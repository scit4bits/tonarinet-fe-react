import taxios from "./taxios";

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

export { getTaskById, createTask };
