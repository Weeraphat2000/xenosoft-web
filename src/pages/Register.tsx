import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerApi } from "../api/user/user";
import { useDispatch } from "react-redux";
import { setToken } from "../util/token";
import { setUser } from "../util/redux/user";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .matches(/^[A-Za-z]/, "Username must start with a letter"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("กรุณายืนยันรหัสผ่าน")
    .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน"),
});

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, register, formState } = methods;

  const submit = handleSubmit(async (data) => {
    try {
      const result = await registerApi(data);

      setToken(result.data.token);
      dispatch(setUser(result.data.user));
      navigate("/");
      toast.success("Register success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Register</h1>
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
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="border border-gray-300 p-2 m-2 rounded-md"
        />
        <p
          className="text-red-500"
          style={{ display: formState.errors.password ? "block" : "none" }}
        >
          {formState.errors.password?.message}
        </p>
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className="border border-gray-300 p-2 m-2 rounded-md"
        />
        <p
          className="text-red-500"
          style={{
            display: formState.errors.confirmPassword ? "block" : "none",
          }}
        >
          {formState.errors.confirmPassword?.message}
        </p>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 m-2 rounded-md"
          >
            Register
          </button>
          <Link to="/login" className="m-2">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
