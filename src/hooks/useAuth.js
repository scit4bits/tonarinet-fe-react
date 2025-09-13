import {useEffect, useState} from "react";
import {getMe} from "../utils/user";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            window.location.href = "/signin";
        }

        async function fetchUser() {
            const data = await getMe();
            if (!data) {
                window.location.href = "/signin";
                return;
            }
            setUser(data);
            setLoading(false);
        }

        fetchUser();
    }, []);

    return {user, loading};
}
