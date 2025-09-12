import { useEffect, useState, useCallback } from "react";
import taxios from "../utils/taxios";

export default function useArticleListByBoardId(
  _boardId,
  _category,
  _searchBy = "all",
  _search = "",
  _page = 0,
  _pageSize = 10,
  _sortBy = "id",
  _sortDirection = "asc"
) {
  const [articles, setArticles] = useState({ data: [], totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(_search);
  const [searchBy, setSearchBy] = useState(_searchBy);
  const [page, setPage] = useState(_page);
  const [pageSize, setPageSize] = useState(_pageSize);
  const [sortBy, setSortBy] = useState(_sortBy);
  const [sortDirection, setSortDirection] = useState(_sortDirection);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);

      // API endpoint for board-based articles
      const params = new URLSearchParams();
      if (_category) params.append("category", _category);
      if (search) params.append("search", search);
      if (searchBy !== "all") params.append("searchBy", searchBy);
      params.append("page", page);
      params.append("pageSize", pageSize);
      params.append("sortBy", sortBy);
      params.append("sortDirection", sortDirection);

      const response = await taxios.get(
        `/board/${_boardId}/articles?${params}`
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Failed to fetch board articles:", error);
      setArticles({ data: [], totalElements: 0 });
    } finally {
      setLoading(false);
    }
  }, [
    _boardId,
    _category,
    search,
    searchBy,
    page,
    pageSize,
    sortBy,
    sortDirection,
  ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    articles,
    loading,
    search,
    setSearch,
    searchBy,
    setSearchBy,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    refresh,
  };
}
