import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { auth, googleProvider } from "../firebase/config";
import { saveUserToFirestore } from "../../services/userService";
import { useAppSelector } from "../../lib/hook";

export default function GoogleLoginComponent({ buttonText }) {
  const [pending, setIsPending] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsPending(true);
    try {
      if (user) {
        await signOut(auth);
        toast.info("Logged out successfully!");
        navigate("/auth/login");
        return;
      }

      const res = await signInWithPopup(auth, googleProvider);
      if (!res?.user) {
        throw new Error("Google login failed");
      }

      // Store Google user details in Cloud Firestore
      await saveUserToFirestore(res.user, {
        authProvider: "google",
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
      });

      toast.success(`Welcome, ${res.user.displayName || "Google User"}!`);
      navigate("/");
    } catch (err) {
      console.error("Google Auth error:", err);
      toast.error(err.message || "Google authentication failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      className="w-full mt-4 border border-gray-300 py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm transition hover:scale-[1.01] cursor-pointer"
      onClick={handleGoogleAuth}
      disabled={pending}
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span>
        {pending
          ? "Connecting..."
          : user
          ? "Sign out of Google"
          : buttonText || "Continue with Google"}
      </span>
    </button>
  );
}