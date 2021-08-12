mapboxgl.accessToken = " ";//MapBox Access Key

imgpath='https://phi.ba/freelancer/map';

territory = [];
territory["Alabama"] = ["Birmingham", "Mobile", "Mont"];
territory["Alaska"] = ["Alaska"];
territory["Arizona"] = ["Northern AZ", "Phoenix", "Tucson"];
territory["Arkansas"] = ["Fayetteville", "Little Rock", "Memphis"];
territory["California"] = ["Fayetteville","Bakersfield","Fresno","Los Angeles","Modesto","Redding","Riverside","Sacramento","San Bernadino","San Diego","San Francisco","Santa Barbara","Sonoma"];
territory["Colorado"] = ["Colorado Springs","Denver","Fort CollinsFresno"];
territory["Connecticut"] = ["CT"];
territory["Delaware"] = ["Delaware"];
territory["District of Columbia"] = ["Washington D.C"];
territory["Florida"] = ["Fort Myers","Gainesville","Jacksonville","Miami","Orlando","Sarasota","Tallahassee","Tampa"];
territory["Georgia"] = ["Atlanta","Augusta","Jacksonville","Macon","Savannah","Southern Georgia"];
territory["Hawaii"] = ["Hawaii"];
territory["Idaho"] = ["Boise"];
territory["Illinois"] = ["Chicago","Springfield IL","St. Louis",];
territory["Indiana"] = ["Chicago","Cincinnati","Indianapolis","Louisville","South Bend"];
territory["Iowa"] = ["Iowa","Nebraska"];
territory["Kansas"] = ["Kansas","Kansas City"];
territory["Kentucky"] = ["Cincinnati","Frankfort","Louisville"];
territory["Louisiana"] = ["Shreveport","Baton Rouge","New Orleans"];
territory["Maine"] = ["Maine"];
territory["Maryland"] = ["Baltimore","Washington D.C"];
territory["Massachusetts"] = ["Boston","Providence"];
territory["Michigan"] = ["Detroit","Grand Rapids","Northern Michigan"];
territory["Minnesota"] = ["Minnesota"];
territory["Mississippi"] = ["Jackson","Memphis","Mobile"];
territory["Missouri"] = ["Kansas City","Springfield","St. Louis"];
territory["Montana"] = ["Montana"];
territory["Nebraska"] = ["Nebraska"];
territory["Nevada"] = ["Las Vegas","Reno"];
territory["New Hampshire"] = ["New Hampshire"];
territory["New Jersey"] = ["Newark","Philadelphia","Trenton"];
territory["New Mexico"] = ["New Mexico"];
territory["New York"] = ["Albany","Buffalo","Long Island","NYC","Syracuse","Westchester"];
territory["North Carolina"] = ["Charlotte","Coastal Carolina","Greensboro","Raleigh-Durham"];
territory["North Dakota"] = ["North Dakota"];
territory["Ohio"] = ["Cincinnati","Cleveland","Columbus","Toledo"];
territory["Oklahoma"] = ["Oklahoma City","Tulsa"];
territory["Oregon"] = ["Eugene","Portland"];
territory["Pennsylvania"] = ["Harrisburg","Northern Pennsylvania","Philadelphia","Pittsburgh","State College"];
territory["Rhode Island"] = ["Providence"];
territory["South Carolina"] = ["Augusta","Charleston","Charlotte","Columbia","Greenville"];
territory["South Dakota"] = ["South Dakota"];
territory["Tennessee"] = ["Knoxville","Memphis","Nashville"];
territory["Texas"] = ["Abilene","Amarillo","Austin","Dallas","Eastern Texas","El Paso","Houston","Lubbock","San Antonio","Southern Texas","Waco"];
territory["Utah"] = ["Salt Lake City"];
territory["Vermont"] = ["Vermont"];
territory["Virginia"] = ["Northern Virginia","Richmond / Hampton Roads","Roanoke","Washington D.C"];
territory["Washington"] = ["Portland","Seattle","Spokane","Yakima"];
territory["West Virginia"] = ["West Virginia"];
territory["Wisconsin"] = ["Milwaukee","Minnesota","Northern Wisconsin"];
territory["Wyoming"] = ["Wyoming"];

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapster/ckne1dkny2r3f17pc60lbyok1",
  center: [-0.129483562266444, 0.11077106198257525],
  zoom: 4, 
});

map.scrollZoom.disable();
map.dragPan.disable();
map.doubleClickZoom.disable();

var hoveredStateId = null;
var popup;

