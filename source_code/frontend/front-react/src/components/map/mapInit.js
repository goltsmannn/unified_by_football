import { YMaps, Map, Placemark} from "@pbe/react-yandex-maps";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Portal from "./Portal";


async function requestPlacemarks(){
    let response = await axios.get('http://127.0.0.1:8000/api/map/placemarks');
    return response.data;
}


const MyMap = () => {
    const [placemarks, setPlacemarks] = useState([]);
    const [activePortal,    setActivePortal] = useState(false);
    const [currentPlacemark, setCurrentPlacemark] = useState(null);

    useEffect( ()=>{
        async function await_placemarks(){
            const placemarks = await requestPlacemarks();
            setPlacemarks(placemarks);
        }
        await_placemarks();
    }, []);

    const handleClose= () => {
        setActivePortal(false);
        document.getElementById('placemark_balloon').innerHTML = '';
        console.log('closing portal');
    }

    return(

        <YMaps>
            <Map style={{width:600, height:600}} defaultState={{ center: [55.75, 37.57], zoom: 9 }}> 
            {placemarks.map(placemark=>{
                if(placemark.verified===true){
                return(<>
                <Placemark
                    modules={["geoObject.addon.balloon"]}
                    geometry={[placemark.x, placemark.y]}
                    properties={{
                        balloonContent: `<div id="placemark_balloon" style="height:500px; width:100%;"></div>`,
                    }}
                    onClick={ ()=>{
                        setTimeout(() => {
                            setActivePortal(true)
                            setCurrentPlacemark(placemark);
                        }, 0);
                    }}
                />                
                {/* {activePortal && <Portal placemark={placemark} onClose={()=>handleClose()}/>} не работало */} 
                </>)}   
            })}   
            </Map>
            {activePortal && <Portal placemark={currentPlacemark} onClose={()=>handleClose()}/>}         
        </YMaps>
    );
    
}

export default MyMap;