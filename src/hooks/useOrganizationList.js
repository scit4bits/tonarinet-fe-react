import { useEffect, useState } from "react";
import { searchOrganizations } from "../utils/organization";

export default function useOrganizationList(
  _searchBy = "all",
  _search = "",
  _page = 0,
  _pageSize = 10,
  _sortBy = "all",
  _sortDirection = "asc"
) {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchBy, setSearchBy] = useState(_searchBy);
  const [search, setSearch] = useState(_search);
  const [page, setPage] = useState(_page);
  const [pageSize, setPageSize] = useState(_pageSize);
  const [sortBy, setSortBy] = useState(_sortBy);
  const [sortDirection, setSortDirection] = useState(_sortDirection);

  async function refresh() {
    setLoading(true);
    const data = await searchOrganizations(
      searchBy,
      search,
      page,
      pageSize,
      sortBy,
      sortDirection
    );
    setOrganizations(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [search, searchBy, page, pageSize, sortBy, sortDirection]);

  return {
    organizations,
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
