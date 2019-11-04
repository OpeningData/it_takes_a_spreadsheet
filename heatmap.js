
var mapsvg = d3.select("#figure1")
     .append("svg")
     .attr("preserveAspectRatio", "xMinYMin meet")
     .attr("viewBox", "0 0 750 680")
    .attr('id', 'heatmap')

var itemSize = 11,
      cellSize = itemSize - 0.85,
      margin = {top: 50, right: 50, bottom: 20, left: 100};
      
var width = 750 - margin.right - margin.left,
     height = 660 - margin.top - margin.bottom;

var colorScale = d3.scaleLinear()
        .domain([0,1, 100, 250, 750, 1250, 1750])
        .range(["#F8F8F8","rgb(226,238,249)", "rgb(42,166,137)", "rgb(253,213,61)", "rgb(226,148,33)", "rgb(238,94,50)","rgb(218,75,49)"]);
 
var data_abc;

var displayValue = "perc_pop";


function getData(){        
      d3.csv('incarceration_state_percentages_join.csv')
          .then( 
          function(response) {
                data_abc = response;
                draw(data_abc);  
                                });
}







function draw(input_data){

    
    data = input_data;
    
    var x_elements = d3.set(input_data.map(function( item ) { return item.year; } )).values(),
        y_elements = d3.set(input_data.map(function( item ) { return item.State; } )).values();

    var xScale = d3.scaleBand()
        .domain(x_elements)
        .range([0, x_elements.length * itemSize]);

    var xAxis = d3.axisTop()
        .scale(xScale)
        .tickFormat(function (d) {
            return d;
        });

    var yScale = d3.scaleBand()
        .domain(y_elements)
        .range([0, y_elements.length * itemSize]);

    var yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(function (d) {
            return d;
        });
    
   //     var svg = d3.select('#heatmap')
//        .append("text")
  //      .text("US Incarceration")
    //    .attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
    
    var svg = d3.select('#heatmap')
        .append("g").attr("id","heat")
        .attr("transform", "translate(" + margin.left + "," +  margin.top + ")");

    var cells = svg.selectAll('rect').remove()
        .data(input_data)
        .enter()//.append('g')
        .append('rect')
        .attr('class', 'cell')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('y', function(d) { return yScale(d.State); })
        .attr('x', function(d) { return xScale(d.year); })
        .attr("id", function(d){return  d.State})
        .attr("class", function(d){return  d.Region})
        .style('fill', function(d) { return colorScale(d[displayValue]); })
  //  .on("mouseover", mouseover)
    //.on("mouseleave", mouseleave)
    //.on("click", mouseclickheat);

    svg.append("g").attr("id","heat")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');

    svg.append("g").attr("id","heat")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });
           
var svgLegend = d3.select('#heatmap').append('g').attr("id","heat")
        .attr("transform", "translate(" + 95 + ","+ 580 + ")")
//.attr("preserveAspectRatio", "xMinYMin meet")
//     .attr("viewBox", "0 0 750 50")
// .attr("width", width)

;

var defs = svgLegend.append('defs');
var linearGradient = defs.append('linearGradient')
		.attr('id', 'linear-gradient');

    // horizontal gradient
linearGradient
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");
    
// append multiple color stops by using D3's data/enter step
linearGradient.selectAll("stop")
  .data([
    {offset: "0%", color: "#F8F8F8"},
    {offset: "1%", color: "rgb(226,238,249)"},
    {offset: "5%", color: "rgb(42,166,137)"},
    {offset: "12.5%", color: "rgb(253,213,61)"},
    {offset: "37.5%", color: "rgb(226,148,33)"},
    {offset: "62.5%", color: "rgb(238,94,50)"},
        {offset: "87.5%", color: "rgb(218,75,49)"},

    {offset: "100%", color: "#00000"}
  ])
  .enter().append("stop")
  .attr("offset", function(d) { 
    return d.offset; 
  })
  .attr("stop-color", function(d) { 
    return d.color; 
  });
    
    
    // append title
svgLegend.append("text")
  .attr("class", "legendTitle")
  .attr("x", 10)
  .attr("y", 20)
  .style("text-anchor", "left")
    .style("font-size", "14px")
  .text("Incarcerated Individuals Per 100,000 Residents Ages 15-64");
    
    
    // draw the rectangle and fill with gradient
svgLegend.append("rect").attr("id", "heatlegend")
  .attr("x", 10)
  .attr("y", 30)
  .attr("width", 400)
  .attr("height", 15)
  .style("fill", "url(#linear-gradient)");
    
    
    //create tick marks
var xLeg = d3.scaleLinear()
  .domain([0, 250, 500, 1000,  1500, 2000])
  .range([0, 50, 100,200, 300, 390]);
    
    
    var axisLeg = d3.axisBottom(xLeg)
  .tickValues(xLeg.domain())
    
    
svgLegend
  .attr("class", "axis")
  .append("g").attr("id","heat")
  .attr("transform", "translate(10, 50)")
  .call(axisLeg);
    
   
//  handleResize();
    
    
};