import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../utils/axios";
import Loader from "../components/ui/Loader";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Google login failed. Please try again.");
        navigate("/login");
        return;
      }

      if (!accessToken || !refreshToken) {
        toast.error("Authentication failed");
        navigate("/login");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      try {
        const res = await api.get("/auth/me");
        const user = res.data.user;
        setAuth(user, accessToken, refreshToken);
        toast.success(`Welcome, ${user.name}! 🎉`);

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/auctions");
        }
      } catch {
        toast.error("Authentication failed");
        navigate("/login");
      }
    };

    handleCallback();
  }, []);

  return <Loader fullScreen />;
};

export default AuthCallback;