import axios from "axios";
import AuthContext from "context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


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
                const config2 = {...config, headers: {...config.headers, 'Content-Type': 'multipart/form-data'}}; 
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
        <div className="h-screen w-full flex items-start justify-center">  
            <div
                className="w-full max-w-md p-[30px] max-h-[450px] rounded-lg border border-solid border-navbar text-navbar flex h-full mt-[100px] flex-col justify-around"
            >
                <h1 className="text-center text-2xl text-navbar font-bold">Review</h1>
                <form onSubmit={handleSubmit} className="mt-[30px] h-full flex flex-col">
                    <div className="mt-[15px] flex flex-col font-medium">
                        <label> Text:</label>
                        <input
                            className=' rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                            type="text"
                            value={reviewText}
                            onChange={(event) => setReviewText(event.target.value)}
                        />
                    </div>

                    <div className="mt-[15px] flex flex-col font-medium">
                        <label>
                            Rating:
                        </label>

                        <select
                            className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                            value={reviewRating}
                            onChange={(event) => setReviewRating(event.target.value)}
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>

                    <div>
                        <label  className="bg-navbar text-[#ffff] rounded-md p-2 cursor-pointer mt-[15px] flex flex-col font-medium">
                            Photo (optional)...
                        <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={(event) => setReviewPicture(event.target.files[0])}
                        />
                        </label>
                    </div>
                    <button className="mt-[40px] bg-active px-1 py-1 rounded-lg text-[#ffff]" type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;