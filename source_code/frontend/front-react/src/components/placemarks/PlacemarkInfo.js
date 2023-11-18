import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "context/AuthContext";
import useFavorites from "hooks/useFavorites";
import PlacemarkVisitors from "./PlacemarkVisitors";
import ActivityModal from "./ActivityModal";
import ReportModal from "./ReportModal";


const PlacemarkMain = ()=>{
    const {placemark_id} = useParams();
    const [placemark, setPlacemark] = useState(null);
    const favoritePlacemarks = useFavorites();
    const [isFavorite, setIsFavorite] = useState(false);
    const authContext = useContext(AuthContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
    const [reviewId, setReviewId] = useState(null);

    useEffect(()=>{
        const fetchData = async () => {
            const response = await axios.get(`${authContext.requestHost}/api/map/placemarks/${placemark_id}`);
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
                const response = await axios.post(`${authContext.requestHost}/api/map/favorites`, {placemark_id: placemark_id, delete: !check}, config);
            }
            catch (error){
                console.error('Error while adding to favorites', error);
            }
        }
        if(authContext.user){
            fetchData();
        }
    }
    
    const handleActivity = async (e) => {
        e.preventDefault();
        setModalIsOpen(true);
      //  document.body.style.overflow = 'hidden';
    }



    return(
        <div className="w-full h-[calc(100vh-56px)] flex justify-center ">
            <div id="placemark-info-wrapper" className=" max-w-md h-fit text-navbar mt-[40px]">
                {/* <div id="placemark-info-section">

                </div> */}
                <div id="placemark-info" className="border border-solid border-gray-300 p-4 my-4">
                    <h1 className="text-center text-2xl text-navbar font-bold my-3">Information</h1>
                    <div className="font-medium">Pitch name: {placemark?.name}</div>
                    <div className="mt-2">Description: {placemark?.description}</div>
                    <div id='working_hours' className="mt-2">Opening at: {placemark?placemark.time_from:"Not mentioned"}</div>
                    <div id='working_hours' className="mt-2">Closing at:  {placemark?placemark.time_to:"Not mentioned"}</div>
                    <img src={placemark?.main_image} alt="" className="w-full h-96 object-cover mt-4"/>
                </div>


                {authContext.user && <div id="placemark-buttons" className="flex justify-between items-center h-[50px]">
                    {/* <div ><Link to="post" className="py-1 rounded-lg border border-solid border-navbar text-center">Оставить отзыв</Link> </div> */}
                    {/* <div className="h-full grow-0 text-center basis-[30%] rounded-lg border border-solid border-navbar"><Link to="post" className="h-full w-full">Оставить отзыв</Link> </div> */}
                    <Link to="post" className="rounded-lg border border-solid border-navbar h-full flex basis-[30%] justify-center items-center grow-0">Leave feedback</Link> 
                    <div className="h-full grow-0 basis-[30%] "><button className="bg-active rounded-lg text-[#ffff] h-full w-full" onClick={handleAddToFavorites}>{isFavorite?"Remove from Favorite":"Add to Favorite"}</button></div>
                    <div className="h-full grow-0 basis-[30%] ">
                        <button className="rounded-lg border border-solid border-navbar h-full w-full" onClick={handleActivity}>I'm here now...</button>
                    </div>
                </div>}
                <div id="active-players">
                    {placemark && <PlacemarkVisitors placemark={placemark}></PlacemarkVisitors>}
                </div>
                <div>
                    <div id="placemark-reviews-section" className="mt-[25px] ">
                        {placemark && (
                            <>
                                {placemark.reviews.map((review)=>{

                                    return (<div id="review-section" className="font-medium mt-[30px] p-[30px] rounded-lg border border-solid border-navbar">
                                        <div id="review-header">
                                            Author: {review.author?review.author.username:'Deleted account'}
                                        </div>
                                        <div id="review-body">
                                            <div id="review-text">
                                                {review.text}
                                            </div>
                                            <div id="review-rating">
                                                Rating: {review.rating}
                                            </div>
                                            <div id="review-pictures">
                                                {review.pictures.map((picture)=>
                                                    <img src={picture.image} alt="" />
                                                )}
                                            </div>
                                        </div>
                                        <div id="review-footer" className="mt-2">
                                            <div id="report" className=" flex flex-row-reverse justify-end justify-between">
                                                <button className="flex justify-end text-white bg-red rounded p-2" onClick={(e)=>{
                                                    setReportModalIsOpen(true)
                                                    setReviewId(review.id)
                                                }}>Report</button>
                                            </div>
                                        </div>
                                    </div>);
                                }
                                )}
                            </>
                        )}
                        </div>
                </div>
                { modalIsOpen && <ActivityModal setModalIsOpen={setModalIsOpen} placemark={placemark}></ActivityModal>}
                {reportModalIsOpen && <ReportModal setReportModalIsOpen={setReportModalIsOpen} reviewId={reviewId}></ReportModal>}
            </div>
            <Outlet></Outlet>
        </div>
    )

}

export default PlacemarkMain;



