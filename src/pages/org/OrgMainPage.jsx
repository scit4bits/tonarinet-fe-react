import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    Typography,
} from "@mui/material";
import {Announcement, CalendarToday, Email, Forum, Language, LocationOn, People, Phone,} from "@mui/icons-material";

export default function OrgMainPage() {
    const {t} = useTranslation();
    const {orgId} = useParams();

    // Mock organization data - replace with actual data fetching
    const organization = {
        id: orgId,
        name: "Sample Organization",
        description:
            "This is a sample organization description. We provide various services and activities for our community members.",
        avatar: "/logo.png",
        location: "Seoul, South Korea",
        phone: "+82-2-1234-5678",
        email: "contact@organization.com",
        website: "https://organization.com",
        memberCount: 150,
        established: "2020-01-15",
        tags: ["Community", "Education", "Volunteer"],
    };

    // Mock notices data - replace with actual data fetching
    const notices = [
        {
            id: 1,
            title: "Welcome to our organization!",
            content: "We are excited to have you join our community...",
            date: "2025-08-25",
            isImportant: true,
        },
        {
            id: 2,
            title: "Monthly meeting scheduled",
            content: "Our monthly meeting will be held on September 15th...",
            date: "2025-08-20",
            isImportant: false,
        },
        {
            id: 3,
            title: "New volunteer program launch",
            content: "We are launching a new volunteer program...",
            date: "2025-08-18",
            isImportant: false,
        },
    ];

    return (
        <Box className="w-full p-6 space-y-6">
            <title>
                {t("pages.organization.main.title", {orgName: organization.name})}
            </title>

            {/* Top Information Section */}
            <Card className="w-full">
                <CardContent className="p-6">
                    <Box className="flex flex-col md:flex-row gap-6">
                        {/* Organization Avatar and Basic Info */}
                        <Box className="flex flex-col items-center md:items-start">
                            <Avatar
                                src={organization.avatar}
                                alt={organization.name}
                                className="w-24 h-24 mb-4"
                            >
                                {organization.name.charAt(0)}
                            </Avatar>
                            <Box className="flex flex-wrap gap-2">
                                {organization.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Organization Details */}
                        <Box className="flex-1 space-y-4">
                            <Box>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    className="font-bold mb-2"
                                >
                                    {organization.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    className="mb-4"
                                >
                                    {organization.description}
                                </Typography>
                            </Box>

                            <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Box className="flex items-center gap-2">
                                    <LocationOn color="primary" fontSize="small"/>
                                    <Typography variant="body2">
                                        {organization.location}
                                    </Typography>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <Phone color="primary" fontSize="small"/>
                                    <Typography variant="body2">{organization.phone}</Typography>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <Email color="primary" fontSize="small"/>
                                    <Typography variant="body2">{organization.email}</Typography>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <Language color="primary" fontSize="small"/>
                                    <Typography variant="body2">
                                        {organization.website}
                                    </Typography>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <People color="primary" fontSize="small"/>
                                    <Typography variant="body2">
                                        {organization.memberCount} members
                                    </Typography>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <CalendarToday color="primary" fontSize="small"/>
                                    <Typography variant="body2">
                                        Est. {organization.established}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Notice Section */}
            <Card className="w-full">
                <CardContent className="p-6">
                    <Box className="flex items-center justify-between mb-4">
                        <Typography
                            variant="h5"
                            component="h2"
                            className="font-semibold flex items-center gap-2"
                        >
                            <Announcement color="primary"/>
                            Notices & Announcements
                        </Typography>
                        <Button variant="outlined" size="small">
                            View All
                        </Button>
                    </Box>

                    <List className="space-y-2">
                        {notices.map((notice, index) => (
                            <Box key={notice.id}>
                                <ListItem className="px-0 items-start">
                                    <ListItemIcon>
                                        {notice.isImportant ? (
                                            <Announcement color="error"/>
                                        ) : (
                                            <Announcement color="action"/>
                                        )}
                                    </ListItemIcon>
                                    <Box className="flex-1">
                                        <Box className="flex items-center gap-2 mb-1">
                                            <Typography
                                                variant="body1"
                                                className={
                                                    notice.isImportant
                                                        ? "font-semibold text-red-600"
                                                        : "font-medium"
                                                }
                                            >
                                                {notice.title}
                                            </Typography>
                                            {notice.isImportant && (
                                                <Chip label="Important" color="error" size="small"/>
                                            )}
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="mb-1"
                                        >
                                            {notice.content}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {notice.date}
                                        </Typography>
                                    </Box>
                                </ListItem>
                                {index < notices.length - 1 && <Divider/>}
                            </Box>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Board Link Section */}
            <Card className="w-full">
                <CardContent className="p-6">
                    <Box className="flex items-center justify-between">
                        <Box>
                            <Typography
                                variant="h5"
                                component="h2"
                                className="font-semibold flex items-center gap-2 mb-2"
                            >
                                <Forum color="primary"/>
                                Community Board
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Join discussions, share ideas, and connect with other members of
                                our community.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            component={Link}
                            to={`/board/organization/${organization.id}`}
                            size="large"
                        >
                            Visit Board
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
