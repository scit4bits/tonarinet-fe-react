import taxios from "../utils/taxios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CountryData from "../data/country.json";
import { useTranslation } from "react-i18next";

export default function AuthTestPage({}) {
  const [t, i18n] = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUserData() {
      const response = await taxios.get("/user/getMe");
      if (response.status === 200) {
        setUser(response.data);
      } else {
        console.error("Failed to fetch user data");
      }
    }
    getUserData();
  }, []);

  return (
    <div className="text-left">
      <p>{user?.name || "NO!!!"}</p>
    </div>
  );
}
