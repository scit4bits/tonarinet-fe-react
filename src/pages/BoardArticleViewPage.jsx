import { useParams } from "react-router";
import { useState } from "react";

export default function BoardArticleViewPage() {
  const { articleId } = useParams();
  const [schoolName, setSchoolName] = useState("학교이름");
  const [title, setTitle] = useState("제목");
  const [likes, setLikes] = useState(7);
  const [reply, setReply] = useState(["댓글", "댓글", "댓글", "댓글"]);
  const [writer, setWriter] = useState("닉네임");
  const [createdAt, setCreatedAt] = useState("2025.08.26 15:27");
  const [viewCount, setViewCount] = useState("55");
  const [contents, setContents] = useState("내용");

  return (
    <div className="min-h-screen bg-pink-100 flex justify-center items-center p-6 m-8 rounded-4xl">
      {/* 고정 크기 박스 */}
      <div className="bg-white rounded-xl shadow p-6 w-[1000px] h-[1200px] overflow-y-auto">
        {/* 상단 제목 */}
        <div className="border-b border-gray-300 pb-2 mb-4 text-left">
          <h1 className="text-3xl font-bold">{schoolName}</h1>
          <p className="text-lg mt-1">{title}</p>

          {/* 글쓴이/날짜 + 조회/추천/댓글 */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>
              {writer} | {createdAt}
            </span>
            <span>
              조회 {viewCount} | 추천 {likes} | 댓글 {reply.length}
            </span>
          </div>
        </div>

        {/* 본문 */}
        <div className="h-60 flex items-start justify-start bg-gray-100 rounded mb-4">
          <span className="text-gray-600 text-xl font-semibold">{contents}</span>
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center justify-between text-gray-600 text-sm mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setLikes(likes + 1)} className="flex items-center space-x-1">
              <span>👍</span> <span>{likes}</span>
            </button>
            <div className="flex items-center space-x-1">
              <span>💬</span> <span>{reply.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>🔗공유</span>
            <span>⚠️신고</span>
          </div>
        </div>

        {/* 댓글 헤더 */}
        <div className="bg-purple-100 p-3 rounded-lg mb-4 text-left">
          <p className="text-sm text-purple-700 font-semibold">댓글 {reply.length}</p>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-3 mb-6">
          {reply.map((c, i) => (
            <div key={i} className="bg-purple-200 p-2 rounded flex justify-between items-center">
              <span className="text-sm">{c}</span>
              <div className="space-x-2 text-xs text-blue-700">
                <button>삭제</button>
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="flex items-center border-t pt-4">
          <input type="text" placeholder="댓글입력" className="flex-1 border rounded px-3 py-2 text-sm" />
          <button className="ml-2 bg-purple-500 text-white px-4 py-2 rounded">➤</button>
        </div>
      </div>
    </div>
  );
}
