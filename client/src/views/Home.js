import React, {useEffect, useState, useContext} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "./Components/Navbar";
import SideBar from "./Components/SideBar";
import { UserRoleContext } from '../context/UserRoleContext.js';

function Home() {
  let navigator = useNavigate();
  const fullname = useContext(UserRoleContext).role.Fullname;

  useEffect(() => {
    if (!localStorage.getItem('authenToken') || !localStorage.getItem('status')) {
      navigator('/login');
    }
  }, []);
  
  return (
      <div className="home">
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