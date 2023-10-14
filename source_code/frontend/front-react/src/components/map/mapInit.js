import { YMaps, Map, Placemark} from "@pbe/react-yandex-maps";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Balloon from "./Balloon";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";


async function requestPlacemarks(){
    let response = await axios.get('http://127.0.0.1:8000/api/map/placemarks');
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



const Portal = ({placemark}) => {
    return createPortal(<Balloon 
    placemark_id={placemark.id}
    data={prepareBalloonData(placemark)}/>,
    document.getElementById('placemark_balloon'));
}

const MyMap = () => {
    const [placemarks, setPlacemarks] = useState([]);
    const [activePortal, setActivePortal] = useState(false);


    useEffect( ()=>{
        async function await_placemarks(){
            const placemarks = await requestPlacemarks();
            setPlacemarks(placemarks);
        }
        await_placemarks();
    }, []);


    return(

        <YMaps>
            <Map style={{width:600, height:600}} defaultState={{ center: [55.75, 37.57], zoom: 9 }}> 
            {placemarks.map(placemark=>(
                <>
                <Placemark
                    modules={["geoObject.addon.balloon"]}
                    geometry={[placemark.x, placemark.y]}
                    properties={{
                        balloonContent: `<div id="placemark_balloon" style="height:500px; width:100%;"></div>`,
                    }}
                    onClick={ ()=>{
                        setTimeout(() => { setActivePortal(true)}, 0)
                    }}
                />
                {activePortal && <Portal placemark={placemark}/>}
                </>           
            ))}   
            </Map>
        </YMaps>
    );
    
}

export default MyMap;