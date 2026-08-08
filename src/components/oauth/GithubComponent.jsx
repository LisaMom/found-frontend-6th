import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import auth from "../firebase/config";
import {
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export default function GithubLoginComponent() {
  const [error, setError] = useState(null);
  const [pending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const provider = new GithubAuthProvider();
    provider.addScope("user:email");

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // will be null on logout — that's expected, not an error
    });

    return () => unsubscribe();
  }, []);

  const loginWithGithub = async () => {
    setIsPending(true);
    setError(null);
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("user:email");

      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("Login unsuccessful");
      }
      console.log("GitHub Info: ", res.user);
      navigate("/"); // redirect after successful login
    } catch (err) {
      setError(err);
      console.log(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const githubLogout = async () => {
    setIsPending(true);
    setError(null);
    try {
      await signOut(auth);
      console.log("Logout successful!");
    } catch (err) {
      setError(err);
      console.log(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
      onClick={user ? githubLogout : loginWithGithub}
      disabled={pending}
    >
      <img
        src="https://www.svgrepo.com/show/512317/github-142.svg"
        alt="github"
        className="w-5 h-5 mr-2"
      />
      {pending ? "Please wait..." : user ? "Logout" : "Register with GitHub"}
    </button>
  );
}