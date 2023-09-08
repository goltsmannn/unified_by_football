import axios from "axios";
import { createContext, useEffect, useState } from "react";
import getAPIURL from "utils/getAPIURL";
import jwtDecode from "jwt-decode";


const AuthContext = createContext('fuck');
let urls = await getAPIURL();


export default AuthContext;
export const AuthProvider = ({children}) => {
    let [user, setUser] = useState(null);
    let [token, setToken] = useState(null);
    
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
            setToken(response.data);
            setUser(jwtDecode(response.data.access));
        }
        else{
            alert('request went wrong');
        }

    }
    
    let contextData = {
        urls: urls,
        loginUser: loginUser,
        user:user,
    };
    
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}