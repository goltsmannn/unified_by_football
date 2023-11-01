import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "context/AuthContext";
import useFavorites from "hooks/useFavorites";
import closeIcon from '../../img/free-icon-close-4013407.png';

const PlacemarkMain = ()=>{
    const {placemark_id} = useParams();
    const [placemark, setPlacemark] = useState(null);
    const favoritePlacemarks = useFavorites();
    const [isFavorite, setIsFavorite] = useState(false);
    const authContext = useContext(AuthContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [activityValue, setActivityValue] = useState(1);
    const [activityError, setActivityError] = useState("");
    
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

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
    
    const handleActivity = async (e) => {
        e.preventDefault();
        setModalIsOpen(true);
      //  document.body.style.overflow = 'hidden';
    }


    const handleSubmitActivity = async (e) => {
        e.preventDefault();
        setModalIsOpen(false);
        const data = {
            placemark_id: placemark_id,
            user_id: authContext.user.id,
            expiry: activityValue
        }
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/map/activity`, data, config);
            setActivityError("")
        }
        catch (error){
            const err = error.response.data.detail;
            console.log(String(err));
            if(String(err)=='EXPIRY_ERROR'){
                setActivityError("Завершите предыдущую активность");
            }
        }   
    }

    return(
        <div className="w-full h-[calc(100vh-56px)] flex justify-center ">
            <div id="placemark-info-wrapper" className=" max-w-md h-fit text-navbar mt-[40px]">
                {/* <div id="placemark-info-section">

                </div> */}
                <div id="placemark-info" className="border border-solid border-gray-300 p-4 my-4">
                    <h1 className="text-center text-2xl text-navbar font-bold my-3">Информация о поле</h1>
                    <div className="font-medium">Название поля: {placemark?.name}</div>
                    <div className="mt-2">Описание поля: {placemark?.description}</div>
                    <div id='working_hours' className="mt-2">Открытие: {placemark?.working_hours?placemark.working_hours.from:"Не указано"}</div>
                    <div id='working_hours' className="mt-2">Закрытие:  {placemark?.working_hours?placemark.working_hours.to:"Не указано"}</div>
                    <img src={placemark?.main_image} alt="" className="w-full h-96 object-cover mt-4"/>
                </div>


                {authContext.user && <div id="placemark-buttons" className="flex justify-between items-center h-[50px]">
                    {/* <div ><Link to="post" className="py-1 rounded-lg border border-solid border-navbar text-center">Оставить отзыв</Link> </div> */}
                    {/* <div className="h-full grow-0 text-center basis-[30%] rounded-lg border border-solid border-navbar"><Link to="post" className="h-full w-full">Оставить отзыв</Link> </div> */}
                    <Link to="post" className="rounded-lg border border-solid border-navbar h-full flex basis-[30%] justify-center items-center grow-0">Оставить отзыв</Link> 
                    <div className="h-full grow-0 basis-[30%] "><button className="bg-active rounded-lg text-[#ffff]" onClick={handleAddToFavorites}>{isFavorite?"Убрать из избранного":"Добавить в избранное"}</button></div>
                    <div className="h-full grow-0 basis-[30%] ">
                        {activityError==""?<button className="rounded-lg border border-solid border-navbar" onClick={handleActivity}>Отметить активность</button>:
                        <div className="bg-red text-white rounded-lg border border-solid border-navbar text-center">{activityError}</div>}
                    </div>
                </div>}
                <div>
                    <div id="placemark-reviews-section" className="mt-[25px] ">
                        {placemark && (
                            <>
                                {placemark.reviews.map((review)=>{

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
                { modalIsOpen && <div
                    id="modal-wrapper"
                    isOpen={modalIsOpen}
                    className="w-full flex top-0 right-0 bg-overlay fixed z-40 flex justify-center items-center h-screen"
                >
                    <div className="w-full rounded-md shadow-lg max-w-md h-[20] px-[25px] py-[20px] bg-[#ffff]" id="modal">
                        <button className="p-[5px] text-navbar font-xl bg-[#ffff] flex justify-center leading-none w-[25px] h-[25px] items-center hover:rounded-full hover:text-[#ffff] hover:bg-[#54545426]"
                         onClick={()=>{
                            setModalIsOpen(false);
                           // document.body.style.overflow = 'auto';
                            }}>
                            <img src={closeIcon}/>
                        </button>
                        <h2>Отметить активность</h2>
                        <div>
                            <label htmlFor="activity-slider">Выберите значение: </label>
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={activityValue}
                                onChange={(e) => setActivityValue(e.target.value)}
                                id="activity-slider"
                            />
                            <p>Выбранное значение: {activityValue} (часа(-ов))</p>
                        </div>
                        <button onClick={handleSubmitActivity}>Отправить</button>
                    </div>
                </div>
                }
            </div>
            <Outlet></Outlet>
        </div>
    )

}

export default PlacemarkMain;



