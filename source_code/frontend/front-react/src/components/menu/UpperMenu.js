import React from "react";
import LoggedUserUpperMenu from "./LoggedUserUpperMenu";
import UnloggedUserUpperMenu from "./UnloggedUserUpperMenu";
import getAPIURL from "../../utils/getAPIURL";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";

//здесь импортнуть стили

const api_urls = await getAPIURL();


class UpperMenu extends React.Component{
    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.state = {
            data: [],
        }
    }

    async componentDidMount(){
        try{
            const request = await axios.get(`${api_urls['users']}`);
            const request_json = await request.json();
            this.setState({
                data: request_json,
            });
        }
        catch(e){
            console.log(e);
        }
    }

    render() {
        
        if (this.context.user){
            return(          
                <>
                    <LoggedUserUpperMenu></LoggedUserUpperMenu>
                </>
        );
        }
        else{
            return(
                <>
                    <UnloggedUserUpperMenu></UnloggedUserUpperMenu>
                </>
            );
        }
    }
}

export default UpperMenu;