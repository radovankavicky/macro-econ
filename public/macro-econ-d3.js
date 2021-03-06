$(document).ready(function() {

var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y0 = d3.scale.linear()
    .range([height, 0]);

var y1 = d3.scale.linear()
	.range([height, 0]);

var y2 = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.format(".0f"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y0)
    .orient("left");

var yAxisRight = d3.svg.axis()
	.scale(y1)
    .orient("right");

var yAxisRight2 = d3.svg.axis()
	.scale(y2)
    .orient("right");

var line0 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y0(d.taxrate); });

var line1 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y1(d.gdprate); });

var line2 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y2(d.unemployment); });

var line3 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y1(d.gdpavg); });

var svg = d3.select(".chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json('http://sleepy-escarpment-3990.herokuapp.com/taxdata', function (error, data) {
	console.log(error);

	//parses integers and modifies each data element
	var derp = 0;
	var counter = 0;
	data.taxes.forEach(function(d) {
		d.date = parseInt(d.date, 10);
		d.taxrate = parseInt(d.taxrate, 10);
		d.gdprate = parseFloat(d.gdprate).toFixed(2);
		d.unemployment = parseFloat(d.unemployment).toFixed(2);
		derp = parseFloat(derp) + parseFloat(d.gdprate);
		counter++;
		d.gdpavg = derp/counter;
	});

x.domain([d3.min(data.taxes, function(d) { return d.date; }), d3.max(data.taxes, function(d) { return d.date; })]);
y0.domain([0, 100]);
y1.domain([d3.min(data.taxes, function(d) { return d.gdprate; })-3, d3.max(data.taxes, function(d) { return d.gdprate; })*2]);
y2.domain([d3.min(data.taxes, function(d) { return d.unemployment; })-3, d3.max(data.taxes, function(d) { return d.unemployment; })*2]);

svg.append("path")
	.datum(data.taxes)
	.attr("class", "line")
	.attr("stroke", "blue")
	.attr("d", line0);

svg.append("path")
	.datum(data.taxes)
	.attr("class", "line lineb")
	.attr("stroke", "green")
	.attr("d", line1);

$('.unemployment-button').click(function (e) {
	$(".yaxis").hide();
	$(".unemployment-axis").show();
	svg.selectAll(".lineb")
		.transition()
		.duration(1000)
		.attr("stroke", "red")
		.attr("d", line2);
});

$('.gdp-button').click(function (e) {
	$(".yaxis").hide();
	$(".gdp-axis").show();
	svg.selectAll(".lineb")
		.transition()
		.duration(1000)
		.attr("stroke", "green")
		.attr("d", line1);
});

svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.style("fill", "blue")
.append("text")
	.attr("transform", "rotate(0)")
	.attr("transform", "translate(" + 145 + " ,0)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("Highest Bracket Tax Rate (%)");

svg.append("g")
	.attr("class", "axis yaxis gdp-axis")
	.attr("transform", "translate(" + width + " ,0)")
	.style("fill", "green")
	.call(yAxisRight)
.append("text")
	.attr("class", "gdp-label")
	.attr("transform", "rotate(-90)")
	.attr("transform", "translate(" + -10 + " ,0)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("GDP Growth Rate (%)");

svg.append("g")
	.attr("class", "axis yaxis unemployment-axis")
	.attr("transform", "translate(" + width + " ,0)")
	.style("fill", "red")
	.call(yAxisRight2)
.append("text")
	.attr("class", "unemployment-label")
	.attr("transform", "rotate(-90)")
	.attr("transform", "translate(" + -10 + " ,0)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("Unemployment Rate (%)");

	$(".unemployment-axis").css("display", "none");
});

});