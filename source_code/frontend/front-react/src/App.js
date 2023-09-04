import React from "react";
import UpperMenu from "./components/menu/UpperMenu";
import MyMap from "components/map/mapInit";


class App extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <>
        <UpperMenu />
        <MyMap />
      </>
    );
  }
}

export default App;
