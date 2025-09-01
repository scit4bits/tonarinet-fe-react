import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import taxios from "../../utils/taxios";
import BoardCard from "../../components/BoardCard";
import { Card, CardContent, Container, Grid, Typography } from "@mui/material";

export default function BoardListPage() {
  const { t } = useTranslation();
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    async function getAccessibleBoards() {
      try {
        const response = await taxios.get("/board");
        setBoards([...response.data]);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    }

    if (localStorage.getItem("accessToken")) {
      getAccessibleBoards();
    } else {
      window.location.replace("/signin");
    }
  }, []);

  const handleBoardClick = (boardId) => {
    window.location.href = `/board/${boardId}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <title>{t("pages.board.list.title")}</title>
      <Typography variant="h3" component="h1" gutterBottom>
        Board List
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {boards.map((board) => (
          <Card
            key={board.id}
            sx={{
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              transition: "box-shadow 0.3s",
              width: { xs: "100%", sm: "300px", md: "300px" },
            }}
            onClick={() => handleBoardClick(board.id)}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {board.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {board.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
