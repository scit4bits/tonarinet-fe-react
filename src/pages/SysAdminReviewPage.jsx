import {
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function SysAdminReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: "id", label: "ID", minWidth: 70 },
    { id: "title", label: "Title", minWidth: 170 },
    { id: "reviewer", label: "Reviewer", minWidth: 120 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "createdAt", label: "Created", minWidth: 120 },
    { id: "actions", label: "Actions", minWidth: 100, align: "right" },
  ];

  useEffect(() => {
    // Fetch reviews data
    const fetchReviews = async () => {
      try {
        // Replace with actual API call
        const data = [
          {
            id: 1,
            title: "Review 1",
            reviewer: "John Doe",
            status: "Pending",
            createdAt: "2023-12-01",
          },
          {
            id: 2,
            title: "Review 2",
            reviewer: "Jane Smith",
            status: "Approved",
            createdAt: "2023-12-02",
          },
        ];
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow hover key={review.id}>
                <TableCell>{review.id}</TableCell>
                <TableCell>{review.title}</TableCell>
                <TableCell>{review.reviewer}</TableCell>
                <TableCell>
                  <Chip
                    label={review.status}
                    color={review.status === "Approved" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{review.createdAt}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
