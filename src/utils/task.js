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

async function checkTaskManagementEligibility(taskId) {
    try {
        const response = await taxios.get(`/task/${taskId}/canmgmt`);
        return response.data;
    } catch (error) {
        console.error("Error checking task management eligibility:", error);
        throw error;
    }
}

async function updateTaskScore(taskId, score, feedback = null) {
    try {
        const requestBody = {score};
        if (feedback !== null) {
            requestBody.feedback = feedback;
        }
        const response = await taxios.patch(`/task/${taskId}/score`, requestBody);
        return response.data;
    } catch (error) {
        console.error("Error updating task score:", error);
        throw error;
    }
}

async function getAITaskRecommendation(prompt) {
    try {
        const response = await taxios.post("/task/ai-recommend", {prompt}); // Assuming the prompt is sent as plain text
        return response.data;
    } catch (error) {
        console.error("Error getting AI task recommendation:", error);
        throw error;
    }
}

export {
    getTaskById,
    createTask,
    searchOrgTasks,
    getTaskGroupById,
    checkTaskManagementEligibility,
    updateTaskScore,
    getAITaskRecommendation,
};
