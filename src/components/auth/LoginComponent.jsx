import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase/config";
import { saveUserToFirestore } from "../../services/userService";
import GoogleLoginComponent from "../oauth/GoogleComponent";

export default function LoginComponent() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .min(1, "Please input email")
      .email("Please enter a valid email address"),
    password: z.string().min(1, "Please input password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Sync Firestore profile
      await saveUserToFirestore(user, {
        authProvider: "email",
      });

      toast.success("Log in successful!");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      let errorMsg = "Incorrect email or password!";
      if (err.code === "auth/operation-not-allowed") {
        errorMsg = "Email/Password sign-in is disabled in your Firebase Console. Please enable 'Email/Password' under Authentication -> Sign-in method in Firebase Console.";
      } else if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        errorMsg = "Invalid email or password. Please check your credentials.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Please try again later.";
      }
      toast.error(errorMsg, { autoClose: 6000 });
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex box-border justify-center items-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl flex max-w-4xl p-6 md:p-10 shadow-xl items-center border border-gray-100">
        <div className="md:w-1/2 px-4 md:px-8 w-full">
          <h2 className="font-bold text-3xl text-[#002D74]">Sign In</h2>
          <p className="text-sm mt-3 text-gray-600">
            Welcome back! Sign in with your registered email.
          </p>

          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="flex flex-col gap-4 mt-6"
          >
            <div>
              <input
                className="p-3 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                type="email"
                placeholder="Real Email Address"
                {...register("email")}
              />
              {errors?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                className="p-3 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}

            <button
              className="bg-[#002D74] text-white py-3 rounded-xl hover:bg-[#206ab1] font-semibold transition cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-medium">Or</span>
            </div>
          </div>

          <GoogleLoginComponent buttonText="Login with Google" />

          <div className="mt-6 text-sm flex justify-between items-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">Don't have an account?</p>
            <Link
              to="/auth/register"
              className="text-[#002D74] font-semibold hover:underline border border-[#002D74] rounded-xl px-4 py-2 hover:bg-[#002D74] hover:text-white transition"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="md:block hidden w-1/2 p-4">
          <img
            className="rounded-2xl object-cover h-[450px] w-full"
            src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="login visual"
          />
        </div>
      </div>
    </section>
  );
}
