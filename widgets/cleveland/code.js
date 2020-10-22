// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 100},
    width = 600 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

var colors = ["#581845" , "#900c3f", "#c70039" , "#ff5733", "#FF6363", "#ffbd69"];
var features = ["Danceability", "Energy", "Loudness", "Acousticness", "Valence", "Tempo"];



// append the svg object to the body of the page
var svg = d3.select("#my_dataviz1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Initialize the Y axis

var y = d3.scaleBand()
  .range([ height, 0])
  .padding(1);

var yAxis = svg.append("g")
  .attr("stroke-width" , 1)
  .attr("class" , "axis")
  //.attr("transform" , "translate(0," + height + ")")



// Initialize the X axis

var x = d3.scaleLinear()
  .range([0,width])


var xAxis = svg.append("g")
  .attr("class" , "axis")
  .attr("stroke-width", 1)

  //.attr("stroke", "#30475e")
  .attr("transform" , "translate(0," + height + ")")

// A function that create / update the plot for a given variable:
function update(selectedVar) {



  // Parse the Data
  d3.csv("data.csv", function(data) {
    // X axis
    y.domain(data.map(function(d) { return d.group; }))
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Add Y axis
    x.domain([0,  0.85]); // To adapt ylim : d3.max(data, function(d) { return +d[selectedVar] })
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    
    // variable u: map data to existing circle
    var j = svg.selectAll(".myLine")
      .data(data)
    // update lines
    j
      .enter()
      .append("line")
      .attr("class", "myLine")
      .merge(j)
      .transition()
      .duration(1000)
        .attr("y1", function(d) { console.log(y(d.group)) ; return y(d.group); })
        .attr("y2", function(d) { return y(d.group); })
        .attr("x1", x(0))
        .attr("x2", function(d) { return x(d[selectedVar]); })
        .attr("stroke-width", 4)
        .attr("opacity" , 0.16)
        .attr("stroke", "white")

    // variable u: map data to existing circle
    var u = svg.selectAll("circle")
      .data(data)
    // update bars
    u
      .enter()
      .append("circle")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("cy", function(d) { return y(d.group); })
        .attr("cx", function(d) { return x(d[selectedVar]); })
        .attr("r", 10)
        .attr("fill", function(d){return colors[features.indexOf(d.group)];});


  })



}

// Initialize plot
update('Rihanna')