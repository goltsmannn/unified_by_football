import AuthContext from "context/AuthContext";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import useFavorites from "hooks/useFavorites";

const FavoritePlacemarks = () => { 
    const favoritePlacemarks = useFavorites();

    return(
        <>
            <h1>Favorite Placemarks</h1>
            <div className="row">
                {favoritePlacemarks.map((placemark, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{placemark.name}</h5>
                                <p className="card-text">{placemark.description}</p>
                                <a href="#" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default FavoritePlacemarks;