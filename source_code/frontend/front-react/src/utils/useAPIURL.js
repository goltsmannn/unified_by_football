// import axios from 'axios';
// import AuthContext from 'context/AuthContext';
// import { useContext, useEffect, useState } from 'react';
// /**
//  * Function to get API URLS, will be actively used in production. 
//  * Currently most of the urls are hardcoded
//  * @returns {Object} API URLS
//    */


// const useAPIURL = async () => {
//     const authContext = useContext(AuthContext);
//     const [urls, setUrls] = useState();


//     const response = await axios.get(`${authContext.requestHost}/api/users`);
//     console.log(response.data)
//     response.data['auth'] = `${authContext.requestHost}/api/auth/`;
//     response.data['token-access'] = `${authContext.requestHost}/api/token/`;
//     response.data['token-refresh'] = `${authContext.requestHost}/api/token/refresh/`;
//     setUrls(response.data);
        
//     console.log(urls)
//     return urls;
    
// }

// export default useAPIURL;