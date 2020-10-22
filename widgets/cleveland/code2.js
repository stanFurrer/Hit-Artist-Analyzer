var artist_1 = "Frank Sinatra";
var artist_2 = "The Beatles";

var colors = ["#581845", "#900c3f", "#c70039", "#ff5733", "#FF6363", "#ffbd69"];

// set the dimensions and margins of the graph
var margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 100
    },
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function update() {
    // Parse the Data
    d3.csv("data.csv", function(data) {
        // Add X axis
        // Lines
        var x = d3.scaleLinear()
            .domain([0, 0.9])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function(d) {
                return d.group;
            }))
            .padding(1);
        svg.append("g")
            .call(d3.axisLeft(y))

        var j = svg.selectAll(".myLine").data(data)
        j.enter()
            .append("line")
            .attr("class", "myLine")
            .merge(j)
            .transition()
            .duration(1000)
            .attr("x1", function(d) {
                return x(d[artist_1]);
            })
            .attr("x2", function(d) {
                return x(d[artist_2]);
            })
            .attr("y1", function(d) {
                return y(d.group);
            })
            .attr("y2", function(d) {
                return y(d.group);
            })
            .attr("stroke-width", 4)
            .attr("opacity", 0.16)
            .attr("stroke", "white")


        // Circles of variable 1
        var k = svg.selectAll(".mycircle1").data(data)
        k.enter()
            .append("circle")
            .attr("class", "mycircle1")
            .merge(k)
            .transition()
            .duration(1000)
            .attr("cx", function(d) {
                return x(d[artist_1]);
            })
            .attr("cy", function(d) {
                return y(d.group);
            })
            .attr("r", "8")
            .style("fill", colors[1])
            .attr("opacity", 1)

        // Circles of variable 2
        var l = svg.selectAll(".mycircle2").data(data)
        l.enter()
            .append("circle")
            .attr("class", "mycircle2")
            .merge(l)
            .transition()
            .duration(1000)
            .attr("cx", function(d) {
                return x(d[artist_2]);
            })
            .attr("cy", function(d) {
                return y(d.group);
            })
            .attr("r", "8")
            .style("fill", colors[4])
            .attr("opacity", 1)
    });
}

function update_1(artist) {
    artist_1 = artist
    update()
}

function update_2(artist) {
    artist_2 = artist
    update()
}


update()
