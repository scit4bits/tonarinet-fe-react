import { useEffect, useState } from "react";
import { fetchUsers, searchOrgMembers, searchUsers } from "../utils/user";

export default function useOrgMemberList(
  orgId,
  _searchBy = "all",
  _search = "",
  _page = 0,
  _pageSize = 10,
  _sortBy = "id",
  _sortDirection = "asc"
) {
  const [users, setUsers] = useState([]);
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
      const data = await searchOrgMembers(
        orgId,
        search,
        searchBy,
        page,
        pageSize,
        sortBy,
        sortDirection
      );
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [search, searchBy, page, pageSize, sortBy, sortDirection]);

  return {
    users,
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
