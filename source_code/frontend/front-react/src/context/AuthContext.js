import axios from "axios";
import { createContext, useEffect, useState } from "react";
import getAPIURL from "utils/getAPIURL";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext('fuck');
let urls = await getAPIURL();


export default AuthContext;
export const AuthProvider = ({children}) => {
    let [user, setUser] = useState(()=> localStorage.getItem('authToken')?JSON.parse(localStorage.getItem('authToken')):null);
    let [authToken, setAuthToken] = useState(()=> localStorage.getItem('authToken')?jwtDecode(localStorage.getItem('authToken')):null) ;
    let navigate = useNavigate();


    let loginUser = async (e ) => {
        e.preventDefault();
        let response = await axios.post(urls['token-access'],
        {
            email: e.target.email.value,
            password: e.target.password.value,
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            }         
        }
        );

        if (response.status === 200){
            setAuthToken(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem('authToken',JSON.stringify(response.data));
            navigate('/');
        }
        else{
            alert('request went wrong');
        }

    }
    
    let logoutUser = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setAuthToken(null);
        navigate('/');
    }

    let contextData = {
        urls: urls,
        loginUser: loginUser,
        user:user,
        logoutUser: logoutUser,
    };
    
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}