import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

const useGetOrCreateUser = (tgUser) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!tgUser) {
      setLoading(false);
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    async function syncUser() {
      try {
        setLoading(true);

        // Ism va username tayyorlash (null o'rniga bo'sh string)
        const currentFullname = `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() || "User";
        const currentUsername = tgUser.username || "";

        try {
          // 1. Tekshirish
          const res = await api.get(`/auth/users/${tgUser.id}/`);
          const existingUser = res.data;

          const isChanged = existingUser.fullname !== currentFullname ||
            (existingUser.username || "") !== currentUsername;

          if (isChanged) {
            // 2. Yangilash (PATCH)
            const updateRes = await api.patch(`/auth/users/${tgUser.id}/`, {
              fullname: currentFullname,
              username: currentUsername,
            });
            setUser(updateRes.data);
          } else {
            setUser(existingUser);
          }
        } catch (err) {
          if (err.response?.status === 404) {
            // 3. Yaratish (POST)
            const payload = {
              user_id: tgUser.id,
              fullname: currentFullname,
              username: currentUsername,
              phone: "",
            };
            const createRes = await api.post("/auth/users/", payload);
            setUser(createRes.data);
          } else {
            console.error("API Error details:", err.response?.data);
            throw err;
          }
        }
      } catch (error) {
        console.error("Global Auth Error:", error);
      } finally {
        setLoading(false);
      }
    }

    syncUser();
  }, [tgUser]);

  return { user, loading };
};

export default useGetOrCreateUser;