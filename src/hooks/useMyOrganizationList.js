import { useEffect, useState } from "react";
import taxios from "../utils/taxios";

export default function useMyOrganizationList() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrganizations = async () => {
      try {
        setLoading(true);
        const response = await taxios.get("/organization/my");
        setOrganizations(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch my organizations:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrganizations();
  }, []);

  return {
    organizations,
    loading,
    error,
  };
}
