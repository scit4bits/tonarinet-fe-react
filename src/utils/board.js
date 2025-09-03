import taxios from "./taxios";

function getLastVisitedBoard() {
  const lastVisitedBoard = localStorage.getItem("lastVisitedBoard");
  return lastVisitedBoard ?? null;
}

function setLastVisitedBoard(boardId) {
  localStorage.setItem("lastVisitedBoard", boardId);
}

async function getMyAccessibleBoards() {
  try {
    const response = await taxios.get("/board");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getBoardInformation(boardId) {
  try {
    const response = await taxios.get(`/board/${boardId}/info`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function searchArticles(
  boardId,
  category = "all",
  searchBy = "all",
  search = "",
  page = 0,
  pageSize = 10,
  sortBy = "created",
  sortDirection = "desc"
) {
  try {
    const response = await taxios.get(
      `/board/${boardId}/articles?category=${category}&searchBy=${searchBy}&search=${search}&sortBy=${sortBy}&sortDirection=${sortDirection}&page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getBoardHotArticles(boardId, page = 0, pageSize = 10) {
  try {
    const response = await taxios.get(
      `/board/${boardId}/hotarticles?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function writeArticle(boardId, form) {
  try {
    const formData = new FormData();

    for (const file of form.files) {
      formData.append("files", file);
    }

    const request = {
      title: form.title,
      content: form.content,
      tags: form.tags,
      category: form.category,
    };

    const requestBlob = new Blob([JSON.stringify(request)], {
      type: "application/json",
    });

    formData.append("request", requestBlob);

    const response = await taxios.post(`/board/${boardId}/write`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  getLastVisitedBoard,
  setLastVisitedBoard,
  getMyAccessibleBoards,
  getBoardInformation,
  searchArticles,
  getBoardHotArticles,
  writeArticle,
};
