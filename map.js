function loadCircularHeatMap (p_departamento, p_campana) {
  $( "#main" ).empty(); 
  $( "#zooms" ).empty();
  document.getElementById('chart2').style.display = 'none';
  document.getElementById('chart3').style.display = 'none';

//  loadCircularHeatRed("","","","");
 // loadCircularHeatline("");
  ///// calculo latitud longitud departamento 
  var latitud = 0.00, longitud = 0.00;
  switch (p_departamento)
  {
     case "AMAZONAS":
          latitud = -1; 
          longitud = -71.9;
          break;
     case "ANTIOQUIA":
          latitud = 7; 
          longitud = -75.5;
          break;
     case "ARCHIPIELAGO DE SAN ANDRES PROVIDENCIA Y SANTA CATALINA": 
          latitud = 12; 
          longitud = -81.7;
          break;
     case "ATLANTICO":
          latitud = 10; 
          longitud = -75;
          break;
      case "ARAUCA":
          latitud = 7; 
          longitud = -70.7;
          break;
     case "BOGOTA":
          latitud = -1; 
          longitud = -71.9;
          break;
     case "BOLIVAR":
          latitud = 9; 
          longitud = -74.33;
          break;
     case "BOYACA":
          latitud = 5.5; 
          longitud = -72.5;
          break;
     case "CALDAS":
          latitud = 5; 
          longitud = -75.5;
          break;
     case "CAQUETA":
          latitud = 1; 
          longitud = -74;
          break;
     case "CASANARE":
          latitud = 5.5; 
          longitud = -71.5;
          break;
     case "CAUCA":
          latitud =2.5; 
          longitud = -76.83;
          break;
     case "CESAR":
          latitud = 9.3; 
          longitud = -73.5;
          break;
     case "CHOCO":
          latitud = 6; 
          longitud = -77;
          break;
     case "CORDOBA":
          latitud =8.33 ; 
          longitud = -75.66;
          break;
     case "CUNDINAMARCA":

          latitud = 4.5; 
          longitud = -74.16;
          break;
     case "GUAINIA":
          latitud = 2.5; 
          longitud = -69;
          break;
     case "GUAVIARE":
          latitud = 1.68 
          longitud = -72.82;
          break;
     case "HUILA":
          latitud = 2.5; 
          longitud = -75.75;
          break;
     case "LA GUAJIRA":
          latitud = 11.5; 
          longitud = -72.5;
          break;
     case "MAGDALENA":
          latitud = 10; 
          longitud = -74.5;
          break;
     case "META":
          latitud = 3.5; 
          longitud = -73;
          break;
     case "NARIÑO":
          latitud = 1.5; 
          longitud = -78;
          break;
     case "NORTE DE SANTANDER":
          latitud = 8; 
          longitud = -73;
          break;
     case "PUTUMAYO":
          latitud = 0.5; 
          longitud = -76;
          break;
     case "QUINDIO":
          latitud = 4.5; 
          longitud = -75.66;
          break;
     case "RISARALDA":
          latitud = 5; 
          longitud = -76;  
          break;   
     case "SANTAFE DE BOGOTA D.C":
          latitud = -1; 
          longitud = -71.9;
          break;
     case "SANTANDER":
          latitud = 7; 
          longitud = -73.25;
          break;
     case "SUCRE":
          latitud = 9; 
          longitud = -75;
          break;
     case "TOLIMA":
          latitud = 3.75; 
          longitud = -75.25;
          break;
     case "VALLE DEL CAUCA":
          latitud = 3.75; 
          longitud = -76.5;
          break;
     case "VAUPES":
          latitud = 0.25; 
          longitud = -70.75;
          break;
     case "VICHADA":
          latitud = 5; 
          longitud = -69.5;
          break;
     default: 
          latitud = -4.5; 
          longitud = -74;
          break;
  }


  var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


  var zoom = d3.zoom().on("zoom", function () {
    var t = d3.event.transform;
    svg.attr("transform", t);
    });

  zoom.scaleExtent([1, 8]);

  var projection = d3.geoMercator()
      .scale(1600)
      .center([-74, 4.5]) // Center the Map in Colombia
      .translate([width / 2, height / 2]);

  var projectionzoom = d3.geoMercator()
        .scale(3000)
        .center([parseFloat(longitud),parseFloat( latitud)]) // Center the Map in departamento lonjitud - latitud
        .translate([300 / 2, 140]);


  var path = d3.geoPath()
      .projection(projection);

  var pathzoom = d3.geoPath()
      .projection(projectionzoom);


  var svg = d3.select("#main").append("svg")
      .attr("width", width)
      .attr("height", height) ;


 
  var svgzoom = d3.select("#zooms").append("svg")
      .attr("width", width)
      .attr("height", height);
   //    .append("g");

  var fmt = d3.format(",d");

  queue()
    .defer(d3.json, "https://raw.githubusercontent.com/63anp3ca/Proyecto-VA/master/colombia.geo.json")
    .defer(d3.csv, "https://raw.githubusercontent.com/63anp3ca/Proyecto-VA/master/datafin.csv")
    .await(function(error, mapData, dataset){

    
     // console.log("dataset");
     // console.log(dataset);       

    var dataFiltered = dataset.filter(function (d) { return d.departamento === p_departamento 
                                                      && d.cargo === p_campana
                                                      
                                                    });
     // console.log("dataFiltered");
     // console.log(dataFiltered);    

    var dictData = {};
    dataset.forEach(function (d) {
      if(dictData[d.departamento.toUpperCase()]){
        dictData[d.departamento.toUpperCase()].cantidad += parseInt(d.valor);
 
      }else{
        dictData[d.departamento.toUpperCase()] = {
          nombre : d.departamento,
          departamento_ingreso : d.departamento_Ingreso,
          cantidad : parseInt(d.valor)
        };
        
      } 
    });

   
  
  var dictData2 = {};
    dataFiltered.forEach(function (d) {
      if(dictData2[d.departamento_Ingreso.toUpperCase()]){

         dictData2[d.departamento_Ingreso.toUpperCase()].cantidad += parseInt(d.valor);
      }else{
        dictData2[d.departamento_Ingreso.toUpperCase()] = {
          nombre : d.departamento_Ingreso,
          cantidad : parseInt(d.valor)

        };
        } 
    });


 
     
  console.log("dataFiltered");
  console.log(dataFiltered);

    var i;
    var valorTotal = 0;
    for (i = 0; i < dataFiltered.length; i++) { 
         valorTotal += parseInt(dataFiltered[i].valor);
    };

  console.log("valorTotal");
  console.log(valorTotal);

 // var valorTotal = 0;
    for (i = 0; i < dataFiltered.length; i++) { 
         console.log(dataFiltered[i].departamento_Ingreso);
    };

  var arrayDictData = Object.keys( dictData2 ).map(function ( key ) {
    return dictData2[key]; 
    });

  var min = parseInt(d3.min(arrayDictData, function(d) { return d.cantidad; }));
  var max = parseInt(d3.max(arrayDictData, function(d) { return d.cantidad; }));
  
  // console.log("min");
  // console.log(min);  


  // console.log("max");
  // console.log(max);  

  if (min == max ){ min= 0;}; 

  var color = d3.scaleSequential(d3.interpolateYlGn)
    .domain([min, max])
    .clamp(true)
    ;

  svg.call(zoom);

  var filteredFeatures = mapData.features.filter(function(feature) {
        return feature.properties.NOMBRE_DPT == p_departamento 
    })

    // console.log("filteredFeatures");
    // console.log(filteredFeatures); 
    

  var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);


  if (p_departamento  != "COLOMBIA"){
       // imprime el map de colombia        
        svg.append("g")
          .attr("class", "departamentos")
          .selectAll("path")
          .data(mapData.features) 
          .enter()
          .append("path")
            .attr("d", path)
            .style("fill", function(d) { 
              var departamento = dictData2[d.properties.NOMBRE_DPT];
                //console.log(dictData2[d.properties.NOMBRE_DPT]); 
                if (departamento){
                  return color(departamento.cantidad);
                } else{
                  return '#fec44f';  //'#fec44f'
                } 
             })
            .style("opacity",0.8)
            .style("stroke","#000000")
            .style('stroke-width', 1)
            .on("dblclick", dblclick)
            .on("mouseover", function(d) {
              var label = '';     
              var departamento = dictData2[d.properties.NOMBRE_DPT];
              if (departamento){
                label = '<strong>Departamento:</strong>' + departamento.nombre 
                      + ' <br /> <strong>Financiación:</strong>' + fmt(departamento.cantidad);
              } else{
                label = '<strong>Departamento:</strong>:' + d.properties.NOMBRE_DPT
                      + '<br /> <strong>Financiación:</strong> 0';
              }
              tooltip.transition().duration(200).style("opacity", .9);
              tooltip.html(label)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
             tooltip.transition().duration(500).style("opacity", 0);
            });
         



        // imprime el map de departamento  de colombia 
        
         svgzoom.append('g')
              .attr('class', 'legend')
              .append("text")
               .attr("style","font-size:20px; font-weight: bold;")
              // .attr("transform", "rotate(-90)")
              .attr("x", 20)
              .attr("y", 20)
              .attr("dy", "0.71em")
              .attr('font-size', '20px')
              .attr("fill", "#3d3d3d")
              .text(p_departamento);


        svgzoom.append('g')
              .attr('class', 'legend')
              .append("text")
              // .attr("transform", "rotate(-90)")
              .attr("style","font-size:12px; font-weight: bold;")
              .attr("x", 5)
              .attr("y", 250)
              .attr("dy", "0.71em")
              .attr('font-size', '16px')
              .attr("fill", "#3d3d3d")
              .text(p_campana);      
       
        svgzoom.append('g')
              .attr('class', 'legend')
              .append("text")
               .attr("style","font-size:22px; font-weight: bold;")
              // .attr("transform", "rotate(-90)")
              .attr("x", 75)
              .attr("y", 270)
              .attr("dy", "0.71em")
              .attr('font-size', '16px')
              .attr("fill", "#3d3d3d")
              .text("$"+Intl.NumberFormat().format(valorTotal) );      
      

        svgzoom.append("g")
              .attr("class", "departamento")
              .selectAll("path")
              .data(filteredFeatures) 
              .enter()
              .append("path")
                .attr("d", pathzoom)
               // .attr("aling" , "start")
                .style("opacity",0.8)
               // .style("stroke","black")
                .style("stroke","#000000")
                .style('stroke-width', 1)
                .style("fill","#00441b")
                .on("dblclick", dblclick)
                ;

        // svgzoom.append("g")
        //       .attr("class", "text")
        //       .data(dictData3) 
        //       .enter()
        //       .append("text")
        //       .text(dictData3.cantidad);    
        //         ;
      

        // The legend con esla de color 
        svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(350,30)");

        var legendLinear = d3.legendColor()
          .labelFormat(fmt)
          .orient('vertical')
          //.attr("fill", "#ffffff")
          .title('Aportes $')
          .labelAlign("start")
          .scale(color);

        svg.select(".legend").call(legendLinear);
  }
  else{
        // imprime el map de colombia  en blanco 
        svgzoom.append('g')
        .attr('class', 'legend')
        .append("text")
        .attr("style","font-size:20px; font-weight: bold;")
        // .attr("transform", "rotate(-90)")
        .attr("x", 20)
        .attr("y", 20)
        .attr("dy", "0.71em")
        .attr('font-size', '20px')
        .attr("fill", "#3d3d3d")
        .text(p_departamento);



        svg.append("g")
              .attr("class", "departamentos")
              .selectAll("path")
              .data(mapData.features) 
              .enter()
              .append("path")
                .attr("d", path)
                .style("opacity",0.8)
                .style("stroke","#bdbdbd")
                .style('stroke-width', 0.5)
                .style("fill","#f0f0f0");

  }  
});


       function dbbuscard(p_candidato,p_financiador) {
           var dataFiltered7 = data.filter(function (d) { return d.candidato === p_candidato 
                                                              && d.financiador === p_financiador  });
           var dataFiltered8 = dataFiltered3.map(d=> d.departamentoi);
              return dataFiltered4[0]
        }

     


   function dblclick() {
        document.getElementById('chart2').style.display = 'block';
        document.getElementById('chart3').style.display = 'none';
        loadCircularHeatRed(p_departamento,p_campana, "todos");
    }

}