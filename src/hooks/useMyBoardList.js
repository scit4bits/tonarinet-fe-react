import { useEffect, useState } from "react";
import { getMyAccessibleBoards } from "../utils/board";

export default function useMyBoardList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    getMyAccessibleBoards().then((data) => {
      setBoards(data);
    });
  }, []);

  return {
    boards,
  };
}
