// Simple dom manipulation with d3 ---------------------------------------------------------------------- 

function listEntry() {
d3.select('#list').selectAll('li')
  .data([2,3,5,8,9,2,4,5,4])
    .text(function(d){return d;})
  .enter()
  .append('li')
    .text(function(d){return "Dit zou nieuwe data moeten zijn " + d})
}

function remove(){
  d3.select('#list').selectAll('li')
    .data([1])
    .exit()
    .remove();
}

function add(){
  var items = d3.select('#list').selectAll('li')
    .data([4,3,5,8,9,2,4,5,4]);

  items.enter().append('li')
    .merge(items)
      .text(function(d){return "This was added later " + d;});
  
  items.exit().remove()
}


// Simple svg manipulation with d3 ----------------------------------------------------------------------

function drawSvg(){
  var width = 500;
  var height = 500;

  var svg = d3.select("#svg_container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("line")
    .attr("x1", 100)
    .attr("y1", 100)
    .attr("x2", 300) 
    .attr("y2", 300)
    .style("stroke", "rgb(255,0,0)")
    .style("stroke-width", 2)
    .attr("transform", "rotate(45,250,250)");

  svg.append("rect")
    .attr("x", 100)
    .attr("y", 100)
    .attr("width", 300)
    .attr("height", 300)
    .style("stroke", "green")
    .style("fill-opacity", "0")
    .attr("transform", "rotate(45,250,250)");

  var cont = d3.select("#svg_container")

  svg.transition()
    .style("background-color", "lightblue")
    .delay(1000)
    .duration(2000);
}

// Simple bar chart---------------------------------------------------------------------------------------

function drawHorizBarChart(data){
  var width=500, scaleFactor=20, barHeight=30, margin=2;

  var graph = d3.select("#svg_container").append("svg")
    .attr("width", width)
    .attr("height", barHeight * data.length);

  var bars = graph.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i){
      return "translate(0,"+ i*barHeight +")"
    })

  bars.append("rect")
    .attr("width", function(d){return d*scaleFactor;})
    .attr("height", barHeight-margin)

  bars.append("text")
    .attr("x", function(d) {return d*scaleFactor;})
    .attr("y", barHeight/2)
    .attr("dy", "0.35em")
    .text(function (d){
      return d+" Points"
    })
  }

// Simple circle chart---------------------------------------------------------------------------------------

function drawCircleChart(){
  var width = 500, height = 500;
  var data = [10,20,40,10,60,30]
  var color = ["red", "orange", "blue", "gray", "cyan", "green"]

  var svg = d3.select("#svg_container").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var g = svg.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", "translate(0,0)");

  g.append("circle")
    .attr("cx", function(d,i){
      return i*75 + 50;
    })
    .attr("cy", function(d,i){
      return 75;
    })
    .attr("r", function(d){
      return d*1.5;
    })
    .attr("fill", function(d, i){
      return color[i];
    });
  
  g.append("text")
    .attr("x", function(d, i){
      return i*75 + 50;
    })
    .attr("y", 80)
    .attr("stroke", "teal")
    .attr("font-size", "10px")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "start")
    .text(function(d) {
      return d;
    });
}

// Simple donut chart---------------------------------------------------------------------------------------

function drawSimpleDonut(){
  var width = 500, height = 500;
      var svg = d3.select("#svg_container").append("svg")
        .attr("width", width)
        .attr("height", height);
      var radius = Math.min(width, height)/2 - 20;

      var g = svg.append("g")
        .attr("transform", "translate("+width/2+","+(height/2 + 20)+")");

      var color = d3.scaleOrdinal(['gray', 'black','darkgray', 'darkred', 'darkorange','darkblue', 'teal']);
      var pie = d3.pie()
        .value(function(d) { return d.percent; });
      
      var path = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius-80);
      
      var label = d3.arc() //Wedges for the labels.
        .outerRadius(radius)
        .innerRadius(radius - 80);

      d3.csv("population.csv", function(error, data) {
        if (error) {
          throw error;
        }

        var arc = g.selectAll(".arc")
          .data(pie(data))
          .enter()
          .append("g")
          .attr("class", "arc");
        
        arc.append("path")
          .attr("d", path)
          .attr("fill", function(d) { return color(d.data.states); });
      
        arc.append("text")
          .attr("transform", function(d) { 
            return "translate(" + label.centroid(d) + ")"; 
          })
          .text(function(d) { return d.data.states; });
      });

      svg.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + 20 + ")")
        .append("text").text("Top population states in india")
        .attr("class", "title")
}

// Simple donut chart---------------------------------------------------------------------------------------

function drawSimpleLine(){
  var svgWidth = 800, svgHeight = 400;
  var svg = d3.select("#svg_container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var margin = {top:20, bottom:30, left:50, right:20};
  var width = svgWidth - margin.left - margin.right, 
  height = svgHeight - margin.top - margin.bottom;
  
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  
  svg.append("g")
    .attr("transform", "translate("+ margin.left +","+ margin.top +")");
  
  d3.csv("population.csv", function(error, data){
    if(error){
      throw error;
    }

    data.forEach(function(d) {
      d.year = new Date(d.year, 1, 1);
      d.population = +d.population;
    });
    
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    var line = d3.line()
      .x(function(d){return x(d.year);})
      .y(function(d){return y(d.population);});

    svg.append("path").data([data])
      .attr("class", "line").attr("d", line);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")") //Pull axis to the bottom.
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

  });
}