import taxios from "./taxios";

async function getMyOrganizations() {
  try {
    const response = await taxios.get("/organization/my");
    return response.data;
  } catch (error) {
    console.error("Error fetching my organizations:", error);
    return null;
  }
}

async function searchOrganizations(
  searchBy = "all",
  search = "",
  page = 1,
  pageSize = 10,
  sortBy = "all",
  sortDirection = "asc"
) {
  const response = await taxios.get(
    `/organization/search?searchBy=${searchBy}&search=${encodeURIComponent(
      search
    )}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
  );
  return response.data;
}

async function applyToOrganization(organizationId) {
  const response = await taxios.post(
    `/organization/apply?organizationId=${organizationId}`
  );
  return response.data;
}

async function createOrganization(name, countryCode, type) {
  const response = await taxios.post(`/organization/create`, {
    name,
    countryCode,
    type,
  });
  return response.data;
}

async function updateOrganization(
  id,
  name,
  countryCode,
  type,
  description = null
) {
  const response = await taxios.post(`/organization/update`, {
    id,
    name,
    description,
    countryCode,
    type,
  });
  return response.data;
}

export {
  getMyOrganizations,
  searchOrganizations,
  applyToOrganization,
  createOrganization,
  updateOrganization,
};
