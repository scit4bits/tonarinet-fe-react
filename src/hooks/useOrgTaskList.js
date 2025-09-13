import {useEffect, useState} from "react";
import {searchOrgTasks} from "../utils/task";

export default function useOrgTaskList(
    orgId,
    _searchBy = "all",
    _search = "",
    _page = 0,
    _pageSize = 10,
    _sortBy = "id",
    _sortDirection = "asc"
) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(_search);
    const [searchBy, setSearchBy] = useState(_searchBy);
    const [page, setPage] = useState(_page);
    const [pageSize, setPageSize] = useState(_pageSize);
    const [sortBy, setSortBy] = useState(_sortBy);
    const [sortDirection, setSortDirection] = useState(_sortDirection);

    async function refresh() {
        try {
            setLoading(true);
            const data = await searchOrgTasks(
                orgId,
                search,
                searchBy,
                page,
                pageSize,
                sortBy,
                sortDirection
            );
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, [search, searchBy, page, pageSize, sortBy, sortDirection]);

    return {
        tasks,
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
