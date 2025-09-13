import {useState} from "react";
import {getBoardInformation} from "../utils/board";

export default function useBoardInfo(boardId) {
    const [boardInfo, setBoardInfo] = useState(null);

    useEffect(() => {
        getBoardInformation(boardId).then((data) => {
            setBoardInfo(data);
        });
    }, [boardId]);

    return boardInfo;
}
