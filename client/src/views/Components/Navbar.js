import React, { useContext } from "react";
import {useNavigate} from 'react-router-dom';
import { AuthenContext } from "../../helper/AuthenContext";
import Dropdown from "react-bootstrap/Dropdown";
import { PiSignOutBold } from "react-icons/pi";
import { FaRegCircleUser } from "react-icons/fa6";
import "../../styles/Nav.scss";

import { NavLink } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  const { authenData, setAuthenData } = useContext(AuthenContext);

  const handleLogout = () => {
    localStorage.clear();
    setAuthenData (false);
    navigate('/login');
  };

  return (
    <div className="navbar navbar-dark bg-dark">
      <NavLink className="nav-link navbar-brand">QUẢN LÝ NGHIỆP VỤ SÁCH</NavLink>
      {/* <NavLink className="nav-link nav-link-item" to="/">
        Home
      </NavLink>
      <NavLink className="nav-link nav-link-item" to="/">
        Item 1
      </NavLink>
      <NavLink className="nav-link nav-link-item" to="/">
        Item 2
      </NavLink> */}

      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {authenData.username}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>
            <FaRegCircleUser />
            <NavLink to='/'>Thông tin cá nhân</NavLink>
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>
            <PiSignOutBold />
            <NavLink>Đăng xuất</NavLink>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Nav;
