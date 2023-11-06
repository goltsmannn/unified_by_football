import axios from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPIURL from "utils/getAPIURL";
const AuthContext = createContext('blank');
let urls = await getAPIURL();


export default AuthContext;

/**
 * Context provider for authentication functions
 * Current user state
 * Read_only fields list
 * Logout 
 * Authorization tokens
 */
export const AuthProvider = ({children}) => {
    let [user, setUser] = useState(null);
    let [authToken, setAuthToken] = useState(()=> localStorage.getItem('accessToken')?localStorage.getItem('accessToken'):null) ;
    let navigate = useNavigate();
    const readOnlyFields = ['email', 'id', 'is_staff', 'username', 'show_activity'];
    
    /**
     * Loggin the user in and setting local storage variables, context variables
     */
    let loginUser = async (e ) => {
        e.preventDefault();
        try{
            const response = await axios.post(urls['token-access'],{
                email: e.target.email.value,
                password: e.target.password.value,
                    },{
                headers: {
                    'Content-Type': 'multipart/form-data',
            }});
            setAuthToken(response.data.access);
            setUser(jwtDecode(response.data.access)); //Заменить на useEffect с getUser?
            localStorage.setItem('accessToken',JSON.stringify(response.data['access'])); 
            localStorage.setItem('refreshToken',JSON.stringify(response.data['refresh'])); 
            navigate('/');
            return null;
        }
        catch (error) {
            return error;
        }
    }
    
    /**Loading previously logged in user to avoid logging in after every reload */
    useEffect(()=>{
        if(authToken){
            async function fetchData(){
                try{
                        const response = await axios.post('http://127.0.0.1:8000/api/users/auth/retrieve_user_by_token', null, {
                        headers: {
                            Authorization: `Bearer ${authToken.replaceAll('"', '')}`,
                        }
                    });
                    setUser(response.data);
                }
                catch (error){
                    console.log('сессия истекла');     
                  //  navigate('/login', { state: { error: 'Session expired'} });
                }
            }
            fetchData(); //синхронный вызов async функции, замыкание, didmount->useeffect->вызов, setuser известен
        }
    }, [authToken]);
    
    let logoutUser = async (e) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setAuthToken(null);
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/users/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${authToken.replaceAll('"', '')}`,
            }
            });
        }   
        catch (error){
            console.error('Error while logging out', error)
        }
        navigate('/');
    }

    let contextData = {
        urls: urls,
        loginUser: loginUser,
        user:user,
        setUser: setUser,
        logoutUser: logoutUser,
        authToken: authToken,
        readOnlyFields: readOnlyFields,
    };
    
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}