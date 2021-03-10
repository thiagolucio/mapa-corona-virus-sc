var geojson;
var dict = {};
var maxData = "01/01/2020";
var layer;
var info;

let saveDict = data => {
  localStorage.setItem("dictio", JSON.stringify(data));
  firstLoad();
};

// Planilha Aba Resumos dos casos
let saveKpi = data => {
  localStorage.setItem("kpi", JSON.stringify(data));
  firstLoad();
};

var count = 0;

function firstLoad() {
  count += 1;
  if (count === 2) {
    drawMapDefault();
  }
}

function createDict(map) {
  dict = {};
  const data = JSON.parse(localStorage.getItem("dictio"));
  var feed = data.feed;
  var entries = feed.entry;
  for (i = 0; i < entries.length; i++) {
    let city = entries[i]["gsx$cidade"]["$t"].toUpperCase();
    dict[city] = {
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

  for (var city in dict) {
    for (i = 0; i < statesData["features"].length; i++) {
      if (statesData["features"][i]["properties"]["NM_MUNICIP"] == city) {
        statesData["features"][i]["properties"]["TOTAL_ATIVOS"] =
          dict[city]["TOTAL_ATIVOS"];
      }
    }

    if (city == Object.keys(dict)[Object.keys(dict).length - 1]) {
      geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);
    }
  }
}

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
  document.getElementById("data-caso-mais-recente").innerHTML = entries[0].gsx$datacasomaisrecente.$t;
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

  get news() {
    return "https://www.nsctotal.com.br/coronavirus";
  }

  get totalAtivos() {
    if (typeof dict[this._name] === "undefined") {
      return 0;
    } else {
      return dict[this._name]["TOTAL_ATIVOS"];
    }
  }

  get totalCasos() {
    if (typeof dict[this._name] === "undefined") {
      return 0;
    } else {
      return dict[this._name]["TOTAL_CASOS"];
    }
  }

  get totalMortes() {
    if (typeof dict[this._name] === "undefined") {
      return 0;
    } else {
      return dict[this._name]["TOTAL_MORTES"];
    }
  }

  get totalCurados() {
    if (typeof dict[this._name] === "undefined") {
      return 0;
    } else {
      return dict[this._name]["TOTAL_CURADOS"];
    }
  }

  get letalidade() {
    if (typeof dict[this._name] === "undefined") {
      return 0;
    } else {
      return dict[this._name]["LETALIDADE"];
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
  createDict(map);
  getKpi();

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 10,
      minZoom: 6,
      touchHover: true,
      touchZoom: true,
      fillColor: '#FFFFFF',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  ).addTo(map);

  // control that shows state info on hover
  info = L.control();

  info.onAdd = function(map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };


  info.update = function(props) {
    let city = props ? new City(props.NM_MUNICIP) : new City("");
    this._div.innerHTML =
      "<div class='row animated fadeIn'>" +
      "<div class='col-10'>" +
      (props ?
        "</div>" +
        "<div class='div-city-name-popup'>" +
        "<h5 class='col-10 badge bg-secondary rounded-pill city-name-popup roboto-font text-center'>" +
        "Casos em " + city.name +
        "<span class='translate-middle badge border border-5 border-secondary rounded-circle bg-danger p-2 hidden-desktop close-btn' onclick='closeDiv();' id='closeDiv'>" +
        "<i class='fas fa-times fa-lg'></i>" +
        "</span>" +
        "</h5>" +
        "</div>" +
        "<div class='row justify-content-center animated fadeIn'>" +
        "<div class='col-3 col-lg-2 ms-1'>" +
        "<div class='card card-city-name-popup text-center'>" +
        "<div class='card-header'>" +
        "<span class='fa-stack fa-1x text-danger'>" +
        "<i class='fas fa-circle fa-stack-2x'></i>" +
        "<i class='fas fa-cross fa-stack-1x fa-inverse'></i>" +
        "</span>" +
        "</div>" +
        "<div class='card-body p-0'>" +
        "<div class='card-title'>" + city.totalMortes + "</div>" +
        "<div class='card-text'>Total Mortes</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='col-3 col-lg-2 ms-1'>" +
        "<div class='card card-city-name-popup text-center'>" +
        "<div class='card-header'>" +
        "<span class='fa-stack fa-1x text-success'>" +
        "<i class='fas fa-circle fa-stack-2x'></i>" +
        "<i class='fas fa-virus-slash fa-stack-1x fa-inverse'></i>" +
        "</span>" +
        "</div>" +
        "<div class='card-body p-0'>" +
        "<div class='card-title'>" + city.totalCurados + "</div>" +
        "<div class='card-text'>Total Curados</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='col-3 col-lg-2 ms-1'>" +
        "<div class='card card-city-name-popup text-center'>" +
        "<div class='card-header'>" +
        "<span class='fa-stack fa-1x text-secondary'>" +
        "<i class='fas fa-circle fa-stack-2x'></i>" +
        "<i class='fas fa-viruses fa-stack-1x fa-inverse'></i>" +
        "</span>" +
        "</div>" +
        "<div class='card-body p-0'>" +
        "<div class='card-title'>" + city.totalAtivos + "</div>" +
        "<div class='card-text'>Total Ativos</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='col-3 col-lg-2 ms-1'>" +
        "<div class='card card-city-name-popup text-center'>" +
        "<div class='card-header'>" +
        "<span class='fa-stack fa-1x text-secondary'>" +
        "<i class='fas fa-circle fa-stack-2x'></i>" +
        "<i class='fas fa-virus-slash fa-stack-1x fa-inverse'></i>" +
        "</span>" +
        "</div>" +
        "<div class='card-body p-0'>" +
        "<div class='card-title'>" + city.totalCasos + "</div>" +
        "<div class='card-text'>Total Casos</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='col-3 col-lg-2 ms-1'>" +
        "<div class='card card-city-name-popup text-center'>" +
        "<div class='card-header'>" +
        "<span class='fa-stack fa-1x text-warning'>" +
        "<i class='fas fa-circle fa-stack-2x'></i>" +
        "<i class='fas fa-balance-scale fa-stack-1x fa-inverse'></i>" +
        "</span>" +
        "</div>" +
        "<div class='card-body p-0'>" +
        "<div class='card-title'>" + city.letalidade + "</div>" +
        "<div class='card-text'>Letalidade</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" :
        "<div class='badge rounded-pill bg-secondary hidden-mobile'> <i class='fas fa-info-circle'></i> Passe o mouse sobre o município para ver detalhes</div>");
  };

  info.addTo(map);

  L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
      var img = L.DomUtil.create("img");
      img.src = "img/nsc.svg";
      img.style.width = "70px";
      img.style.marginBottom = "30px";
      img.style.marginLeft = "20px"
      return img;
    },
    onRemove: function(map) {
      // add rule if necessary
    }
  });

  L.control.watermark = function(opts) {
    return new L.Control.Watermark(opts);
  };

  L.control.watermark({
    position: "bottomleft"
  }).addTo(map);
}

// get color depending on population density value
function getColor(d) {
  return d > 20000 ?
    "#270B14" :
    d > 10000 ?
    "#2C1635" :
    d > 5000 ?
    "#59264E" :
    d > 1000 ?
    "#6D3558" :
    d > 500 ?
    "#824864" :
    d > 100 ?
    "#995C71" :
    d >= 50 ?
    "#B2737F" :
    "#CC8C8E";
}

function highlightFeature(e) {
  geojson.resetStyle(layer);
  info.update();

  layer = e.target;
  let city = e.sourceTarget.feature.properties ?
    new City(e.sourceTarget.feature.properties.NM_MUNICIP) :
    new City("");
  var popupContent = "<small class='badge'>Saiba mais em: <br><br><a href=" + city.news + " target='_blank'>NSC Total</a></small>";
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
  let city = e.sourceTarget.feature.properties ?
    new City(e.sourceTarget.feature.properties.NM_MUNICIP) :
    new City("");

  var popupContent =
    "<b>Saiba mais em:</b><br><a href=" + city.news + " target='_blank'>" + city.news + "</href>";
  e.target.bindPopup(popupContent);
  info.update(layer.feature.properties);
}
