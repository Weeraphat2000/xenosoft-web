import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import * as Icon from "@mui/icons-material";
import { loginApi } from "../api/user/user";
import { setToken } from "../util/token";
import { useDispatch } from "react-redux";
import { setUser } from "../util/redux/user";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .matches(/^[A-Za-z]/, "Username must start with a letter"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { handleSubmit, register, formState } = methods;

  const submit = handleSubmit(async (datas) => {
    try {
      const { data } = await loginApi(datas);
      setToken(data.token);
      dispatch(setUser(data.user));
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  });

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold">Login</h1>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={submit}
        >
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="border border-gray-300 p-2 m-2 rounded-md"
          />
          <p
            className="text-red-500"
            style={{ display: formState.errors.username ? "block" : "none" }}
          >
            {formState.errors.username?.message}
          </p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="border border-gray-300 p-2 m-2 rounded-md"
            />
            <button
              type="button"
              className="absolute top-4 right-4"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Icon.VisibilityOff className="text-gray-500" />
              ) : (
                <Icon.Visibility className="text-gray-500" />
              )}
            </button>
          </div>
          <p
            className="text-red-500"
            style={{ display: formState.errors.password ? "block" : "none" }}
          >
            {formState.errors.password?.message}
          </p>

          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 m-2 rounded-md"
            >
              Login
            </button>
            <Link to="/register" className="m-2">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
