import React, {useEffect} from "react";
import "../styles/Home.scss";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "./Components/Navbar";
import SideBar from "./Components/SideBar";
import {AuthenContext} from '../helper/AuthenContext';

function Home() {
  let navigator = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authenToken') && !AuthenContext.status) {
      navigator('/login');
    }
  });

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