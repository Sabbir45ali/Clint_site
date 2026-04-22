// Mock API for booking functionality

// Services data
const services = [
  {
    id: 1,
    name: "Bridal Makeup",
    duration: "120 mins",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Hair Styling",
    duration: "60 mins",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Facial & Skincare",
    duration: "45 mins",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Manicure & Pedicure",
    duration: "90 mins",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop",
  },
];

export const getServices = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(services), 500); // Simulate network latency
  });
};

export const bookAppointment = async (bookingData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Store in localStorage
      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]",
      );
      const newBooking = {
        ...bookingData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      existingBookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(existingBookings));

      // Update points
      const points = parseInt(localStorage.getItem("loyaltyPoints") || "0", 10);
      localStorage.setItem("loyaltyPoints", (points + 10).toString());

      resolve(newBooking);
    }, 800);
  });
};

export const getBookings = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      resolve(allBookings.filter((b) => b.userId === userId));
    }, 500);
  });
};

export const getLoyaltyPoints = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const points = parseInt(localStorage.getItem("loyaltyPoints") || "0", 10);
      resolve(points);
    }, 300);
  });
};
