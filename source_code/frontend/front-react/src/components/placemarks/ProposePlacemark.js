import { YMaps, Map } from "@pbe/react-yandex-maps";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import ModalPlacemarkWrapper from "./ModalPlacemarkWrapper";

const ProposePlacemark = () => {
    const [coordinates, setCoordinates] = useState([]);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [modal, setModal] = useState(false)

    const handleClick = (event) => {
        event.preventDefault();
        setCoordinates(event.get('coords'));
        console.log(coordinates);
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    useEffect(()=>{
        if(!authContext.user){
            navigate('/login', {state: {error: 'You must be logged in to propose placemark'}});
        }
    }, [authContext.user, navigate]);

    return(
        <div id="proposal-page">
            <div className="absolute top-[65px] left-[20px] bg-[#30b684da] w-[300px] h-[100px] z-40 text-[#ffff] flex items-center justify-center text-center font-medium rounded-md">
                Кликните в любое место, чтобы поставить метку
            </div>
            <div id="proposal-map">
                <YMaps>
                <Map style={{width:'100%', height:'calc(100vh - 56px)'} } defaultState={{ center: [55.75, 37.57], zoom: 9 }} onClick={handleClick}>       
                {/* <Map style={{width:600, height:600}} defaultState={{ center: [55.75, 37.57], zoom: 9 }} onClick={handleClick}>        */}
                </Map>
                </YMaps>
            </div>
            <div id="modal-form">
                {modal && <ModalPlacemarkWrapper coordinates={coordinates} onClose={closeModal}/>}
            </div>
        </div>
    )
}

export default ProposePlacemark;


