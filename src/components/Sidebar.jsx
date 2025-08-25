import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";

export default function Sidebar({ role }) {
  const systemAdmin = ["유저관리", "단체관리", "게시판관리", "리뷰관리", "공지관리"];
  const orgAdmin = ["멤버관리", "그룹관리", "과제관리", "상담관리"];

  let menuItems = role === "systemAdmin" ? systemAdmin : role === "orgAdmin" ? orgAdmin : [];

  return (
    <Box sx={{ height: "100%", bgcolor: "#f0f0f0" }}>
      <List>
        {menuItems.map((text) => (
          <ListItem button key={text} sx={{ justifyContent: "center" }}>
            <ListItemText  primary={<Typography align="center">{text}</Typography>}  />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
