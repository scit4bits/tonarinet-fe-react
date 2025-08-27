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
    { key: "단체관리", url: "/sysadmin/org" },
    { key: "게시판관리", url: "/sysadmin/board" },
    { key: "리뷰관리", url: "/sysadmin/review" },
    { key: "파티관리", url: "/sysadmin/party" },
    { key: "공지관리", url: "/sysadmin/notice" },
  ];
  const orgAdmin = [
    { key: "멤버관리", url: "/orgadmin/member" },
    { key: "그룹관리", url: "/orgadmin/group" },
    { key: "과제관리", url: "/orgadmin/task" },
    { key: "상담관리", url: "/orgadmin/counsel" },
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
