import taxios from "./taxios";

async function getMyNotification() {
  try {
    const response = await taxios.get("/notification/my");
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function readOneNotification(notiId) {
  try {
    const response = await taxios.get(`/notification/read?notiId=${notiId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function readAllNotification() {
  try {
    const response = await taxios.get("/notification/readall");
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getMyNotification, readOneNotification, readAllNotification };
