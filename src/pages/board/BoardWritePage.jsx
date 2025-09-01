import { useTranslation } from "react-i18next";

export default function BoardWritePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center p-6 bg-pink-100 min-h-screen w-[1000px]">
      <title>{t("pages.board.write.title")}</title>
      <h1 className="text-3xl font-bold mb-6">게시글 작성</h1>

      <form className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
        {/* 제목 입력 */}
        <div className="flex flex-col mb-4">
          <label className="font-semibold mb-1">닉네임</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* 게시판 선택 & 기능 버튼 */}
        <div className="flex items-center gap-2 mb-2">
          <select className="border border-gray-300 rounded px-2 py-1">
            <option>게시판을 선택하세요</option>
          </select>
          <button type="button" className="bg-yellow-100 px-3 py-1 rounded">
            이모티콘
          </button>
          <button type="button" className="bg-yellow-100 px-3 py-1 rounded">
            차트
          </button>
          <button type="button" className="bg-yellow-100 px-3 py-1 rounded">
            투표
          </button>
        </div>

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
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </button>
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
