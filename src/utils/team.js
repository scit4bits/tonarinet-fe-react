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

export { createTeam, getTeamByOrgId };
