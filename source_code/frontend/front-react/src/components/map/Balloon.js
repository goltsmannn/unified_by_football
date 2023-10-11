import React from "react";
import { BrowserRouter, Link, Routes } from "react-router-dom";

const Balloon = (props) => {
    let links = [];
    for(let picture of props.data.pictures){
        links.push(picture.image);
    }
    let images = links.map((link)=><img src={link} style={{height:100, width:'30%'}}></img>);
    return(
        <>
            <div>Rating: {props.data.rating}</div> 
            <a href="/placemark">Метки</a>
            {images}
        </>
    ); 
};

export default Balloon;