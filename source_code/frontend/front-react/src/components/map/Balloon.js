import React from "react";
import { BrowserRouter, Link, Routes } from "react-router-dom";

const Balloon = (props) => {
    let links = [];
    for(let picture of props.data.pictures){
        links.push(picture.image);
    }
    let images = links.map((link)=><img src={link} style={{height:100, width:'30%'}}></img>);
    return(
        <BrowserRouter>
            <div>Rating: {props.data.rating}</div> 
            <nav>
                <ul>
                    <li>
                        <Link to="placemark" state={{"placemark_id":props.placemark_id}}>Метки</Link>
                    </li>
                </ul>
            </nav>
            {images}
        </BrowserRouter>
    ); 
};

export default Balloon;