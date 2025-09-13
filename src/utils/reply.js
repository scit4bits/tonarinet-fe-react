import taxios from "./taxios";

async function addReplyToArticle(articleId, contents) {
    try {
        const payload = {
            articleId,
            contents,
        };
        const response = await taxios.post(`/reply`, payload);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getRepliesOfArticle(articleId) {
    try {
        const response = await taxios.get(`/reply/article/${articleId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export {addReplyToArticle, getRepliesOfArticle};
