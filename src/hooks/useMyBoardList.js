import { useEffect, useState } from "react";
import { getMyAccessibleBoards } from "../utils/board";

export default function useMyBoardList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    getMyAccessibleBoards().then((data) => {
      if (data.length === 0) {
        window.location.href = "/org/list";
      }
      setBoards(data);
    });
  }, []);

  return {
    boards,
  };
}
