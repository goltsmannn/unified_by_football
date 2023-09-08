import React from "react";
import UpperMenu from "./components/menu/UpperMenu";
import MyMap from "components/map/mapInit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "components/auth/Login";
import { AuthProvider } from "context/AuthContext";

class App extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <>
        <AuthProvider>      
          <UpperMenu />
          <Routes>
              <Route path="/" element = {<MyMap />} exact></Route>
              <Route path="/login" element = { <Login/> }></Route>
          </Routes>
        </AuthProvider>

      </>
    );
  }
}

export default App;
