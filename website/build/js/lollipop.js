var artist_1 = "Frank Sinatra";
var artist_2 = "The Beatles";

var colors = ["#581845", "#900c3f", "#c70039", "#ff5733", "#FF6363", "#ffbd69"];

// set the dimensions and margins of the graph
var margin = {
        top: 30,
        right: 30,
        bottom: 70,
        left: 100
    },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgLollipop = d3.select("#lollipop_d3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var lollipop_x = d3.scaleLinear()
    .domain([0, 0.9])
    .range([0, width]);

svgLollipop.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(lollipop_x))


var lollipop_y = d3.scaleBand()
    .range([height, 0])
    .padding(1);

var yAxis = svgLollipop.append("g")
    .attr("stroke-width", 1)
    .attr("class", "axis")

svgLollipop.append("g").call(d3.axisLeft(lollipop_y))

function update() {
    // Parse the Data
    d3.csv("data/lollipop.csv", function(data) {
        // Add X axis
        // Lines

        lollipop_y.domain(data.map(function(d) {
            return d.group;
        }))
        yAxis.transition().duration(1000).call(d3.axisLeft(lollipop_y));


        var j = svgLollipop.selectAll(".lineInBetween").data(data)
        j.enter()
            .append("line")
            .attr("class", "lineInBetween")
            .merge(j)
            .transition()
            .duration(1000)
            .attr("x1", function(d) {
                return lollipop_x(d[artist_1]);
            })
            .attr("x2", function(d) {
                return lollipop_x(d[artist_2]);
            })
            .attr("y1", function(d) {
                return lollipop_y(d.group);
            })
            .attr("y2", function(d) {
                return lollipop_y(d.group);
            })
            .attr("stroke-width", 4)
            .attr("opacity", 0.16)
            .attr("stroke", "white")


        // Circles of variable 1
        var k = svgLollipop.selectAll(".lollipopCircleOne").data(data)
        k.enter()
            .append("circle")
            .attr("class", "lollipopCircleOne")
            .merge(k)
            .transition()
            .duration(1000)
            .attr("cx", function(d) {
                return lollipop_x(d[artist_1]);
            })
            .attr("cy", function(d) {
                return lollipop_y(d.group);
            })
            .attr("r", "8")
            .style("fill", colors[1])
            .attr("opacity", 1)

        // Circles of variable 2
        var l = svgLollipop.selectAll(".lollipopCircleTwo").data(data)
        l.enter()
            .append("circle")
            .attr("class", "lollipopCircleTwo")
            .merge(l)
            .transition()
            .duration(1000)
            .attr("cx", function(d) {
                return lollipop_x(d[artist_2]);
            })
            .attr("cy", function(d) {
                return lollipop_y(d.group);
            })
            .attr("r", "8")
            .style("fill", colors[4])
            .attr("opacity", 1)
    });
}

/*
svg_rih_em.append("rect")
    .attr("x", width - 130)
    .attr("y", margin.top - 10 + DISTANCE)
    .style("fill", colors[2])
    .style("height", 10)
    .style("width", 20);

*/

var DISTANCE = 30;

svgLollipop.append("rect")
    .attr("x", 520)
    .attr("y", margin.top)
    .style("fill", colors[1])
    .style("height", 10)
    .style("width", 20);

svgLollipop.append("text")
    .attr("class", "artist1")
    .attr("x", 550)
    .attr("y", margin.top + 10)
    .text("Frank Sinatra")
    .style("font-size", "15px")
    .style("fill", colors[1]);



svgLollipop.append("rect")
    .attr("x", 520)
    .attr("y", margin.top - DISTANCE)
    .style("fill", colors[4])
    .style("height", 10)
    .style("width", 20);

svgLollipop.append("text")
    .attr("class", "artist2")
    .attr("x", 550)
    .attr("y", margin.top - DISTANCE + 10)
    .text("The Beatles")
    .style("font-size", "15px")
    .style("fill", colors[4]);


/* DEFAULT */

function update_1(artist) {
    svgLollipop.select(".artist1").remove();

    svgLollipop.append("rect")
        .attr("x", 520)
        .attr("y", margin.top - 10 + DISTANCE)
        .style("fill", colors[1])
        .style("height", 10)
        .style("width", 20);

    svgLollipop.append("text")
        .attr("class", "artist1")
        .attr("x", 550)
        .attr("y", margin.top + DISTANCE)
        .text(artist)
        .style("font-size", "15px")
        .style("fill", colors[1]);

    artist_1 = artist
    update()
}

function update_2(artist) {
    svgLollipop.select(".artist2").remove();

    svgLollipop.append("rect")
        .attr("x", 520)
        .attr("y", margin.top - 10)
        .style("fill", colors[4])
        .style("height", 10)
        .style("width", 20);

    svgLollipop.append("text")
        .attr("class", "artist2")
        .attr("x", 550)
        .attr("y", margin.top)
        .text(artist)
        .style("font-size", "15px")
        .style("fill", colors[4]);

    artist_2 = artist
    update()
}


update()
