var colors = ["#581845", "#900c3f", "#c70039", "#ff5733", "#FF6363", "#ffbd69"];

var songs_rih_em = [
    "Love The Way You Lie",
    "Love The Way You Lie (Part II) - Pt. 2",
    "The Monster", "Numb"
];

var margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60
    },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_rih_em = d3.select("#rih_em_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var features = ["acousticness", "danceability", "energy", "loudness", "tempo", "valence"]

/* LEGEND */

var DISTANCE = 30;

svg_rih_em.append("text")
.attr("x", width - 100)
.attr("y", margin.top)
.text("Rihanna")
.style("font-size", "15px")
.style("fill", colors[0]);

svg_rih_em.append("rect")
.attr("x", width - 130)
.attr("y", margin.top - 10)
.style("fill", colors[0])
.style("height", 10)
.style("width", 20);


svg_rih_em.append("text")
.attr("x", width - 100)
.attr("y", margin.top + DISTANCE)
.text("Eminem")
.style("font-size", "15px")
.style("fill",colors[2]);

svg_rih_em.append("rect")
.attr("x", width - 130)
.attr("y", margin.top - 10 + DISTANCE)
.style("fill", colors[2])
.style("height", 10)
.style("width", 20);

var x_rih_em = d3.scaleOrdinal()
    .domain(features)
    .range([0, width / 6, 2 * width / 6, 3 * width / 6, 4 * width / 6, 5 * width / 6]);

svg_rih_em.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis")
    .call(d3.axisBottom(x_rih_em));

// Add Y axis
var y_rih_em = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);
svg_rih_em.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y_rih_em).ticks(5).tickFormat(d3.format(".1f")));

function display_conf_interval_rih_em(file, color) {
    d3.csv(file, function(data) {
        // Show confidence interval
        svg_rih_em.append("path")
            .datum(data)
            .attr("fill", color)
            .attr("data-legend", "bla")
            .attr("d", d3.area()
                .x(function(d) {
                    return x_rih_em(d.group)
                })
                .y0(function(d) {
                    return y_rih_em(d.ci_lb)
                })
                .y1(function(d) {
                    return y_rih_em(d.ci_ub)
                })
            ).style("opacity", 0.5);
    })
}

function display_song_rih_em(file, song_rih_em) {

    /* ADD TEXT LEGEND */

    svg_rih_em.select(".title_text").remove();

    svg_rih_em.append("text")
        .attr("class", "title_text")
        .attr("x", width - 150)
        .attr("y", margin.top)
        .text(song_rih_em)
        .style("font-size", "15px")
        .style("fill", colors[3])
        .attr("text-anchor", "end");

    d3.csv(file, function(data) {
        svg_rih_em
            .append("path")
            .datum(data)
            .attr("class", "song_rih_em")
            .attr("data-legend", song_rih_em)
            .transition()
            .duration(1000)
            .attr("fill", "none")
            .attr("stroke", colors[3])
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(function(d) {
                    return x_rih_em(d.group)
                })
                .y(function(d) {
                    return y_rih_em(d[song_rih_em])
                })
            )
    })
}

function update_rih_em(selectedVar) {
    d3.select(".song_rih_em").remove();
    display_song_rih_em("/data/rihanna-eminem.csv", selectedVar)
}

display_conf_interval_rih_em("/data/Rihanna_mean_std.csv", colors[0])
display_conf_interval_rih_em("/data/Eminem_mean_std.csv", colors[2])
update_rih_em(songs_rih_em[0])
