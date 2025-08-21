import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import taxios from "../utils/taxios";
import { Link } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handleClick = async (event) => {
    const accessToken = localStorage.getItem("accessToken");
    const eventCapture = event.currentTarget;

    if (!accessToken) {
      window.location.href = "/signin";
    }

    try {
      const response = await taxios.get("/user/getMe");

      if (response.status === 200) {
        console.log(response.data);
        setUserInfo(response.data);
        setAnchorEl(eventCapture);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    setAnchorEl(null);
    setUserInfo(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <AccountCircleIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disabled>{userInfo?.email || "User"}</MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/mypage">MyPage</Link>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </Menu>
    </>
  );
}
