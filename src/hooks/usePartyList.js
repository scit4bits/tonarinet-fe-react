import {useEffect, useState} from "react";
import taxios from "../utils/taxios";

const usePartyList = (searchBy = "name") => {
    const [parties, setParties] = useState({data: []});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchParties = async (searchTerm = "") => {
        setLoading(true);
        try {
            const response = await taxios.get("/party/search", {
                params: {
                    searchBy,
                    search: searchTerm,
                    page: 0,
                    pageSize: 9999,
                    sortBy: "id",
                    sortDirection: "desc",
                },
            });
            setParties(response.data);
        } catch (error) {
            console.error("Error fetching parties:", error);
            setParties({data: []});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParties(search);
    }, [search, searchBy]);

    return {
        parties,
        loading,
        search,
        setSearch,
        fetchParties,
    };
};

export default usePartyList;
