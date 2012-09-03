(function () {

"use strict";

var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]

// The overall chart
function Chart()
{
  this.width = 600
  this.height = 375
  this.chart = d3.select("#output").append("svg").attr("width", this.width).attr("height", this.height)
}

Chart.prototype.draw = function (data) {
  var chart = this.chart
    , dayCharts = chart.selectAll("g").data(data)
    , newDayCharts = dayCharts.enter()
    , self = this
    , labelWidth = 100
    , dayGraphAreaWidth = this.width - labelWidth
    , hourRects = null
  
  // Create day containers
  newDayCharts
    .append("g")
    .attr("transform", function (d, i) { return "translate(0," + i*self.height/7 + ")"; })
      .append("line")
      .style("stroke", "#ccc")
      .attr("x1", 0).attr("x2", this.width)
      .attr("y1", this.height/7).attr("y2", this.height/7)
  
  // Labels of the day container
  newDayCharts
    .append("text")
    .attr("transform", function (d, i) { return "translate(0," + i*self.height/7 + ")"; })
    .attr("x", labelWidth).attr("y", this.height/14)
    .attr("text-anchor", "end")
    .attr("dx", -10)
    .text(function (d, i) { return dayNames[i] })
  
  // Vertical line
  newDayCharts
    .append("line")
    .attr("transform", function (d, i) { return "translate(0," + i*self.height/7 + ")"; })
    .attr("class", "vertical")
    .attr("x1", labelWidth).attr("x2", labelWidth)
    .attr("y1", 0).attr("y2", this.height/7)
    .style("stroke", "#ccc")
  
  // Set up the bar graphs
  hourRects = dayCharts.selectAll("rect").data(function (d) { return d || new Array(24) })
  
  // Create new ones as necessary
  hourRects.enter().append("rect")
  
  // Update the existing bars
  hourRects
    .transition()
    .attr("x", function (d, i) { return labelWidth + i*(dayGraphAreaWidth/24) })
    .attr("y", function (d, i) { return (1-d)*self.height/7 || 0 })
    .attr("height", function (d, i) { return d*self.height/7 || 0 })
    .attr("width", dayGraphAreaWidth/24)
}

window.Chart = Chart

}())