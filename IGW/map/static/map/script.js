let map;
ymaps.ready(function(){
  map = new ymaps.Map(document.getElementById('map'), {
      center: [55.76, 37.64],
      zoom: 10
  });
  renderMarkers();
});

async function fetchAsync () {
  let response = await fetch('/api/markers');
  let data = await response.json();
  return data;
}

async function renderMarkers(){
  json_response = await fetchAsync();
  json_response.placemarks.forEach(placemark_json=>{
    var placemark = new ymaps.Placemark([placemark_json.x, placemark_json.y], {
      balloonContentHeader: 'Header',
      balloonContentBody: 'Body',
      balloonContentFooter: 'Footer'
    }, {});
    map.geoObjects.add(placemark);
  });
}

