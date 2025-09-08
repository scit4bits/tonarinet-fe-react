import { useEffect, useState, useCallback } from "react";
import { searchArticles } from "../utils/board";
import taxios from "../utils/taxios";

export default function useArticleList(
    _orgId,
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

            const boardIds = await taxios.get("/board");
            let boardId = boardIds.data.find((board)=>board.orgId==_orgId)?.id;

			const data = await searchArticles(
                boardId,
				_category,
				search,
				searchBy,
				page,
				pageSize,
				sortBy,
				sortDirection
			);
			setArticles(data);
		} catch (error) {
			console.error("Failed to fetch counsel articles:", error);
		} finally {
			setLoading(false);
		}
	}, [search, searchBy, page, pageSize, sortBy, sortDirection]);

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
