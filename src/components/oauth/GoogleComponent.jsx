import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import auth  from "../firebase/config";
import { useUserLoginMutation, useUserRegisterMutation } from "../../services/authApi";

export default function GoogleLoginComponent() {
  const [error, setError] = useState(null);
  const [pending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);
  // create provider 
  const provider = new GoogleAuthProvider();
  provider.addScope('email');

  const [userOauthRegister,{data:userData}] = useUserRegisterMutation();
  cosnt [userOauthLogin] = useUserLoginMutation();

  const navigate = useNavigate();



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null on logout — expected, not an error
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsPending(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");

      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("Login unsuccessful");
      }
      console.log("Google Info: ", res.user);
      navigate("/"); // redirect after successful login

// logic implement with api
if (user?.email != null) {
  const result = useOauthRegister({
    userRegisterRequest: {
      username: user.providerData[0]?.displayName.slice(0,5),
      phoneNumber: user.providerData[0]?.phoneNumber,
      address: {
        addressLine1: "string",
        addressLine2: "string",
        road: "string",
        linkAddress: "string",
      },
      email: user.providerData[0]?.email,
      password: `${user.providerData[0]?.displayName}168$$`,
      confirmPassword: `${user.providerData[0].displayName.slice(0,5)}168$$`,
      profile: user.providerData[0].photoURL,
    }
  });
  cconsole.log('===> UserData: ', result)
result
.then((data) => data.json())
.then((data) => {
  useUserOauthLogin({
    userLoginRequest: {
      email: user.providerData[0].email,
      password: `${user.providerData[0].displayName}168$$`
    }
  })
});
}
    } catch (err) {
      setError(err);
      console.log(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const googleLogout = async () => {
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
      onClick={user ? googleLogout : loginWithGoogle}
      disabled={pending}
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      {pending ? "Please wait..." : user ? "Logout" : "Register with Google"}
    </button>
  );
}