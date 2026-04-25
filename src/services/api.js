import { auth } from "../firebase/config";
import { API_BASE_URL } from "../config";

const getToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken(true);
  }
  return null;
};

export const getServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) throw new Error("Failed to fetch services");
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
};

export const getOffers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/offers`);
    if (!response.ok) throw new Error("Failed to fetch offers");
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error("Error fetching offers:", err);
    return [];
  }
};

export const getAvailableSlots = async (date) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/available-slots?date=${date}`,
    );
    if (!response.ok) throw new Error("Failed to fetch slots");
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error("Error fetching slots:", err);
    return [];
  }
};

export const bookAppointment = async (bookingData) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error("Failed to book appointment");
  const result = await response.json();
  return result.data;
};

export const getBookings = async (userId) => {
  const token = await getToken();
  if (!token) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  const token = await getToken();
  const response = await fetch(
    `${API_BASE_URL}/appointments/${bookingId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ status }),
    },
  );
  if (!response.ok) throw new Error("Failed to update status");
  const result = await response.json();
  return result.data;
};

export const rescheduleAppointment = async (bookingId, date, time) => {
  const token = await getToken();
  const response = await fetch(
    `${API_BASE_URL}/appointments/${bookingId}/reschedule`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ date, time }),
    },
  );
  if (!response.ok) throw new Error("Failed to request reschedule");
  const result = await response.json();
  return result.data;
};

export const getLoyaltyPoints = async (userId) => {
  const token = await getToken();
  if (!token) return 0;
  try {
    const response = await fetch(`${API_BASE_URL}/loyalty`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return 0;
    const result = await response.json();
    return result.data?.loyaltyPoints || 0;
  } catch (err) {
    console.error("Error fetching loyalty:", err);
    return 0;
  }
};

export const getLoyaltySettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/loyalty-settings`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching loyalty settings:", err);
    return null;
  }
};

export const syncUser = async (displayName) => {
  const token = await getToken();
  if (!token) return;
  try {
    const payload =
      typeof displayName === "object" && displayName !== null
        ? displayName
        : { displayName };
    await fetch(`${API_BASE_URL}/sync-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to sync user:", err);
  }
};

export const getUserProfile = async () => {
  const token = await getToken();
  if (!token) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.data || null;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
};

export const updateUserProfileData = async (profileData) => {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized");
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update profile");
  return result;
};

export const submitReview = async (appointmentId, rating, comment) => {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(
    `${API_BASE_URL}/appointments/${appointmentId}/review`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    },
  );

  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to submit review");
  return result;
};
