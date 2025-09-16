import { useEffect, useState } from "react";
import taxios from "../utils/taxios";

export default function useCountryList() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCountries() {
    try {
      setLoading(true);
      setError(null);
      const response = await taxios.get("/country");
      setCountries(response.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError(err);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countries,
    loading,
    error,
    refresh: fetchCountries,
  };
}
