import React, { useContext, useState } from "react";
import closeIcon from '../../img/free-icon-close-4013407.png';
import AuthContext from "context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";


const ReportModal = ({setReportModalIsOpen, reviewId}) => {
    const authContext = useContext(AuthContext);
    const [description, setDescription] = useState('');


    const handleSubmitReport = async (e) => {
        const config = {
            headers:
            {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
            }
        }
        const data = {
            review_id: reviewId,
            user_id: authContext.user.id,
            reason: description,
        }
        try{
            const response = await axios.post(`${authContext.requestHost}/api/map/report`, data, config);
            
        }
        catch (error){
            console.error('Error while reporting', error);
        }
        setReportModalIsOpen(false);
    }


    return(
        <div
            id="report-modal-wrapper"
            className="w-full flex top-0 right-0 bg-overlay fixed z-40 flex justify-center items-center h-screen"
        >
            <div className="w-full rounded-md shadow-lg max-w-md h-[20] px-[25px] py-[20px] bg-[#ffff]" id="modal">
                <button className="p-[5px] font-xl bg-[#ffff] flex justify-center leading-none w-[25px] h-[25px] items-center hover:rounded-full hover:text-[#ffff] hover:bg-[#54545426]"
                onClick={()=>setReportModalIsOpen(false)}>
                    <img src={closeIcon}/>                           
                </button>
                    <div className="m-3">
                        <h2 className="text-center text-[#000] text-xl">Report Form</h2>
                        <label for='reason-field' className="text-[#000]">Describe the report reason here: </label>
                        <input type='text' id='reason-field' name='reason' onChange={(e)=>setDescription(e.target.value)} className="w-full border border-red text-[#000]"></input>
                    </div>
                    <button className="bg-red text-[#ffff] text-center px-2 py-1 rounded-md" onClick={handleSubmitReport}>Submit</button>                
            </div>
        </div>
    );
}

export default ReportModal;