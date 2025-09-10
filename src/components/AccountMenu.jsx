import { useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getMe } from "../utils/user";
import { signOut } from "../utils/auth";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  const handleClick = async (event) => {
    const eventCurrentTarget = event.currentTarget; // capturing
    setAnchorEl(eventCurrentTarget);

    const data = await getMe();
    if (!data) {
      window.location.href = "/signin";
      return;
    }
    setUser(data);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    setAnchorEl(null);
    signOut();
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
        disableScrollLock={true}
      >
        {!user ? (
          <MenuItem disabled>
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <CircularProgress size={20} />
            </Box>
          </MenuItem>
        ) : (
          [
            <MenuItem key="email" disabled>
              {user?.email || "User"}
            </MenuItem>,
            <MenuItem
              key="mypage"
              onClick={() => {
                window.location.href = "/my";
              }}
            >
              <Typography>마이 페이지</Typography>
            </MenuItem>,
            user?.isAdmin && (
              <MenuItem
                key="admin"
                onClick={() => {
                  window.location.href = "/sysadmin";
                }}
              >
                <Typography>관리자 페이지</Typography>
              </MenuItem>
            ),
            <MenuItem key="signout" onClick={handleSignOut}>
              Sign out
            </MenuItem>,
          ]
        )}
      </Menu>
    </>
  );
}
