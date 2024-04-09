import React from "react";
import "../styles/Home.scss";
import { Outlet } from "react-router-dom";
import Nav from "./Components/Navbar";
import SideBar from "./Components/SideBar";

function Home() {
    return (
        <div className="Home">
        <Nav/>
        <div className="row">
            <div className="leftSide col-2">
              <SideBar/>
            </div>
            <div className="rightSide col-10">
                <Outlet/>
            </div>
          </div>
        </div>
    )
}

export default Home;