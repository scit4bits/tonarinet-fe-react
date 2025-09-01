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

async function fetchUsers() {
  try {
    const response = await taxios.get("/user/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export { getMe, setUserAdmin, fetchUsers };
