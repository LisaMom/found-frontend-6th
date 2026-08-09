import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hook";
import { useNavigate, Link } from "react-router";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../components/firebase/config";
import { setLogout, setUser } from "../features/auth/authSlice";
import { saveUserToFirestore } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(setLogout());
      toast.info("Signed out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Error signing out");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      await saveUserToFirestore(auth.currentUser, {
        displayName: displayName,
      });

      dispatch(
        setUser({
          ...user,
          displayName: displayName,
        })
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update profile error:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            👤
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Not Logged In</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please log in or register to view your Google account profile.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/auth/login"
              className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Google Account Profile Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="relative">
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.displayName || "User"
                  )}&background=1a73e8&color=fff&bold=true&size=128`
                }
                alt="Profile Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-blue-500/20 shadow-lg"
              />
              {user.authProvider === "google" && (
                <div
                  className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md border border-gray-100"
                  title="Verified Google Account"
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google Provider"
                    className="w-5 h-5"
                  />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {user.displayName || "Google Account User"}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  {user.authProvider === "google" ? "Google Account" : "Registered Real Email"}
                </span>
              </div>
              <p className="text-gray-600 mt-1 font-medium text-sm sm:text-base">
                {user.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Firebase User ID: <span className="font-mono text-gray-600">{user.uid}</span>
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-xl border border-red-200 transition shadow-sm cursor-pointer shrink-0"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Account Information */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">👤</span> Profile Details
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  Edit Name
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
                    Display Name
                  </span>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    {user.displayName || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
                    Real Email Address
                  </span>
                  <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-2">
                    {user.email}
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Stored in Firebase
                    </span>
                  </p>
                </div>
                {user.phoneNumber && (
                  <div>
                    <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
                      Phone Number
                    </span>
                    <p className="font-semibold text-gray-800 mt-0.5">
                      {user.phoneNumber}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Security & Provider Info */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">🛡️</span> Security & Authentication
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
                  Sign-In Provider
                </span>
                <p className="font-semibold text-gray-800 mt-0.5 capitalize flex items-center gap-2">
                  {user.authProvider === "google" ? (
                    <>
                      <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        className="w-4 h-4"
                      />
                      Google OAuth 2.0
                    </>
                  ) : (
                    "Firebase Email & Password"
                  )}
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
                  Cloud Firestore Storage
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Stored under collection <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700 font-mono">users/{user.uid}</code>
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
                  Account Created
                </span>
                <p className="font-semibold text-gray-800 mt-0.5">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "Recently"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
