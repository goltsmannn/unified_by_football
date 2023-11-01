import AuthContext from "context/AuthContext";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import useFavorites from "hooks/useFavorites";
import prepareBalloonData from "utils/BalloonData";
import { Link } from "react-router-dom";


const FavoritePlacemarks = () => { 
    const favoritePlacemarks = useFavorites();
    return(
        <>
        <h1 className="text-center text-3xl mb-6 text-navbar">Favorite Placemarks</h1>
        <div className="w-full flex justify-center">
            <div className="row">
                {favoritePlacemarks.map((favoritePlacemark) => {
                    const placemark = favoritePlacemark.placemark;
                    return (
                        <div className="col-md-4 m-10 p-2" key={placemark.id}>
                            <div className="card bg-white rounded-lg shadow shadow-lg shadow-navbar hover:shadow-inner hover:shadow-navbar p-2 text-navbar mb-2">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-lg font-medium mb-5 m-2">Pitch name: {placemark.name}</h5>
                                    <Link to={`/placemarks/${placemark.id}`} className="btn btn-primary font-bold text-lg bg-white text-navbar text-center shadow shadow-active p-2 m-3 rounded">Navigate to the pitch page</Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        </>
    )
}

export default FavoritePlacemarks;

