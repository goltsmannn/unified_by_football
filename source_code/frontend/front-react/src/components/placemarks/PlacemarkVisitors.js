import AuthContext from "context/AuthContext";
import React, { useContext, useEffect, } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";


const PlacemarkVisitors = ({placemark}) => {   
    const [visitors, setVisitors] = useState([]);
    const authContext = useContext(AuthContext);


    useEffect(()=>{
        const fetchData = async () => {
            const config = {
                headers:{
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                },
                params: {
                    get_by: 'placemark',
                    placemark_id: placemark.id,
                }
            };
            try{
                const response = await axios.get(`${authContext.requestHost}/api/map/activity`, config);
                setVisitors(response.data);
            }
            catch (error){
                console.error('error while getting placemark visitors', error);
            }
        }
        if(authContext.user){
            fetchData();
        }
    }, [placemark]);
    
    if(visitors.length>0){
        return(
            <div className="border border-navbar h-full w-full my-10 rounded">
                <h2 className="text-center text-2xl">Users on the pitch</h2>
                {visitors.map((visit)=>{
                    const beginDT = new Date(visit.created);
                    const tmp = new Date(visit.created);
                    const endDT = visit.finished_early? new Date(visit.finished_early): new Date(tmp.setHours(tmp.getHours() + visit.expiry));
                    return(
                        <div>
                            <div className="flex items-center justify-center shadow shadow-active my-5 mx-2">
                                <Link className='font-bold' to={`/profile/${visit.user.id}`}>Username: <br/> {visit.user.username} (clickable)</Link>
                                <p>From: {beginDT.toLocaleString()}</p>
                                <p>To: {endDT.toLocaleString()}</p>
                            </div>
                        </div>
                    );
            })}
            </div>
        );
    }
    else{
        return(authContext.user?<div>No activity</div>:<div>Sign in to Check Activity</div>);
    }
}

export default PlacemarkVisitors;