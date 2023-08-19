let map;
ymaps.ready(function(){
  map = new ymaps.Map(document.getElementById('map'), {
      center: [55.76, 37.64],
      zoom: 10,
      controls: ['zoomControl'],
  }, 
  {suppressMapOpenBlock: true}
  );
  renderMarkers();
});

async function fetchAsync () {
  let response = await fetch('/map/api/markers');
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
    balloonContent: `
      <div class="balloon">
        <div class="object_description">${plc_json.description}</div>
        <img src="${pictures.length?pictures[0].image:''}" style="height:100px; width:100px;"></img>
        <a href="${plc_json.id}">Просмотреть точку</a>
        <div class="object_rating">${cnt==0?"Нет рейтинга": 'рейтинг: ' + avg/cnt}</div>
      </div>
    `,
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

