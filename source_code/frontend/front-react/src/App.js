import React from "react";
import UpperMenu from "./components/menu/UpperMenu";
import MyMap from "components/map/mapInit";
import { Routes, Route } from "react-router-dom";
import Login from "components/auth/Login";
import { AuthProvider } from "context/AuthContext";
import PlacemarkMain from "components/placemarks/PlacemarkMain";


class App extends React.Component{

  // constructor(props){
  //   super(props);
  // }

  render(){
    return(
      <>
        <AuthProvider>      
          <UpperMenu />
          <Routes>
              <Route path="/" element = {<MyMap />} exact></Route>
              <Route path="/login" element = { <Login/> }></Route>
              <Route path="/placemark" element = { <PlacemarkMain/> }></Route>
          </Routes>
        </AuthProvider>
      </>
    );
  }
}

export default App;
