import taxios from "./taxios";

// Fetch town reviews for a specific region
async function fetchTownReviewsByRegion(regionId) {
  try {
    const response = await taxios.get(`/townreview/region/${regionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching town reviews:", error);
    throw error;
  }
}

// Create a new town review
async function createTownReview(townReviewData) {
  try {
    const response = await taxios.post("/townreview", townReviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating town review:", error);
    throw error;
  }
}

export { fetchTownReviewsByRegion, createTownReview };
