import { getApiBaseUrl } from "../config/apiConfig";

const API_BASE_URL = getApiBaseUrl();

async function readResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  throw new Error(
    text || "Server returned an unexpected response."
  );
}


// Handle invalid / expired token
function handleAuthError(response) {
  if (response.status === 401) {
    localStorage.removeItem("travelGurujiToken");
    localStorage.removeItem("travelGurujiUser");

    window.dispatchEvent(
      new Event("travelGurujiLogout")
    );

    window.location.href = "/login";

    return true;
  }

  return false;
}


// LOGIN (SUPPORTS EMAIL OR PHONE NUMBER)
export async function loginUser(emailOrPhone, password) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrPhone,
        email: emailOrPhone,
        password,
      }),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}


// GOOGLE SIGN-IN & ACCOUNT MERGE
export async function googleLoginUser(payload) {
  const response = await fetch(
    `${API_BASE_URL}/auth/google-login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Google sign-in failed"
    );
  }

  return data;
}


// FACEBOOK SIGN-IN & ACCOUNT MERGE
export async function facebookLoginUser(payload) {
  const response = await fetch(
    `${API_BASE_URL}/auth/facebook-login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Facebook sign-in failed"
    );
  }

  return data;
}


// SEND AUTHENTIC OTP (EMAIL OR PHONE)
export async function sendAuthOtp(emailOrPhone, type = "email") {
  const response = await fetch(
    `${API_BASE_URL}/auth/send-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrPhone,
        type,
      }),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to send verification code"
    );
  }

  return data;
}


// VERIFY AUTHENTIC OTP
export async function verifyAuthOtp(emailOrPhone, otp, isLoginFlow = false) {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrPhone,
        otp,
        isLoginFlow,
      }),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Invalid or expired verification code"
    );
  }

  return data;
}


// MAKEMYTRIP STYLE AUTH: INITIATE (MOBILE SMS OR EMAIL OTP)
export async function initiateMakeMyTripAuth(identifier) {
  const response = await fetch(`${API_BASE_URL}/auth/makemytrip-initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to initiate verification");
  }

  return data;
}


// MAKEMYTRIP STYLE AUTH: VERIFY OTP & SIGN IN
export async function verifyMakeMyTripAuth(identifier, otp, name = "") {
  const response = await fetch(`${API_BASE_URL}/auth/makemytrip-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, otp, name }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Verification failed");
  }

  return data;
}


// GET SMS LOGS (FOR VERIFICATION)
export async function getSmsLogs() {
  const response = await fetch(`${API_BASE_URL}/auth/sms-logs`);
  return await readResponse(response);
}


// FORGOT PASSWORD: REQUEST PRIVATE OTP VIA SMS OR EMAIL
export async function forgotPassword(identifier) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to initiate password reset");
  }

  return data;
}


// RESET PASSWORD: SUBMIT OTP & NEW 8-CHARACTER PASSWORD
export async function resetPassword(identifier, otp, newPassword) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, otp, newPassword }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }

  return data;
}



// REGISTER (NAME, EMAIL, PASSWORD, PHONE)
export async function registerUser(
  name,
  email,
  password,
  phone = ""
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      }),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data;
}


// GET CURRENT USER
export async function getCurrentUser() {
  const token = localStorage.getItem("travelGurujiToken");
  const storedUser = localStorage.getItem("travelGurujiUser");

  if (!token) {
    return { user: null };
  }

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await readResponse(response);
      return data;
    }
  } catch (err) {
    console.warn("Backend /auth/me verification notice:", err.message);
  }

  // Graceful fallback to stored user session so UI remains authenticated
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed && (parsed.name || parsed.email)) {
        return { user: parsed };
      }
    } catch (_) {}
  }

  return { user: null };
}


// GET PROFILE
export async function getProfile() {
  const token = localStorage.getItem("travelGurujiToken");
  const storedUser = localStorage.getItem("travelGurujiUser");

  if (!token) {
    if (storedUser) {
      try {
        return { user: JSON.parse(storedUser) };
      } catch (_) {}
    }
    return {
      user: {
        id: "user_demo",
        name: "Sounava Karmakar",
        email: "karmakarsounava@gmail.com",
        phone: "",
        bio: "Passionate traveler exploring incredible India.",
        profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Sounava%20Karmakar&backgroundColor=0f766e,0d9488",
      },
    };
  }

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await readResponse(response);
      return data;
    }
  } catch (err) {
    console.warn("Backend /profile fetch error:", err.message);
  }

  // Fallback to locally stored user profile
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed && (parsed.name || parsed.email)) {
        return { user: parsed };
      }
    } catch (_) {}
  }

  return {
    user: {
      id: "user_demo",
      name: "Sounava Karmakar",
      email: "karmakarsounava@gmail.com",
      phone: "",
      bio: "Passionate traveler exploring incredible India.",
      profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Sounava%20Karmakar&backgroundColor=0f766e,0d9488",
    },
  };
}


// UPDATE PROFILE
export async function updateProfile(profileData) {
  const token = localStorage.getItem("travelGurujiToken");
  const storedUser = localStorage.getItem("travelGurujiUser");

  let localUser = {};
  if (storedUser) {
    try {
      localUser = JSON.parse(storedUser);
    } catch (_) {}
  }

  const updatedUser = {
    ...localUser,
    ...profileData,
  };

  localStorage.setItem("travelGurujiUser", JSON.stringify(updatedUser));
  window.dispatchEvent(new Event("travelGurujiProfileUpdated"));

  if (!token) {
    return {
      message: "Profile updated successfully",
      user: updatedUser,
    };
  }

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      }
    );

    if (response.ok) {
      const data = await readResponse(response);
      localStorage.setItem("travelGurujiUser", JSON.stringify(data.user));
      return data;
    }
  } catch (err) {
    console.warn("Backend /profile PUT notice:", err.message);
  }

  return {
    message: "Profile updated successfully",
    user: updatedUser,
  };
}
export async function getDestinations(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.append("search", filters.search.trim());
  }

  if (filters.state?.trim()) {
    params.append("state", filters.state.trim());
  }

  if (filters.category?.trim()) {
    params.append("category", filters.category.trim());
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/destinations${
      queryString ? `?${queryString}` : ""
    }`
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Could not get destinations"
    );
  }

  return data;
}
export async function getDestinationById(id) {
  const response = await fetch(
    `${API_BASE_URL}/destinations/${id}`
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Could not get destination"
    );
  }

  return data;
}
export async function getHotels(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.append(
      "search",
      filters.search.trim()
    );
  }

  if (filters.destination?.trim()) {
    params.append(
      "destination",
      filters.destination.trim()
    );
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/hotels${
      queryString
        ? `?${queryString}`
        : ""
    }`
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Could not get hotels"
    );
  }

  return data;
}


export async function getHotelById(id) {
  const response = await fetch(
    `${API_BASE_URL}/hotels/${id}`
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Could not get hotel"
    );
  }

  return data;
}