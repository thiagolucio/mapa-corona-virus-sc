var geojson;
var dict = {};
var maxData = "01/01/2020";
var layer;
var info;


let saveDict = data => {
  localStorage.setItem("dictio", JSON.stringify(data));
  firstLoad();
};

// New Dicts da planilha nova
let saveNewDict = data => {
  localStorage.setItem("dictios", JSON.stringify(data));
  console.log(' >>> NEW DICTIOS  --->  ', JSON.stringify(data))
  firstLoad();
};

// Kpis
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
      ATEND: entries[i]["gsx$ondebuscaratendimentonacidade"]["$t"],
      NEWS: entries[i]["gsx$saibamaisem"]["$t"],
      QTD_CONF: entries[i]["gsx$casosconfirmados"]["$t"],
      QTD_MORTE: entries[i]["gsx$mortes"]["$t"],
      FIRST_DATE: entries[i]["gsx$primeirocaso"]["$t"],
      LAST_DATE: entries[i]["gsx$últimocaso"]["$t"],
      FIRST_DEATH: entries[i]["gsx$primeiramorte"]["$t"] == "30/12/1899"? "":entries[i]["gsx$primeiramorte"]["$t"],
      LAST_DEATH: entries[i]["gsx$últimamorte"]["$t"] == "30/12/1899"? "":entries[i]["gsx$últimamorte"]["$t"]
      };      
  }

  const style = feature => {
    return {      
      weight: 0.5,
      opacity: 8,
      color: "#bdc3c7",      
      dashArray: "0",
      fillOpacity: 10,      
      fillColor: getColor(feature.properties.QTD_CONF)
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
        statesData["features"][i]["properties"]["QTD_CONF"] =
          dict[city]["QTD_CONF"];
      }
    }

    var n = dict[city]["LAST_DATE"];    
    var nFormatted = n.substr(6, 4).concat(n.substr(3,2)).concat(n.substr(0,2))    
    var maxDataFormatted = maxData.substr(6, 4).concat(maxData.substr(3,2)).concat(maxData.substr(0,2))
    if (nFormatted > maxDataFormatted) {
      maxData = n;
      document.getElementById(
        "maxData"
      ).innerHTML = `Atualizado em: ${maxData}`;
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

  document.getElementById("casos-confirmados").innerHTML = entries[0].gsx$confirmadosnovos.$t;
  document.getElementById("confirmados-24horas").innerHTML = entries[1].gsx$confirmadosnovos.$t;
  document.getElementById("casos-ativos").innerHTML = entries[0].gsx$casosativosnovos.$t;
  document.getElementById("curados").innerHTML = entries[0].gsx$curadosnovos.$t;
  document.getElementById("cidades-ativos").innerHTML = entries[0].gsx$cidadescomativos.$t;
  document.getElementById("mortes-confirmadas").innerHTML = entries[0].gsx$mortesnovas.$t;
  document.getElementById("mortes-recentes").innerHTML = entries[0].gsx$morterecentenova.$t;


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


  get confirmedCases() {
    if (typeof dict[this._name] === "undefined") {
      return 0;
    } else {
      return dict[this._name]["QTD_CONF"];
    }
  }

  get help() {
    if (
      typeof dict[this._name] === "undefined" ||
      dict[this._name]["ATEND"] == ""
    ) {
      return "<div class='help-saude'><i class='fas fa-phone-alt mr-1'></i> Utilize o telefone do Ministério da Saúde, 136, ou procure uma unidade de saúde mais próxima</div>";
    } else {
      return dict[this._name]["ATEND"];
    }
  }

  get news() {
    if (
      typeof dict[this._name] === "undefined" ||
      dict[this._name]["NEWS"] == ""
    ) {
      return "https://www.nsctotal.com.br/coronavirus";
    } else {
      return dict[this._name]["NEWS"];
    }
  }

  get firstDate() {
    if (typeof dict[this._name] === "undefined") {
      return "";
    } else {
      return dict[this._name]["FIRST_DATE"];
    }
  }

  get lastDate() {
    if (typeof dict[this._name] === "undefined") {
      return "";
    } else {
      return dict[this._name]["LAST_DATE"];
    }
  }

  get deaths() {
    if (typeof dict[this._name] === "undefined") {
      return 0;
    } else {
      return dict[this._name]["QTD_MORTE"];
    }
  }

  get firstDeath() {
    if (typeof dict[this._name] === "undefined") {
      return "";
    } else {
      return dict[this._name]["FIRST_DEATH"];
    }
  }

  get lastDeath() {
    if (typeof dict[this._name] === "undefined") {
      return "";
    } else {
      return dict[this._name]["LAST_DEATH"];
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
        city.deaths +
        " morte(s) confirmada(s)<br>" +
        "<hr class='hr-popup'>" +
        "<i class='fas fa-exclamation-triangle mr-2'></i>" +
        city.confirmedCases +
        " caso(s) confirmado(s)</div><br /><br />" +
        "<b>Primeira morte registrada em: </b>" +
        city.firstDeath +
        "<br>" +
        "<b>Última morte registrada em: </b>" +
        city.lastDeath +
        "<br><br>" +
        "<b>Primeiro caso registrado em: </b>" +
        city.firstDate +
        "<br>" +
        "<b>Último caso registrado em: </b>" +
        city.lastDate +
        "<br><br>" +
        "<div class='col-12'><b>Onde buscar atendimento na cidade:</b><br />" +
        city.help +
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


function trocaMapaUm() {
  document.getElementById("loadLinks").innerHTML = `<div id="map" class="animated fadeIn"></div>`;
  drawMapDefault();
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
    city.news +
    " target='_blank'>" +
    city.news +
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
    city.news +
    " target='_blank'>" +
    city.news +
    "</href>";
  e.target.bindPopup(popupContent);
  info.update(layer.feature.properties);
  // map.fitBounds(e.target.getBounds());
}
function backtoTop()  {
  document.documentElement.scrollTo = 0;
}