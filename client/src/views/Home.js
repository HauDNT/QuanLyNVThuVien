import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Nav from './Components/Navbar.js';
import SideBar from './Components/SideBar.js';
import { TfiMenu } from 'react-icons/tfi';

function Home() {
    let navigator = useNavigate();
    const [menuStatus, setMenuStatus] = useState('none');

    useEffect(() => {
        if (
            !localStorage.getItem('authenToken') ||
            !localStorage.getItem('status')
        ) {
            navigator('/login');
        }
    }, []);

    const handleDisplayMenu = () => {
        setMenuStatus((prevStatus) =>
            prevStatus === 'none' ? 'block' : 'none'
        );
    };

    return (
        <>
            <Nav />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <SideBar
                            display={menuStatus}
                            handleDisplayMenu={handleDisplayMenu}
                        />
                    </div>
                    <div className="col-md-12 col-sm-12 right-side">
                        <button
                            className="btn btn-default btn-menu zoom-effect"
                            onClick={handleDisplayMenu}
                        >
                            {<TfiMenu />}
                        </button>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
