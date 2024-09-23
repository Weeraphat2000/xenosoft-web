import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../util/token";
import { getMe } from "../api/user/user";
import { setUser } from "../util/redux/user";
import { useDispatch } from "react-redux";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = getToken();
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMe = async () => {
    try {
      const result = await getMe();
      dispatch(setUser(result.data));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      navigate("/login");
    }
  }, [token, navigate, fetchMe]);

  if (!token) {
    return <div>Redirecting...</div>;
  }

  return <div>{children}</div>;
}

export default AuthGuard;
