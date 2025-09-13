import taxios from "./taxios";

async function createSubmission(submissionData) {
    try {
        const formData = new FormData();

        const requestPayload = {
            contents: submissionData.contents,
            taskId: submissionData.taskId,
        };

        const requestBlob = new Blob([JSON.stringify(requestPayload)], {
            type: "application/json",
        });

        formData.append("request", requestBlob);

        // Append files
        submissionData.files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await taxios.post(
            `/submission/with-attachments`,
            formData
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create submission:", error);
        throw error;
    }
}

async function getTaskSubmissions(taskId) {
    try {
        const response = await taxios.get(`/submission/task/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch task submissions:", error);
        throw error;
    }
}

export {createSubmission, getTaskSubmissions};
