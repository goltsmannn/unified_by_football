import React, { useState, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "context/AuthContext";


const ReviewForm = () => {
    const { placemark_id } = useParams();
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(1);
    const [reviewPicture, setReviewPicture] = useState(null);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);


    const handleSubmit = (event) => {
        event.preventDefault();
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
                }
            };

            const data = {
                text: reviewText,
                rating: reviewRating,
                placemark_id: placemark_id,
            }       

            try{
                const response = await axios.post('http://localhost:8000/api/map/review/post', data, config);
                navigate(-1);

                const formData = new FormData();
                formData.append('picture', reviewPicture);
                formData.append('review_id', response.data.id);
                console.log(response.data);
                const config2 = {...config, headers: {...config.headers, 'Content-Type': 'multipart/form-data'}}; //жесть, но работает
                const response2 = await axios.post('http://localhost:8000/api/map/review/picture/post', formData, config2);
                console.log(response2); 
            }
            catch(error){
                console.error('error while posting review ',error);
            }        
        }
        fetchData();
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Review Text:
                <input
                    type="text"
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                />
            </label>
            <br />
            <label>
                Review Rating:
                <select
                    value={reviewRating}
                    onChange={(event) => setReviewRating(event.target.value)}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </label>
            <br />
            <label>
                Review Picture:
                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setReviewPicture(event.target.files[0])}
                />
            </label>
            <br />
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;