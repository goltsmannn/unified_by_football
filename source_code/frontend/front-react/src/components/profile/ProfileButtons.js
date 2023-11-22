import axios from "axios";
import AuthContext from "context/AuthContext";
import useBlackList from "hooks/useBlackList";
import useSubscriptions from "hooks/useSubscriptions";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteModal from "./DeleteModal";

const ProfileButtons = ({pageUser}) =>{
    const location = useLocation();
    const authContext = useContext(AuthContext);
    const subscriptions = useSubscriptions();
    const blacklistedUsers = useBlackList();
    const page_id= useParams().user_id;
    const [isSubscribed, setIsSubscribed] = useState(null);
    const [isBlackListed, setIsBlackListed] = useState(null);
    const [isHidden, setIsHidden] = useState(!authContext.user.show_activity);
    const [modalIsOpen, setModalIsOpen] = useState(false);


    /**
     * Subscribing or unsubscribing  the user
     */
    const handleSubscriptionClick = async (e)=>{
        e.preventDefault();
        const check = !isSubscribed;
        setIsSubscribed(check);

        const fetchData = async ()=>{
            const data = {
                user_from_id: authContext.user.id,
                user_to_id: pageUser.id,
                delete: !check
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                }
            }
            try{
                console.log(data);
                const response = await axios.post(`${authContext.requestHost}/api/users/subscriptions`, data, config);
                console.log(response.data);
            }
            catch(error){
                console.error('caught error while subscribing', error);
            }
        }
        await fetchData();
    }

    /**
     * Adding to or removing from blacklist
     */
    const handleBlackListClick = async (e)=>{
        e.preventDefault();
        const check = !isBlackListed;
        setIsBlackListed(check);  
        const fetchData = async ()=>{
            const data = {
                user_from_id: authContext.user.id,
                user_to_id: pageUser.id,
                delete: !check,
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                }
            }
            try{
                const response = await axios.post(`${authContext.requestHost}/api/users/blacklist`, data, config);
                console.log(response.data);
            }
            catch(error){
                console.error('caught error while blacklisting', error);
            }
        }
        await fetchData();      
    }

    /**
     * Hiding/showing activity from other users 
     */
    const handleIsHiddenChange = async () => {
        console.log('changing visib')
        const isHiddenRealValue = !isHidden;
        setIsHidden(isHiddenRealValue);
        authContext.setUser({...authContext.user, show_activity: !isHiddenRealValue});
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        try{
            const response = await axios.post(`${authContext.requestHost}/api/users/auth/update_user_by_token`, authContext.user, config);
        }
        catch(error){
            console.error('error while updating activity boolean value')
        }    
    }

    const handleRequestPasswordChange = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` 
            }
        }
        try{
            await axios.post(`${authContext.requestHost}/api/users/create_password_reset_token`, {}, config);
            document.getElementById('change-password-button').innerHTML = 'Check your email!';
        }
        catch (error){
            console.error('error while creating reset token', error);
        }
    }
    /**
     * Looking through subscriptions of the user to find looked up profile and decide on the relationship with the current user
     */
    useEffect(()=>{
        subscriptions.forEach((subscription)=>{
            if(subscription.user_to.id === Number(page_id)){
                setIsSubscribed(true);  
            }
        })
    }, [subscriptions, page_id]);

    /**
     * Looking through blacklisted users of the user to find looked up profile and decide on the relationship with the current user
     */
    useEffect(()=>{
        blacklistedUsers.forEach((blacklistedUser)=>{
            if(blacklistedUser.user_to.id === Number(page_id)){
                setIsBlackListed(true);
            }
        })
    }, [blacklistedUsers, page_id]);






    if((location.pathname===`/profile/${page_id}`) && (authContext.user)){
        if(pageUser.id === authContext.user.id){
            return(
                <>
                <Link 
                    className={`mt-[30px] text-center block  bg-navbar px-1 py-2 rounded-lg text-white active:bg-active`}
                    to="edit">Edit
                </Link>
                <button 
                    className={`mt-[30px] text-center block w-full bg-red px-1 py-2 rounded-lg text-white active:bg-active`}
                    onClick={()=>setModalIsOpen(true)}>Delete profile
                </button>
                <div className="flex justify-between">
                    <button onClick={handleIsHiddenChange}>{isHidden?"Show Activity":"Hide Activity"}</button>
                    <button id='change-password-button' className='text-[#000]' onClick={handleRequestPasswordChange}>Change Password</button>
                </div>
                {modalIsOpen && <DeleteModal closeModal={()=>setModalIsOpen(false)} />}
                </>
            );
        }
        else{
            return(
                <div className="mt-[20px]">
                    <button className="bg-navbar text-[#ffff] text-center px-2 py-1 rounded-md" onClick={handleSubscriptionClick}>{isSubscribed?"Unsubscribe":"Subscribe"}</button> <br></br>
                    <button className="mt-[10px] bg-[#cf0404] text-[#ffff] px-2 py-1 rounded-md" onClick={handleBlackListClick}>{isBlackListed?"Remove from Blacklist":"Add to Blacklist"}</button>
                </div>
            );
        }
    }
    else{
        return <></>;
    }
}   

export default ProfileButtons;
                
