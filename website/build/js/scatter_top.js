/* Brush scatterplot and top words table

Author: Jonathan Besomi

*/

function scatterTop(column_id, filename) {

    var column_id_str = "#column" + column_id;

    var column_dim = d3.select(column_id_str).node().getBoundingClientRect();

    column_dim.height = 400

    /* Define margin and object settings */
    var margin = {
            top: 10,
            right: 10,
            bottom: 0,
            left: 70
        },
        width = column_dim.width,
        height = column_dim.height,
        scatterplot_width = width - margin.right - margin.left,
        scatterplot_height = height - margin.top - margin.bottom;

    /* Define the scale */
    var x = d3.scaleLinear().range([margin.left, width - margin.right]),
        sentiment = d3.scaleLinear().range([scatterplot_height, margin.top]);

    /* Create the svg object */
    var svg = d3.select(column_id_str + " #chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var tooltip = svg
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")


    d3.csv(filename, all_data => {

        var n = all_data.length;

        x.domain([0, 1]);
        sentiment.domain([-0.6, 0.9]); // sentiment

        var axis_x = d3.axisBottom(x)
        axis_sentiment = d3.axisLeft(sentiment);

        if (column_id == 1) {

            /* Create #axis_sentiment and populate it.*/
            svg.append("g")
                .attr("id", "axis_sentiment")
                .attr("transform", "translate(" + (margin.left / 2) + ", 0)")

            d3.select("#axis_sentiment")
                .append("text")
                .attr("x", -40)
                .attr("y", -10)
                .attr("transform", "rotate(-90) translate(-20, 15)")
                .text("Positive")
                .style("fill", "white")
                .style("font-size", "14px");

            d3.select("#axis_sentiment")
                .append("text")
                .attr("x", -height / 2)
                .attr("y", -10)
                .attr("transform", "rotate(-90) translate(-20, 15)")
                .text("Neutral")
                .style("fill", "white")
                .style("font-size", "14px");

            d3.select("#axis_sentiment")
                .append("text")
                .attr("x", -height + 20)
                .attr("y", -10)
                .attr("transform", "rotate(-90) translate(-20, 15)")
                .text("Negative")
                .style("fill", "white")
                .style("font-size", "14px");

            d3.select("#axis_sentiment")
                .append("text")
                .attr("x", -height / 2 + -20)
                .attr("y", -35)
                .attr("transform", "rotate(-90) translate(-20, 15)")
                .text("SENTIMENT")
                .style("fill", "white")
                .style("font-size", "17px");
        }


        function get_random(max) {
            return Math.floor(Math.random() * max)
        }


        var mousemoveTooltip = function(d) {
            tooltip
                .html("The exact value of<br>the Ground Living area is: " + d.GrLivArea)
                .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (d3.mouse(this)[1]) + "px")
        }



        var mouseoverTooltip = function(d) {
            tooltip
                .style("opacity", 1)
        }

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var mouseleaveTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

        function isBrushed(selected_area, cx, cy) {
            /* Check if the point cx, cy is in the area */
            var y0 = selected_area[0],
                y1 = selected_area[1];

            return y0 <= cy && cy <= y1;
        }

        function displayTable() {
            /*  Called at the end of the brushing action.
                Update the table by counting the top-words of the
                selectioned circle.
            */


            /* Get all selected data */
            var selected_data = d3.selectAll(".brushed" + column_id).data();

            if (selected_data.length > 0) {
                /* Remove previous data */
                d3.selectAll(column_id_str + " .row_data").remove();

                /* Get all text */
                allTextBrushed = []
                selected_data.forEach(d => allTextBrushed.push(d.text))
                allText = allTextBrushed.join(" ")

                /* Compute the key-values table */
                topWords = countWords(allText)

                /* Update the table */
                updateTable(topWords)
            }

        }

        /*
            Create the brush object (function)
        */

        var circles = svg.append("g")
            .selectAll("circle")
            .data(all_data)
            .enter()
            .append("circle")
            .attr("r", 6)
            .attr("cx", (d) => x(+d.xdata))
            .attr("cy", (d) => sentiment(+d.sentiment))
            .attr("class", "non_brushed");



        var brush = d3.brushY()
            .on("start", function() {
                svg.selectAll("rect") // Add style to the brush
                    .attr("x", margin.left - 10)
                    .attr("width", scatterplot_width + 20);
            })
            .on("brush", addClassToBrushedCircles) // update class
            .on("end", displayTable);

        /* Add brush to svg, set initial height (a bit random),
            and add some style */
        svg.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, [get_random(100), 300 + get_random(100)])
            .selectAll("rect")
            .attr("x", margin.left - 10)
            .attr("width", scatterplot_width + 20);


        function addClassToBrushedCircles() {
            /* Get the selected area (brushSelection)
               and change class to all his circle
            */

            /* Keep rectangle width */
            svg.selectAll("rect")
            .attr("x", margin.left - 10)
            .attr("width", scatterplot_width + 20);

            if (d3.event.selection != null) {

                /* Set all circle to non-brushed */
                /*var circles = svg.selectAll("circle");*/

                circles.attr("class", "non_brushed");

                /* Get coordinated of selected area */
                var selected_area = d3.brushSelection(this);

                /* Find all circle in the area and set the class*/
                circles.filter(function() {
                        var cx = d3.select(this).attr("cx"),
                            cy = d3.select(this).attr("cy");
                        return isBrushed(selected_area, cx, cy);
                    })
                    .attr("class", "brushed" + column_id);
            }
        }

        function countWords(text) {
            /* Given a text string, count all the words */
            var wordCounts = {};
            var words = text.split(/ +/);

            for (var i = 0; i < words.length; i++)
                wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1;

            /* Convert a dictionary into an array */
            var keyValues = []
            for (var key in wordCounts) {
                keyValues.push([key, wordCounts[key]])
            }

            /* Sort it. */
            keyValues.sort(function compare(kv1, kv2) {
                return kv2[1] - kv1[1]
            })

            return keyValues.slice(0, 10);
        }




        function updateTable(topWords) {
            /* Given the topWords, update the table. */

            /* Iterate over all topWords and update each row */
            if (column_id != 10) {
                topWords.forEach(d_row =>
                    d3.select(column_id_str + " table")
                    .append("tr")
                    .attr("class", "row_data")
                    .selectAll("td")
                    .data(d_row)
                    .enter()
                    .append("td")
                    .attr("align", (d, i) => i == 0 ? "left" : "right")
                    .text(d => d))

                /*
                                    .filter(d[0] == "love")
                                    .append("span")
                                    .attr("class", "love") */



            } else {
                topWords.forEach((d_row, i) => {

                    d_row.unshift(i + 1);

                    d3.select(column_id_str + " table")
                        .append("tr")
                        .attr("class", "row_data")
                        .selectAll("td")
                        .data(d_row)
                        .enter()
                        .append("td")
                        .attr("align", (d, i) => i == 0 ? "left" : "right")
                        .text(d => d);
                });
            }
        }

    });

}
