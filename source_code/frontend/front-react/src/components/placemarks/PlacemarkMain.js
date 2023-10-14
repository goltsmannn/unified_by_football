import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PlacemarkMain = ()=>{
    const {placemark_id} = useParams();
    const [placemark, setPlacemark] = useState(null);
    
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
    }, []);

    return(
        <>
            <div id="placemark-info-wrapper">
                <div id="placemark-info-section">

                </div>
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
                                                <img src={picture.image} alt="" style={{width:100}} />
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
        </>
    )

}

export default PlacemarkMain;
