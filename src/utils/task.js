import taxios from "./taxios";

async function getTaskGroupById(taskgroupId) {
  try {
    const response = await taxios.get(`/task/taskgroup/${taskgroupId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task group:", error);
    throw error;
  }
}

async function getTaskById(taskId) {
  try {
    const response = await taxios.get(`/task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
}

async function createTask(taskData) {
  try {
    const response = await taxios.post("/task", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

async function searchOrgTasks(
  orgId,
  search = "",
  searchBy = "all",
  page = 0,
  pageSize = 10,
  sortBy = "id",
  sortDirection = "asc"
) {
  try {
    const response = await taxios.get(
      `/task/search?orgId=${orgId}&searchBy=${searchBy}&search=${encodeURIComponent(
        search
      )}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching organization tasks:", error);
    throw error;
  }
}

export { getTaskById, createTask, searchOrgTasks, getTaskGroupById };
