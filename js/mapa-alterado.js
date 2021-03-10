var geojson;
var cidades = {};
var maxData = "01/01/2020";
var layer;
var info;


// New Dicts da planilha nova
let salvarCidades = data => {
  localStorage.setItem("casosCidades", JSON.stringify(data));
  // console.log(' >>> SALVANDO CIDADES  --->  ', data, null, 7);
  //
  firstLoad();
};

// Kpis
let saveKpi = data => {
  localStorage.setItem("kpi", JSON.stringify(data));
  // console.log(' >>> NOVOS KPIS  --->  ', data, null, 7);
  firstLoad();
};

var count = 0;
function firstLoad() {
  count += 1;
  if (count === 2) {
    drawMapDefault();
  }
}

function listagemCidades(map) {
  cidades = {}
  const data = JSON.parse(localStorage.getItem('casosCidades'));
  var feed = data.feed;
  var entries = feed.entry;
  for (i = 0; i < entries.length; i++) {
    let cidades = entries[i]["gsx$cidade"]["$t"].toUpperCase();
    let totalAtivos = entries[i]["gsx$totaldecasosativos"]["$t"];
    console.log('TOTAL A T I V O S :> ', totalAtivos)
    
    cidades[city] = {
      TOTAL_CASOS: entries[i]["gsx$totaldecasos"]["$t"],
      TOTAL_MORTES: entries[i]["gsx$totaldemortes"]["$t"],
      TOTAL_ATIVOS: entries[i]["gsx$totaldecasosativos"]["$t"],
      TOTAL_CURADOS: entries[i]["gsx$curados"]["$t"],
      LETALIDADE: entries[i]["gsx$letalidade"]["$t"],      
    };
  }
  
  const style = feature => {
    return {
      weight: 0.5,
      opacity: 8,
      color: "#bdc3c7",
      dashArray: "0",
      fillOpacity: 10,
      fillColor: getColor(feature.properties.TOTAL_ATIVOS)
    };
  };
  
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: highlightFeature
    });
  };
  
  for (var city in cidades) {
    for (i = 0; i < statesData["features"].length; i++) {
      if (statesData["features"][i]["properties"]["NM_MUNICIP"] == city) {
        statesData["features"][i]["properties"]["TOTAL_ATIVOS"] =
        cidades[city]["TOTAL_ATIVOS"];
        console.log(cidades[city]["TOTAL_ATIVOS"])
      }
    }
    
    if (city == Object.keys(cidades)[Object.keys(cidades).length - 1]) {
      geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);
    }
  }
}

 
  console.log('deoijdeoidjeoi ===> ', statesData)

function getKpi() {
  const data = JSON.parse(localStorage.getItem("kpi"));
  var feed = data.feed;
  var entries = feed.entry;

  document.getElementById("casos-confirmados").innerHTML = entries[2].gsx$casosconfirmados.$t;
  document.getElementById("confirmados-24horas").innerHTML = entries[4].gsx$casosconfirmados.$t;
  document.getElementById("casos-ativos").innerHTML = entries[2].gsx$dataprimeiraconfirmacao.$t;
  document.getElementById("curados").innerHTML = entries[2].gsx$datacasomaisrecente.$t;
  document.getElementById("cidades-ativos").innerHTML = entries[2].gsx$cidadesafetadas.$t;

  document.getElementById("mortes-confirmadas").innerHTML = entries[2].gsx$mortes.$t;
  document.getElementById("mortes-24h").innerHTML = entries[4].gsx$mortes.$t;

  document.getElementById("mortes-mais-recentes").innerHTML = entries[2].gsx$mortemaisrecente.$t;

  // DATA CASO MAIS RECENTE - DATA DE ATUALIZACAO DO MAPA
  document.getElementById("data-caso-mais-recente").innerHTML = entries[0].gsx$datacasomaisrecente.$t;
  // document.getElementById("cidades-afetadas").innerHTML = entries[2].gsx$cidadesafetadas.$t;
}

function formatDate(string) {
  if (typeof string === "undefined") {
    return "";
  } else {
    return string.substr(6, 4)
      .concat(string.substr(3, 2))
      .concat(string.substr(0, 2));
  }
}

class City {
  constructor(name) {
    this.name = name;
  }


  get totalCasosAtivos() {
    if (typeof cidades[this._name] === "undefined") {
      
      return 0;
    } else {
      return cidades[this._name]["TOTAL_ATIVOS"];
    }
  }
  
  get totalCasos() {
    if (
      typeof cidades[this._name] === "undefined" ||
      cidades[this._name]["TOTAL_CASOS"] == ""
    ) {
      return "<div class='help-saude'><i class='fas fa-phone-alt mr-1'></i> Total de Casos</div>";
    } else {
      return cidades[this._name]["TOTAL_CASOS"];
    }
  }

  get totalMortes() {
    if (
      typeof cidades[this._name] === "undefined" ||
      cidades[this._name]["TOTAL_MORTES"] == ""
    ) {
      return "<div class='help-saude'><i class='fas fa-phone-alt mr-1'></i> Total de Mortes</div>";
    } else {
      return cidades[this._name]["TOTAL_MORTES"];
    }
  }

  get totalCurados() {
    if (typeof cidades[this._name] === "undefined") {
      return "<div class='help-saude'><i class='fas fa-phone-alt mr-1'></i> Total de Curados</div>";
    } else {
      return cidades[this._name]["TOTAL_CURADOS"];
    }
  }

