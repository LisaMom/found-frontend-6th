import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase/config";
import { saveUserToFirestore } from "../../services/userService";
import GoogleLoginComponent from "../oauth/GoogleComponent";
import GithubLoginComponent from "../oauth/GithubComponent";

export default function RegisterComponent() {
  const navigate = useNavigate();

  const formSchema = z
    .object({
      username: z
        .string("Please input username")
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be at most 50 characters"),
      email: z
        .string()
        .min(1, "Please input email")
        .email("Please enter a valid email address"),
      phoneNumber: z
        .string()
        .optional(),
      password: z
        .string()
        .min(6, "At least 6 characters")
        .max(100, "At most 100 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegisterSubmit = async (data) => {
    try {
      // 1. Create account with real email in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 2. Generate Google-styled avatar URL
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.username
      )}&background=1a73e8&color=fff&bold=true&size=128`;

      // 3. Update Firebase profile
      await updateProfile(user, {
        displayName: data.username,
        photoURL: avatarUrl,
      });

      // 4. Save email and user metadata into Cloud Firestore `users` collection
      await saveUserToFirestore(user, {
        displayName: data.username,
        photoURL: avatarUrl,
        phoneNumber: data.phoneNumber || "",
        authProvider: "email",
      });

      toast.success("Account created successfully with real email!");
      
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Firebase Registration Error:", err);
      let errorMsg = err.message;
      if (err.code === "auth/operation-not-allowed") {
        errorMsg = "Email/Password sign-in is currently disabled in your Firebase Console. Please enable 'Email/Password' in Firebase Console -> Authentication -> Sign-in method.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "This email address is already registered. Please login.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Invalid email address format.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Password is too weak (min 6 characters).";
      }
      toast.error(errorMsg, { autoClose: 6000 });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Register with your real email address
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegisterSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register("username")}
            />
            {errors?.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Real Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register("email")}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="+123456789"
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register("phoneNumber")}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register("password")}
            />
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Registering..." : "Sign up"}
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

        <GoogleLoginComponent buttonText="Register with Google" />
        <GithubLoginComponent />

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}