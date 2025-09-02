import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  ListItemButton,
} from "@mui/material";

export default function Sidebar({ role }) {
  const systemAdmin = [
    { key: "유저관리", url: "/sysadmin/user" },
    { key: "조직관리", url: "/sysadmin/org" },
    { key: "공지관리", url: "/sysadmin/notice" },
  ];
  const orgAdmin = [
    { key: "멤버관리", url: "/orgadmin/member" },
    { key: "팀관리", url: "/orgadmin/team" },
    { key: "과제관리", url: "/orgadmin/task" },
    { key: "상담관리", url: "/orgadmin/counsel" },
    { key: "공지관리", url: "/orgadmin/notice" },
  ];

  let menuItems =
    role === "systemAdmin" ? systemAdmin : role === "orgAdmin" ? orgAdmin : [];

  return (
    <Box className="bg-gray-100 mr-4">
      <List>
        {menuItems.map(({ key, url }) => (
          <ListItemButton
            key={key}
            className="justify-center"
            onClick={() => {
              window.location.href = url;
            }}
          >
            {key}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
