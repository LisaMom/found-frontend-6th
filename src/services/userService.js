import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase/config";

/**
 * Saves or updates a user document in Cloud Firestore under the `users/{uid}` collection.
 */
export async function saveUserToFirestore(user, extraData = {}) {
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);

  const displayName =
    extraData.displayName ||
    user.displayName ||
    (user.email ? user.email.split("@")[0] : "User");

  const photoURL =
    user.photoURL ||
    extraData.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1a73e8&color=fff&bold=true&size=128`;

  const authProvider =
    extraData.authProvider ||
    (user.providerData && user.providerData[0]?.providerId === "google.com"
      ? "google"
      : "email");

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL,
    authProvider,
    phoneNumber: user.phoneNumber || extraData.phoneNumber || "",
    updatedAt: new Date().toISOString(),
  };

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      userData.createdAt = new Date().toISOString();
      await setDoc(userRef, userData);
    } else {
      await updateDoc(userRef, {
        displayName,
        photoURL,
        authProvider,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn("Firestore user sync info:", err.message);
  }

  return userData;
}

/**
 * Fetches user profile data from Cloud Firestore.
 */
export async function getUserFromFirestore(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn("Error fetching user from Firestore:", err.message);
  }
  return null;
}
