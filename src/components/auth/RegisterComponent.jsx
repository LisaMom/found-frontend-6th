import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserRegisterMutation } from "../../services/authApi";

// Fixed values matching the teacher's example — not collected from the user
const FIXED_ADDRESS = {
  addressLine1: "pp",
  addressLine2: "pp",
  road: "2",
  linkAddress: "R2",
};
const FIXED_PROFILE = "https://i.pinimg.com/originals/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg?nii=t";

export default function RegisterComponent() {
  const navigate = useNavigate();
  const [registerRequest] = useUserRegisterMutation();

  const formSchema = z.object({
    username: z
      .string("Please input username")
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),
    email: z
      .string("Please input email")
      .email({ pattern: z.regexes.html5Email }),
    phoneNumber: z
      .string("Please input phone number")
      .min(8, "Phone number is too short")
      .max(20, "Phone number is too long")
      .regex(/^[0-9+\s-]+$/, { message: "Phone number can only contain digits, spaces, + and -" }),
    password: z.string()
      .min(6, "Atleast 6 letters")
      .max(100, "Atmost 100 letter ")
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string("Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // define useForm
  const { register, handleSubmit,
    formState: { errors } } = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      }
    })

  // custom register logic
  const handleRegisterSubmit = async (data) => {
    const userRegisterRequest = {
      username: data.username,
      phoneNumber: data.phoneNumber,
      address: FIXED_ADDRESS,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      profile: FIXED_PROFILE,
    };

    const result = await registerRequest({ userRegisterRequest });
    if (result.error) {
      console.log("Register failed:", result.error);
      return;
    }
    // registration succeeded — send them to login to sign in with their new account
    navigate("/auth/login", { replace: true });
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full flex items-center justify-center">
        <div className="w-3/4 max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Register</h2>
          <form onSubmit={handleSubmit(handleRegisterSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("username")}
              />
              <p className="text-red-500 text-sm mt-1">{errors?.username && errors.username.message}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email")}
              />
              <p className="text-red-500 text-sm mt-1">{errors?.email && errors.email.message}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("phoneNumber")}
              />
              <p className="text-red-500 text-sm mt-1">{errors?.phoneNumber && errors.phoneNumber.message}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password")}
              />
              <p className="text-red-500 text-sm mt-1">{errors?.password && errors.password.message}</p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("confirmPassword")}
              />
              <p className="text-red-500 text-sm mt-1">{errors?.confirmPassword && errors.confirmPassword.message}</p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign up
            </button>
          </form>


          <button className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Register with Google
          </button>
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}