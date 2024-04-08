import React from 'react';
import '../styles/Nav.scss';

import {
    NavLink
} from "react-router-dom";

function Nav() {
    return (
        <>
        <div className="navbar navbar-dark bg-dark">
            <NavLink class="nav-link" to="/" className="navbar-brand">QUẢN TRỊ THƯ VIỆN</NavLink>
            <NavLink class="nav-link nav-link-item" to="/">Home</NavLink>
            <NavLink class="nav-link nav-link-item" to="/">Item 1</NavLink>
            <NavLink class="nav-link nav-link-item" to="/">Item 2</NavLink>
        </div>
        </>
    );
}

export default Nav;