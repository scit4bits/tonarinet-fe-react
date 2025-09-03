import taxios from "./taxios";

async function getMe() {
  try {
    const response = await taxios.get("/user/getMe");
    return response.data;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("accessToken");
    return null;
  }
}

async function setUserAdmin(userId) {
  try {
    const response = await taxios.get(`/user/toggleAdmin?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error setting user admin status:", error);
  }
}

async function toggleUserGrant(userId, orgId) {
  try {
    const response = await taxios.get(
      `/user/toggleGrant?userId=${userId}&orgId=${orgId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling user granted status:", error);
  }
}

async function changeUserRole(userId, orgId, newRole) {
  try {
    const response = await taxios.get(
      `/user/changeRole?userId=${userId}&orgId=${orgId}&newRole=${newRole}`
    );
    return response.data;
  } catch (error) {
    console.error("Error changing user role:", error);
  }
}

async function fetchUsers() {
  try {
    const response = await taxios.get("/user/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

async function searchUsers(
  search = "",
  searchBy = "all",
  page = 0,
  pageSize = 10,
  sortBy = "all",
  sortDirection = "asc"
) {
  try {
    const response = await taxios.get(
      `/user/search?searchBy=${searchBy}&search=${encodeURIComponent(
        search
      )}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
  }
}

async function searchOrgMembers(
  orgId,
  search = "",
  searchBy = "all",
  page = 0,
  pageSize = 10,
  sortBy = "all",
  sortDirection = "asc"
) {
  try {
    const response = await taxios.get(
      `/user/searchWithOrg?orgId=${orgId}&searchBy=${searchBy}&search=${encodeURIComponent(
        search
      )}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching organization members:", error);
  }
}

export {
  getMe,
  setUserAdmin,
  toggleUserGrant,
  changeUserRole,
  fetchUsers,
  searchUsers,
  searchOrgMembers,
};
