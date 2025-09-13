import {Outlet} from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import {Box} from "@mui/material";

const drawerWidth = 240;
const headerHeight = 65;

export default function Layout() {
    return (
        <Box className="min-h-screen flex flex-col">
            <Header/>

            <Box
                component="main"
                className="w-full flex flex-1 bg-background-default max-w-[1200px] self-center"
            >
                <Outlet/>
            </Box>

            <Footer/>
        </Box>
    );
}
