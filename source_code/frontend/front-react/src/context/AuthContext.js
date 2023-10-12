import axios from "axios";
import { createContext, useEffect, useState } from "react";
import getAPIURL from "utils/getAPIURL";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext('fuck');
let urls = await getAPIURL();


export default AuthContext;
export const AuthProvider = ({children}) => {
    let [user, setUser] = useState(null);
    let [authToken, setAuthToken] = useState(()=> localStorage.getItem('accessToken')?localStorage.getItem('accessToken'):null) ;
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
            console.log(response.data);
            setAuthToken(response.data.access);
            setUser(jwtDecode(response.data.access)); //Заменить на useEffect с getUser
            localStorage.setItem('accessToken',JSON.stringify(response.data['access'])); //переписать под ключ - значение DONE
            localStorage.setItem('refreshToken',JSON.stringify(response.data['refresh'])); 

            navigate('/');
        }
        else{
            alert('request went wrong');
        }

    }
    
    useEffect(()=>{
        if(authToken){
            async function fetchData(){
                try{
                        const response = await axios.post('http://127.0.0.1:8000/users/api/auth/user_by_token', null, {
                        headers: {
                            Authorization: `Bearer ${authToken.replaceAll('"', '')}`,
                        }
                    });
                    setUser(response.data);
                }
                catch (error){
                    console.log(error);
                }
            }
            fetchData(); //синхронный вызов async функции, замыкание, didmount->useeffect->вызов, setuser известен
        }
    }, [authToken]);
    
    let logoutUser = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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