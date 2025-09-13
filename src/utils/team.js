import taxios from "./taxios";

async function createTeam(teamData) {
    try {
        const response = await taxios.post("/team", teamData);
        return response.data;
    } catch (error) {
        console.error("Error creating team:", error);
    }
}

async function getTeamByOrgId(orgId) {
    try {
        const response = await taxios.get(`/team/organization/${orgId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching teams by org ID:", error);
    }
}

async function searchTeam(
    searchBy = "all",
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "name",
    sortDirection = "asc"
) {
    try {
        const response = await taxios.get(
            `/team/search?searchBy=${searchBy}&search=${search}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
        );
        return response.data;
    } catch (error) {
        console.error("Error searching teams:", error);
    }
}

export {createTeam, getTeamByOrgId, searchTeam};
