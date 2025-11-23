import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const TrainerPrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["volunteerUser", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await axios.get(
        `https://pawfect-server-beige.vercel.app/users/${user.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  if (loading || userLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && userData?.role === "volunteer") {
    return children;
  }

  return (
    <Navigate to="/trainer-login" state={{ from: location }} replace></Navigate>
  );
};

export default TrainerPrivateRoute;
