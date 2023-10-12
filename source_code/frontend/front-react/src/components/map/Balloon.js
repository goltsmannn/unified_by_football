import React from "react";
import { BrowserRouter, Link, Routes } from "react-router-dom";
import NavigateButton from "utils/NavigateButton";


const Balloon = (props) => {
    let imageLinks = [];
    for(let picture of props.data.pictures){
        imageLinks.push(picture.image);
    }
    let images = imageLinks.map((link)=><img src={link} style={{height:100, width:'30%'}}></img>);
    return(
        <>
            <div>Rating: {props.data.rating}</div> 
            <Link to={"placemarks/" + props.placemark_id}>Детали</Link>
            {images}
        </>
    ); 
};

export default Balloon;