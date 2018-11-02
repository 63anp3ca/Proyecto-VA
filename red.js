 function loadCircularHeatRed (p_departamento, p_anno,p_campana, p_parentesco) { 
 

 $( "#network" ).empty(); 
 


    var tooltip = d3.select("body")
                .append('div')
                .attr('class', 'tooltip')
                .attr("fill","#54278f" ) ;

     // mapiar etiquetas
    tooltip.append('div')
      .attr('class', 'label');
     tooltip.append('div')
      .attr('class', 'candidato');  
    tooltip.append('div')
      .attr('class', 'monto');
    tooltip.append('div')
      .attr('class', 'parentesco');
    tooltip.append('div')
      .attr('class', 'target');
    tooltip.append('div')
      .attr('class', 'source');    

   
    let svg = d3.select("#network"),
          width = +svg.attr("width"),
          height = + svg.attr("height");

    var container = svg.append("g");      

            
    var size =d3.scaleLog().range([1,70]) // escala de la linea

    d3.queue()
        .defer(d3.csv,"https://raw.githubusercontent.com/63anp3ca/Proyecto-VA/master/datafin.csv",parse)  // llama funcion parse para las columnas
        .await(ready)
       
     
       function ready (error,data)
       {
         if (error) throw error;
     
            console.log("data");
            console.log(data);

           // console.log("p_parentesco");
           // console.log(p_parentesco);
           
           if ( p_parentesco == "todos") 
                      {

                          var dataFiltered = data.filter(function (d) { return d.departamento === p_departamento 
                                                              && d.cargo === p_campana
                                                              && d.anno === p_anno });

                          // console.log("dataFiltered todos");
                          // console.log(dataFiltered);    

                      }
                     else if  ( p_parentesco == "NA") 
                      {
                            var dataFiltered = data.filter(function (d) { return d.departamento === p_departamento 
                                                              && d.cargo === p_campana
                                                              && d.anno === p_anno
                                                              && d.parentesco === "NA"});
                            // console.log("dataFiltered sin parentesco");
                            // console.log(dataFiltered);    
                     } 
                     else  
                     {
                            var dataFiltered = data.filter(function (d) { return d.departamento === p_departamento 
                                                              && d.cargo === p_campana
                                                              && d.anno === p_anno
                                                              && d.parentesco != "NA"});
                            // console.log("dataFiltered parentesco");
                            // console.log(dataFiltered);    
                     };

            
            

                       

           const nestByCandidato=d3.nest().key((d)=>{return d.candidato})
                                 .entries(dataFiltered);
          
           nestByCandidato.forEach((d)=>{
              d.volume=d3.sum(d.values,(d)=>{return d.value});
           })
          
        
           const nestByFinanciador=d3.nest().key((d)=>{return d.financiador})
                                 .entries(dataFiltered);
          
            nestByFinanciador.forEach((d)=>{
               d.volume=d3.sum(d.values,(d)=>{return d.value});
            })
   
         
          const nodes=[], 
            links=[],
            graph={};

     
         //push all wesite and username to nodes=[] and remove duplicate value
           nestByCandidato.forEach((d)=>{
               nodes.push({"id":d.key,"type":"source","volume":d.volume})
            })
          
           nestByFinanciador.forEach((d)=>{
               nodes.push({"id":d.key,"type":"target","volume":d.volume})
           })

         dataFiltered.forEach((d)=>{
           links.push(
             {"source":d.candidato,"target":d.financiador,"value":d.value}
            )
         })

         graph.nodes=nodes,
         graph.links=links;
         
         // console.log("nodes");
         // console.log(nodes);

         // console.log("links");
         // console.log(links);

         // console.log("graph");
         // console.log(graph);
    
        svg.call(
          d3.zoom()
              .scaleExtent([.1, 4])
              .on("zoom", function() { container.attr("transform", d3.event.transform); }) );

        // simulation setup with all forces
        var linkForce = d3
          .forceLink()
          .id(function (link) { return link.id })
          .strength(function (link) { return link.strength });

      
     
        const simulation = d3.forceSimulation()
                           .velocityDecay(0.8)
                 .force("links",d3.forceLink().id(function(d){return d.id}))
                 .force("charge",d3.forceManyBody().strength(-4))
                           .force("collide",d3.forceCollide())
                 .force("center",d3.forceCenter(width/2,height/2));   


        var dragDrop = d3.drag().on('start', function (node) {
          node.fx = node.x
          node.fy = node.y
        }).on('drag', function (node) {
          simulation.alphaTarget(0.3).restart()
          node.fx = d3.event.x
          node.fy = d3.event.y
        }).on('end', function (node) {
          if (!d3.event.active) {
            simulation.alphaTarget(0)
          }
          node.fx = null
          node.fy = null
        });

        size.domain(d3.extent(nodes,(d)=>{return d.volume}))

   
         ///// imprime linea y datos d ela linea
        var linkElements = container.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", 3)
          .attr("stroke", "rgba(50, 50, 50, 0.2)")
          .on('mouseover', function(d) {
               // tooltip.select('.parentesco').html("<b> parentesco: " + d.parentesco  + "</b>");
                 tooltip.select('.candidato').html("<b>  Departamento Ingreso: " + dbbuscard(d.source.id , d.target.id)  + "</b>" );
                 tooltip.select('.source').html("<b> Financiador: " + d.target.id  + "</b>");
                 tooltip.select('.parentesco').html("<b> parentesco: " + dbbuscarp(d.source.id , d.target.id)  + "</b>");
                 tooltip.select('.monto').html("<b> monto: " + Intl.NumberFormat().format(d.value)   + "</b>");
                 tooltip.style('display', 'block');
                 tooltip.style('opacity',2)
             })    
             .on('mousemove', function(d) {

                          tooltip.style('top', (d3.event.layerY + 10) + 'px')
                          .style('left', (d3.event.layerX - 25) + 'px');
            })
            .on('mouseout', function(d) {
                          tooltip.style('display', 'none');
                          tooltip.style('opacity',0)
            })  ;   
        
    


        //imprime nodo 
        var nodeElements = container.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
            .attr("r",function(d){
                   if (d.type == "target") 
                      { return 5 ;}
                   else 
                      {return radio(d.volume);}})
            .attr("fill", getNodeColor)
            .call(dragDrop)
            .on('click', selectNode)
            .on("dblclick", dblclick)
            .on('mouseover', function(d) {
                 tooltip.select('.candidato').html( d.id );
                 tooltip.select('.target').html("</b>");
                 tooltip.select('.source').html("</b>");
                 tooltip.select('.parentesco').html("</b>");
                 tooltip.select('.monto').html("</b>" + Intl.NumberFormat().format(d.volume)   + "</b>");
                  tooltip.style('display', 'block');
                 tooltip.style('opacity',2)
             })    
             .on('mousemove', function(d) {

                          tooltip.style('top', (d3.event.layerY + 10) + 'px')
                          .style('left', (d3.event.layerX - 25) + 'px');
            })
            .on('mouseout', function(d) {
                          tooltip.style('display', 'none');
                          tooltip.style('opacity',0)
            }) 
             ;   




       // texto nodo
        // var textElements = svg.append("g")
        //   .attr("class", "texts")
        //   .selectAll("text")
        //   .data(graph.nodes)
        //   .enter().append("text")
        //     .text(function (node) { return  node.id  })
        //      .attr("font-size",5)
        //      .attr("dx", 15)
        //     .attr("dy", 4);


        // CALCULA LAS COORDENADAS 
        simulation.nodes(graph.nodes).on("tick", ticked);
        simulation.force("links").links(graph.links);
        simulation.force("collide").radius((d)=>{return size(d.volume)})

        

        //// funciones
        function ticked() {
          linkElements
            .attr('x1', function (link) { return link.source.x })
            .attr('y1', function (link) { return link.source.y })
            .attr('x2', function (link) { return link.target.x })
            .attr('y2', function (link) { return link.target.y });
          nodeElements
            .attr('cx', function (node) { return node.x })
            .attr('cy', function (node) { return node.y });
          // textElements
          //   .attr('x', function (node) { return node.x })
          //   .attr('y', function (node) { return node.y+2 });
          }



        function getNeighbors(node) {
          return links.reduce(function (neighbors, link) {
              if (link.target.id === node.id) {
                neighbors.push(link.source.id)
              } else if (link.source.id === node.id) {
                neighbors.push(link.target.id)
              }
              return neighbors
            },
            [node.id]
          )
        };

       function isNeighborLink(node, link) {
          return link.target.id === node.id || link.source.id === node.id
        }


        function getNodeColor(node, neighbors) {
          if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
            return node.type === "source" ? '#fc4e2a' : '#FFE80D' // ''naranja' : 'amarillo'
          }

          return node.type === "source" ? '#08306b' : '#6a51a3'   // 'azul oscuro' : 'azul claro' primer plano 
        };


        function getLinkColor(node, link) {
          return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
        }

        function getTextColor(node, neighbors) {
          return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? '#00441b' : '#000000'  ///'verde' : 'black'
        };

        
        function selectNode(selectedNode) {
          var neighbors = getNeighbors(selectedNode)

          // we modify the styles to highlight selected nodes
          nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
        //  textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
          linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
        }


        function dbbuscarp(p_candidato,p_financiador) {
           var dataFiltered = data.filter(function (d) { return d.candidato === p_candidato 
                                                              && d.financiador === p_financiador  })
           var dataFiltered2 = dataFiltered.map(d=> d.parentesco);
             return dataFiltered2[0]
        }

        function dbbuscard(p_candidato,p_financiador) {
           var dataFiltered3 = data.filter(function (d) { return d.candidato === p_candidato 
                                                              && d.financiador === p_financiador  });

            console.log("dataFiltered3");
              console.log(dataFiltered3);
           var dataFiltered4 = dataFiltered3.map(d=> d.departamentoi);
              console.log("dataFiltered4");
              console.log(dataFiltered4[0]);
             return dataFiltered4[0]
        }


         function radio(p_monto) {
               if (p_monto <= 100000000) {
                 return 10
                } else if (p_monto > 100000000 && p_monto <= 200000000) {
                        return 15
                } else if (p_monto > 300000000 && p_monto <= 400000000) {
                        return 20
                } else if (p_monto > 400000000 && p_monto <= 500000000) {
                        return 25
                } else if (p_monto > 500000000 && p_monto <= 600000000) {
                        return 30
                } else if (p_monto > 600000000 && p_monto <= 700000000) {
                        return 35
                } else if (p_monto > 700000000 && p_monto <= 800000000) {
                        return 40
                } else if (p_monto > 800000000 && p_monto <= 900000000) {
                      return 45
                } else {
                        return 50  
           }
         }

        function dblclick() {
         // alert("Gerardo Perez");
           document.getElementById('chart3').style.display = 'block';
           loadCircularHeatline(p_departamento);
         
      }



    } 

   function parse(d){
        return {
          candidato:d.candidato,
          financiador:d.financiador,
          parentesco:d.parentesco,
          departamento:d.departamento,
          departamentoi:d.departamento_Ingreso,
          anno:d.anno,
          cargo:d.cargo,
          value:+d.valor
        }
      }   
  }