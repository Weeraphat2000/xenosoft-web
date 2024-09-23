import React, { useEffect } from "react";

import { getToken } from "../util/token";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/user/user";
import { useDispatch } from "react-redux";
import { setUser } from "../util/redux/user";

function Guard({ children }: { children: React.ReactNode }) {
  const path = window.location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();

  const fetchMe = async () => {
    try {
      const result = await getMe();

      dispatch(setUser(result.data));

      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      navigate(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{children}</div>;
}

export default Guard;
