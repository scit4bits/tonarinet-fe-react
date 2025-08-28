import taxios from "./taxios";

async function getMyNotification() {
  try {
    const response = await taxios.get("/noti/my");
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getMyNotification };
