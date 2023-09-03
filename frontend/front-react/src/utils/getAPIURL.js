import axios from 'axios'

async function getAPIURL(){
    const response = await axios.get('http://localhost:8000/profile/api');
    return response.data;
}

export default getAPIURL;