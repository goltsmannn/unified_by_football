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
            if(favorite.placemark.id===Number(placemark_id)){
                setIsFavorite(true);
            }
        })
    }, [favoritePlacemarks]);


    const handleAddToFavorites = async (e) => {
        e.preventDefault();
        const check = !isFavorite;
        setIsFavorite(check);
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
                }
            }
            try{
                const response = await axios.post(`http://127.0.0.1:8000/api/map/favorites`, {placemark_id: placemark_id, delete: !check}, config);
            }
            catch (error){
                console.error('Error while adding to favorites', error);
            }
        }
        fetchData();
    }
    

    return(
        <div className="w-full h-[calc(100vh-56px)] flex justify-center ">
            <div id="placemark-info-wrapper" className=" max-w-md h-fit text-navbar mt-[40px]">
                {/* <div id="placemark-info-section">

                </div> */}
                {authContext.user && <div id="placemark-buttons" className="flex justify-between items-center ">
                    <Link to="post" className="px-2 py-1 rounded-lg border border-solid border-navbar">Оставить отзыв</Link> <br></br>
                    <button className="ml-4 bg-active px-2 py-1 rounded-lg text-[#ffff]" onClick={handleAddToFavorites}>{isFavorite?"Убрать из избранного":"Добавить в избранное"}</button>
                </div>}
                <div>
                    <div id="placemark-info">
                        <div>Название поля: {placemark?.name}</div>
                        <div>Описание поля: {placemark?.description}</div>
                    </div>
                <div id="placemark-reviews-section" className="mt-[25px] ">
                    {placemark && (
                        <>
                            {placemark.reviews.map((review)=>{
                                console.log(review);

                                return (<div id="review-section" className="font-medium mt-[30px] p-[30px] rounded-lg border border-solid border-navbar">
                                    <div id="review-header">
                                        Автор: {review.author.username}
                                    </div>
                                    <div id="review-body">
                                        <div id="review-text">
                                            {review.text}
                                        </div>
                                        <div id="review-footer">
                                            Рейтинг: {review.rating}
                                        </div>
                                        <div id="review-pictures">
                                            {review.pictures.map((picture)=>
                                                <img src={picture.image} alt="" />
                                            )}
                                        </div>
                                    </div>
                                </div>);
                            }
                            )}
                        </>
                    )}
                    </div>
                </div>
            </div>
            <Outlet></Outlet>
        </div>
    )

}

export default PlacemarkMain;
