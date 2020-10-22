// set the dimensions and margins of the graph
var songs=[
	"Love The Way You Lie",
	"Love The Way You Lie (Part II) - Pt. 2",
	"The Monster", "Numb"]
var colors = ["#581845" , "#900c3f", "#c70039" , "#ff5733", "#FF6363", "#ffbd69"];

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
					// Add X axis --> it is a date format
var features = ["acousticness", "danceability",
"energy","loudness", "tempo","valence"]

var x = d3.scaleOrdinal()
		.domain(features)
		.range([0, width / 6, 2 * width / 6, 3 * width / 6, 4 * width / 6, 5 * width / 6]);

svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
	.domain([0, 1])
	.range([ height, 0 ]);
svg.append("g")
	.call(d3.axisLeft(y));


function display_conf_interval(file, color){
	d3.csv(file,function(data) {
	    // Show confidence interval
	    svg.append("path")
	      .datum(data)
	      .attr("fill", color)
        .attr("data-legend", "bla")
	      .attr("d", d3.area()
	        .x(function(d) { return x(d.group) })
	        .y0(function(d) { return y(d.ci_lb) })
	        .y1(function(d) { return y(d.ci_ub) })
	      ).style("opacity", 0.5);
	})
}

function display_song(file, song) {
	d3.csv(file,function(data) {
		    svg
		      .append("path")
		      .datum(data)
		      .attr("class","song")
          .attr("data-legend", song)
          .transition()
          .duration(1000)
		      .attr("fill", "none")
		      .attr("stroke", colors[3])
		      .attr("stroke-width", 2)
		      .attr("d", d3.line()
		        .x(function(d) { return x(d.group) })
		        .y(function(d) { return y(d[song]) })
		        )
		})
}
display_conf_interval("/data/Rihanna_mean_std.csv", colors[0])
display_conf_interval("/data/Eminem_mean_std.csv", colors[2])
update(songs[0])
