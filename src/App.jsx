import React, { useEffect, Suspense, lazy } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import ToastContainer, { showToast } from "./components/Toast";
import FloatingEmergencyButton from "./components/FloatingEmergencyButton";
import ErrorBoundary from "./components/ErrorBoundary";

// Core home page loaded eagerly for instant first paint
import Home from "./pages/Home";

// Secondary & heavy routes code-split lazily for fast bundle & initial load
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationDetails = lazy(() => import("./pages/DestinationDetails"));
const Hotels = lazy(() => import("./pages/Hotels"));
const HotelDetails = lazy(() => import("./pages/HotelDetails"));
const Transport = lazy(() => import("./pages/Transport"));
const Activities = lazy(() => import("./pages/Activities"));
const Planner = lazy(() => import("./pages/Planner"));
const TripPlan = lazy(() => import("./pages/TripPlan"));
const ItineraryCheckout = lazy(() => import("./pages/ItineraryCheckout"));
const StudentPlan = lazy(() => import("./pages/StudentPlan"));
const StudentPlanner = lazy(() => import("./pages/StudentPlanner"));
const StudentPlanConfirmed = lazy(() => import("./pages/StudentPlanConfirmed"));
const PlanHistory = lazy(() => import("./pages/PlanHistory"));
const PlanConfirmed = lazy(() => import("./pages/PlanConfirmed"));
const LocalExperiences = lazy(() => import("./pages/LocalExperiences"));
const MyTrips = lazy(() => import("./pages/MyTrips"));
const WomenSafety = lazy(() => import("./pages/WomenSafety"));
const ProtectedBooking = lazy(() => import("./pages/ProtectedBooking"));
const EmergencyHub = lazy(() => import("./pages/EmergencyHub"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Search = lazy(() => import("./pages/Search"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, search]);

  return null;
}

function ProtectedRoute({
  children,
  message = "Please login before booking or planning a trip.",
  action = "general",
}) {
  const token = localStorage.getItem("travelGurujiToken");
  const location = useLocation();

  if (!token) {
    const fullTarget = location.pathname + location.search + location.hash;
    try {
      sessionStorage.setItem("travelGurujiReturnTo", fullTarget);
    } catch {
      // Ignore
    }
    showToast(message, "warning", 5000);

    return (
      <Navigate
        to="/login"
        replace
        state={{
          returnTo: fullTarget,
          from: location.pathname,
          message,
          action,
        }}
      />
    );
  }

  return children;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      <FloatingEmergencyButton />

      <Navbar />

      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/activities" element={<Activities />} />
          <Route
            path="/planner"
            element={
              <ProtectedRoute
                message="Please login before planning your trip."
                action="plan"
              >
                <Planner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip-plan"
            element={
              <ProtectedRoute
                message="Please login before creating or viewing your trip plan."
                action="plan"
              >
                <TripPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itinerary-checkout"
            element={
              <ProtectedRoute
                message="Please login before booking your trip itinerary."
                action="book"
              >
                <ItineraryCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirm-booking"
            element={
              <ProtectedRoute
                message="Please login before confirming your trip booking."
                action="book"
              >
                <ItineraryCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-plan"
            element={
              <ProtectedRoute
                message="Please login before creating or viewing your student trip plan."
                action="plan"
              >
                <StudentPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-portal"
            element={
              <ProtectedRoute
                message="Please login before accessing the student trip portal."
                action="plan"
              >
                <StudentPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-planner"
            element={
              <ProtectedRoute
                message="Please login before planning your student trip."
                action="plan"
              >
                <StudentPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-plan-confirmed"
            element={
              <ProtectedRoute
                message="Please login to view your booking confirmation."
                action="book"
              >
                <StudentPlanConfirmed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan-history"
            element={
              <ProtectedRoute
                message="Please login to view your saved trip plans."
                action="plan"
              >
                <PlanHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute
                message="Please login to view and manage your bookings."
                action="book"
              >
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute
                message="Please login to view and manage your bookings."
                action="book"
              >
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan-confirmed"
            element={
              <ProtectedRoute
                message="Please login to view your booking confirmation."
                action="book"
              >
                <PlanConfirmed />
              </ProtectedRoute>
            }
          />
          <Route path="/safety" element={<WomenSafety />} />
          <Route path="/protected-booking" element={<ProtectedBooking />} />
          <Route path="/emergency" element={<EmergencyHub />} />
          <Route path="/emergency-hub" element={<EmergencyHub />} />
          <Route path="/local-experiences" element={<LocalExperiences />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute message="Please login to access your dashboard.">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/search" element={<Search />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute message="Please login to access your profile.">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute message="Please login to edit your profile.">
                <EditProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>

      <Footer />
    </>
  );
}

export default App;
