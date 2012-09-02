(function () {

"use strict";

var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]

// The overall chart
function Chart()
{
  this.width = 600
  this.height = 375
  this.dayCharts = new Array(dayNames.length)
  this.initialize()
}

Chart.prototype.initialize = function () {
  var chart = d3.select("#output").append("svg").attr("width", this.width).attr("height", this.height)
    , dayCharts = this.dayCharts
    , chartHeight = this.height
    , chartWidth = this.width
    , newDayCharts = chart.selectAll("g").data(dayNames).enter()
  
  // Create the day charts
  newDayCharts
    .append("g")
      .attr("id", function (d, i) { return d })
      .style("transform", function (d, i) { return "translate(0," + (i+1)*(chartHeight/7) + ")" })
  
  // Draw the lines separating the different day charts
  newDayCharts
    .append("line")
      .attr("x1", 0)
      .attr("y1", function (d, i) { return (i+1)*(chartHeight/7) })
      .attr("x2", this.width)
      .attr("y2", function (d, i) { return (i+1)*(chartHeight/7) })
      .style("stroke", "#ccc")
  
  // Create the day charts
  for (var i = 0; i < dayNames.length; i++)
  {
    this.dayCharts[i] = new DayChart(dayNames[i], "g#" + dayNames[i], this)
  }
}

Chart.prototype.draw = function (data) {
  for (var i = 0; i < dayNames.length; i++)
  {
    this.dayCharts[i].draw(data[i])
  }
}


// Class to construct chart for a day
// title: title of the day for which this chart is generated
// selector: the selector to select the element containing this DayChart
function DayChart(title, selector, parentChart)
{
  this.title = title
  this.selector = selector
  this.parentChart = parentChart
}

DayChart.prototype.draw = function (data) {
  var dayChartSurface = d3.select(this.selector).append("g")
    , dayChartRects = dayChartSurface.selectAll("rect").data(data || new Array())
    , width = this.parentChart.width
    , height = this.parentChart.height
  
  // Left side label area
  dayChartSurface
    .select("text")
    .data(this.title)
    .enter().append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .text(String)
  
  // Right side data visualization
  
  // dayChartRects.enter().append("rect")
  // dayChartRects
    // .transition()
    // .attr("x", function (d, i) { return i *  })
  
  // graph
    // .transition()
    // .attr("x", function (d, i) { return i * ($surface.width - 50) / 24 })
    // .attr("y", $surface.height / 7)
    // .attr("width", ($surface.width - 50) / 24)
    // .attr("height", function (d, i) { return d * $surface.height / 7 })
}

window.Chart = Chart

}())