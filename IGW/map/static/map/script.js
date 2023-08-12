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


function render_placemark(plc_json){
  let pictures = [];
  let avg = 0.0, cnt = 0;
  plc_json.reviews.forEach(review=>{
    avg += review.rating;
    cnt += 1;
    review.pictures.forEach(picture=>{
      if(pictures.length < 3){
        pictures.push(picture);
      }
    });
  });

  var placemark = new ymaps.Placemark([plc_json.x, plc_json.y], {
    balloonContentHeader: plc_json.description,
    balloonContentBody: pictures,
    balloonContentFooter: (cnt==0?"Нет рейтинга": avg/cnt),
  }, {});
  return placemark;
}


async function renderMarkers(){
  json_response = await fetchAsync();
  json_response.forEach(plc_json=>{
    placemark = render_placemark(plc_json);
    map.geoObjects.add(placemark);
  });
}

