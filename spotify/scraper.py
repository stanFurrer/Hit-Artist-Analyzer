import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd

"""
SETTINGS
"""
DEBUG_PROMPT = False

ARTISTS = [
    "Eminem"
]  # ["Frank Sinatra", "The Beatles", "Michael Jackson", "Eminem", "Rihanna"]

token = spotipy.util.prompt_for_user_token(
    "Julien Salomon",
    client_id="3f0268c00c604e70aace4982367723c7",
    client_secret="c9a4a4f2699642c795cb82595c2c8035",
    redirect_uri="http://localhost:8888",
)

spotify = spotipy.Spotify(auth=token)
spotify.trace = False  # turn on tracing
spotify.trace_out = False  # turn on trace out

"""
HELPERS
"""


def print_list(lis, tab=0):
    tabs = ""
    for i in range(tab):
        tabs += "\t"
    print(tabs + "list_length: " + str(len(lis)))
    for val in lis:
        if isinstance(val, dict):
            print_dict(val, tab=tab)
        elif isinstance(val, list):
            if len(val) <= 50 or DEBUG_PROMPT:
                print_list(val, tab=tab + 1)
        else:
            print(tabs + val)


def print_dict(dico, tab=0):
    tabs = ""
    for i in range(tab):
        tabs += "\t"
    for item, value in dico.items():
        if isinstance(value, dict):
            print(tabs + item + ":")
            print_dict(value, tab=tab + 1)
        elif isinstance(value, list):
            print(tabs + item + ":")
            print_list(value, tab=tab + 1)
        else:
            print(tabs + item + " : " + str(value))


def print_result(res, info=None):
    if info:
        print(info)
    if isinstance(res, dict):
        print_dict(res)
    elif isinstance(res, list):
        print_list(res)
    else:
        print(res)


def get_artist(artist_name):
    results = spotify.search(artist_name, type="artist")["artists"]["items"]
    results.sort(key=lambda artist: artist["popularity"], reverse=True)
    top_result = results[0]
    if DEBUG_PROMPT:
        print_result(top_result, info="Artist")
    return top_result


def get_albums_tracks(albums):
    all_tracks = []
    for uri in albums:
        tracks = spotify.album_tracks(uri)["items"]
        for track in tracks:
            track["album_uri"] = uri
        all_tracks += tracks

    return pd.DataFrame(all_tracks)


def get_audio_features(tracks):
    features_list = [spotify.audio_features(track)[0] for track in tracks]
    features = pd.DataFrame(features_list)
    features["uri_track"] = features["uri"]
    features = features.drop("duration_ms", axis=1).drop("uri", axis=1)
    if DEBUG_PROMPT:
        print(features.head())
    return features


def get_audio_analysis(tracks):
    analysis_list = [spotify.audio_analysis(track) for track in tracks]
    analysis = pd.DataFrame(analysis_list)
    analysis["uri"] = tracks
    if DEBUG_PROMPT:
        print(analysis.head())
    return analysis


def artist_spotify_df(artist):
    albums = spotify.artist_albums(get_artist(artist)["uri"])["items"]
    albums_df = pd.DataFrame.from_dict(albums)

    tracks_df = get_albums_tracks(albums_df.uri.unique())

    albums_df["album_uri"] = albums_df.uri
    albums_df = tracks_df.join(
        albums_df.set_index("album_uri"),
        lsuffix="_track",
        rsuffix="_album",
        on="album_uri",
    )
    if DEBUG_PROMPT:
        print(albums_df.columns)

    track_uris = albums_df.uri_track.unique()

    features = get_audio_features(track_uris)
    albums_df = albums_df.join(features.set_index("uri_track"), on="uri_track")

    albums_df["featuring"] = albums_df.artists_track.map(lambda l: len(l) > 1)
    albums_df["artists_track_uri"] = albums_df.artists_track.map(
        lambda artist_list: [artist["uri"] for artist in artist_list]
    )
    albums_df["artists_track"] = albums_df.artists_track.map(
        lambda artist_list: [artist["name"] for artist in artist_list]
    )

    albums_df = albums_df[
        [
            "name_track",
            "duration_ms",
            "explicit",
            "artists_track",
            "artists_track_uri",
            "featuring",
            "track_number",
            "disc_number",
            "name_album",
            "artists_album",
            "total_tracks",
            "uri_track",
            "uri_album",
            "danceability",
            "energy",
            "key",
            "loudness",
            "mode",
            "speechiness",
            "acousticness",
            "instrumentalness",
            "liveness",
            "valence",
            "tempo",
            "time_signature",
        ]
    ]

    albums_df.to_csv(
        "data/spotify/{0}_tracks.csv".format(artist.lower().replace(" ", "_"))
    )


"""
MAIN
"""
for artist in ARTISTS:
    artist_spotify_df(artist)
