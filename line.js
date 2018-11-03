function loadCircularHeatline(p_financiador) 
{ 
        
        console.log("p_financiador");
              console.log(p_financiador);

        var margin = {top: 50, right: 30, bottom: 100, left: 100};
        let svg = d3.select("#line"),
          width = 800,
          height =400;  

        var g = svg.append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
        var tooltip = d3.select("body")
                .append('div')
                .attr('class', 'tooltip')
                .attr("fill","#54278f" ) ;

         // mapiar etiquetas
        tooltip.append('div')
               .attr('class', 'label');
        
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
              
              var dataFiltered = data.filter(function(d) { return d.Representante === p_financiador });
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


             g.append('g')
                  .attr('class', 'legend')
                  .append("text")
                  .attr("x", -32)
                  .attr("y", -15)
                  .attr("dy", "0.71em")
                  .attr('font-size', '12px')
                  .attr("fill", "#3d3d3d")
                  .text(p_financiador.toUpperCase());


              var svg_aline = g.append("line")
              //	.attr("class", "line")	
                .attr("fill", "none")
                .attr("stroke", "#ffab00")
                .attr("stroke-width", 3)
              	.style("stroke-dasharray", ("3, 10"))	
              	.attr("x1",100)
              	.attr("x2",400)
              	.attr("y1",200)
             	  .attr("y2",200)
              	.style("display", "None");
  
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
                    svg_aline.transition().duration(10)
                    	.style("display", "block")
                    	.attr("x1", x(d.date))
                    	.attr("y1", y(d.value))
                    	.attr("x2", x(d.date))
                    	.attr("y2", height);

                    tooltip.select('.label').html("<b> texto: " + d.value +  " - "  +d.contrato + " "+ d.date  + "</b>");
                    tooltip.style('display', 'block');
                    tooltip.style('opacity',2);

                    })		
                   
                 .on('mousemove', function(d) {
                          tooltip.style('top', (d3.event.layerY + 10) + 'px')
                          .style('left', (d3.event.layerX - 25) + 'px');
                  })

                .on("mouseout", function(d) {	
                		d3.select(this).transition().duration(100)
                      .style("fill", "grey")
                      .attr("r", 8);
                   	svg_aline.style("display","None")
                    tooltip.style('display', 'none');
                    tooltip.style('opacity',0);
                });
        })
}