import taxios from "./taxios";

async function getMe() {
  try {
    const response = await taxios.get("/user/getMe");
    return response.data;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("accessToken");
    return null;
  }
}

export { getMe };
