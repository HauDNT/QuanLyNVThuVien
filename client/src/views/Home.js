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
  }, []);

  return (
      <div className="Home">
      <Nav/>
      <div className="home-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2 leftSide">
              <SideBar/>
            </div>
            <div className="col-10 rightSide">
                <Outlet/>
            </div>
          </div>
        </div>
        </div>
      </div>
  )
}

export default Home;