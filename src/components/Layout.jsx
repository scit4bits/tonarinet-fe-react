import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

const drawerWidth = 240;
const headerHeight = 65;

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1, mt: `${headerHeight}px`, minHeight: 0 }}>
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            bgcolor: "#f0f0f0",
          }}
        >
          <Sidebar role="systemAdmin" />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            overflow: "auto",
            bgcolor: "background.default",
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
