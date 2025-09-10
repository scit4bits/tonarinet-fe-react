import taxios from "./taxios";

async function createLiveReport(liveReportData) {
  try {
    const response = await taxios.post("/livereport", liveReportData);
    return response.data;
  } catch (error) {
    console.error("Error creating live report:", error);
    throw error;
  }
}

// Like a live report
async function likeLiveReport(reviewId) {
  try {
    const response = await taxios.post(`/livereport/${reviewId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking live report:", error);
    throw error;
  }
}

export { createLiveReport, likeLiveReport };
