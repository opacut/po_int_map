//const trailheadsLayer = new onlanguagechange.layer.Vector({
//  source: new onlanguagechange.source.Vector({
//    format: new onlanguagechange.format.GeoJSON(),
//    url: 'https://service3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=pgeojson'
//  })
//});
//map.addLayer(trailheadsLayer);

//const popup = new Popup();
//map.addOverlay(popup);

//map.on("click", (e) => {
//  //let trailName, parkName;
//  let feature;
//
//  //const trailheads = map.getFeaturesAtPixel(event.pixel, function (f) {
//  //});
//  map.forEachFeatureAtPixel(e.pixel, function (f) {
//    //selected = f;
//    //f.setStyle(highlightStyle);
//    popup.show(feature['name']);
//    return true;
//  });
//
//  if (feature.length > 0) {
//    popup.show(feature['name']);
//    //const trailName = trailheads[0].get('TRL_NAME');
//    //const parkName = trailheads[0].get('PARK_NAME');
//    //popup.show(event.coordinate, '<b>${trailName}</b></br>${parkName}'));
//  } else {
//    popup.hide();
//  }
//});

//const vector_source = new VectorSource();
//const vector_layer = new VectorLayer({
//  source: vector_source,
//  style: function (feature) {
//    return new Style({
//      fill: new Fill({
//        color: 'rgba(255,255,255,0.3)',
//      }),
//      stroke: new Stroke({
//        color: 'rgba(0,0,0,1)',
//      }),
//    });
//  },
//});
//map.addLayer(vector_layer)