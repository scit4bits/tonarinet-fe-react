import { useEffect, useState } from "react";
import taxios from "../utils/taxios";
import BoardCard from "../components/BoardCard";
import { useParams } from "react-router";

export default function BoardArticleListPage() {
  const { boardId } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function getArticles() {
      try {
        const response = await taxios.get(`/board/${boardId}`);
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    }

    if (localStorage.getItem("accessToken")) {
      getArticles();
    } else {
      window.location.href = "/signin";
    }
  }, []);

  return (
    <div>
      <h1>Board {boardId}</h1>
      <br />
      <div className="flex gap-5">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr
                key={article.id}
                onClick={() =>
                  (window.location.href = `/board/${boardId}/article/${article.id}`)
                }
              >
                <td>{article.title}</td>
                <td>{article.contents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
