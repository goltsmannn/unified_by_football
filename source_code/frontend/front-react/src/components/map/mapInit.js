import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import logo from '../../logo.png';
import Portal from "./Portal";
import AuthContext from "context/AuthContext";



/**
 * Initializes the map, populates in with placemarks and triggers the portal once a placemark is clicked
 */
const MyMap = () => {
    const [placemarks, setPlacemarks] = useState([]);
    const [activePortal,    setActivePortal] = useState(false);
    const [currentPlacemark, setCurrentPlacemark] = useState(null);
    const authContext = useContext(AuthContext);

    const requestPlacemarks = async () =>{
        let response = await axios.get(`${authContext.requestHost}/api/map/placemarks`);
        return response.data;
    }


    useEffect( ()=>{
        async function await_placemarks(){
            const placemarks = await requestPlacemarks();
            setPlacemarks(placemarks);
        }
        await_placemarks();
    }, []);

    const handleClose = () => {
        setActivePortal(false);
        setCurrentPlacemark(null);
        document.getElementById('placemark_balloon').innerHTML = '';
        console.log('closing portal');
    }

    return(
        // <div className="w-full h-full mt-[40px] flex items-center justify-center">
        <YMaps>
            <Map style={{width:'100%', height:'calc(100vh - 56px)'}} defaultState={{ center: [55.75, 37.57], zoom: 9 }}> 
            {/* <Map style={{width:900, height:600}} defaultState={{ center: [55.75, 37.57], zoom: 9 }}>  */}
            
            {placemarks.map(placemark=>{
                if(placemark.verified===true){
                return(<>
                <Placemark
                    modules={["geoObject.addon.balloon"]}
                    geometry={[placemark.x, placemark.y]}
                    properties={{
                        balloonContent: `<div id="placemark_balloon" style="height:200px; width:200px; padding:10px"></div>`,
                    }}
                    onClick={ ()=>{
                        setTimeout(() => {
                            console.log(activePortal, placemark)
                            setCurrentPlacemark(placemark);
                            setActivePortal(true);
                        }, 0);
                    }}
                    options={{
                        iconLayout: "default#image",
                        iconImageHref: logo,
                        iconImageSize: [22, 22],
                        iconImageOffset: [-15, -15]
                    }}
                    key={placemark.id}
                />                
                {/* {activePortal && <Portal placemark={placemark} onClose={()=>handleClose()}/>} не работало */} 
                </>)}   
            })}   
            </Map>
            {activePortal && <Portal placemark={currentPlacemark} onClose={handleClose}/>}         
        </YMaps>
        // </div>
    );
    
}

export default MyMap;