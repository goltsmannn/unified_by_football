import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


const PlacemarkMain = ()=>{
    const {placemark_id} = useParams();
    return(
        <>
            <div>{placemark_id}</div>
        </>
    )

}

export default PlacemarkMain;