  get totalAtivos() {
    if (typeof cidades[this._name] === "undefined") {
      return "<div class='help-saude'><i class='fas fa-phone-alt mr-1'></i> Total de Ativos</div>";
    } else {
      return cidades[this._name]["TOTAL_ATIVOS"];
    }
  }

  get letalidade() {
    if (typeof cidades[this._name] === "undefined") {
      return 0;
    } else {
      return cidades[this._name]["LETALIDADE"];
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}

function drawMapDefault() {
  var map = L.map("map").setView([-27.5, -49.7], 7.4);
  listagemCidades(map);
  getKpi();
  console.log('TOTAL_ATIVOS > ',listagemCidades(map))

  // setMapWidgetStyle(list(background="white"));

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 10,
      minZoom: 6,
      touchHover: true,
      touchZoom: true,
      fillColor: '#FFFFFF',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      // subdomains: 'abcd',
    }
  ).addTo(map);

  // control that shows state info on hover
  info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };


  info.update = function (props) {
    let city = props ? new City(props.NM_MUNICIP) : new City("");
    this._div.innerHTML =
      "<div class='row'>" +
      "<div class='col-10'>" +
      "<h4>Casos de Coronavirus em SC</h4>" +
      (props
        ?
        "</div><div class='col-2 hidden-desktop' onclick='closeDiv();' id='closeDiv'><i class='fas fa-times-circle close-btn bg-light rounded fa-3x ml-n3 mt-n3 text-danger'></i></div>" +
        "</div>" +
        "<b>" +
        city.name +
        "<br>" +
        "</b><br><div class='badge badge-default font13 text-danger text-left w-100'> <i class='fas fa-exclamation-triangle mr-2'></i>" +
        city.letalidade +
        " morte(s) confirmada(s)<br>" +
        "<hr class='hr-popup'>" +
        "<i class='fas fa-exclamation-triangle mr-2'></i>" +
        city.totalCasosAtivos +
        " caso(s) confirmado(s)</div><br /><br />" +     
        "<b>Primeiro caso registrado em: </b>" +
        city.totalCurados +
        "<br>" +
        "<b>Último caso registrado em: </b>" +
        city.totalAtivos +
        "<br><br>" +
        "<div class='col-12'><b>Onde buscar atendimento na cidade:</b><br />" +
        city.totalCasos +
        "</div>" +
        "<br><div class='help-saude font13 text-left hidden-mobile mt-2 text-accent'> <i class='fas fa-info-circle'></i> Clique sobre um município para ver<br /> detalhes</div>"
        : "<div class='help-saude font13 text-left hidden-mobile text-accent'> <i class='fas fa-info-circle'></i> Clique sobre um município para ver<br /> detalhes</div>");
  };

  info.addTo(map);

  var legend = L.control({
    position: "bottomright"
  });

  L.Control.Watermark = L.Control.extend({
    onAdd: function (map) {
      var img = L.DomUtil.create("img");
      img.src = "img/nsc.svg";
      img.style.width = "70px";
      return img;
    },
    onRemove: function (map) {
      // Nothing to do here
    }
  });

  L.control.watermark = function (opts) {
    return new L.Control.Watermark(opts);
  };

  L.control.watermark({ position: "bottomleft" }).addTo(map);


  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [50, 100, 500, 1000, 5000, 10000, 20000, 100000],
      labels = [],
      from,
      to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<i style="background:' +
        getColor(from + 1) +
        '"></i> ' +
        from +
        (to ? "&ndash;" + to : "+")
      );
    }
    div.innerHTML = labels.join("<br>");
    return div;
  };
  legend.addTo(map);
}


// get color depending on population density value
function getColor(d) {
  return d > 20000
    ? "#270B14"
    : d > 10000
      ? "#2C1635"
      : d > 5000
        ? "#59264E"
        : d > 1000
          ? "#6D3558"
          : d > 500
            ? "#824864"
            : d > 100
              ? "#995C71"
              : d >= 50
                ? "#B2737F"
                : "#CC8C8E";
}

function highlightFeature(e) {
  geojson.resetStyle(layer);
  info.update();

  layer = e.target;
  let city = e.sourceTarget.feature.properties
    ? new City(e.sourceTarget.feature.properties.NM_MUNICIP)
    : new City("");
  var popupContent =
    "<b>Saiba mais em:</b><br><a href=" +
    city.totalMortes +
    " target='_blank'>" +
    city.totalMortes +
    "</href>";
  e.target.bindPopup(popupContent);

  layer.setStyle({
    weight: 2,
    color: "#ffe082",
    dashArray: "0",
    fillOpacity: 0.8,
    transition: "all ease .1s"
  });


  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function closeDiv() {
  geojson.resetStyle(layer);
  info.update();
}

function zoomToFeatureMap(e) {
  layer = e.target;
  let city = e.sourceTarget.feature.properties
    ? new City(e.sourceTarget.feature.properties.NM_MUNICIP)
    : new City("");

  var popupContent =
    "<b>Saiba mais em:</b><br><a href=" +
    city.totalMortes +
    " target='_blank'>" +
    city.totalMortes +
    "</href>";
  e.target.bindPopup(popupContent);
  info.update(layer.feature.properties);
  // map.fitBounds(e.target.getBounds());
}
function backtoTop() {
  document.documentElement.scrollTo = 0;
}