map.on("load", function () {

  var layers = map.getStyle().layers;
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      firstSymbolId = layers[i].id;
      break;
    }
      
  }
  
  map.addLayer({
    id: "polygons",
    type: "fill",
    source: "composite",
    "source-layer": "albersusa",
    paint: {
      "fill-color": [
        "case",
        [
          "boolean",
          ["feature-state", "clicked"],
          ["feature-state", "hover"],
          false,
        ],
        "#34A2DA",
        "#173F6E",
      ],

      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0,
      ],
    },
    filter: ["==", "$type", "Polygon"],
    
  },
  firstSymbolId
  );

  //keyglee
  map.loadImage(
  'http://127.0.0.1:5500/img/pin.png',
    function (error, image) {
      if (error) throw error;
      
      // Add the image to the map style.
      map.addImage('pinImg', image);
    
//House
      map.addLayer({
        id: "kucice",
        type: 'symbol',
        source: "composite",
        "source-layer": "Keygles_sites_albers-0f63q8",
        'layout': {
          'icon-image': 'pinImg', // reference the image
          'icon-size': 0.9
        }
      });
      
    });

    console.log(map.getStyle());

});

var polygonID = null;
var kuciceID = null;

var features = map.querySourceFeatures("statefill", {
  source: "composite",
  sourceLayer: "albersusa",
});

//popup on click in statefill layer

map.on("click", "polygons", (e) => {
 map.querySourceFeatures("composite", {
    sourceLayer: "albersusa",
  });
 $(map).click();
  map.getCanvas().style.cursor = "pointer";
  if (e.features.length > 0) {
    if (polygonID) {
      map.removeFeatureState({
        source: "composite",
        sourceLayer: "albersusa",
      });
    }

    for (i = 0; i < 2; i++) {
      polygonID = e.features[i].id;
      if (e.features[i].properties.county_name) {
      } else {
        map.setFeatureState(
          {
            source: "composite",
            sourceLayer: "albersusa",
            id: polygonID,
          },
          {
            clicked: true,
          }
        );
      }
    }
  }


  var helpniz = territory[e.features[0].properties.state_name];
  var tername = "";

  for (j = 0; j < helpniz.length; j++) {
    tername += "<p id='tername'>" + helpniz[j] + "</p>";
  }

  var img=e.features[0].properties.state_name;
  var image_name= img.replace(" ", "_");

  cursorY= event.clientY;
  

  if(cursorY < 300){
    markerHeight = -500;
  }else{
    markerHeight = 0;
  }

  var markerRadius = 10, linearOffset = 25;
  var popupOffsets = {
    'top': [0, 0],
    'top-left': [0,0],
    'top-right': [0,0],
    'bottom': [0, markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  };

  html = "";
  html +=
    "<div id='stateName'><p>" +
    e.features[0].properties.state_name +
    "</p></div><div id='container'><div id='imageDiv'><img src='"+imgpath+'/images/maps/'+image_name+'.png'+"'>" +
    "</div> <div id='territory'>" + tername +"</div></div>";
  popup = new mapboxgl.Popup({ offset: popupOffsets})
    .setLngLat(e.lngLat)
    .setHTML(html)
    .setMaxWidth("400px")
    .addTo(map);
});


// Hover
map.style.imageManager.getImage(polygonID);

var popupHover = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on("mousemove", "polygons", (e) => {
  map.getCanvas().style.cursor = "pointer"; 
  if (e.features.length > 0) {
    if (polygonID) {
      map.removeFeatureState({
        source: "composite",
        sourceLayer: "albersusa",
      });
    }
   for (i = 0; i < 2; i++) {
    polygonID = e.features[i].id;
      if (e.features[i].properties.county_name) {    
      } else {
        map.setFeatureState(
          {
            source: "composite",
            sourceLayer: "albersusa",
            id: polygonID,
          },
          {
            hover: true,
          }
        );
      }
    }
  }
});

map.on('mouseleave', 'polygons', function () {
    if (polygonID !== null) {
      map.setFeatureState({ 
        source: 'composite',
        sourceLayer: "albersusa", 
        id: polygonID 
      },
      { 
        hover: false 
      }
      );
    }
  polygonID = null;
});

// Popup on click in layer keyglee
   map.on("mouseover", "kucice", (e) => {
    map.getCanvas().style.cursor = "pointer";

    html = "";
    html +=
    "<div id='terrLabel'>" +e.features[0].properties.Territory +"</div>";
    popupHover = new mapboxgl.Popup({ offset: [0, -15], closeButton: false, })
    .setLngLat(e.lngLat)
    .setHTML(html)
    .addTo(map); 
  });

  map.on('mouseleave', 'kucice', function () {
    map.getCanvas().style.cursor = '';
    popupHover.remove();
  });
