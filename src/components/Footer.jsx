import { useTranslation } from "react-i18next";
import LogoWithTitle from "../assets/logoWithTitle.png";
import TeamLogo from "../assets/4bits.png";
import Developers from "../data/developers.json";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

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
            <Typography variant="h6">
              {t("footer.projectIntroTitle")}
            </Typography>
            <Typography variant="body2">{t("footer.projectIntro1")}</Typography>
            <Typography variant="body2">{t("footer.projectIntro2")}</Typography>
            <Typography variant="body2">{t("footer.projectIntro3")}</Typography>
            <Typography variant="body2">{t("footer.projectIntro4")}</Typography>
            <Typography variant="body2">{t("footer.projectIntro5")}</Typography>
          </div>
          <div className="flex flex-col text-left">
            <Typography variant="h6">{t("common.aboutUs")}</Typography>
            <Typography variant="body2">{t("common.projectTitle")}</Typography>
            <Typography variant="body2">{t("common.teamTitle")}</Typography>
            <Typography variant="body2">{t("common.teamLeader")}</Typography>
          </div>
          <div className="flex flex-col text-left">
            <Typography variant="h6">{t("common.members")}</Typography>
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
        <p>{t("common.copyright")}</p>
      </footer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedMember &&
            (i18n.language === "ko"
              ? selectedMember.name.ko
              : selectedMember.name.ja)}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">{t("common.profile")}</Typography>
          <Typography variant="body2">
            {selectedMember &&
              (i18n.language === "ko"
                ? selectedMember.profile.ko
                : selectedMember.profile.ja)}
          </Typography>
          <Typography variant="h6">{t("common.contacts")}</Typography>
          <Typography variant="body2">
            {selectedMember && selectedMember.phone}
          </Typography>
          <Typography variant="body2">
            {selectedMember && selectedMember.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
