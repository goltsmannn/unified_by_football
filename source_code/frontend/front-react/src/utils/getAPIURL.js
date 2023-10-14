import axios from 'axios'

async function getAPIURL(){
    const response = await axios.get('http://localhost:8000/api/users');
    response.data['auth'] = 'http://localhost:8000/api/auth/';
    response.data['token-access'] = 'http://localhost:8000/api/token/';
    response.data['token-refresh'] = 'http://localhost:8000/api/token/refresh/';

    return response.data;
}

export default getAPIURL;