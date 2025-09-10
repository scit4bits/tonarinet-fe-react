import { useTranslation } from "react-i18next";
import LogoWithTitle from "../assets/logoWithTitle.png";
import TeamLogo from "../assets/4bits.png";
import { Link } from "react-router";
import Developers from "../data/developers.json";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import { useState } from "react";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      <footer className="bg-gray-300 w-full p-3 text-center flex flex-col items-center">
        <div className="flex gap-5 max-w-[1200px] gap-15">
          <div className="flex flex-col text-left">
            <img src={LogoWithTitle} alt="logo" className="h-[55px]" />
            <div className="flex flex-row text-left items-center">
              <img
                src={TeamLogo}
                alt="Team Logo"
                className="h-[100px] w-[100px]"
              />
              <Typography variant="h3">4bits</Typography>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <Typography variant="h6">About us</Typography>
            <Typography variant="body2">
              SMART Cloud IT Master 47기 팀 프로젝트
            </Typography>
            <Typography variant="body2">B반 4조 Team 4bits</Typography>
            <Typography variant="body2">조장 현진섭</Typography>
          </div>
          <div className="flex flex-col text-left">
            <Typography variant="h6">Members</Typography>
            {Developers.map((member) => (
              <Typography
                key={member.id}
                variant="body2"
                onClick={() => handleMemberClick(member)}
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {i18n.language === "ko" ? member.name.ko : member.name.ja}
              </Typography>
            ))}
          </div>
        </div>
        <br />
        <p>© 2025 Team 4bits. All Rights Reserved.</p>
      </footer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedMember &&
            (i18n.language === "ko"
              ? selectedMember.name.ko
              : selectedMember.name.ja)}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">Profile</Typography>
          <Typography variant="body2">
            {selectedMember &&
              (i18n.language === "ko"
                ? selectedMember.profile.ko
                : selectedMember.profile.ja)}
          </Typography>
          <Typography variant="h6">Contacts</Typography>
          <Typography variant="body2">
            {selectedMember && selectedMember.phone}
          </Typography>
          <Typography variant="body2">
            {selectedMember && selectedMember.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
