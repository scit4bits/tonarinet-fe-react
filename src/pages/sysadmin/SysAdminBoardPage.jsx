import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SysAdminBoardPage() {
  const { t } = useTranslation();
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleBoardChange = (event) => {
    setSelectedBoard(event.target.value);
    // Fetch articles for selected board
    fetchArticles(event.target.value);
  };

  const fetchArticles = async (boardId) => {
    if (!boardId) return;
    setLoading(true);
    try {
      setArticles([
        { id: 1, title: "Article 1", author: "Admin", createdAt: "2024-01-01" },
        { id: 2, title: "Article 2", author: "Admin", createdAt: "2024-01-02" },
        { id: 3, title: "Article 3", author: "Admin", createdAt: "2024-01-03" },
      ]);
      // Replace with your API call
      // const response = await api.getArticles(boardId);
      // setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch boards on component mount
    const fetchBoards = async () => {
      try {
        setBoards([
          { id: 1, name: "Board 1" },
          { id: 2, name: "Board 2" },
          { id: 3, name: "Board 3" },
        ]);
        // Replace with your API call
        // const response = await api.getBoards();
        // setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchBoards();
  }, []);

  const handleArticleClick = (article) => {
    setEditingArticle(article);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingArticle(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <title>{t("pages.sysAdmin.boards.title")}</title>
      <Typography variant="h4" component="h1" gutterBottom>
        System Admin Board Management
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          select
          label="Select Board"
          value={selectedBoard}
          onChange={handleBoardChange}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>Select a board</em>
          </MenuItem>
          {boards.map((board) => (
            <MenuItem key={board.id} value={board.id}>
              {board.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {selectedBoard && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Articles
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {articles.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No articles found" />
                </ListItem>
              ) : (
                articles.map((article) => (
                  <ListItem
                    key={article.id}
                    divider
                    button
                    onClick={() => handleArticleClick(article)}
                    sx={{ cursor: "pointer" }}
                  >
                    <ListItemText
                      primary={article.title}
                      secondary={`Author: ${article.author} | Date: ${new Date(
                        article.createdAt
                      ).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Paper>
      )}

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Article</DialogTitle>
        <DialogContent>
          {editingArticle && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                defaultValue={editingArticle.title}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={8}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseEditDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
