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
        <h1 className="text-center text-3xl mb-6">Favorite Placemarks</h1>
        <div className="w-full flex justify-center">
            <div className="row">
                {favoritePlacemarks.map((favoritePlacemark) => {
                    const placemark = favoritePlacemark.placemark;
                    return (
                        <div className="col-md-4 m-10 p-2" key={placemark.id}>
                            <div className="card bg-white rounded-lg shadow shadow-lg shadow-navbar hover:shadow-inner hover:shadow-navbar p-2">
                                <div className="card-body">
                                    <h5 className="card-title text-lg font-medium mb-2">Название поля: {placemark.name}</h5>
                                    <Link to={`/placemarks/${placemark.id}`} className="btn btn-primary">Посмотреть площадку</Link>
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

