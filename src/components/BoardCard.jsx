import {Card, CardContent, Typography} from "@mui/material";

export default function BoardCard({title, description, onClick}) {
    return (
        <Card onClick={onClick} className="w-[300px] bg-blue-100 cursor-pointer">
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}
