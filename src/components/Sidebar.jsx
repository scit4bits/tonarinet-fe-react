import {Box, List, ListItemButton,} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function Sidebar({role, orgId}) {
    const {t} = useTranslation();

    const systemAdmin = [
        {key: t("sidebar.userManagement"), url: "/sysadmin/user"},
        {key: t("sidebar.orgManagement"), url: "/sysadmin/org"},
        {key: t("sidebar.noticeManagement"), url: "/sysadmin/notice"},
    ];
    const orgAdmin = [
        {key: t("sidebar.memberManagement"), url: `/orgadmin/${orgId}/member`},
        {key: t("sidebar.teamManagement"), url: `/orgadmin/${orgId}/team`},
        {key: t("sidebar.taskManagement"), url: `/orgadmin/${orgId}/task`},
        {key: t("sidebar.counselManagement"), url: `/orgadmin/${orgId}/counsel`},
        {key: t("sidebar.noticeManagement"), url: `/orgadmin/${orgId}/notice`},
    ];

    let menuItems =
        role === "systemAdmin" ? systemAdmin : role === "orgAdmin" ? orgAdmin : [];

    return (
        <Box className="bg-gray-100 mr-4">
            <List>
                {menuItems.map(({key, url}) => (
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
