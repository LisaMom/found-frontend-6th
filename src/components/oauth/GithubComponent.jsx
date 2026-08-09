import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { auth, githubProvider } from "../firebase/config";
import { saveUserToFirestore } from "../../services/userService";

export default function GithubLoginComponent() {
  const [pending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const loginWithGithub = async () => {
    setIsPending(true);
    try {
      const res = await signInWithPopup(auth, githubProvider);
      if (!res?.user) {
        throw new Error("GitHub login failed");
      }

      await saveUserToFirestore(res.user, {
        authProvider: "github",
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
      });

      toast.success(`Welcome, ${res.user.displayName || "GitHub User"}!`);
      navigate("/");
    } catch (err) {
      console.error("GitHub Auth error:", err);
      let errorMsg = err.message || "GitHub authentication failed";
      if (err.code === "auth/unauthorized-domain") {
        errorMsg = `Domain '${window.location.hostname}' is not authorized. Please add '${window.location.hostname}' to Firebase Console -> Authentication -> Settings -> Authorized domains.`;
      }
      toast.error(errorMsg, { autoClose: 7000 });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      className="w-full mt-3 border border-gray-300 py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm transition hover:scale-[1.01] cursor-pointer"
      onClick={loginWithGithub}
      disabled={pending}
    >
      <img
        src="https://www.svgrepo.com/show/512317/github-142.svg"
        alt="GitHub"
        className="w-5 h-5"
      />
      <span>{pending ? "Connecting..." : "Continue with GitHub"}</span>
    </button>
  );
}