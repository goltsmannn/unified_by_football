import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "context/AuthContext";
import useFavorites from "hooks/useFavorites";

const PlacemarkMain = ()=>{
    const {placemark_id} = useParams();
    const [placemark, setPlacemark] = useState(null);
    const favoritePlacemarks = useFavorites();
    const [isFavorite, setIsFavorite] = useState(false);
    const authContext = useContext(AuthContext);

    useEffect(()=>{
        const fetchData = async () => {
            const response = await axios.get(`http://127.0.0.1:8000/api/map/placemarks/${placemark_id}`);
            if(response.status===200){
                console.log('Placemark response correct');
                setPlacemark(response.data);
            }
            else{
                console.log('Placemark response failed');
            }
        }
        fetchData();
    }, [placemark_id]);

    useEffect(()=>{
        favoritePlacemarks.forEach((favorite)=>{
            if(favorite.id===placemark_id){
                setIsFavorite(true);
            }
        })
    }, [favoritePlacemarks]);


    const handleAddToFavorites = async (e) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);
    }
    
    useEffect(()=>{
        const fetchData = async () => {
            const config = {
                headers: {
                    Authozization: `Bearer ${authContext.accessToken}`
                }
            }
            try{
                const response = await axios.post(`http://127.0.0.1:8000/api/map/favorites/`, {placemark_id: placemark_id}, config);
            }
            catch (error){
                console.error('Error while adding to favorites', error);
            }
        }
    }, [isFavorite]);

    return(
        <>
            <div id="placemark-info-wrapper">
                <div id="placemark-info-section">

                </div>
                {authContext.user && <div id="placemark-buttons">
                    <Link to="post">Оставить отзыв</Link> <br></br>
                    <button onClick={handleAddToFavorites}>{isFavorite?"Убрать из избранного":"Добавить в избранное"}</button>
                </div>}
                <div id="placemark-reviews-section">
                    {placemark && (
                        <>
                            {placemark.reviews.map((review)=>
                                <div id="review-section">
                                    <div id="review-header">
                                        Author: {review.author}
                                    </div>
                                    <div id="review-body">
                                        <div id="review-text">
                                            Text: {review.text}
                                        </div>
                                        <div id="review-pictures">
                                            {review.pictures.map((picture)=>
                                                <img src={picture.image} alt="" />
                                            )}
                                        </div>
                                    </div>
                                    <div id="review-footer">
                                        Rating: {review.rating}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Outlet></Outlet>
        </>
    )

}

export default PlacemarkMain;
