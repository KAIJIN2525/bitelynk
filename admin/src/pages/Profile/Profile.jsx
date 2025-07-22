import React, { useEffect, useState } from "react";
import { layoutClasses, styles } from "../../assets/dummyadmin";
import { apiServices } from "../../lib/services";
import { toast } from "sonner";
import { FiLoader, FiUser, FiEdit } from "react-icons/fi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiServices.users.getProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.message || "Failed to fetch profile");
          toast.error(response.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Simple validation
    if (!data.username || !data.email) {
      toast.error("Username and Email are required.");
      return;
    }

    const loadingToast = toast.loading("Updating profile...");
    try {
      const response = await apiServices.users.updateProfile(data);
      if (response.success) {
        toast.dismiss(loadingToast);
        toast.success("Profile updated successfully!");
        setProfile(response.data);
        setIsEditing(false);
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  if (loading) {
    return (
      <div className={layoutClasses.page}>
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-2xl text-amber-500" />
          <span className="ml-2 text-amber-100">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={layoutClasses.page}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={layoutClasses.page}>
      <div className="mx-auto max-w-4xl">
        <div className={layoutClasses.card}>
          <div className="flex justify-between items-center">
            <h2 className={layoutClasses.heading}>Admin Profile</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-amber-400 hover:text-amber-200"
            >
              <FiEdit size={24} />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-amber-300 mb-4">Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Placeholder</h4>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Placeholder</h4>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-gray-400">Placeholder</h4>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>

          {profile && (
            isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6 mt-6">
                <div>
                  <label className="block mb-2 text-lg text-amber-400">Username</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={profile.username}
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-lg text-amber-400">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={profile.email}
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-lg text-amber-400">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={profile.phone}
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-lg text-amber-400">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={profile.address.street}
                    className={styles.inputField}
                  />
                </div>
                <button type="submit" className={styles.actionBtn}>
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <FiUser className="text-amber-400 mr-4" size={24} />
                  <div>
                    <p className="text-lg font-semibold text-white">{profile.username}</p>
                    <p className="text-amber-200">{profile.email}</p>
                  </div>
                </div>
                <p className="text-white"><span className="font-semibold text-amber-300">Phone:</span> {profile.phone || 'N/A'}</p>
                <p className="text-white"><span className="font-semibold text-amber-300">Address:</span> {profile.address.street || 'N/A'}</p>
                <p className="text-gray-400">Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
