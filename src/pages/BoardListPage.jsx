import { useEffect, useState } from "react";
import taxios from "../utils/taxios";
import BoardCard from "../components/BoardCard";

export default function BoardListPage() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    async function getAccessibleBoards() {
      try {
        const response = await taxios.get("/board");
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    }

    if (localStorage.getItem("accessToken")) {
      getAccessibleBoards();
    } else {
      window.location.href = "/signin";
    }
  }, []);

  const handleBoardClick = (boardId) => {
    window.location.href = `/board/${boardId}`;
  };

  return (
    <div>
      <h1>Board List</h1>
      <br />
      <div className="flex gap-5">
        {boards.map((board) => (
          <BoardCard
            className="w-[500px]"
            key={board.id}
            title={board.title}
            description={board.description}
            onClick={() => handleBoardClick(board.id)}
          />
        ))}
      </div>
    </div>
  );
}
