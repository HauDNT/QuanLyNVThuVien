import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/UserRoleContext.js";
import Dropdown from "react-bootstrap/Dropdown";
import { PiSignOutBold } from "react-icons/pi";
import { FaRegCircleUser } from "react-icons/fa6";
import "../../styles/Nav.scss";

import { NavLink } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  const userRoles = useContext(UserRoleContext);
  const { clearRole } = useContext(UserRoleContext);
  const fullname = userRoles.role.Fullname;
  const userId = localStorage.getItem("id");

  const handleLogout = () => {
    localStorage.clear();
    clearRole();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <NavLink className="nav-link navbar-brand" to="/">
        LIBTECH
      </NavLink>

      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {fullname}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>
            <FaRegCircleUser />
            <NavLink to={`/users/edit/${userId}`}>Thông tin cá nhân</NavLink>
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
