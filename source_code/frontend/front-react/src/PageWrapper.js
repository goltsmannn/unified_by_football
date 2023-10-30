import React from "react";
import UpperMenu from "components/menu/UpperMenu";
import { Outlet } from "react-router-dom";

export default function PageWrapper(){
    return (
        <div>
          <UpperMenu />
          <Outlet />
        </div>
    )
}