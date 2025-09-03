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

async function searchUsers(
	search = "",
	searchBy = "all",
	page = 1,
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

export { getMe, setUserAdmin, fetchUsers, searchUsers };
