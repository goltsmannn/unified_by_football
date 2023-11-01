import React from "react";
import { BrowserRouter, Link, Routes } from "react-router-dom";
import NavigateButton from "utils/NavigateButton";


const Balloon = (props) => {
    // let imageLinks = [];
    // for(let picture of props.data.pictures){
    //     imageLinks.push(picture.image);
    // }
    // let images = imageLinks.map((link)=><img src={link} style={{height:100, width:'200px'}}></img>);
    let image = <img src={props.data.picture}/>;
    return(
        <>
            <div className="flex justify-between items-center mb-8">
                <div>Rating: {props.data.rating?props.data.rating.toPrecision(3): "No reviews"}</div> 
                {/* <div>{props.placemark_id}</div> */}
                <div>
                    <Link className="px-2 py-1 bg-active rounded-lg text-[#ffff]" to={"placemarks/" + props.placemark_id}>Details</Link>
                </div>
            </div>
            {image}
        </>
    ); 
};

export default Balloon;