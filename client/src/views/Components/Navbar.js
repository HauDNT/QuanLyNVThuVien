import React, { useContext } from 'react';
import '../../styles/Nav.scss';
import {AuthenContext} from '../../helper/AuthenContext';

import {
    NavLink
} from "react-router-dom";

function Nav() {
    const {authenData} = useContext(AuthenContext);

    return (
        <div className="navbar navbar-dark bg-dark">
            <NavLink className="nav-link navbar-brand">QUẢN TRỊ THƯ VIỆN</NavLink>
            <NavLink className="nav-link nav-link-item" to="/">Home</NavLink>
            <NavLink className="nav-link nav-link-item" to="/">Item 1</NavLink>
            <NavLink className="nav-link nav-link-item" to="/">Item 2</NavLink>
            <NavLink className="nav-link nav-link-item" to="/">
                {authenData.username}
            </NavLink>
        </div>
    );
}

export default Nav;