function signOut() {
  localStorage.removeItem("accessToken");
  window.location.href = "/";
}

export { signOut };
