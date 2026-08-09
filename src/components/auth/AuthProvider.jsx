import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAppDispatch } from "../../lib/hook";
import { setUser, setLogout } from "../../features/auth/authSlice";
import { saveUserToFirestore, getUserFromFirestore } from "../../services/userService";
export default function AuthProvider({ children }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let firestoreUser = await getUserFromFirestore(currentUser.uid);
        if (!firestoreUser) {
          firestoreUser = await saveUserToFirestore(currentUser);
        }
        const displayName =
          currentUser.displayName ||
          firestoreUser?.displayName ||
          (currentUser.email ? currentUser.email.split("@")[0] : "User");
        const photoURL =
          currentUser.photoURL ||
          firestoreUser?.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1a73e8&color=fff&bold=true&size=128`;
        const authProvider =
          firestoreUser?.authProvider ||
          (currentUser.providerData && currentUser.providerData[0]?.providerId === "google.com"
            ? "google"
            : "email");
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName,
            photoURL,
            authProvider,
            emailVerified: currentUser.emailVerified,
            phoneNumber: currentUser.phoneNumber || firestoreUser?.phoneNumber || "",
            createdAt: firestoreUser?.createdAt || currentUser.metadata?.creationTime || new Date().toISOString(),
          })
        );
      } else {
        dispatch(setLogout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
    return children;
}