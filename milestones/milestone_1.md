## Milestone 1

Last update: friday 3rd April.

### Dataset

The dataset is composed of around 300 music of **Michael Jackson** and features for each of them :

- Title, Album title, Year of release, Music Type…
- Audio features : danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo and time_signature.
- Audio analysis : bars, tatums, beats
- **The lyrics**

The data have been obtained using the API of **Spotify** and **[Genius.com](http://Genius.com)**.

The data-set is relatively clean but needs preprocessing as :

- Delete doublons
- Merge Spotify dataset with Genius dataset
- Select interesting features
- Use **NLP techniques** to extract features from the lyrics

After preprocessing, the dataset is clean and can be extended easily to other artists if needed.

### Problematic

How Michael Jackson's songs **evolved** through time and albums by studying the **musical features** and the **lyrics** of his songs?
What are the **main topics** ? How large is Michael Jackson **vocabulary**? What are the most used words in his songs?

**How do the audio features and the lyrics relate to each other?**


The aim of this project is to show how the lyrics are related different features to one biggest star in the world. To construct a story on an all-known artist. Therefore, everybody will be curious about this data-visualization.

### Exploratory Data Analysis

The EDA notebook for the lyrics can be found [at the following address](./eda/eda_lyrics.ipynb).

The EDA notebook for the audio features can be found [at the following address](./eda/eda_spotify.ipynb).

#### Lyrics EDA conclusion

First observations on the distrution in vocabular and text size, did not bring many information. Using these distrubtion to compare MJ's songs or albums together could be intersting; as well we could compare MJ's distrubtion of vocabulary size to other artists to see which is more "lyrical".

The main focus of the EDA was on the clusterization of the lyrics. This was done by doing **sentiment analysis** to seperate the *positive-themes* songs to *negative-songs* and **topic modelling** that allows us to group songs given the words they contain. Naming the topics should not be complicated as the most relevant words have been shown. This gives us a great opportunity to visualize the lyrical properties and to compare the audio features of the songs given the theme or sentiment of MJ's songs.

#### Spotify EDA conclusion

First observations of the distribution of the musical features of MJ's songs show a trend in all of his musical career: more danceable tracks. This is a simple but relevant visualisation scheme, that we can go deeper into, by selecting relevant features given a cluster of songs.

Clustering the songs given all their audio features was efficient as well. Visualising these clusters is more of a challenge due to the number of features. We are thinking of implementing a radar chart to visualize them, as well as combining some of the audio features together (mean, sum...).

Merging these features with the lyrical clusters will be the main aspect of our visualisation work: how do these clusters relate to each other; how to show the relation between song topics or song sentiment with their musicality (networks, graphs...).

#### EDA conclusion

The data scrapped is very useable and complete. The primary analysis done gave us interesting results and ideas for visualization and left us with clear next steps for our work.

### Related work

Nobody have done such a data analysis on Michael Jackson, and we found no in depth analysis of the music/lyrics of an artist using data in general. However, a lot of work have been done in lyrical analysis, and audio analysis seperated. We believe that our angle can be interesting: by combining two different types of analytics, we can generate new ways to visualize an artist's musical career.

A similar idea already buzzed on [reddit.com](http://reddit.com). Indeed, a designer called Silven created a mock-up of what would be a lyrics based data-visualisation on Eminem but never gave birth to it.

Our first inspiration is therefore the mock-up [Rap Genius 2.0](https://medium.com/svilenk/data-visualization-uncovering-the-hidden-layers-of-hip-hop-lyrics-e6f97be1a932) from Silven.

Other inspiration are comes from [The Pudding](https://pudding.cool/archives/) website, the [New York Time](www.nytimes.com) or other websites.

- [Vocabulary representation over time](https://pudding.cool/projects/vocabulary/)
- [Most Instances of the Same Name in a song](https://pudding.cool/2019/05/names-in-songs/)
- [Representation of audio features](https://www.nytimes.com/interactive/2018/08/09/opinion/do-songs-of-the-summer-sound-the-same.html)

### Next steps

Our EDA made us realize that it would be interesting, and not too time consuming, to compare MJ's data to other artists thanks to our modular scrapers and EDA notebooks.

As well, preliminary EDA has been done. We believe that there is further analysis possible, and on the website we will include more in depth analysis based on what we have already done especially for the audio feature data.

Finally, throughout our EDA we proposed ideas for visualization, our main focus will be to implement these visualization schemes.
