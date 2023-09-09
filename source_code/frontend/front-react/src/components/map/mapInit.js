import { YMaps, Map, Placemark} from "@pbe/react-yandex-maps";
import React from "react";
import axios from "axios";

async function requestPlacemarks(){
    let response = await axios.get('http://localhost:8000/map/api/markers');
    return response.data;
}

function prepareBalloonData(plc_json){
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
    const data = {
        pictures: pictures,
        rating: avg/cnt,
    }
    return data;
}


const placemarks = await requestPlacemarks();

class MyMap extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            placemarks: placemarks,
        }
    }
    render(){
        console.log(this.state.placemarks);
        return(
            <YMaps>
                <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }}> 
                {placemarks.map(placemark=>(
                    <Placemark
                        modules={["geoObject.addon.balloon"]}
                        geometry={[placemark.x, placemark.y]}
                        properties={{
                            balloonContent: `
                                <div class="balloon">
                                    a
                                </div>
                                `,
                        }}
                    />
                ))}   
                </Map>
            </YMaps>
        );
    }
}

export default MyMap;