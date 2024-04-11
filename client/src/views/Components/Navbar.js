import React, { useContext, useEffect } from 'react';
import '../../styles/Nav.scss';
import {AuthenContext} from '../../helper/AuthenContext';

import {
    NavLink
} from "react-router-dom";

function Nav() {
    const {authenState} = useContext(AuthenContext);

    return (
        <>
        <div className="navbar navbar-dark bg-dark">
            <NavLink class="nav-link" to="/" className="navbar-brand">QUẢN TRỊ THƯ VIỆN</NavLink>
            <NavLink class="nav-link nav-link-item" to="/">Home</NavLink>
            <NavLink class="nav-link nav-link-item" to="/">Item 1</NavLink>
            <NavLink class="nav-link nav-link-item" to="/">Item 2</NavLink>
            <NavLink class="nav-link nav-link-item" to=""> {/*{authenState.username}*/}
                {
                    localStorage.username?.replace(/^"|"$/g, '')
                }
            </NavLink>
        </div>
        </>
    );
}

export default Nav;