import React from "react";
import { Link } from "react-router-dom";
class PlacemarkMain extends React.Component{

    constructor(props){
        super(props);
    }
    render(){
        const placemark_id = 1; //this.props.match.params;
        return(
            <>
                <div>{placemark_id}</div>
            </>
        )
    };
}

export default PlacemarkMain;