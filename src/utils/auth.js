import taxios from "./taxios";

function signOut() {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
}

async function checkEmailDup(email) {
    try {
        const response = await taxios.get(`/auth/emaildupcheck?email=${email}`);
        return response.data;
    } catch (error) {
        console.error("Error checking email duplication:", error);
        return false;
    }
}

export {signOut, checkEmailDup};
