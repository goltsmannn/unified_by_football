import React from "react";
import UpperMenu from "./components/menu/UpperMenu";
import MyMap from "components/map/mapInit";
import { BrowserRouter, Routes, Route } from "react-router-dom";


class App extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <>
        <UpperMenu />
        <Routes>
          <Route path="/" element = {<MyMap />}></Route>
        </Routes>
      </>
    );
  }
}

export default App;
