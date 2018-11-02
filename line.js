function loadCircularHeatline(p_financiador) 
{ 
        var margin = {top: 20, right: 30, bottom: 100, left: 100};

        // let svg = d3.select("#line"),
        //   width = +svg.attr("width"),
        //   height = + svg.attr("height");

         let svg = d3.select("#line"),
          width = 800,
          height =400;  

        var g = svg.append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
        
        var div = d3.select("body").append("div")	
                    .attr("class", "tooltip")				
                    .style("opacity", 0);
        
    		var data;

        var xAxisTime = d3.timeFormat("%b");

        var x0AxisYear = d3.timeFormat("20" + "%y");

        d3.text("https://raw.githubusercontent.com/63anp3ca/Proyecto-VA/master/SECOPGIS.csv", function(error, raw)
        {
        
              var data       = d3.dsvFormat(",").parse(raw);
              var parseTime  = d3.timeParse("%d/%m/%Y");
              var formatTime = d3.timeFormat("%d/%m/%Y");
         
              data.map(function(d){
                    d.value     = parseInt(d.monto)
                    d.date      = parseTime(d.FechaIni);
                    });
              
              console.log("data");
              console.log(data);

              var dataFiltered = data.filter(function(d) { return d.Representante === "hector fabio osorio rivillas" });

              console.log("dataFiltered");
              console.log(dataFiltered);


              var max = d3.max(dataFiltered, function(d){return parseInt(d.value)});
             

              var y = d3.scaleLinear()
                .domain([0, max])
                .range([height,0]);
              
              var x = d3.scaleTime()
                .rangeRound([0, width]);
              
              x.domain(d3.extent(dataFiltered, function(d) { return d.date; }));
              
  
              var line = d3.line()
            		.x(function(d) { return x(d.date); })
            		.y(function(d) { return y(d.value); });
              
          //    console.log(data.length);
            

              var barwidth = width / data.length ;
        			
                        
              // imprime meses eje X
              g.append("g")
                  .attr("class", "axis axis--x months")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x).tickFormat(xAxisTime).tickSizeOuter(0).tickPadding(10));
               // imprime años eje X
              g.append('g')
                  .attr('class', 'axis axis--x years')
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x).tickFormat(x0AxisYear).tickSizeOuter(0).tickPadding(25));


              g.append("g")

              //.attr("transform", "translate(0," + (height) + ")")
              .call(d3.axisLeft(y));

              var svg_aline = g.append("line")
              	.attr("class", "line")	
              	.style("stroke-dasharray", ("3, 10"))	
              	.attr("x1",100)
              	.attr("x2",400)
              	.attr("y1",200)
             	  .attr("y2",200)
              	.style("display", "None")
  
              // Line 
              g.append("path")
              	.datum(dataFiltered)
              	.attr("fill", "none")
              	.attr("stroke", "steelblue")
              	.attr("stroke-linejoin", "round")
              	.attr("stroke-linecap", "round")
              	.attr("stroke-width", 2)
              	.attr("d", line);
              
              g.selectAll("dot").data(dataFiltered)
              	.enter()
                .append("circle")
                .attr("r", 8)
                .attr("cx", function(d){return x(d.date)})
                .attr("cy", function(d){return y(d.value);})
                .attr("class", "dot")
              	.on("mouseover", function(d) {	
                		d3.select(this).transition().duration(100)
                      .style("fill", "#ffab00")
                      .attr("r", 12);
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .8);		
                    div	.html(d.value +  " - "  +d.contrato + " "+ d.date)	
                        .style("left", x(d.date) + "px")		
                        .style("top", y(d.value) + "px");	
                		svg_aline.transition().duration(10)
                    	.style("display", "block")
                    	.attr("x1", x(d.date))
                    	.attr("y1", y(d.value))
                    	.attr("x2", x(d.date))
                    	.attr("y2", height)
                    })			
                .on("mouseout", function(d) {	
                		d3.select(this).transition().duration(100)
                      .style("fill", "grey")
                      .attr("r", 8);
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                		svg_aline.style("display","None")
                });
        })
}