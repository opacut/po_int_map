import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import './style.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource  from 'ol/source/Vector';
import View from 'ol/View';
import sync from 'ol-hashed';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Modify from 'ol/interaction/Modify';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import { Style, Fill, Stroke } from 'ol/style';
import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import TileLayer from 'ol/layer/Tile';
//import colormap from 'colormap';
import {getArea} from 'ol/sphere';
import { getCenter } from 'ol/extent';
import FeatureLayer from "./f2.json"
import Overlay from 'ol/Overlay'

const min = 1e8;
const max = 2e13;
const steps = 50;

function clamp(value, low, high) {
  return Math.max(low, Math.min(value, high));
}

const highlightStyle = new Style({
  fill: new Fill({
    color: 'rgba(255,12,25,0.3',
  }),
  stroke: new Stroke({
    color: 'rgba(255,12,25,0.3',
    width: 0,
  }),
});

const extent = [0, 0, 8192, 6144];
const projection = new Projection({
  code: 'ichion',
  units: 'pixels',
  extent: extent
});
//url: 'https://cdn.inkarnate.com/QUks1Sfy8LAGs7ivhwCxFi',
//ichion_4k_nolabel.jpg
const raster = new ImageLayer({
  source: new Static({
    url: 'https://cdn.inkarnate.com/QUks1Sfy8LAGs7ivhwCxFi',
    projection: projection,
    imageExtent: extent
  }),
});

/* popup elements */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
/* overlay */
const overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});
/* click handler */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
}


const map = new Map({
  target: 'map',
  layers: [raster],
  overlays: [overlay],
  view: new View({
    projection: projection,
    center: getCenter(extent),
    zoom: 2,
  })
});
let selected = null;
const status = document.getElementById('status');

let popup_open = false;
map.on('pointermove', function (e) {
  const coordinate = e.coordinate
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  /*
  if(popup_open === false) {
    features = map.getFeaturesAtPixel(e.pixel)
    if(features.length > 0){
      content.innerHTML = features[0].get('name');  
      overlay.setPosition(coordinate)
    } else {
      content.innerHTML = "";  
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    }
  }
  */

  map.forEachFeatureAtPixel(e.pixel, function (f) {
    selected = f;
    f.setStyle(highlightStyle);
    return true;
  });

  if (selected) {
    status.innerHTML = '&nbsp;Hovering: ' + selected.get('name');
  } else {
    status.innerHTML = '&nbsp;';
  }
});

const vector_source = new VectorSource({
  format: new GeoJSON({featureProjection: 'EPSG:3857'}),
  url: "features.json"
});
const vector_layer = new VectorLayer({
  source: vector_source,
  style: function (feature) {
    return new Style({
      fill: new Fill({
        color: 'rgba(255,255,255,0.3)',
      }),
      stroke: new Stroke({
        color: 'rgba(0,0,0,1)',
      }),
    })
  }
});
map.addLayer(vector_layer)

function generateInnerHTMLOfPopup(feature){
  return '<b>'+feature.get('name')+'</b><br><p>'+feature.get('description')+'</p>';
}

map.addInteraction(
  new DragAndDrop({
    source: vector_source,
    formatConstructors: [GeoJSON],
  })
);


let features = null;
map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate
  features = map.getFeaturesAtPixel(evt.pixel)
  if(features.length > 0){
    content.innerHTML = generateInnerHTMLOfPopup(features[0]);//.get('name')); 
    overlay.setPosition(coordinate)
    popup_open = true;
  } else {
    content.innerHTML = "";  
    overlay.setPosition(undefined);
    closer.blur();
    popup_open = false;
    return false;
  }
})


//map.addInteraction(
//  new DragAndDrop({
//    source: vector_source,
//    formatConstructors: [GeoJSON],
//  })
//);

/*
map.addInteraction(
  new Modify({
    source: vector_source,
  })
);

map.addInteraction(
  new Draw({
    type: 'Polygon',
    source: vector_source,
  })
);

map.addInteraction(
  new Snap({
    source: vector_source,
  })
)
*/


const clear = document.getElementById('clear');
clear.addEventListener('click', function () {
  vector_source.clear();
});

const format = new GeoJSON();
const download = document.getElementById('download')
vector_source.on('change', function () {
  const features = vector_source.getFeatures();
  const json = format.writeFeatures(features);
  download.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
})

sync(map)