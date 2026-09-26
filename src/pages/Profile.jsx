import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getProfile();

      setUser(data.user);

      localStorage.setItem(
        "travelGurujiUser",
        JSON.stringify(data.user)
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function getInitial() {
    if (!user?.name) {
      return "?";
    }

    return user.name.charAt(0).toUpperCase();
  }

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <div className="profile-error">
          <h2>Unable to load profile</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-background"></div>

      <section className="profile-container">

        <div className="profile-card">

          <div className="profile-photo-section">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="profile-large-image"
              />
            ) : (
              <div className="profile-large-placeholder">
                {getInitial()}
              </div>
            )}
          </div>

          <h1>{user.name}</h1>

          <p className="profile-email">
            {user.email}
          </p>

          <div className="profile-details">

            <div className="profile-detail">
              <span>📱</span>

              <div>
                <small>Phone Number</small>

                <strong>
                  {user.phone || "Not added yet"}
                </strong>
              </div>
            </div>

            <div className="profile-detail">
              <span>✉️</span>

              <div>
                <small>Email</small>

                <strong>
                  {user.email}
                </strong>
              </div>
            </div>

            <div className="profile-detail profile-bio">
              <span>📝</span>

              <div>
                <small>Bio</small>

                <strong>
                  {user.bio ||
                    "Tell us something about yourself."}
                </strong>
              </div>
            </div>

          </div>

          <Link
            to="/profile/edit"
            className="profile-edit-button"
          >
            ✏️ Edit Profile
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Profile;