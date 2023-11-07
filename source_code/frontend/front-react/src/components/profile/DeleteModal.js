import AuthContext from "context/AuthContext";
import React, { useContext, useState } from "react";
import closeIcon from '../../img/free-icon-close-4013407.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteModal = ({closeModal}) => {
    const authContext = useContext(AuthContext);
    const [currentEmail, setCurrentEmail] = useState('');
    const navigate = useNavigate();


    const handleDelete = async (e) => {
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        authContext.logoutUser();
        navigate('/');
        try{
            const response = await axios.post(`${authContext.requestHost}/api/users/auth/delete`, {}, config);       
        }
        catch(error){
            console.error('Error while deleting user', error);
        }
    }


    return(
        <div
            id="delete-modal-wrapper"
            className="w-full flex top-0 right-0 bg-overlay fixed z-40 flex justify-center items-center h-screen"
        >
            <div className="w-full rounded-md shadow-lg max-w-md h-[20] px-[25px] py-[20px] bg-[#ffff]" id="modal">
                <button className="p-[5px] font-xl bg-[#ffff] flex justify-center leading-none w-[25px] h-[25px] items-center hover:rounded-full hover:text-[#ffff] hover:bg-[#54545426]"
                onClick={closeModal}>
                    <img src={closeIcon}/>                           
                </button>
                    <div className="m-3">
                        <h2 className="text-center text-[#000] text-xl">Confirmation form</h2>
                        <label for='reason-field' className="text-[#000]">Enter your email address: </label>
                        <input type='text' id='email-field' name='email' onChange={(e)=>setCurrentEmail(e.target.value)} className="w-full border border-red text-[#000]"></input>
                    </div>
                    {currentEmail===authContext.user.email &&
                        <button className="bg-red text-[#ffff] flex ml-3 text-center px-2 py-1 rounded-md" onClick={handleDelete}>Submit</button> 
                    }               
            </div>
        </div>
    );
}

export default DeleteModal;