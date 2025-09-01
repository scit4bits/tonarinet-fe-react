import {useState} from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

export default function BoardWritePage() {
  const { t } = useTranslation();               // 언어 설정
  // const [category, setCategory] = useState(""); // 선택한 카테고리 저장
  // const { boardName } = useParams();
  const [tags, setTags] = useState([]); // 선택한 태그 저장

  return (
    <div className="flex flex-col items-center p-6 bg-pink-100 min-h-screen w-[1000px]">
      <title>{t("pages.board.write.title")}</title>
      <h1 className="text-3xl font-bold mb-6">게시글 작성</h1>

      <form className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
        {/* 게시판 이름 표시
        <input
          type="text"
          value={boardName || "게시판 이름 없음"}
          className="border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
          readOnly
        /> */}

      {/* 게시글 카테고리 선택 */}
      {/* <div className="flex flex-col mb-4">
        <label className="font-semibold mb-1">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="">카테고리를 선택하세요</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div> */}

        {/* 내용 입력 */}
        <div className="mb-4">
          <textarea
            placeholder="내용을 입력하세요"
            className="w-full border border-gray-300 rounded px-2 py-2 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
          ></textarea>
        </div>

        {/* 파일첨부 / 버튼 */}
        <div className="flex items-center justify-between mb-4">
          {/* 파일첨부 */}
          <input type="file" className="text-sm text-gray-500" />

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-pink-200 rounded hover:bg-pink-300"
            >
              등록
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
