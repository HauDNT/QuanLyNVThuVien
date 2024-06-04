import React, { useContext } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { UserRoleContext } from "../../context/UserRoleContext.js";
import { FaHome, FaUser, FaList, FaCodeBranch } from "react-icons/fa";
import { MdHandyman } from "react-icons/md";
import { GiBookCover } from "react-icons/gi";
import { Link } from "react-router-dom";

function SideBar() {
  const userRoles = useContext(UserRoleContext);
  const idRole = userRoles.role.RoleId;

  return (
    <Sidebar className="sidebar">
      <Menu>
        <MenuItem component={<Link to="/" />} icon={<FaHome/>}>Trang chủ</MenuItem>
        {idRole === 1 || idRole === 2 ? (
          <SubMenu label="Quản lý người dùng" icon={<FaUser/>}>
            <MenuItem component={<Link to="/users/" />}>
              Quản lý tài khoản
            </MenuItem>
            <MenuItem component={<Link to="/positions/" />}>Chức vụ</MenuItem>
            <MenuItem component={<Link to="/roles/" />}>Quyền hạn</MenuItem>
          </SubMenu>
        ) : null}
        <SubMenu label="Quản lý đơn sách" icon={<FaList/>}>
          <MenuItem component={<Link to="/bills/2" />}>Đơn mua</MenuItem>
          <MenuItem component={<Link to="/bills/3" />}>
            Đơn nhận / biếu tặng
          </MenuItem>
          <MenuItem component={<Link to="/bills/1" />}>
            Đơn chưa phân loại
          </MenuItem>
          <MenuItem component={<Link to="/bills/types" />}>
            Phân loại hóa đơn
          </MenuItem>
        </SubMenu>
        <SubMenu label="Biên mục sách" icon={<GiBookCover/>}>
          <MenuItem component={<Link to="/book/cataloging/create" />}>
            Tạo mới
          </MenuItem>
          <MenuItem component={<Link to="/book/cataloging/all" />}>
            Danh sách biên mục
          </MenuItem>
        </SubMenu>
        {idRole === 1 || idRole === 2 ? (
          <SubMenu label="Thông tin phân phối" icon={<FaCodeBranch/>}>
            <MenuItem component={<Link to="/rooms" />}>Phòng</MenuItem>
            <MenuItem component={<Link to="/storetypes" />}>
              Thể loại lưu trữ
            </MenuItem>
            <MenuItem component={<Link to="/statusdocs" />}>
              Trạng thái tài liệu
            </MenuItem>
          </SubMenu>
        ) : null}
        <SubMenu label="Công cụ" icon={<MdHandyman/>}>
          <MenuItem component={<Link to="/encodetitles" />}>
            Bảng mã hóa tên sách
          </MenuItem>
          {idRole === 1 || idRole === 2 ? (
            <MenuItem component={<Link to="/barcode" />}>
              Tạo mã Barcode 128
            </MenuItem>
          ) : null}
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}

export default SideBar;
