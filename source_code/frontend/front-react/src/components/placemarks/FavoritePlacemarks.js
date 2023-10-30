import AuthContext from "context/AuthContext";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import useFavorites from "hooks/useFavorites";
import prepareBalloonData from "utils/BalloonData";

const FavoritePlacemarks = () => { 
    const favoritePlacemarks = useFavorites();
    return(
        <>
            <h1>Favorite Placemarks</h1>
            <div className="row">
                {favoritePlacemarks.map((favoritePlacemark) => {
                    const placemark = favoritePlacemark.placemark;
                    return(
                    <div className="col-md-4" key={placemark.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Поле: {placemark.name}</h5>
                                {/* <p className="card-text">Рейтинг: {prepareBalloonData(placemark).rating?prepareBalloonData().rating:'недостаточно отзывов'}</p> */}
                                <a href="#" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>);
                })}
            </div>
        </>
    )
}

export default FavoritePlacemarks;