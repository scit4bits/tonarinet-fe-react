import taxios from "./taxios";

async function getArticleInformation(articleId) {
    try {
        const response = await taxios.get(`/article/${articleId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching article information:", error);
        return null;
    }
}

async function increaseViewCount(articleId) {
    try {
        const response = await taxios.get(`/article/${articleId}/view`);
        return response.data;
    } catch (error) {
        console.error("Error increasing view count:", error);
        return null;
    }
}

async function toggleArticleLike(articleId) {
    try {
        const response = await taxios.post(`/like/${articleId}/toggle`);
        return response.data;
    } catch (error) {
        console.error("Error liking the article:", error);
        return null;
    }
}

export {getArticleInformation, increaseViewCount, toggleArticleLike};
