import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getProfile,
  updateProfile,
} from "../services/api";


function EditProfile() {
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] =
    useState("");


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);


  async function loadProfile() {
    try {
      const data =
        await getProfile();

      const user = data.user;

      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");

      setProfileImage(
        user.profileImage || ""
      );

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }


  // Compress and resize image
  function compressImage(file) {
    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader();

        reader.onload = (
          event
        ) => {

          const image =
            new Image();

          image.onload = () => {

            const maxWidth = 800;
            const maxHeight = 800;

            let width =
              image.width;

            let height =
              image.height;


            if (
              width > maxWidth ||
              height > maxHeight
            ) {

              const ratio =
                Math.min(
                  maxWidth / width,
                  maxHeight / height
                );

              width =
                Math.round(
                  width * ratio
                );

              height =
                Math.round(
                  height * ratio
                );
            }


            const canvas =
              document.createElement(
                "canvas"
              );

            canvas.width = width;
            canvas.height = height;


            const context =
              canvas.getContext(
                "2d"
              );

            context.drawImage(
              image,
              0,
              0,
              width,
              height
            );


            const compressedImage =
              canvas.toDataURL(
                "image/jpeg",
                0.80
              );

            resolve(
              compressedImage
            );
          };


          image.onerror = () => {
            reject(
              new Error(
                "Could not process image."
              )
            );
          };


          image.src =
            event.target.result;
        };


        reader.onerror = () => {
          reject(
            new Error(
              "Could not read image."
            )
          );
        };


        reader.readAsDataURL(file);
      }
    );
  }


  // Select profile photo
  async function handleImageChange(
    event
  ) {
    const file =
      event.target.files[0];

    if (!file) {
      return;
    }


    // Image check
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image file."
      );

      return;
    }


    // Maximum original upload size = 10 MB
    const maxSize =
      10 * 1024 * 1024;


    if (file.size > maxSize) {
      setError(
        "Profile photo must be smaller than 10 MB."
      );

      return;
    }


    try {

      setError("");


      const compressedImage =
        await compressImage(file);


      setProfileImage(
        compressedImage
      );

    } catch (error) {

      setError(
        "Could not process the selected photo."
      );
    }
  }


  // Save profile
  async function handleSave(
    event
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);


    try {

      const data =
        await updateProfile({
          name,
          email,
          phone,
          bio,
          profileImage,
        });


      // Update localStorage
      localStorage.setItem(
        "travelGurujiUser",
        JSON.stringify(
          data.user
        )
      );


      // Tell Navbar that profile changed
      window.dispatchEvent(
        new Event(
          "travelGurujiProfileUpdated"
        )
      );


      setSuccess(
        "Profile updated successfully!"
      );


      setTimeout(() => {
        navigate("/profile");
      }, 900);


    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSaving(false);
    }
  }


  function getInitial() {
    if (!name) {
      return "?";
    }

    return name
      .charAt(0)
      .toUpperCase();
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


  return (
    <main className="profile-page">

      <div className="profile-background"></div>


      <section className="edit-profile-container">

        <div className="edit-profile-card">

          <p className="section-label">
            YOUR ACCOUNT
          </p>

          <h1>
            Edit Profile
          </h1>

          <p className="edit-profile-subtitle">
            Update your photo and personal
            information.
          </p>


          <form
            onSubmit={handleSave}
          >

            {/* PHOTO */}

            <div className="edit-photo-section">

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="Profile preview"
                  className="edit-profile-image"
                />

              ) : (

                <div className="edit-profile-placeholder">
                  {getInitial()}
                </div>

              )}


              <label
                htmlFor="profile-photo"
                className="change-photo-button"
              >
                📷 Change Photo
              </label>


              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                hidden
              />


              <small>
                JPG, PNG, WEBP and other
                image formats • Maximum 10 MB
              </small>

            </div>


            {/* NAME */}

            <div className="profile-form-group">

              <label htmlFor="profile-name">
                Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Enter your name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="profile-form-group">

              <label htmlFor="profile-email">
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter your email"
                required
              />

            </div>


            {/* PHONE */}

            <div className="profile-form-group">

              <label htmlFor="profile-phone">
                Phone Number
              </label>

              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="Enter your phone number"
              />

            </div>


            {/* BIO */}

            <div className="profile-form-group">

              <label htmlFor="profile-bio">
                Bio
              </label>

              <textarea
                id="profile-bio"
                value={bio}
                onChange={(event) =>
                  setBio(
                    event.target.value
                  )
                }
                placeholder="Tell us something about yourself..."
                rows="4"
                maxLength="300"
              />

              <small className="bio-counter">
                {bio.length}/300
              </small>

            </div>


            {/* ERROR */}

            {error && (
              <p className="profile-form-error">
                {error}
              </p>
            )}


            {/* SUCCESS */}

            {success && (
              <p className="profile-form-success">
                {success}
              </p>
            )}


            {/* BUTTONS */}

            <div className="edit-profile-actions">

              <button
                type="button"
                className="profile-cancel-button"
                onClick={() =>
                  navigate("/profile")
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}


export default EditProfile;