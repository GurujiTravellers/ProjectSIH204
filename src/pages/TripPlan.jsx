import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getDestinations, getHotels } from "../services/api";
import { activities } from "./Activities";
import localBusinessData from "../data/localBusinessData";
import travelActivityData from "../data/travelActivityData";
import { getWeatherForecast } from "../services/weatherApi";
import BudgetGuardian from "../components/BudgetGuardian";
import LiveJourneyTracker from "../components/LiveJourneyTracker";
import SafetyIntelligence from "../components/SafetyIntelligence";
import {
  calculateTripBudgetBreakdown,
  generateSmartItinerary,
  fetchSmartPlanIntelligence,
} from "../services/plannerService";
import { savePlan } from "../services/planApi";
import { createBooking } from "../services/bookingApi";
import RazorpayPaymentModal from "../components/RazorpayPaymentModal";
import ErrorBoundary from "../components/ErrorBoundary";
import { getArrivalPoints } from "../data/arrivalPointsData.js";
import { getCuratedMultiDayItinerary, getCuratedSixDayItinerary } from "../data/curatedSixDayItineraries.js";
import { showToast } from "../components/Toast";

function getTravelActivityMeta(attractionName) {
  if (!attractionName) {
    return null;
  }

  return (
    travelActivityData[attractionName] ||
    null
  );
}

function getWeatherSummary(weatherCode) {
  if (weatherCode === 0) {
    return { icon: "☀️", label: "Clear" };
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return { icon: "☁️", label: "Cloudy" };
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81].includes(weatherCode)) {
    return { icon: "🌧️", label: "Rain" };
  }

  if ([82, 95, 96, 99].includes(weatherCode)) {
    return { icon: "⛈️", label: "Heavy Rain" };
  }

  if ([45, 48].includes(weatherCode)) {
    return { icon: "🌫️", label: "Foggy" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { icon: "❄️", label: "Snow" };
  }

  return { icon: "🌤️", label: "Mixed Weather" };
}

function TripPlan() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Itinerary Booking & Bundle Modal State
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [bundleTransport, setBundleTransport] = useState(true);
  const [bundleHotel, setBundleHotel] = useState(true);
  const [bundleActivities, setBundleActivities] = useState(true);
  const [itineraryPaymentPlan, setItineraryPaymentPlan] = useState("INSTALLMENT_ADVANCE"); // 30% advance vs 100%
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [itineraryBookingError, setItineraryBookingError] = useState("");
  const [itineraryBookingLoading, setItineraryBookingLoading] = useState(false);

  // Prefill logged-in user details if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("travelGurujiUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setGuestName(u.name);
        if (u.email) setGuestEmail(u.email);
      }
    } catch {
      // Ignore
    }
  }, []);

  const destinationName = searchParams.get("destination") || "";

  const startDate = searchParams.get("startDate") || "";

  const selectedHotelName = searchParams.get("hotel") || "";

  const initialPersons = Number(searchParams.get("persons")) || 1;
  const initialDays = Number(searchParams.get("days")) || 1;
  const initialBudget = Number(searchParams.get("budget")) || 0;

  const [livePersons, setLivePersons] = useState(initialPersons);
  const [liveDays, setLiveDays] = useState(initialDays);
  const [liveBudget, setLiveBudget] = useState(initialBudget);

  useEffect(() => {
    setLivePersons(initialPersons);
  }, [initialPersons]);

  useEffect(() => {
    setLiveDays(initialDays);
  }, [initialDays]);

  useEffect(() => {
    setLiveBudget(initialBudget);
  }, [initialBudget]);

  const persons = livePersons;
  const days = liveDays;
  const budget = liveBudget;

  const tripType = searchParams.get("tripType") || "Friends";

  const localExperiencesFromUrl = searchParams.get("localExperiences") || "";

  const localExperienceFromUrl = searchParams.get("localExperience") || "";

  // Smart Planner Extended Parameters
  const originCity = searchParams.get("origin") || "";
  const endDate = searchParams.get("endDate") || "";
  const adults = Number(searchParams.get("adults")) || Math.max(1, persons);
  const children = Number(searchParams.get("children")) || 0;
  const stayPref = searchParams.get("stayPref") || "Mid-Range";
  const transportPref = searchParams.get("transport") || "Flexible";
  const foodPref = searchParams.get("foodPref") || "Flexible";
  const walkingPref = searchParams.get("walkingPref") || "Moderate";
  const tripStyle = searchParams.get("tripStyle") || "Balanced";
  const lateNightPref = searchParams.get("lateNightPref") || "Avoid Late Night";
  const safetyPref = searchParams.get("safetyPref") || "Standard Verification";
  const rawInterests = searchParams.get("interests") || "";
  const urlTransportFare = Number(searchParams.get("transportFare")) || 0;
  const urlTransportOperator = searchParams.get("transportOperator") || "";

  const confirmedTransport = useMemo(() => {
    if (urlTransportFare > 0) {
      return {
        fare: urlTransportFare,
        operator: urlTransportOperator || transportPref,
        status: "CONFIRMED",
      };
    }
    try {
      const stored = localStorage.getItem("travelGurujiSelectedTransport");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          parsed.fare > 0 &&
          (!destinationName || !parsed.destination || parsed.destination.toLowerCase() === destinationName.toLowerCase())
        ) {
          return {
            fare: parsed.fare,
            operator: parsed.operator || parsed.type || transportPref,
            status: "CONFIRMED",
          };
        }
      }
    } catch {
      // Ignore
    }
    return null;
  }, [urlTransportFare, urlTransportOperator, destinationName, transportPref]);

  const interestsArray = useMemo(() => {
    return rawInterests
      ? rawInterests.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
  }, [rawInterests]);

  const arrivalPoints = useMemo(() => {
    return getArrivalPoints(destinationName);
  }, [destinationName]);

  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const selectedLocalExperiences = useMemo(() => {
    if (localExperiencesFromUrl) {
      try {
        const parsed = JSON.parse(
          decodeURIComponent(localExperiencesFromUrl)
        );

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch (error) {
        try {
          const parsed = JSON.parse(
            localExperiencesFromUrl
          );

          return Array.isArray(parsed)
            ? parsed
            : [];
        } catch (parseError) {
          console.error(
            "Local experiences loading failed:",
            parseError
          );
        }
      }
    }

    if (localExperienceFromUrl) {
      try {
        return [
          JSON.parse(
            decodeURIComponent(
              localExperienceFromUrl
            )
          ),
        ];
      } catch (error) {
        try {
          return [JSON.parse(localExperienceFromUrl)];
        } catch (parseError) {
          console.error(
            "Local experience loading failed:",
            parseError
          );
        }
      }
    }

    return [];
  }, [
    localExperiencesFromUrl,
    localExperienceFromUrl,
  ]);

  const [destination, setDestination] = useState(null);

  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [exploreCategory, setExploreCategory] = useState("");

  const [weatherData, setWeatherData] = useState(null);

  const [weatherLoading, setWeatherLoading] =
    useState(false);

  const [weatherError, setWeatherError] =
    useState("");

  useEffect(() => {
    const loadTripData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          destinationResponse,
          hotelResponse,
        ] = await Promise.all([
          getDestinations({
            search: destinationName,
          }),

          getHotels({
            destination: destinationName,
          }),
        ]);

        const destinationList =
          destinationResponse?.destinations ||
          destinationResponse?.data ||
          destinationResponse ||
          [];

        const hotelList =
          hotelResponse?.hotels ||
          hotelResponse?.data ||
          hotelResponse ||
          [];

        const matchedDestination =
          destinationList.find(
            (item) =>
              item.name?.toLowerCase() ===
              destinationName.toLowerCase()
          ) ||
          destinationList[0] ||
          null;

        setDestination(
          matchedDestination
        );

        setHotels(
          Array.isArray(hotelList)
            ? hotelList
            : []
        );
      } catch (err) {
        console.error(
          "Trip plan loading failed:",
          err
        );

        setError(
          "Unable to create your trip plan. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (destinationName) {
      loadTripData();
    } else {
      setLoading(false);
    }
  }, [destinationName]);

  useEffect(() => {
    const loadWeatherData = async () => {
      if (!destinationName) {
        setWeatherData(null);
        setWeatherError("");
        return;
      }

      try {
        setWeatherLoading(true);
        setWeatherError("");

        const forecast = await getWeatherForecast(
          destinationName,
          startDate,
          days,
          { state: destination?.state }
        );

        setWeatherData(forecast);
      } catch (err) {
        console.error(
          "Weather loading failed:",
          err
        );

        setWeatherData(null);
        setWeatherError(
          "Weather information is currently unavailable for this destination."
        );
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeatherData();
  }, [destinationName, startDate, days, destination?.state]);

  const attractions = useMemo(() => {
    if (
      !destination ||
      !Array.isArray(
        destination.attractions
      )
    ) {
      return [];
    }

    return destination.attractions;
  }, [destination]);

  const destinationActivities = useMemo(() => {
    return activities.flatMap((category) =>
      category.activities
        .filter((activity) =>
          activity.places.some(
            (place) =>
              place.toLowerCase() ===
              destinationName.toLowerCase()
          )
        )
        .map((activity) => ({
          ...activity,
          category: category.category,
        }))
    );
  }, [destinationName]);

  const getDayDate = (
    dateString,
    dayNumber
  ) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    date.setDate(
      date.getDate() +
      dayNumber -
      1
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const recommendedHotel = useMemo(() => {
    if (!hotels.length) {
      return null;
    }

    if (selectedHotelName) {
      const selected =
        hotels.find(
          (hotel) =>
            hotel.name?.toLowerCase() ===
            selectedHotelName.toLowerCase()
        );

      if (selected) {
        return selected;
      }
    }

    return [...hotels].sort(
      (a, b) => {
        const scoreA =
          Number(a.rating || 0) *
          1000 -
          Number(a.price || 0) *
          0.15;

        const scoreB =
          Number(b.rating || 0) *
          1000 -
          Number(b.price || 0) *
          0.15;

        return scoreB - scoreA;
      }
    )[0];
  }, [
    hotels,
    selectedHotelName,
  ]);

  const foodPerPersonPerDay = 220;
  const travelPerPersonPerDay = 180;
  const miscPerPersonPerDay = 80;

  // Intercity round-trip transit cost for all persons
  const intercityTransportCost = useMemo(() => {
    if (confirmedTransport?.fare > 0) {
      return Number(confirmedTransport.fare);
    }
    if (urlTransportFare > 0) {
      return urlTransportFare;
    }
    const ratePerPerson = transportPref === "Flight" ? 4800 : transportPref === "Bus" ? 900 : 891;
    return ratePerPerson * persons;
  }, [confirmedTransport, urlTransportFare, transportPref, persons]);

  const smartBudgetBreakdown = useMemo(() => {
    return calculateTripBudgetBreakdown({
      totalBudget: budget,
      origin: originCity,
      destination: destinationName,
      days,
      adults,
      children,
      preferences: {
        accommodation: stayPref,
        transport: transportPref,
        food: foodPref,
        walking: walkingPref,
        tripStyle,
        lateNight: lateNightPref,
        safety: safetyPref,
        interests: interestsArray,
      },
      selectedHotel: recommendedHotel,
      confirmedTransport: confirmedTransport || { fare: intercityTransportCost, operator: transportPref },
      foodDailyRate: foodPerPersonPerDay,
      localTransitDailyRate: travelPerPersonPerDay,
      activityDailyRate: miscPerPersonPerDay,
    });
  }, [
    budget,
    originCity,
    destinationName,
    days,
    adults,
    children,
    stayPref,
    transportPref,
    foodPref,
    walkingPref,
    tripStyle,
    lateNightPref,
    safetyPref,
    interestsArray,
    recommendedHotel,
    confirmedTransport,
    intercityTransportCost,
  ]);

  // Calculate bundle pricing based on items and installment options
  const bundleTransportCost = bundleTransport ? (smartBudgetBreakdown?.items?.find((i) => i.category === "Transportation")?.amount || 2800) : 0;
  const bundleHotelCost = bundleHotel ? (smartBudgetBreakdown?.items?.find((i) => i.category === "Accommodation")?.amount || 4500) : 0;
  const bundleActivitiesCost = bundleActivities ? (smartBudgetBreakdown?.items?.find((i) => i.category === "Activities")?.amount || 1800) : 0;
  const totalBundleCost = Math.max(1, bundleTransportCost + bundleHotelCost + bundleActivitiesCost);

  const itineraryAdvancePercentage = 30; // 30% advance for itinerary installment plan
  const itineraryAdvanceCost = Math.round((totalBundleCost * itineraryAdvancePercentage) / 100);
  const itineraryRemainingCost = Math.max(0, totalBundleCost - itineraryAdvanceCost);
  const payableNowAmount = itineraryPaymentPlan === "INSTALLMENT_ADVANCE" ? itineraryAdvanceCost : totalBundleCost;

  const handleOpenItineraryCheckout = () => {
    const params = new URLSearchParams({
      destination: destinationName || "",
      startDate: startDate || "",
      days: String(days || 3),
      persons: String(persons || 2),
      hotel: selectedHotelName || (recommendedHotel?.name || ""),
      budget: String(budget || 0),
      tripType: tripType || "Friends",
      origin: originCity || "",
      transport: transportPref || "Train",
      tripStyle: tripStyle || "Balanced",
      transportFare: String(bundleTransportCost || 0),
    });

    const checkoutUrl = `/itinerary-checkout?${params.toString()}`;
    const checkoutState = {
      destination: destinationName,
      startDate,
      days,
      persons,
      selectedHotelName: selectedHotelName || recommendedHotel?.name,
      budget,
      tripType,
      originCity,
      transportPref,
      tripStyle,
      transportFare: bundleTransportCost,
      hotelDetails: recommendedHotel,
      bundleActivitiesCost,
    };

    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      try {
        sessionStorage.setItem("travelGurujiReturnTo", checkoutUrl);
        sessionStorage.setItem("travelGurujiRedirectState", JSON.stringify(checkoutState));
      } catch {
        // Ignore
      }
      showToast("Please do login before booking your trip itinerary.", "warning", 5000);
      navigate("/login", {
        state: {
          returnTo: checkoutUrl,
          redirectState: checkoutState,
          action: "book",
          message: "Please do login before booking your trip itinerary.",
        },
      });
      return;
    }

    navigate(checkoutUrl, {
      state: checkoutState,
    });
  };

  const handleItineraryProceedToPay = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("travelGurujiToken");
    if (!token) {
      handleOpenItineraryCheckout();
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setItineraryBookingError("Please provide traveler full name and email address.");
      return;
    }
    setItineraryBookingError("");
    setIsRazorpayModalOpen(true);
  };

  const handleItineraryPaymentSuccess = async (paymentData) => {
    try {
      setItineraryBookingLoading(true);
      setItineraryBookingError("");
      setIsRazorpayModalOpen(false);

      const hasRemaining = (paymentData?.remainingBalance || 0) > 0;

      const comboItems = [];
      if (bundleTransport) {
        comboItems.push({
          itemType: "Transport",
          title: `Transit Journey (${originCity || "Origin"} ⇄ ${destinationName})`,
          price: bundleTransportCost,
          details: { origin: originCity || "Origin", destination: destinationName, mode: transportPref },
        });
      }
      if (bundleHotel) {
        comboItems.push({
          itemType: "Hotel",
          title: `Stay at ${selectedHotelName || recommendedHotel?.name || "Verified Accommodations"}`,
          price: bundleHotelCost,
          details: { hotelName: selectedHotelName || recommendedHotel?.name || "Verified Accommodations", days, nights: Math.max(1, days - 1) },
        });
      }
      if (bundleActivities) {
        comboItems.push({
          itemType: "Activity",
          title: `Curated Activities & Sightseeing Passes`,
          price: bundleActivitiesCost,
          details: { destination: destinationName, count: destinationActivities.length || 3 },
        });
      }

      const payload = {
        itemType: "ComboItinerary",
        guestDetails: {
          fullName: guestName.trim(),
          email: guestEmail.trim(),
          phone: guestPhone.trim(),
          specialRequests: `Trip Type: ${tripType}, Style: ${tripStyle}, Persons: ${persons}, Days: ${days}`,
        },
        comboItems,
        totalAmount: totalBundleCost,
        currency: "INR",
        paymentStatus: hasRemaining ? "Partially Paid" : "Paid",
        paymentPlan: paymentData?.paymentPlan || itineraryPaymentPlan,
        amountPaid: paymentData?.amountPaid || payableNowAmount,
        remainingBalance: paymentData?.remainingBalance || (hasRemaining ? itineraryRemainingCost : 0),
        razorpayOrderId: paymentData?.orderId,
        razorpayPaymentId: paymentData?.paymentId,
        paymentMethod: paymentData?.paymentMethod || "Razorpay Verified",
        installmentNote: paymentData?.installmentNote || (hasRemaining ? `30% advance paid (₹${payableNowAmount.toLocaleString("en-IN")}); balance of ₹${itineraryRemainingCost.toLocaleString("en-IN")} payable upon departure.` : "100% full payment confirmed."),
        isDemoMode: true,
      };

      const result = await createBooking(payload);
      const bookingRef = result?.booking?.bookingReference || `TG-CMB-${Date.now().toString().slice(-6)}`;

      try {
        await savePlan({
          planType: "Full",
          destination: destinationName,
          startDate,
          hotel: selectedHotelName || recommendedHotel?.name || "Selected Hotel",
          persons,
          days,
          budget,
          tripType,
          localExperiences: [],
        });
      } catch (saveErr) {
        console.warn("Auto save plan note:", saveErr);
      }

      setIsItineraryModalOpen(false);

      navigate(
        `/plan-confirmed?destination=${encodeURIComponent(destinationName)}&startDate=${encodeURIComponent(
          startDate
        )}&hotel=${encodeURIComponent(
          selectedHotelName || recommendedHotel?.name || "Selected Hotel"
        )}&persons=${persons}&days=${days}&budget=${budget}&tripType=${encodeURIComponent(
          tripType
        )}&bookingRef=${encodeURIComponent(bookingRef)}&paymentPlan=${encodeURIComponent(
          paymentData?.paymentPlan || itineraryPaymentPlan
        )}&amountPaid=${encodeURIComponent(
          paymentData?.amountPaid || payableNowAmount
        )}&remainingBalance=${encodeURIComponent(
          paymentData?.remainingBalance || (hasRemaining ? itineraryRemainingCost : 0)
        )}&razorpayId=${encodeURIComponent(paymentData?.paymentId || "")}&paymentStatus=Paid`
      );
    } catch (err) {
      console.error("Itinerary booking error:", err);
      setItineraryBookingError(err.message || "Failed to confirm itinerary booking.");
    } finally {
      setItineraryBookingLoading(false);
    }
  };

  const smartItineraryDays = useMemo(() => {
    return generateSmartItinerary({
      destinationName: destination?.name || destinationName,
      startDate,
      days,
      attractions,
      destinationActivities,
      preferences: {
        walking: walkingPref,
        food: foodPref,
        tripStyle,
        lateNight: lateNightPref,
        interests: interestsArray,
      },
    });
  }, [
    destination,
    destinationName,
    startDate,
    days,
    attractions,
    destinationActivities,
    walkingPref,
    foodPref,
    tripStyle,
    lateNightPref,
    interestsArray,
  ]);

  const [hybridIntelligence, setHybridIntelligence] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadHybridIntelligence = async () => {
      try {
        const intel = await fetchSmartPlanIntelligence({
          destination: destination?.name || destinationName,
          origin: originCity,
          startDate,
          endDate,
          days,
          adults,
          children,
          budget,
          tripType,
          preferences: {
            accommodation: stayPref,
            transport: transportPref,
            food: foodPref,
            walking: walkingPref,
            tripStyle,
            lateNight: lateNightPref,
            safety: safetyPref,
            interests: interestsArray,
          },
          selectedHotel: recommendedHotel,
          attractions,
          weatherData,
        });
        if (isMounted && intel) {
          setHybridIntelligence(intel);
        }
      } catch (err) {
        console.warn("Hybrid intelligence load notice:", err);
      }
    };

    if (destinationName) {
      loadHybridIntelligence();
    }
    return () => {
      isMounted = false;
    };
  }, [
    destination,
    destinationName,
    originCity,
    startDate,
    endDate,
    days,
    adults,
    children,
    budget,
    tripType,
    stayPref,
    transportPref,
    foodPref,
    walkingPref,
    tripStyle,
    lateNightPref,
    safetyPref,
    interestsArray,
    recommendedHotel,
    attractions,
    weatherData,
  ]);

  const curatedMasterItinerary = useMemo(() => {
    return getCuratedMultiDayItinerary(destination?.name || destinationName, startDate, days);
  }, [destination, destinationName, startDate, days]);

  const activeItineraryDays =
    Array.isArray(curatedMasterItinerary) && curatedMasterItinerary.length > 0
      ? curatedMasterItinerary
      : (Array.isArray(hybridIntelligence?.itineraryDays) && hybridIntelligence.itineraryDays.length > 0
          ? hybridIntelligence.itineraryDays
          : smartItineraryDays);

  const activeBudgetBreakdown =
    hybridIntelligence?.budgetBreakdown &&
    typeof hybridIntelligence.budgetBreakdown.totalEstimatedCost === "number"
      ? hybridIntelligence.budgetBreakdown
      : smartBudgetBreakdown;

  const activeEngineSource =
    hybridIntelligence?.source || "deterministic_fallback";
  const activeDataStatus =
    hybridIntelligence?.dataStatus || "DEMO/FALLBACK";
  const activeLastUpdated =
    hybridIntelligence?.lastUpdated || new Date().toISOString();

  const handleSavePlan = async () => {
    try {
      setIsSavingPlan(true);
      setSaveStatus(null);

      const planPayload = {
        planType: "Full",
        destination: destinationName,
        origin: originCity,
        startDate,
        endDate,
        hotel: recommendedHotel?.name || selectedHotelName,
        persons,
        adults,
        children,
        days,
        budget,
        tripType,
        preferences: {
          accommodation: stayPref,
          transport: transportPref,
          food: foodPref,
          walking: walkingPref,
          tripStyle,
          lateNight: lateNightPref,
          safety: safetyPref,
          interests: interestsArray,
        },
        itinerary: activeItineraryDays,
        costBreakdown: activeBudgetBreakdown.items,
        localExperiences: selectedLocalExperiences,
      };

      const result = await savePlan(planPayload);
      setSaveStatus({
        type: "success",
        message: result.message || "Your trip plan was saved successfully!",
      });
      setTimeout(() => {
        setSaveStatus(null);
      }, 6000);
    } catch (err) {
      console.error("Save plan error:", err);
      setSaveStatus({
        type: "error",
        message: err.message || "Failed to save trip plan.",
      });
    } finally {
      setIsSavingPlan(false);
    }
  };

  const rooms = Math.ceil(persons / 2);
  const hotelNights = Math.max(1, days - 1);
  const hotelPrice = Number(recommendedHotel?.price || 0);

  // Synchronized Cost Totals across the entire plan
  const hotelTotal = hotelPrice * rooms * hotelNights;
  const localTransitTotal = travelPerPersonPerDay * persons * days;
  const foodTotal = foodPerPersonPerDay * persons * days;
  const miscTotal = miscPerPersonPerDay * persons * days;
  const travelTotal = intercityTransportCost; // intercity round-trip transit

  // Base Direct Expenses Subtotal
  const baseExpensesSubtotal =
    hotelTotal + intercityTransportCost + localTransitTotal + foodTotal + miscTotal;

  // 10% Emergency Contingency Safety Reserve
  const emergencyBuffer = Math.round(baseExpensesSubtotal * 0.10);

  // Grand Total Projected Budget (100% matched with Budget Guardian & Financial Intelligence table)
  const totalCost = baseExpensesSubtotal + emergencyBuffer;
  const projectedTotalCost = totalCost;

  const totalCostPerPerson =
    persons > 0
      ? Math.round(totalCost / persons)
      : totalCost;

  const totalCostPerDay =
    days > 0
      ? Math.round(totalCost / days)
      : totalCost;

  const costPerPersonPerDay =
    persons > 0 && days > 0
      ? Math.round(totalCost / (persons * days))
      : totalCost;

  const baseCostPerPerson =
    persons > 0
      ? Math.round(baseExpensesSubtotal / persons)
      : baseExpensesSubtotal;

  const baseCostPerPersonPerDay =
    persons > 0 && days > 0
      ? Math.round(baseExpensesSubtotal / (persons * days))
      : baseExpensesSubtotal;

  // Dedicated student concession budget calculation (~48% lower than standard commercial plan)
  const studentCostPerPersonPerDay = Math.max(
    650,
    Math.round(costPerPersonPerDay * 0.52)
  );
  const studentTotalCost = studentCostPerPersonPerDay * (persons || 1) * (days || 1);
  const studentSavingsTotal = Math.max(0, totalCost - studentTotalCost);
  const studentSavingsPercent = totalCost > 0 ? Math.round((studentSavingsTotal / totalCost) * 100) : 48;

  const budgetDifference = budget - totalCost;
  const isOverBudget = budgetDifference < 0;
  const isUnderBudget = budgetDifference > 0;

  const budgetProgress =
    budget > 0
      ? Math.min(
        100,
        Math.round(
          (totalCost / budget) *
          100
        )
      )
      : 0;

  const recommendedBudget =
    Math.ceil(
      totalCost / 1000
    ) * 1000;

  // Dynamic, Day-Specific Cost Breakdown (Authentic variance based on actual itinerary events)
  const dailyCosts = useMemo(() => {
    // Archetypal day profiles representing authentic itinerary progression:
    // Day 1: Arrival & transfer + orientation dinner + introductory entry
    // Day 2: Peak outstation excursion cab + regional banquet thali + major monument entries
    // Day 3: Major landmark complex + internal shuttles + viewing deck / museum tickets
    // Day 4: Safari / outdoor nature + highway countryside dining + sanctuary permit
    // Day 5: Cultural / temples & night bazaar + street food + cultural entry
    // Day 6+: Departure drop + farewell lunch + craft shopping & souvenirs (₹0 hotel on checkout day!)
    const archetypes = [
      { 
        travelWeight: 1.05, 
        foodWeight: 0.95, 
        miscWeight: 0.65, 
        defaultTravelNote: "Station/airport transfer & local auto", 
        defaultFoodNote: "Welcome dinner & street snacks", 
        defaultMiscNote: "Heritage monument entries & passes" 
      },
      { 
        travelWeight: 1.40, 
        foodWeight: 1.25, 
        miscWeight: 1.40, 
        defaultTravelNote: "Full-day outstation excursion cab", 
        defaultFoodNote: "Traditional regional thali banquet", 
        defaultMiscNote: "ASI temple & UNESCO entry passes" 
      },
      { 
        travelWeight: 1.15, 
        foodWeight: 1.00, 
        miscWeight: 1.65, 
        defaultTravelNote: "Attraction shuttles & city cabs", 
        defaultFoodNote: "Boutique cafes & midday meals", 
        defaultMiscNote: "Major landmark viewing gallery tickets" 
      },
      { 
        travelWeight: 0.95, 
        foodWeight: 0.85, 
        miscWeight: 1.00, 
        defaultTravelNote: "Safari & natural reserve transit", 
        defaultFoodNote: "Countryside highway dhaba dining", 
        defaultMiscNote: "Wildlife sanctuary permits & eco-entry" 
      },
      { 
        travelWeight: 0.75, 
        foodWeight: 0.90, 
        miscWeight: 0.65, 
        defaultTravelNote: "Local temple rickshaws & promenade", 
        defaultFoodNote: "Street food trail & devotional prasad", 
        defaultMiscNote: "Cultural evening show & temple pooja" 
      },
      { 
        travelWeight: 0.70, 
        foodWeight: 1.05, 
        miscWeight: 0.65, 
        defaultTravelNote: "Departure station/airport drop", 
        defaultFoodNote: "Farewell celebration lunch & travel bites", 
        defaultMiscNote: "Artisan crafts & souvenir gifts" 
      },
      { 
        travelWeight: 0.90, 
        foodWeight: 1.00, 
        miscWeight: 0.85, 
        defaultTravelNote: "Scenic valley & viewpoint transfers", 
        defaultFoodNote: "Regional mountain/coastal fare", 
        defaultMiscNote: "Ropeway & scenic overlook tickets" 
      },
      { 
        travelWeight: 0.80, 
        foodWeight: 0.95, 
        miscWeight: 0.90, 
        defaultTravelNote: "Town exploration & leisurely taxis", 
        defaultFoodNote: "Local bakery & casual meals", 
        defaultMiscNote: "Museum & art gallery passes" 
      },
      { 
        travelWeight: 0.85, 
        foodWeight: 1.00, 
        miscWeight: 0.80, 
        defaultTravelNote: "Lakeside/river cruise transfers", 
        defaultFoodNote: "Fresh regional catches & dining", 
        defaultMiscNote: "Boating & harbor entry tickets" 
      },
      { 
        travelWeight: 0.70, 
        foodWeight: 1.05, 
        miscWeight: 0.65, 
        defaultTravelNote: "Final day drop & station transit", 
        defaultFoodNote: "Farewell feast & packaged snacks", 
        defaultMiscNote: "Handmade souvenirs & mementos" 
      },
    ];

    const dayProfiles = Array.from({ length: days }, (_, i) => {
      if (i === 0) return archetypes[0];
      if (i === days - 1 && days > 1) return archetypes[5];
      return archetypes[i % archetypes.length];
    });

    const sumTravelW = dayProfiles.reduce((acc, p) => acc + p.travelWeight, 0);
    const sumFoodW = dayProfiles.reduce((acc, p) => acc + p.foodWeight, 0);
    const sumMiscW = dayProfiles.reduce((acc, p) => acc + p.miscWeight, 0);

    let cumulativeTravel = 0;
    let cumulativeFood = 0;
    let cumulativeMisc = 0;
    let cumulativeBuffer = 0;
    let cumulativeTotal = 0;

    return dayProfiles.map((p, i) => {
      const dayNumber = i + 1;
      const isLast = i === days - 1;

      // Distribute local transit proportionally with conservation of totals
      const dailyLocalTravel = isLast 
        ? Math.max(0, localTransitTotal - cumulativeTravel) 
        : Math.round((p.travelWeight / sumTravelW) * localTransitTotal);
      cumulativeTravel += dailyLocalTravel;

      // Allocate intercity transport (inbound on Day 1, return on Last Day)
      let dailyIntercity = 0;
      if (days === 1) {
        dailyIntercity = intercityTransportCost;
      } else if (i === 0) {
        dailyIntercity = Math.floor(intercityTransportCost / 2);
      } else if (isLast) {
        dailyIntercity = intercityTransportCost - Math.floor(intercityTransportCost / 2);
      }

      const dailyTravel = dailyLocalTravel + dailyIntercity;

      const dailyFood = isLast 
        ? Math.max(0, foodTotal - cumulativeFood) 
        : Math.round((p.foodWeight / sumFoodW) * foodTotal);
      cumulativeFood += dailyFood;

      const dailyMisc = isLast 
        ? Math.max(0, miscTotal - cumulativeMisc) 
        : Math.round((p.miscWeight / sumMiscW) * miscTotal);
      cumulativeMisc += dailyMisc;

      // Hotel night is charged for days 1 to hotelNights. Checkout day is ₹0!
      const dailyHotel = dayNumber <= hotelNights ? hotelPrice * rooms : 0;

      const dailyBaseTotal = dailyTravel + dailyFood + dailyHotel + dailyMisc;
      
      const dailyBuffer = isLast
        ? Math.max(0, emergencyBuffer - cumulativeBuffer)
        : Math.round(dailyBaseTotal * 0.10);
      cumulativeBuffer += dailyBuffer;

      const dailyTotal = isLast
        ? Math.max(0, totalCost - cumulativeTotal)
        : (dailyBaseTotal + dailyBuffer);
      cumulativeTotal += dailyTotal;

      const dailyPerPerson = persons > 0 ? Math.round(dailyTotal / persons) : dailyTotal;

      // Extract authentic theme from activeItineraryDays if available
      const itDay = activeItineraryDays[i];
      let dayTheme = "";
      if (itDay?.summary) {
        dayTheme = itDay.summary.split(",")[0].trim();
        if (dayTheme.length > 26) {
          dayTheme = dayTheme.slice(0, 24) + "…";
        }
      } else if (i === 0) {
        dayTheme = "Arrival & Heritage";
      } else if (isLast) {
        dayTheme = "Departure & Farewell";
      } else {
        dayTheme = `Sightseeing Circuit ${dayNumber}`;
      }

      // Contextual notes based on itinerary
      let travelNote = "";
      if (dailyIntercity > 0) {
        if (i === 0) {
          travelNote = `Inbound transit (₹${dailyIntercity.toLocaleString("en-IN")}) + station auto`;
        } else {
          travelNote = `Return transit (₹${dailyIntercity.toLocaleString("en-IN")}) + station drop`;
        }
      } else if (itDay?.timeBlocks?.find((b) => b.transportMode)?.transportMode) {
        travelNote = `${itDay.timeBlocks.find((b) => b.transportMode).transportMode} transit`;
      } else {
        travelNote = p.defaultTravelNote;
      }

      const foodNote = itDay?.timeBlocks?.find((b) => b.period === "Midday Meal" || b.type?.includes("Culinary"))?.title
        ? itDay.timeBlocks.find((b) => b.period === "Midday Meal" || b.type?.includes("Culinary")).title.slice(0, 36)
        : p.defaultFoodNote;

      const miscNote = itDay?.timeBlocks?.find((b) => b.period === "Morning" || b.period === "Afternoon")?.title
        ? `${itDay.timeBlocks.find((b) => b.period === "Morning" || b.period === "Afternoon").title.slice(0, 30)} passes`
        : p.defaultMiscNote;

      return {
        day: dayNumber,
        date: getDayDate(startDate, dayNumber),
        theme: dayTheme,
        travel: dailyTravel,
        localTravel: dailyLocalTravel,
        intercity: dailyIntercity,
        travelNote,
        food: dailyFood,
        foodNote,
        hotel: dailyHotel,
        hotelNote: dayNumber <= hotelNights 
          ? `${rooms} room${rooms > 1 ? "s" : ""} (Night ${dayNumber})` 
          : "Checkout (₹0 night stay)",
        isCheckoutDay: dayNumber > hotelNights,
        misc: dailyMisc,
        miscNote,
        buffer: dailyBuffer,
        baseTotal: dailyBaseTotal,
        total: dailyTotal,
        perPerson: dailyPerPerson,
      };
    });
  }, [
    days,
    persons,
    hotelNights,
    hotelPrice,
    rooms,
    startDate,
    localTransitTotal,
    foodTotal,
    miscTotal,
    intercityTransportCost,
    baseExpensesSubtotal,
    emergencyBuffer,
    totalCost,
    activeItineraryDays,
  ]);

  const extraActivities = [
    {
      title:
        "Local Market & Shopping",

      description:
        "Explore the local market, buy souvenirs, handicrafts and useful travel items.",

      icon: "🛍️",

      type: "Shopping",
    },

    {
      title:
        "Café & Local Food Experience",

      description:
        "Enjoy local cafés, street food and traditional dishes of the destination.",

      icon: "☕",

      type: "Food Experience",
    },

    {
      title:
        "Relaxation & Leisure",

      description:
        "Enjoy a peaceful walk, scenic views, photography and some free time.",

      icon: "🌿",

      type: "Relaxation",
    },

    {
      title:
        "Nearby Exploration",

      description:
        "Explore nearby local places, viewpoints, cultural areas or small attractions.",

      icon: "🗺️",

      type: "Exploration",
    },

    {
      title:
        "Sunset & Local Experience",

      description:
        "Enjoy the evening atmosphere, sunset, local culture and a memorable outing.",

      icon: "🌅",

      type: "Local Experience",
    },
  ];

  const attractionsPerDay =
    days >= 5
      ? 3
      : days >= 3
        ? 4
        : 5;

  const tripTypeTips = {
    Solo: {
      title: "Solo Travel Tip",
      text: "Keep your schedule flexible, explore local places and leave some time for photography and personal exploration.",
    },
    Couple: {
      title: "Couple Travel Tip",
      text: "Include scenic spots, cafés, relaxed walks and a sunset or evening experience for a memorable trip.",
    },
    Family: {
      title: "Family Travel Tip",
      text: "Prefer comfortable sightseeing, family-friendly attractions and enough rest between activities.",
    },
    Friends: {
      title: "Friends Travel Tip",
      text: "Mix sightseeing with adventure activities, local food and fun group experiences.",
    },
    "Senior Citizens": {
      title: "Senior Travel Tip",
      text: "Keep the itinerary relaxed, avoid too much walking and give enough time for rest between nearby attractions.",
    },
  };

  const currentTripTypeTip =
    tripTypeTips[tripType] || tripTypeTips.Friends;

  const groupDestinationSuggestions = {
    Solo: ["Varanasi", "Rishikesh", "Darjeeling", "Jaipur", "Shillong"],
    Couple: ["Srinagar", "Manali", "Darjeeling", "Udaipur", "Mussoorie"],
    Family: ["Jaipur", "Agra", "Puri", "Shimla", "Srinagar"],
    Friends: ["Manali", "Rishikesh", "Kasol", "Digha", "Jaisalmer"],
    "Senior Citizens": ["Puri", "Jaipur", "Agra", "Srinagar", "Varanasi"],
  };

  const groupSuggestionText = {
    Solo: "These places are great for independent exploration, local experiences and flexible plans.",
    Couple: "These destinations are especially nice for scenic moments, privacy, relaxed evenings and memorable experiences.",
    Family: "These places offer a comfortable mix of sightseeing, culture, food and family-friendly experiences.",
    Friends: "These destinations are great for group fun, adventure, local food, photography and shared experiences.",
    "Senior Citizens": "These places work well for relaxed sightseeing, culture, scenic views and a comfortable travel pace.",
  };

  const currentDestinationCoupleNote = {
    "Srinagar": "I especially suggest coming here as a couple for a peaceful and scenic experience.",
    "Manali": "Couples can enjoy the mountain views, cafés and relaxed evenings here.",
    "Darjeeling": "I suggest visiting as a couple if you enjoy scenic views, quiet walks and beautiful evenings.",
    "Mussoorie": "This is a lovely couple-friendly choice for relaxed walks, viewpoints and evening experiences.",
    "Udaipur": "I especially suggest this destination for couples who enjoy lakeside views and romantic evenings.",
  };

  const currentDestinationFriendNote = {
    "Manali": "Friends can have a great time here with adventure activities, cafés and group exploration.",
    "Rishikesh": "This is a strong choice for friends who enjoy adventure, rafting and active experiences.",
    "Kasol": "Friends can enjoy trekking, cafés, nature and a relaxed group trip here.",
    "Digha": "Friends can enjoy beach time, water activities, local food and evening hangouts here.",
    "Jaisalmer": "A friend group can enjoy desert experiences, sightseeing and local culture here.",
  };

  const currentGroupNote =
    tripType === "Couple"
      ? currentDestinationCoupleNote[destinationName]
      : tripType === "Friends"
        ? currentDestinationFriendNote[destinationName]
        : null;

  const groupSuggestions =
    groupDestinationSuggestions[tripType] ||
    groupDestinationSuggestions.Friends;

  const groupSuggestionDescription =
    groupSuggestionText[tripType] ||
    groupSuggestionText.Friends;

  const hiddenGemSuggestions = {
    Mussoorie: ["Landour", "George Everest", "Cloud's End"],
    Manali: ["Sethan", "Hamta", "Naggar"],
    Shimla: ["Mashobra", "Naldehra", "Chail"],
    Darjeeling: ["Lamahatta", "Tinchuley", "Takdah"],
    Rishikesh: ["Neer Garh Waterfall", "Kunjapuri", "Kaudiyala"],
    Jaipur: ["Samode", "Bagru", "Abhaneri"],
    Puri: ["Raghurajpur", "Chandrabhaga", "Satapada"],
    Varanasi: ["Sarnath", "Ramnagar", "Chunar"],
    Srinagar: ["Doodhpathri", "Yusmarg", "Aharbal"],
    Jaisalmer: ["Kuldhara", "Khuri", "Lodrawa"],
    Kasol: ["Tosh", "Malana", "Grahan"],
  };

  const hiddenGems =
    hiddenGemSuggestions[destinationName] || [
      "Explore nearby villages",
      "Visit local markets",
      "Try a less-crowded viewpoint",
    ];

  const offSeasonSuggestions = {
    Mussoorie: "Try late winter or the quieter weeks after the main summer rush for a more relaxed hill-station experience.",
    Manali: "Consider the quieter shoulder season if you want fewer crowds and more relaxed local exploration.",
    Shimla: "The shoulder season can offer a calmer experience with less crowd around popular viewpoints.",
    Darjeeling: "Quieter months can be a good choice for peaceful walks, local cafés and scenic views.",
    Rishikesh: "Consider a less busy period for a calmer mix of adventure, cafés and riverside experiences.",
    Jaipur: "The quieter months outside major holiday rushes can make sightseeing and local markets more comfortable.",
    Puri: "A quieter travel period can give you more time for temples, beaches and local experiences.",
    Varanasi: "Avoiding the busiest festival periods can make local exploration more relaxed.",
    Srinagar: "Shoulder-season travel can offer a calmer experience while still enjoying scenic places and local culture.",
    Jaisalmer: "Choose a quieter period outside the peak desert-tourism rush for a more relaxed local experience.",
  };

  const offSeasonText =
    offSeasonSuggestions[destinationName] ||
    "Consider travelling outside the busiest holiday period for fewer crowds and more relaxed local experiences.";

  const localBusinessSuggestions = [
    {
      icon: "🍴",
      title: "Local Food",
      category: "food",
      text: `Explore cafés, local food spots and traditional dishes around ${destinationName}.`,
    },
    {
      icon: "🧑‍🏫",
      title: "Local Guides",
      category: "guides",
      text: `Find local guides for sightseeing, walks and cultural experiences in ${destinationName}.`,
    },
    {
      icon: "🛍️",
      title: "Local Shopping",
      category: "shopping",
      text: `Explore local markets, handicrafts and destination-specific shopping in ${destinationName}.`,
    },
    {
      icon: "✨",
      title: "Local Experiences",
      category: "activities",
      text: `Immerse in unique cultural activities, heritage rituals and workshops in ${destinationName}.`,
    },
  ];

  const currentLocalBusinessData =
    localBusinessData[destinationName] || {
      food: [],
      guides: [],
      shopping: [],
      activities: [],
    };

  const activeBusinessItems =
    currentLocalBusinessData[exploreCategory] || [];

  const activeBusinessTitle = localBusinessSuggestions.find(
    (item) => item.category === exploreCategory
  )?.title || "Local Experiences";

  const itinerary =
    useMemo(() => {
      const curated = getCuratedMultiDayItinerary(destination?.name || destinationName, startDate, days);
      if (Array.isArray(curated) && curated.length > 0) {
        return curated.map((cDay) => ({
          day: cDay.day,
          date: cDay.date,
          attractions: (cDay.timeBlocks || [])
            .filter((b) => b.period === "Morning" || b.period === "Afternoon")
            .map((b) => ({
              name: b.title,
              description: b.description,
              zone: b.location,
              duration: parseFloat(b.duration) || 2,
              cost: b.estimatedCost,
              travelMeta: getTravelActivityMeta(b.title),
            })),
          activity: cDay.timeBlocks?.find((b) => b.period === "Afternoon")?.title || null,
          extraActivity: cDay.extraActivity,
        }));
      }

      const result = [];
      const usedAttractionIds = new Set();
      let extraActivityIndex = 0;

      for (
        let day = 1;
        day <= days;
        day++
      ) {
        const dayAttractions = [];
        for (const att of attractions) {
          const attKey = att.id || att.name;
          if (!usedAttractionIds.has(attKey)) {
            usedAttractionIds.add(attKey);
            dayAttractions.push(att);
            if (dayAttractions.length >= attractionsPerDay) break;
          }
        }

        let extraActivity = null;

        if (
          dayAttractions.length === 0
        ) {
          extraActivity =
            extraActivities[
            extraActivityIndex %
            extraActivities.length
            ];

          extraActivityIndex++;
        }

        result.push({
          day,

          date: getDayDate(
            startDate,
            day
          ),

          attractions:
            dayAttractions.map((attraction) => ({
              ...attraction,
              travelMeta:
                getTravelActivityMeta(
                  attraction.name
                ),
            })),

          activity:
            destinationActivities.length > 0
              ? destinationActivities[
              (day - 1) %
              destinationActivities.length
              ]
              : null,

          extraActivity,
        });
      }

      return result;
    }, [
      attractions,
      attractionsPerDay,
      days,
      startDate,
      destinationActivities,
      tripType,
    ]);

  if (loading) {
    return (
      <div className="trip-plan-page">

        <div className="trip-plan-loading">

          <div className="trip-plan-spinner">
            ✈️
          </div>

          <h2>
            Creating your travel plan...
          </h2>

          <p>
            Finding destinations,
            hotels and itinerary
            for you.
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-plan-page">

        <div className="trip-plan-error">

          <div className="trip-plan-error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/planner"
            className="trip-plan-primary-btn"
          >
            Back to Planner
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div
      className="trip-plan-page"
      style={{
        "--trip-plan-page-bg": `url(${destination?.image || ""})`,
      }}
    >

      <section className="trip-plan-hero">

        <div className="trip-plan-hero-content">

          <div className="trip-plan-hero-badge">

            ✨

            <span>
              YOUR TRAVEL PLAN...
            </span>

          </div>

          <h1>
            {destination?.name ||
              destinationName ||
              "Your Trip"}
          </h1>
          

          <div className="trip-plan-hero-meta">

            <span>
              📅 {days}{" "}
              {days === 1
                ? "Day"
                : "Days"}
            </span>

            <span>
              👥 {persons}{" "}
              {persons === 1
                ? "Traveller"
                : "Travellers"}
            </span>
          </div>

        </div>

        <div className="trip-plan-hero-overlay" />

        {destination?.image ? (
          <img
            src={destination.image}
            alt={
              destination?.name ||
              destinationName
            }
            className="trip-plan-hero-image"
          />
        ) : (
          <div className="trip-plan-hero-fallback">
            🏔️
          </div>
        )}

      </section>

      <section className="trip-plan-container">

        <div className="trip-plan-summary-grid">

          <div className="trip-plan-summary-card">

            <div className="trip-plan-summary-icon">
              <span>
                📍
              </span>
            </div>

            <div>

              <p>
                DESTINATION
              </p>

              <h3>
                {destination?.name ||
                  destinationName}
              </h3>

            </div>

          </div>

          <div className="trip-plan-summary-card">

            <div className="trip-plan-summary-icon">
              <span>
                📅
              </span>
            </div>

            <div>

              <p>
                START DATE
              </p>

              <h3>
                {startDate
                  ? new Date(
                    `${startDate}T00:00:00`
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )
                  : "Not selected"}
              </h3>

            </div>

          </div>

          <div className="trip-plan-summary-card">

            <div className="trip-plan-summary-icon">
              <span>
                👥
              </span>
            </div>

            <div>

              <p>
                TRAVELLERS
              </p>

              <h3>
                {persons}{" "}
                {persons === 1
                  ? "Person"
                  : "Persons"}
              </h3>

            </div>

          </div>

          <div className="trip-plan-summary-card">

            <div className="trip-plan-summary-icon">
              <span>
                🗓️
              </span>
            </div>

            <div>

              <p>
                TRIP DURATION
              </p>

              <h3>
                {days}{" "}
                {days === 1
                  ? "Day"
                  : "Days"}
              </h3>

            </div>

          </div>

          <div className="trip-plan-summary-card">

            <div className="trip-plan-summary-icon">
              <span>
                💰
              </span>
            </div>

            <div>

              <p>
                YOUR BUDGET
              </p>

              <h3>
                ₹
                {budget.toLocaleString(
                  "en-IN"
                )}
              </h3>

            </div>

          </div>

          <div className="trip-plan-summary-card">

            <div className="trip-plan-summary-icon">
              <span>
                🏨
              </span>
            </div>

            <div>

              <p>
                HOTEL
              </p>

              <h3>
                {recommendedHotel?.name ||
                  "Best Value"}
              </h3>

            </div>

          </div>

        </div>

        {/* SMART TRIP ROUTE & PREFERENCES BANNER */}
        <div
          className="planner-route-banner"
          style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "32px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  color: "#0284c7",
                  fontWeight: 800,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                📍 ROUTE & SMART PREFERENCES
              </span>
              <h2
                style={{
                  fontSize: "22px",
                  margin: 0,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: 700,
                }}
              >
                <span>{originCity || "Starting Location"}</span>
                <span style={{ color: "#0284c7", fontSize: "18px" }}>➔</span>
                <span>{destination?.name || destinationName}</span>
              </h2>
              {endDate && (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginTop: "4px",
                    display: "inline-block",
                  }}
                >
                  🗓️ {startDate} to {endDate} ({days} {days === 1 ? "day" : "days"})
                </span>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background:
                      activeEngineSource === "python_intelligence"
                        ? "#ecfdf5"
                        : "#f8fafc",
                    color:
                      activeEngineSource === "python_intelligence"
                        ? "#065f46"
                        : "#475569",
                    border:
                      activeEngineSource === "python_intelligence"
                        ? "1px solid #a7f3d0"
                        : "1px solid #cbd5e1",
                  }}
                >
                  {activeEngineSource === "python_intelligence"
                    ? "⚡ Python Intelligence Engine"
                    : "🛡️ Verified Deterministic Engine"}
                </span>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background:
                      activeDataStatus === "LIVE"
                        ? "#dcfce7"
                        : activeDataStatus === "VERIFIED"
                        ? "#e0e7ff"
                        : activeDataStatus === "DATABASE"
                        ? "#e0f2fe"
                        : "#f1f5f9",
                    color:
                      activeDataStatus === "LIVE"
                        ? "#15803d"
                        : activeDataStatus === "VERIFIED"
                        ? "#4338ca"
                        : activeDataStatus === "DATABASE"
                        ? "#0369a1"
                        : "#475569",
                  }}
                >
                  ● {activeDataStatus === "DEMO/FALLBACK" ? "STANDARD ESTIMATE" : activeDataStatus}
                </span>

                <span style={{ fontSize: "10px", color: "#64748b" }}>
                  Updated{" "}
                  {new Date(activeLastUpdated).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {activeEngineSource !== "python_intelligence" && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "#fffbeb",
                      color: "#92400e",
                      border: "1px solid #fde68a",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>ℹ️</span> Smart optimization temporarily unavailable — showing standard plan.
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span className="planner-chip active">🚆 {transportPref}</span>
              <span className="planner-chip active">🏨 {stayPref}</span>
              <span className="planner-chip active">🍛 {foodPref}</span>
              <span className="planner-chip active">🚶 {walkingPref} Walking</span>
              <span className="planner-chip active">⚡ {tripStyle} Pace</span>
              <span className="planner-chip active">🌙 {lateNightPref}</span>
              {interestsArray.map((interest) => (
                <span key={interest} className="planner-chip active">
                  ✨ {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="trip-plan-weather-section">
          <div className="trip-plan-section-title">
            <span>🌦️</span>
            <div>
              <h2>Weather Forecast & Relief Operations Horizon</h2>
              <p>Real-time telemetry, safe transit windows, and multi-day projections for future planning and relief operations.</p>
            </div>
          </div>

          {weatherLoading ? (
            <div className="trip-plan-weather-status">
              Checking the latest meteorological and hydrology radar feeds...
            </div>
          ) : weatherError ? (
            <div className="trip-plan-weather-status error">
              {weatherError}
            </div>
          ) : weatherData?.forecast?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* TOP META BAR & RELIEF READINESS HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "16px 20px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "18px" }}>📍</span>
                    <strong style={{ fontSize: "16px", color: "#0f172a" }}>
                      {weatherData.location?.name || destinationName}
                      {weatherData.location?.admin1 ? `, ${weatherData.location.admin1}` : ""}
                    </strong>
                    <span
                      style={{
                        background: weatherData.mode === "live" ? "#dcfce7" : "#e0f2fe",
                        color: weatherData.mode === "live" ? "#166534" : "#075985",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "800",
                      }}
                    >
                      {weatherData.mode === "live" ? "● Live Satellite Radar" : "🗓️ Seasonal Outlook"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    {weatherData.reliefPlanning?.safeOperatingHours || "Safe Daylight Window: 06:30 AM – 05:30 PM"} • Primary Control: {weatherData.reliefPlanning?.primaryHelpline || "1077 / 1070"}
                  </p>
                </div>

                <div
                  style={{
                    background: weatherData.reliefPlanning?.overallRiskTier === "RED"
                      ? "#fef2f2"
                      : weatherData.reliefPlanning?.overallRiskTier === "YELLOW"
                      ? "#fffbeb"
                      : "#f0fdf4",
                    border: `1px solid ${
                      weatherData.reliefPlanning?.overallRiskTier === "RED"
                        ? "#fca5a5"
                        : weatherData.reliefPlanning?.overallRiskTier === "YELLOW"
                        ? "#fde68a"
                        : "#bbf7d0"
                    }`,
                    color: weatherData.reliefPlanning?.overallRiskTier === "RED"
                      ? "#991b1b"
                      : weatherData.reliefPlanning?.overallRiskTier === "YELLOW"
                      ? "#92400e"
                      : "#166534",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "800",
                  }}
                >
                  {weatherData.reliefPlanning?.overallRiskTier === "RED"
                    ? "🔴 High Relief Hazard (Special Escort Required)"
                    : weatherData.reliefPlanning?.overallRiskTier === "YELLOW"
                    ? "🟡 Moderate Advisory (Caution Staging)"
                    : "🟢 Normal Conditions (All Corridors Open)"}
                </div>
              </div>

              {/* 2-COLUMN FEATURED CARDS: TODAY & TOMORROW */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* 1. TODAY'S RELIEF & TRANSIT OPERATIONS */}
                {weatherData.today && (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "20px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "800" }}>
                        TODAY'S OPERATIONS
                      </span>
                      <strong style={{ fontSize: "13px", color: "#64748b" }}>
                        {weatherData.today.date} ({weatherData.today.dayName})
                      </strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "42px" }}>{weatherData.today.weatherIcon || "🌤️"}</span>
                      <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: "20px", color: "#0f172a" }}>
                          {weatherData.today.weatherLabel || "Partly Cloudy"}
                        </h3>
                        <div style={{ display: "flex", gap: "12px", fontSize: "14px", color: "#475569" }}>
                          <span>↑ <strong>{weatherData.today.temperatureMax}°C</strong></span>
                          <span>↓ <strong>{weatherData.today.temperatureMin}°C</strong></span>
                          <span>🌧️ <strong>{weatherData.today.precipitationSum} mm</strong> ({weatherData.today.precipitationProbability}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* RELIEF TELEMETRY CHECKLIST */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                      <div>
                        <strong style={{ color: "#0f172a" }}>🛡️ Safe Transit Window: </strong>
                        <span style={{ color: "#2563eb", fontWeight: "700" }}>{weatherData.today.safeTransitWindow}</span>
                      </div>
                      <div>
                        <strong style={{ color: "#0f172a" }}>🚚 Transit Feasibility: </strong>
                        <span style={{ color: "#059669", fontWeight: "700" }}>{weatherData.today.travelFeasibility}</span>
                      </div>
                      <div>
                        <strong style={{ color: "#0f172a" }}>📦 Relief Staging Status: </strong>
                        <span style={{ color: "#475569" }}>{weatherData.today.reliefStatus}</span>
                      </div>
                      <div>
                        <strong style={{ color: "#0f172a" }}>🚁 Aerial & Drone Viability: </strong>
                        <span style={{ color: "#475569" }}>{weatherData.today.aerialViability}</span>
                      </div>

                      {/* EMERGENCY SUPPLY CHECKLIST */}
                      {Array.isArray(weatherData.today.supplyChecklist) && weatherData.today.supplyChecklist.length > 0 && (
                        <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", marginTop: "6px" }}>
                          <strong style={{ display: "block", color: "#334155", marginBottom: "4px" }}>
                            🎒 Recommended Supply Kit:
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "18px", color: "#64748b" }}>
                            {weatherData.today.supplyChecklist.slice(0, 3).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. TOMORROW'S FORWARD PLANNING & RELIEF READINESS */}
                {weatherData.tomorrow && (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "20px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ background: "#ede9fe", color: "#6d28d9", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "800" }}>
                        TOMORROW'S FORWARD PLAN
                      </span>
                      <strong style={{ fontSize: "13px", color: "#64748b" }}>
                        {weatherData.tomorrow.date} ({weatherData.tomorrow.dayName})
                      </strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "42px" }}>{weatherData.tomorrow.weatherIcon || "🌤️"}</span>
                      <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: "20px", color: "#0f172a" }}>
                          {weatherData.tomorrow.weatherLabel || "Partly Cloudy"}
                        </h3>
                        <div style={{ display: "flex", gap: "12px", fontSize: "14px", color: "#475569" }}>
                          <span>↑ <strong>{weatherData.tomorrow.temperatureMax}°C</strong></span>
                          <span>↓ <strong>{weatherData.tomorrow.temperatureMin}°C</strong></span>
                          <span>🌧️ <strong>{weatherData.tomorrow.precipitationSum} mm</strong> ({weatherData.tomorrow.precipitationProbability}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* RELIEF TELEMETRY CHECKLIST FOR TOMORROW */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                      <div>
                        <strong style={{ color: "#0f172a" }}>🛡️ Safe Transit Window: </strong>
                        <span style={{ color: "#2563eb", fontWeight: "700" }}>{weatherData.tomorrow.safeTransitWindow}</span>
                      </div>
                      <div>
                        <strong style={{ color: "#0f172a" }}>🚚 Transit Feasibility: </strong>
                        <span style={{ color: "#059669", fontWeight: "700" }}>{weatherData.tomorrow.travelFeasibility}</span>
                      </div>
                      <div>
                        <strong style={{ color: "#0f172a" }}>💨 Wind Gusts Peak: </strong>
                        <span style={{ color: "#475569" }}>{weatherData.tomorrow.windGustMax} km/h (Wind Speed: {weatherData.tomorrow.windSpeedMax} km/h)</span>
                      </div>
                      <div>
                        <strong style={{ color: "#0f172a" }}>💧 Hydrology / Flood Risk: </strong>
                        <span style={{ color: "#475569" }}>{weatherData.tomorrow.floodRisk}</span>
                      </div>

                      {/* TOMORROW FORWARD PREPARATION NOTE */}
                      <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", marginTop: "6px" }}>
                        <strong style={{ display: "block", color: "#334155", marginBottom: "4px" }}>
                          🚚 Route Readiness & Pre-Positioning:
                        </strong>
                        <p style={{ margin: 0, color: "#64748b" }}>
                          {weatherData.tomorrow.precipitationSum >= 15
                            ? "Heavy rainfall expected tomorrow. Pre-position dry rations and verify road clearance before departure."
                            : "Standard conditions expected tomorrow. Normal tourist vehicles and relief deliveries can proceed on schedule."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. MULTI-DAY HORIZON: DAYS AHEAD PLANNING */}
              {Array.isArray(weatherData.daysAhead) && weatherData.daysAhead.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      🗓️ Days Ahead (Future Multi-Day Planning Horizon)
                    </h4>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Showing {weatherData.daysAhead.length} forward projection days
                    </span>
                  </div>

                  <div className="trip-plan-weather-grid">
                    {weatherData.daysAhead.map((weatherDay, index) => {
                      const summary = getWeatherSummary(weatherDay.weatherCode);
                      const tripDay = weatherDay.tripDay || index + 3;

                      return (
                        <div
                          className="trip-plan-weather-card"
                          key={`${weatherDay.date}-${index}`}
                          style={{
                            background: "#ffffff",
                            border: `1.5px solid ${weatherDay.riskTier === "RED" ? "#fca5a5" : weatherDay.riskTier === "YELLOW" ? "#fde68a" : "#e2e8f0"}`,
                            borderRadius: "12px",
                            padding: "16px",
                            position: "relative",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <span className="trip-plan-weather-day" style={{ fontWeight: "800" }}>
                              Day {tripDay}
                            </span>
                            <span
                              style={{
                                background: weatherDay.riskTier === "RED" ? "#fef2f2" : weatherDay.riskTier === "YELLOW" ? "#fffbeb" : "#f0fdf4",
                                color: weatherDay.riskTier === "RED" ? "#991b1b" : weatherDay.riskTier === "YELLOW" ? "#92400e" : "#166534",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                fontSize: "10px",
                                fontWeight: "800",
                              }}
                            >
                              {weatherDay.riskTier === "RED" ? "🔴 Red" : weatherDay.riskTier === "YELLOW" ? "🟡 Yellow" : "🟢 Normal"}
                            </span>
                          </div>

                          <strong className="trip-plan-weather-date">
                            {new Date(`${weatherDay.date}T00:00:00`).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </strong>

                          <div className="trip-plan-weather-icon" style={{ fontSize: "32px", margin: "8px 0" }}>
                            {summary.icon}
                          </div>

                          <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700" }}>{summary.label}</h4>

                          <div className="trip-plan-weather-temperature" style={{ fontSize: "12px", color: "#475569", marginBottom: "6px" }}>
                            <span>↑ {weatherDay.temperatureMax ?? "--"}°C</span>
                            <span>↓ {weatherDay.temperatureMin ?? "--"}°C</span>
                          </div>

                          <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>
                            <div>🌧️ Rain: <strong>{weatherDay.precipitationSum ?? 0} mm</strong> ({weatherDay.precipitationProbability ?? 0}%)</div>
                            <div>💨 Gust: <strong>{weatherDay.windGustMax ?? 0} km/h</strong></div>
                            <div style={{ marginTop: "4px", color: "#0369a1", fontWeight: "700" }}>
                              ✓ {weatherDay.travelFeasibility}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="trip-plan-weather-status">
              Weather information is currently unavailable for this destination.
            </div>
          )}
        </section>

        <section className="trip-type-plan-card">

          <div className="trip-type-plan-icon">
            {tripType === "Solo"
              ? "🧍"
              : tripType === "Couple"
                ? "💑"
                : tripType === "Family"
                  ? "👨‍👩‍👧"
                  : tripType === "Senior Citizens"
                    ? "👴"
                    : "🧑‍🤝‍🧑"}
          </div>

          <div className="trip-type-plan-content">
            <span>TRIP TYPE</span>

            <h2>
              {tripType} Travel Plan
            </h2>

            <p>
              {currentTripTypeTip.text}
            </p>
          </div>

        </section>

        {selectedLocalExperiences.length > 0 && (
          <section className="trip-plan-selected-experiences-section">
            <div className="trip-plan-section-title">
              <span>✨</span>

              <div>
                <h2>Selected Local Experiences</h2>
                <p>
                  {selectedLocalExperiences.length}{" "}
                  {selectedLocalExperiences.length === 1
                    ? "experience"
                    : "experiences"}{" "}
                  added to your trip.
                </p>
              </div>
            </div>

            <div className="trip-plan-selected-experiences-grid">
              {selectedLocalExperiences.map(
                (experience, index) => (
                  <article
                    className="trip-plan-selected-experience"
                    key={`${experience.category}-${experience.name}-${index}`}
                  >
                    <div className="trip-plan-selected-experience-top">
                      <div className="trip-plan-selected-experience-icon">
                        {experience.icon || "✨"}
                      </div>

                      <span className="trip-plan-selected-experience-check">
                        ✓
                      </span>
                    </div>

                    <div className="trip-plan-selected-experience-content">
                      <span>
                        {experience.categoryLabel ||
                          "Local Experience"}
                      </span>

                      <h2>{experience.name}</h2>

                      <p>
                        {experience.detail ||
                          "Enjoy this local experience during your trip."}
                      </p>
                    </div>

                    <div className="trip-plan-selected-experience-meta">
                      <span>
                        {experience.tag ||
                          "Travel Guruji Pick"}
                      </span>
                      <strong>
                        {experience.price ||
                          "Price on request"}
                      </strong>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>
        )}

        <section className="trip-plan-budget-section">

          <div className="trip-plan-section-heading">

            <div>

              <span>
                💳
              </span>

              <h2>
                Budget Overview
              </h2>

            </div>

            <strong>
              {budgetProgress}%
            </strong>

          </div>

          <div className="trip-plan-budget-bar">

            <div
              className="trip-plan-budget-fill"
              style={{
                width: `${budgetProgress}%`,
              }}
            />

          </div>

          {isOverBudget && (
            <div className="trip-plan-budget-message over">
              <div className="trip-plan-budget-message-icon">
                ⚠️
              </div>
              <div>
                <strong>
                  Projected trip exceeds selected budget
                </strong>
                <p>
                  Your total projected cost (₹{totalCost.toLocaleString("en-IN")} incl. 10% emergency buffer) exceeds your selected budget of ₹{budget.toLocaleString("en-IN")} by{" "}
                  <b>
                    ₹{Math.abs(budgetDifference).toLocaleString("en-IN")}
                  </b>
                  . (Base direct spend: ₹{baseExpensesSubtotal.toLocaleString("en-IN")}).
                </p>
                <p>
                  Recommended budget:{" "}
                  <b>
                    ₹{recommendedBudget.toLocaleString("en-IN")}
                  </b>
                </p>
              </div>
            </div>
          )}

          {isUnderBudget && (
            <div className="trip-plan-budget-message under">
              <div className="trip-plan-budget-message-icon">
                🎉
              </div>
              <div>
                <strong>
                  Great! You are within budget.
                </strong>
                <p>
                  Your selected budget of ₹{budget.toLocaleString("en-IN")} safely covers your complete projected cost of ₹{totalCost.toLocaleString("en-IN")} (including 10% emergency buffer). Remaining surplus:{" "}
                  <b>
                    ₹{budgetDifference.toLocaleString("en-IN")}
                  </b>
                  .
                </p>
              </div>
            </div>
          )}

          {!isOverBudget &&
            !isUnderBudget && (
              <div className="trip-plan-budget-message equal">

                <div className="trip-plan-budget-message-icon">
                  ✅
                </div>

                <div>

                  <strong>
                    Perfect budget match!
                  </strong>

                  <p>
                    Your estimated trip
                    cost matches your
                    selected budget.
                  </p>

                </div>

              </div>
            )}

          {/* DETERMINISTIC SMART BUDGET BREAKDOWN CARD */}
          <div className="budget-breakdown-card" style={{ marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "#0284c7",
                  }}
                >
                  TRANSPARENT FINANCIAL INTELLIGENCE
                </span>
                <h3
                  style={{
                    margin: "2px 0 0",
                    fontSize: "18px",
                    color: "#0f172a",
                  }}
                >
                  Detailed Itemized Cost Breakdown
                </h3>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: "4px 10px",
                  borderRadius: "8px",
                }}
              >
                Distinguishes <b>ESTIMATED</b> vs <b>CONFIRMED</b>
              </span>
            </div>

            {Boolean(
              activeBudgetBreakdown?.isOverBudget &&
                (activeBudgetBreakdown?.alternatives?.length || 0) > 0
            ) && (
              <div className="budget-overrun-banner">
                <div className="budget-overrun-header">
                  <span style={{ fontSize: "20px" }}>🚨</span>
                  <div>
                    <h4>
                      Budget Overrun Detected (+₹
                      {(
                        activeBudgetBreakdown?.budgetDifference ?? 0
                      ).toLocaleString("en-IN")}
                      )
                    </h4>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "13px",
                        color: "#9f1239",
                      }}
                    >
                      Estimated cost exceeds your planned budget. Review these
                      actionable alternatives to balance your trip:
                    </p>
                  </div>
                </div>

                <div className="budget-overrun-alternatives">
                  {(activeBudgetBreakdown?.alternatives || []).map((alt) => (
                    <div className="alternative-card" key={alt.id || Math.random()}>
                      <div>
                        <strong>{alt.title}</strong>
                        <p>{alt.description}</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "8px",
                          borderTop: "1px solid #fee2e2",
                        }}
                      >
                        <span className="alternative-savings">
                          Save ~₹{(alt.savings ?? 0).toLocaleString("en-IN")}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#64748b",
                          }}
                        >
                          New Est: ₹
                          {(alt.newEstimatedTotal ?? 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table className="budget-breakdown-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Detail / Basis</th>
                    <th style={{ textAlign: "right" }}>Amount (₹)</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeBudgetBreakdown?.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: "#1e293b" }}>
                        {item.category}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.label}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            marginTop: "2px",
                          }}
                        >
                          {item.note}
                        </div>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        ₹{(item.amount ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={
                            item.status === "CONFIRMED"
                              ? "status-badge-conf"
                              : "status-badge-est"
                          }
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "#f8fafc", fontWeight: 700 }}>
                    <td colSpan="2" style={{ padding: "14px 12px" }}>
                      TOTAL ESTIMATED COST (incl. 10% Contingency Safety Reserve)
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "14px 12px",
                        color: activeBudgetBreakdown?.isOverBudget
                          ? "#dc2626"
                          : "#059669",
                        fontSize: "16px",
                      }}
                    >
                      ₹
                      {(
                        activeBudgetBreakdown?.totalEstimatedCost ?? 0
                      ).toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "center", padding: "14px 12px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        {activeBudgetBreakdown?.isOverBudget
                          ? "OVER BUDGET"
                          : "WITHIN BUDGET"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* =========================================================
            BUDGET GUARDIAN FINANCIAL INTELLIGENCE & SIMULATOR
            ========================================================= */}
        <section className="trip-plan-guardian-wrapper" style={{ marginTop: "40px" }}>
          <BudgetGuardian
            totalBudget={budget}
            persons={persons}
            days={days}
            destination={destinationName}
            hotelCost={hotelTotal}
            transportCost={travelTotal}
            foodDailyPerPerson={foodPerPersonPerDay}
            localTransitDailyPerPerson={travelPerPersonPerDay}
            miscDailyPerPerson={miscPerPersonPerDay}
            onBudgetChange={(data) => {
              if (data?.persons && data.persons !== livePersons) {
                setLivePersons(data.persons);
              }
              if (data?.days && data.days !== liveDays) {
                setLiveDays(data.days);
              }
            }}
          />
        </section>

        <section className="trip-plan-hotel-section">

          <div className="trip-plan-section-title">

            <span>
              🏨
            </span>

            <div>

              <h2>
                Your Stay
              </h2>

              <p>
                Selected or recommended
                accommodation.
              </p>

            </div>

          </div>

          {recommendedHotel ? (
            <div className="trip-plan-hotel-card">

              <div className="trip-plan-hotel-image-wrapper">

                {recommendedHotel.image ? (
                  <img
                    src={
                      recommendedHotel.image
                    }
                    alt={
                      recommendedHotel.name
                    }
                  />
                ) : (
                  <div className="trip-plan-hotel-placeholder">
                    🏨
                  </div>
                )}

              </div>

              <div className="trip-plan-hotel-content">

                <div className="trip-plan-hotel-top">

                  <div>

                    <span className="trip-plan-hotel-label">

                      {selectedHotelName
                        ? "SELECTED HOTEL"
                        : "BEST VALUE"}

                    </span>

                    <h3>
                      {
                        recommendedHotel.name
                      }
                    </h3>

                  </div>

                  <div className="trip-plan-hotel-rating">

                    ⭐{" "}
                    {recommendedHotel.rating ||
                      "N/A"}

                  </div>

                </div>

                {recommendedHotel.location && (
                  <p className="trip-plan-hotel-location">

                    📍{" "}
                    {
                      recommendedHotel.location
                    }

                  </p>
                )}

                {recommendedHotel.description && (
                  <p className="trip-plan-hotel-description">

                    {
                      recommendedHotel.description
                    }

                  </p>
                )}

                <div className="trip-plan-hotel-bottom">

                  <div>

                    <strong>
                      ₹
                      {hotelPrice.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span>
                      / night
                    </span>

                  </div>

                  <div>

                    <span>
                      {rooms}{" "}
                      {rooms === 1
                        ? "room"
                        : "rooms"}{" "}
                      •{" "}
                      {hotelNights}{" "}
                      {hotelNights === 1
                        ? "night"
                        : "nights"}
                    </span>

                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className="trip-plan-no-hotel">

              <span>
                🏨
              </span>

              <p>
                No hotel information
                available for this
                destination.
              </p>

            </div>
          )}

        </section>

        <section className="trip-plan-daily-cost">

          <div className="trip-plan-section-title">

            <span>
              📊
            </span>

            <div>

              <h2>
                Day-wise Cost Breakdown
              </h2>

              <p>
                Estimated spending for
                every day of your trip.
              </p>

            </div>

          </div>

          <div
            style={{
              background: "#f0fdf4",
              border: "1.5px solid #86efac",
              borderRadius: "14px",
              padding: "14px 20px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>🎯</span>
                <strong style={{ fontSize: "15px", color: "#166534" }}>
                  Day-Wise Budget Matches Whole Trip Cost 100%
                </strong>
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    border: "1px solid #bbf7d0",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  ✓ FULLY RECONCILED
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "#475569" }}>
                Sum of Days 1 to {days}: Base Expenses ₹{baseExpensesSubtotal.toLocaleString("en-IN")} + 10% Emergency Reserve ₹{emergencyBuffer.toLocaleString("en-IN")} = <b>₹{totalCost.toLocaleString("en-IN")}</b>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: 700, display: "block" }}>
                  Total All Days Sum
                </span>
                <strong style={{ fontSize: "18px", color: "#065f46" }}>
                  ₹{totalCost.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>

          <div className="trip-plan-daily-grid">
            {dailyCosts.map((day) => (
              <div
                className={`trip-plan-daily-card ${day.isCheckoutDay ? "checkout-day-card" : ""}`}
                key={day.day}
              >
                <div className="trip-plan-daily-card-header">
                  <div>
                    <div className="trip-plan-day-number">
                      Day {day.day}
                    </div>
                    <div className="trip-plan-daily-date">
                      {day.date}
                    </div>
                  </div>
                  <span className={`trip-plan-day-theme ${day.isCheckoutDay ? "departure" : ""}`}>
                    {day.theme}
                  </span>
                </div>

                <div className="trip-plan-daily-row">
                  <div>
                    <span className="row-main">{day.intercity > 0 ? "🚆 Transit & Travel" : "🚗 Local Travel"}</span>
                    <small className="row-sub">{day.travelNote}</small>
                  </div>
                  <strong>
                    ₹{day.travel.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="trip-plan-daily-row">
                  <div>
                    <span className="row-main">🍛 Food</span>
                    <small className="row-sub">{day.foodNote}</small>
                  </div>
                  <strong>
                    ₹{day.food.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="trip-plan-daily-row">
                  <div>
                    <span className="row-main">🏨 Hotel Stay</span>
                    <small className={`row-sub ${day.isCheckoutDay ? "free-text" : ""}`}>
                      {day.hotelNote}
                    </small>
                  </div>
                  <strong style={{ color: day.isCheckoutDay ? "#059669" : "#123b31" }}>
                    ₹{day.hotel.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="trip-plan-daily-row">
                  <div>
                    <span className="row-main">🎟️ Passes & Entries</span>
                    <small className="row-sub">{day.miscNote}</small>
                  </div>
                  <strong>
                    ₹{day.misc.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="trip-plan-daily-total">
                  <div>
                    <span>Group Total</span>
                    <div className="trip-plan-daily-buffer-tag">
                      Base: ₹{day.baseTotal.toLocaleString("en-IN")} + 10%: +₹{day.buffer.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <strong>
                    ₹{day.total.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="trip-plan-daily-person-cost">
                  <span>Per Person</span>
                  <strong>
                    ₹{day.perPerson.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =========================================================
            LIVE JOURNEY TRACKER & WHAT-IF SIMULATOR
            ========================================================= */}
        <section className="trip-plan-live-tracker-wrapper" style={{ marginTop: "40px" }}>
          <LiveJourneyTracker
            destination={destinationName}
            startDate={startDate}
            days={days}
            hotelName={selectedHotelName}
          />
        </section>

        <section className="trip-plan-itinerary">

          <div className="trip-plan-section-title">

            <span>
              🗺️
            </span>

            <div>

              <h2>
                Your {days}-day itinerary
              </h2>

              <p>
                Explore the best places,
                local experiences and
                activities during your trip.
              </p>

            </div>

          </div>

          <div
            className="smart-itinerary-container"
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {(Array.isArray(activeItineraryDays) && activeItineraryDays.length > 0
              ? activeItineraryDays
              : smartItineraryDays
            ).map((sDay) => {
              const legacyDay = itinerary.find((d) => d.day === sDay.day);
              const timeBlocks = Array.isArray(sDay?.timeBlocks) ? sDay.timeBlocks : [];

              return (
                <div className="smart-day-card" key={sDay.day}>
                  <div
                    className="smart-day-header"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "18px",
                      flexWrap: "wrap",
                      gap: "10px",
                      borderBottom: "1px solid #e2e8f0",
                      paddingBottom: "14px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#0284c7",
                        }}
                      >
                        DAY {sDay.day} SCHEDULE & ROUTE OPTIMIZATION
                      </span>
                      <h3
                        style={{
                          margin: "4px 0 0",
                          fontSize: "19px",
                          color: "#0f172a",
                        }}
                      >
                        {sDay.summary}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#475569",
                        background: "#f1f5f9",
                        padding: "6px 14px",
                        borderRadius: "8px",
                      }}
                    >
                      📅 {sDay.date}
                    </span>
                  </div>

                  {/* VLOGGER-STYLE DAY-WISE WALKTHROUGH */}
                  <div
                    className="vlogger-guide-card"
                    style={{
                      background: "linear-gradient(135deg, rgba(254, 243, 199, 0.45), rgba(254, 249, 195, 0.35))",
                      border: "1px solid #fde68a",
                      borderRadius: "12px",
                      padding: "14px 18px",
                      marginBottom: "16px",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "24px", lineHeight: "1" }}>🎙️</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <strong style={{ fontSize: "0.88rem", color: "#92400e" }}>
                          Vlogger-Style Day Guide (Day {sDay.day})
                        </strong>
                        <span style={{ fontSize: "0.72rem", background: "#fef3c7", color: "#b45309", padding: "1px 6px", borderRadius: "4px", border: "1px solid #fcd34d", fontWeight: 700 }}>
                          Curated Flow
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#451a03", lineHeight: "1.5" }}>
                        {timeBlocks.length > 0
                          ? `“Start your morning at ${timeBlocks[0]?.title || "the first stop"} to beat the crowds. For lunch, explore ${timeBlocks.find(b => b.period === "Midday Meal")?.title || "regional specialties"}, then head over to ${timeBlocks.find(b => b.period === "Afternoon Exploration")?.title || "cultural sights"} in the afternoon. Conclude your day relaxed at ${timeBlocks[timeBlocks.length - 1]?.title || "the evening spot"}.”`
                          : `“Take your time exploring ${sDay.summary}, soaking in local flavors and scenic viewpoints at your own comfortable pace.”`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Time Blocks: Morning, Lunch, Afternoon, Evening */}
                  <div
                    className="time-blocks-list"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    {timeBlocks.map((block, bIdx) => {
                      const isMeal = block.period === "Midday Meal";
                      const isEvening = block.period === "Sunset & Evening";

                      return (
                        <div
                          key={bIdx}
                          className={`time-block-item ${
                            isMeal ? "meal" : isEvening ? "evening" : ""
                          }`}
                        >
                          <div className="time-block-top">
                            <span className="time-slot-badge">
                              <span>{block.icon}</span>
                              <span>{block.timeSlot}</span>
                              <span style={{ opacity: 0.5 }}>•</span>
                              <span>{block.period}</span>
                            </span>
                            <span className="time-block-cost">
                              {block.estimatedCost}
                            </span>
                          </div>

                          <h4 className="time-block-title">{block.title}</h4>

                          <p className="time-block-desc">
                            {block.description}
                          </p>

                          <div className="time-block-meta-row">
                            <span>
                              ⏱️ <b>Duration:</b> {block.duration}
                            </span>
                            <span>
                              🚗 <b>Transit:</b> {block.travelTime} (
                              {block.transportMode})
                            </span>
                            <span>
                              🚶 <b>Walking:</b> {block.walkingIntensity}
                            </span>
                            <span>
                              🎟️ <b>Booking:</b> {block.bookingRequirement}
                            </span>
                          </div>

                          {block.smartReason && (
                            <div className="smart-reason-box">
                              <span>💡</span>
                              <div>
                                <strong>Smart Scheduling Logic:</strong>{" "}
                                {block.smartReason}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Extra Activity / Local Highlights if present for this day */}
                  {legacyDay?.extraActivity && (
                    <div
                      className="trip-plan-extra-activity"
                      style={{ marginTop: "16px" }}
                    >
                      <div className="trip-plan-extra-activity-icon">
                        {legacyDay.extraActivity.icon}
                      </div>
                      <div className="trip-plan-extra-activity-content">
                        <span>{legacyDay.extraActivity.type}</span>
                        <h4>{legacyDay.extraActivity.title}</h4>
                        <p>{legacyDay.extraActivity.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* =========================================================
            TRIP CONFIRMATION, DISEMBARKATION HUBS & COMPLETE BILL SUMMARY (PROCEED TO PAY)
            ========================================================= */}
        <section
          id="trip-arrival-points-section"
          className="trip-plan-arrival-points-section"
          style={{
            marginTop: "36px",
            marginBottom: "36px",
            background: "#ffffff",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 6px 24px rgba(15, 23, 42, 0.05)",
            padding: "28px 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Decorative Header Accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #10b981 0%, #0284c7 100%)",
            }}
          />

          {/* Section Header with Inline Action */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "22px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    background: "#ecfdf5",
                    color: "#059669",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  VERIFIED ARRIVAL HUBS
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    background: "#f0f9ff",
                    color: "#0284c7",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    border: "1px solid #bae6fd",
                  }}
                >
                  📍 PRIMARY GATEWAY: {arrivalPoints?.disembarkationHub || destinationName}
                </span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Arrival & Disembarkation Hubs for {destinationName}
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
                Authentic train stations, nearest commercial airports, and central interstate bus terminals.
              </p>
            </div>

            {/* Quick Action Button & Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block" }}>
                  Estimated Package
                </span>
                <div style={{ fontSize: "24px", fontWeight: 900, color: "#059669", lineHeight: 1.1 }}>
                  ₹{totalBundleCost.toLocaleString("en-IN")}
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenItineraryCheckout}
                className="trip-plan-confirm-btn"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 800,
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "transform 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <span>Confirm & Book Itinerary</span>
                <span style={{ fontSize: "16px" }}>→</span>
              </button>
            </div>
          </div>

          {/* 3-Column Disembarkation Hub Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            {/* Train Hub */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🚆</span> By Train / Rail
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  CODE: {arrivalPoints?.train?.code || "RAIL"}
                </span>
              </div>
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                {arrivalPoints?.train?.station || `${destinationName} Station`}
              </strong>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                {arrivalPoints?.train?.details || "Direct express and superfast rail connection."}
              </p>
            </div>

            {/* Flight Hub */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>✈️</span> By Flight / Air
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    background: "#ede9fe",
                    color: "#6d28d9",
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  IATA: {arrivalPoints?.flight?.code || "AIR"}
                </span>
              </div>
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                {arrivalPoints?.flight?.airport || "Nearest Airport"}
              </strong>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                {arrivalPoints?.flight?.distance || "Direct connecting airport with onward transit."}
              </p>
            </div>

            {/* Interstate Bus Hub */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#d97706", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🚌</span> By Interstate Bus
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    background: "#fef3c7",
                    color: "#b45309",
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  CENTRAL ISBT
                </span>
              </div>
              <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                {arrivalPoints?.bus?.terminal || `${destinationName} Bus Stand`}
              </strong>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                {arrivalPoints?.bus?.details || "State RTC and private luxury sleeper coach terminus."}
              </p>
            </div>
          </div>

          {/* Transit Guidance */}
          {arrivalPoints?.guidance && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#166534",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <span>💡</span>
              <span>
                <strong>Transit Guidance:</strong> {arrivalPoints.guidance}
              </span>
            </div>
          )}

          {/* Subtle Bottom Strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              paddingTop: "14px",
              borderTop: "1px solid #f1f5f9",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#10b981", fontWeight: 700 }}>✓ 30% Flexi-Pay:</span>
              <span>Pay only ₹{itineraryAdvanceCost.toLocaleString("en-IN")} advance now to lock bundle. Remainder ₹{itineraryRemainingCost.toLocaleString("en-IN")} on trip.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>🔒 256-Bit Razorpay Instant Encrypted Checkout</span>
            </div>
          </div>
        </section>

        <section className="trip-plan-whole-trip-section">
          <div className="trip-plan-section-title">
            <span>💰</span>
            <div>
              <h2>Whole Trip Cost</h2>
              <p>Complete transparent cost breakdown for your entire trip.</p>
            </div>
          </div>

          <div className="trip-plan-whole-cost-grid">
            {/* 1. HOTEL */}
            <div className="trip-plan-whole-cost-card">
              <div className="trip-plan-whole-cost-icon">🏨</div>
              <div>
                <span>TOTAL HOTEL STAY</span>
                <h3>₹{hotelTotal.toLocaleString("en-IN")}</h3>
                <p>
                  {rooms} {rooms === 1 ? "room" : "rooms"} × {hotelNights} {hotelNights === 1 ? "night" : "nights"} at database rate.
                </p>
              </div>
            </div>

            {/* 2. INTERCITY TRANSPORT */}
            <div className="trip-plan-whole-cost-card">
              <div className="trip-plan-whole-cost-icon">🚆</div>
              <div>
                <span>INTERCITY TRANSIT (ROUND-TRIP)</span>
                <h3>₹{intercityTransportCost.toLocaleString("en-IN")}</h3>
                <p>
                  {originCity ? `${originCity} ⇄ ${destinationName}` : `${transportPref} transit`} for {persons} travelers.
                </p>
              </div>
            </div>

            {/* 3. LOCAL AUTOS & CITY TRANSIT */}
            <div className="trip-plan-whole-cost-card">
              <div className="trip-plan-whole-cost-icon">🚕</div>
              <div>
                <span>LOCAL AUTOS & CITY COMMUTE</span>
                <h3>₹{localTransitTotal.toLocaleString("en-IN")}</h3>
                <p>
                  ₹{travelPerPersonPerDay}/day/person across all {days} days of sightseeing.
                </p>
              </div>
            </div>

            {/* 4. FOOD & DINING */}
            <div className="trip-plan-whole-cost-card">
              <div className="trip-plan-whole-cost-icon">🍛</div>
              <div>
                <span>TOTAL FOOD & DINING</span>
                <h3>₹{foodTotal.toLocaleString("en-IN")}</h3>
                <p>
                  ₹{foodPerPersonPerDay}/day/person for {persons} travelers over {days} days.
                </p>
              </div>
            </div>

            {/* 5. SIGHTSEEING & PASSES */}
            <div className="trip-plan-whole-cost-card">
              <div className="trip-plan-whole-cost-icon">🎟️</div>
              <div>
                <span>SIGHTSEEING & PASSES</span>
                <h3>₹{miscTotal.toLocaleString("en-IN")}</h3>
                <p>
                  Monuments, entry passes, activities and incidental extras.
                </p>
              </div>
            </div>

            {/* 6. EMERGENCY SAFETY BUFFER */}
            <div className="trip-plan-whole-cost-card buffer-card">
              <div className="trip-plan-whole-cost-icon" style={{ background: "linear-gradient(145deg, #ecfdf5, #d1fae5)", borderColor: "#a7f3d0" }}>🛡️</div>
              <div>
                <span style={{ color: "#059669" }}>10% EMERGENCY SAFETY BUFFER</span>
                <h3 style={{ color: "#065f46" }}>+₹{emergencyBuffer.toLocaleString("en-IN")}</h3>
                <p>
                  Safety contingency reserve for unexpected delays or peak surge.
                </p>
              </div>
            </div>
          </div>

          {/* GRAND TOTAL SUMMARY BANNER */}
          <div className="trip-plan-final-cost-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <span style={{ textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9, fontSize: "11px", fontWeight: 800 }}>
                  TOTAL PROJECTED TRIP BUDGET (RECOMMENDED)
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap", marginTop: "4px" }}>
                  <h2 style={{ margin: "4px 0", fontSize: "38px", color: "#ffffff" }}>
                    ₹{projectedTotalCost.toLocaleString("en-IN")}
                  </h2>
                  <span style={{ fontSize: "13px", background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "12px", color: "#ffffff", fontWeight: 600 }}>
                    Base: ₹{baseExpensesSubtotal.toLocaleString("en-IN")} + 10% Reserve: ₹{emergencyBuffer.toLocaleString("en-IN")}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                  Stay + Intercity Transit + Local Autos + Meals + Passes + 10% Contingency Buffer
                </p>
              </div>

              <div className="trip-plan-cost-stats">
                <div>
                  <span>TOTAL / PERSON</span>
                  <strong>₹{totalCostPerPerson.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span>BASE DIRECT COST</span>
                  <strong>₹{baseExpensesSubtotal.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span>PER PERSON / DAY</span>
                  <strong>₹{costPerPersonPerDay.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            {/* INTUITIVE BUDGET EXPLAINER CALLOUT */}
            <div className="trip-cost-explainer-banner">
              <div className="trip-cost-explainer-title">
                <span>💡</span>
                <strong>Understanding Your Trip Numbers: Base Expenses vs. Projected Total</strong>
              </div>
              <div className="trip-cost-explainer-grid">
                <div className="trip-cost-explainer-box">
                  <div className="explainer-box-header">
                    <span className="explainer-pill base">1. Base Direct Expenses</span>
                    <strong>₹{baseExpensesSubtotal.toLocaleString("en-IN")}</strong>
                  </div>
                  <p>
                    What you directly spend on fixed reservations and daily needs: Hotel (₹{hotelTotal.toLocaleString("en-IN")}), 
                    Intercity travel (₹{intercityTransportCost.toLocaleString("en-IN")}), Local Autos (₹{localTransitTotal.toLocaleString("en-IN")}), 
                    Meals (₹{foodTotal.toLocaleString("en-IN")}), and Sightseeing (₹{miscTotal.toLocaleString("en-IN")}).
                  </p>
                </div>

                <div className="trip-cost-explainer-box highlight">
                  <div className="explainer-box-header">
                    <span className="explainer-pill projected">2. Total Projected Budget</span>
                    <strong>₹{projectedTotalCost.toLocaleString("en-IN")}</strong>
                  </div>
                  <p>
                    Your safe recommended travel bankroll. Includes the 10% Emergency Safety Reserve (+₹{emergencyBuffer.toLocaleString("en-IN")}) 
                    so you are never caught unprepared by unexpected surge fares, medical needs, or transit delays. 
                    <b> Perfectly synchronized with Budget Guardian!</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="group-destination-recommendation">
          <div className="group-recommendation-header">
            <div className="group-recommendation-icon">
              {tripType === "Couple"
                ? "💑"
                : tripType === "Friends"
                  ? "🧑‍🤝‍🧑"
                  : tripType === "Family"
                    ? "👨‍👩‍👧"
                    : tripType === "Solo"
                      ? "🧍"
                      : "👴"}
            </div>

            <div>
              <span>TRAVEL GURUJI SUGGESTION</span>
              <h2>Best Places for {tripType}</h2>
              <p>{groupSuggestionDescription}</p>
            </div>
          </div>

          {currentGroupNote && (
            <div className="group-destination-note">
              <strong>
                {tripType === "Couple"
                  ? "💖 Couple suggestion"
                  : "🔥 Friends suggestion"}
              </strong>
              <p>{currentGroupNote}</p>
            </div>
          )}

          <div className="group-destination-list">
            {groupSuggestions.map((place) => (
              <span key={place}>📍 {place}</span>
            ))}
          </div>

          <p className="group-recommendation-footer">
            You can still visit this destination with your group — this is simply our recommended travel style for the best experience.
          </p>
        </section>

        <section className="local-business-boost">
          <div className="local-business-boost-header">
            <div className="local-business-boost-icon">
              🏪
            </div>

            <div>
              <span>SUPPORT LOCAL TOURISM</span>

              <h2>Discover Local Experiences</h2>

              <p>
                Explore local food, guides, shopping and activities while supporting the tourism businesses of {destination?.name || destinationName}.
              </p>
            </div>
          </div>

          <div className="local-business-boost-grid">
            {localBusinessSuggestions.map((item) => (
              <button
                type="button"
                className="local-business-boost-card"
                key={item.title}
                onClick={() => setExploreCategory(item.category)}
              >
                <div className="local-business-boost-card-icon">
                  {item.icon}
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="local-business-explore-link">
                    Explore 
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="local-business-boost-footer">
            <span className="logo-text" style={{ fontSize: "inherit", color: "inherit" }}>Travel<span>_Guruji</span></span> helps travelers discover local experiences so tourism spending can reach more local businesses.
          </p>
        </section>

        <section className="hidden-gems-plan">
          <div className="hidden-gems-plan-header">
            <div className="hidden-gems-plan-icon">
              🌿
            </div>

            <div>
              <span>SMART TRAVEL DISCOVERY</span>
              <h2>Hidden Gems & Smart Travel Time</h2>
              <p>
                Discover quieter nearby places and consider travelling outside the busiest period for a more relaxed experience.
              </p>
            </div>
          </div>

          <div className="hidden-gems-grid">
            <div className="hidden-gems-box">
              <span>🌿 HIDDEN GEMS</span>
              <h3>Explore beyond the usual spots</h3>
              <div className="hidden-gems-list">
                {hiddenGems.map((place) => (
                  <span key={place}>📍 {place}</span>
                ))}
              </div>
            </div>

            <div className="hidden-gems-box">
              <span>🌤️ SMART TRAVEL TIME</span>
              <h3>Travel a little smarter</h3>
              <p>{offSeasonText}</p>
            </div>
          </div>
        </section>

        {exploreCategory && (
          <div
            className="local-business-modal-backdrop"
            onClick={() => setExploreCategory("")}
          >
            <div
              className="local-business-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="local-business-modal-header">
                <div>
                  <span>EXPLORE {destinationName.toUpperCase()}</span>
                  <h2>{activeBusinessTitle}</h2>
                  <p>Curated local options for your destination.</p>
                </div>

                <button
                  type="button"
                  className="local-business-modal-close"
                  onClick={() => setExploreCategory("")}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="local-business-modal-list">
                {activeBusinessItems.length > 0 ? (
                  [...activeBusinessItems]
                    .sort((a, b) =>
                      a.tag === "Top Pick" ? -1 : b.tag === "Top Pick" ? 1 : 0
                    )
                    .map((item) => (
                      <div className="local-business-detail-card" key={item.name}>
                        <div>
                          <span className="local-business-tag">{item.tag}</span>
                          <h3>{item.name}</h3>
                          <p>{item.detail}</p>
                        </div>
                        <strong>{item.price}</strong>
                      </div>
                    ))
                ) : (
                  <div className="local-business-empty">
                    Local listings for this category are coming soon for {destinationName}.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="student-smart-plan">

          <div className="student-smart-plan-header">

            <div className="student-smart-plan-icon">
              🎓
            </div>

            <div>

              <span>
                TRAVEL GURUJI
              </span>

              <h2>
                Student Smart Travel Plan
              </h2>

              <p>
                A practical low-cost plan
                designed especially for
                students and college groups.
              </p>

            </div>

          </div>

          <div className="student-smart-plan-grid">

            <div className="student-smart-item">

              <div>
                🚌
              </div>

              <section>

                <h4>
                  Choose Budget Travel
                </h4>

                <p>
                  Prefer public transport,
                  shared cabs or group travel
                  whenever possible.
                </p>

              </section>

            </div>

            <div className="student-smart-item">

              <div>
                🍱
              </div>

              <section>

                <h4>
                  Save on Food
                </h4>

                <p>
                  Try local food and
                  student-friendly cafés
                  instead of expensive
                  restaurants.
                </p>

              </section>

            </div>

            <div className="student-smart-item">

              <div>
                🏨
              </div>

              <section>

                <h4>
                  Share Rooms
                </h4>

                <p>
                  Sharing rooms between
                  students helps reduce
                  hotel expenses.
                </p>

              </section>

            </div>

            <div className="student-smart-item">

              <div>
                🎒
              </div>

              <section>

                <h4>
                  Keep Extra Budget
                </h4>

                <p>
                  Keep a small emergency
                  amount for unexpected
                  travel expenses.
                </p>

              </section>

            </div>

            <div className="student-smart-item">

              <div>
                🛍️
              </div>

              <section>

                <h4>
                  Smart Shopping
                </h4>

                <p>
                  Compare prices before
                  buying souvenirs and
                  local products.
                </p>

              </section>

            </div>

            <div className="student-smart-item">

              <div>
                📱
              </div>

              <section>

                <h4>
                  Group Planning
                </h4>

                <p>
                  Share maps, bookings and
                  daily expenses with the
                  whole group.
                </p>

              </section>

            </div>

          </div>

          <div className="student-smart-budget" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 24px", background: "linear-gradient(135deg, #0f3d32 0%, #165345 100%)", borderRadius: "18px", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", width: "100%" }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", textTransform: "uppercase" }}>
                  SUBSIDIZED STUDENT CONCESSION ESTIMATE
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
                  <span style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.5)", textDecoration: "line-through" }}>
                    ₹{costPerPersonPerDay.toLocaleString("en-IN")}/day
                  </span>
                  <strong style={{ fontSize: "24px", color: "#4ade80", fontWeight: "800" }}>
                    ₹{studentCostPerPersonPerDay.toLocaleString("en-IN")}
                  </strong>
                  <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }}>
                    / student / day
                  </span>
                  <span style={{ background: "#22c55e", color: "#ffffff", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px" }}>
                    Save ~{studentSavingsPercent}%
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.65)", display: "block" }}>
                  Total Student Group Spend ({persons} students • {days} days)
                </span>
                <strong style={{ fontSize: "20px", color: "#ffffff" }}>
                  ₹{studentTotalCost.toLocaleString("en-IN")}
                </strong>
                <span style={{ fontSize: "11px", color: "#86efac", display: "block", fontWeight: "700" }}>
                  (Saves ₹{studentSavingsTotal.toLocaleString("en-IN")} vs normal)
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", width: "100%", borderTop: "1px solid rgba(255, 255, 255, 0.12)", paddingTop: "12px", fontSize: "11px", color: "rgba(255, 255, 255, 0.85)" }}>
              <span>🚆 50% IRCTC Sleeper Rail Concession</span>
              <span>🏨 Youth Hostel / Homestay Beds (₹550/nt)</span>
              <span>🍱 Subsidized Mess & Student Dhabas (~₹200/d)</span>
              <span>🏛️ 50% ASI Heritage & Museum Concession</span>
            </div>
          </div>

          <div className="student-smart-plan-action">
            <div>
              <span>
                WANT A STUDENT-FRIENDLY TRIP?
              </span>

              <p>
                Create a verified student plan with IRCTC concessions, backpacker dorms, and guaranteed low budgets.
              </p>
            </div>

            <Link
              to={`/student-plan?destination=${encodeURIComponent(
                destinationName
              )}&startDate=${encodeURIComponent(
                startDate
              )}&hotel=${encodeURIComponent(
                selectedHotelName
              )}&persons=${persons}&days=${days}&budget=${studentTotalCost}&studentBudgetPerHead=${studentCostPerPersonPerDay * days}&tripType=Students`}
              className="create-student-plan-button"
            >
              🎓 Open Student Portal (₹{studentCostPerPersonPerDay.toLocaleString("en-IN")}/day) ➔
            </Link>
          </div>

        </section>

        {/* =========================================================
            SAFETY INTELLIGENCE, EMERGENCY HELPLINES & SOS
            ========================================================= */}
        <section className="trip-plan-safety-wrapper" style={{ marginTop: "40px" }}>
          <SafetyIntelligence destination={destinationName} />
        </section>

        {saveStatus && (
          <div
            style={{
              maxWidth: "640px",
              margin: "0 auto 20px auto",
              padding: "14px 20px",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "14px",
              background:
                saveStatus.type === "success" ? "#ecfdf5" : "#fef2f2",
              border:
                saveStatus.type === "success"
                  ? "1px solid #10b981"
                  : "1px solid #ef4444",
              color:
                saveStatus.type === "success" ? "#065f46" : "#991b1b",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            {saveStatus.type === "success" ? "✅ " : "⚠️ "}
            {saveStatus.message}
            {saveStatus.type === "success" && (
              <Link
                to="/plan-history"
                style={{
                  marginLeft: "12px",
                  color: "#047857",
                  textDecoration: "underline",
                  fontWeight: 700,
                }}
              >
                View in Plan History →
              </Link>
            )}
          </div>
        )}

        <div className="trip-plan-actions" style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>

          <button
            type="button"
            onClick={handleSavePlan}
            disabled={isSavingPlan}
            className="trip-plan-secondary-btn"
            style={{
              borderColor: "#10b981",
              color: "#10b981",
              cursor: isSavingPlan ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isSavingPlan ? "⏳ Saving Plan..." : "💾 Save Plan"}
          </button>

          <Link
            to="/planner"
            className="trip-plan-secondary-btn"
          >
            ✏️ Edit Trip
          </Link>

          <Link
            to={`/transport?destination=${encodeURIComponent(
              destinationName
            )}&date=${encodeURIComponent(startDate)}`}
            className="trip-plan-secondary-btn"
            style={{ borderColor: "#38bdf8", color: "#38bdf8" }}
          >
            🚆 Book Transport
          </Link>

          <Link
            to={`/hotels?destination=${encodeURIComponent(destinationName)}`}
            className="trip-plan-secondary-btn"
            style={{ borderColor: "#34d399", color: "#34d399" }}
          >
            🏨 Stays
          </Link>

          <button
            type="button"
            className="trip-plan-confirm-btn"
            onClick={handleOpenItineraryCheckout}
            style={{ cursor: "pointer", border: "none" }}
          >
            ✓ Confirm & Book Itinerary (Proceed to Pay)
          </button>

          <Link
            to="/destinations"
            className="trip-plan-primary-btn"
          >
            Explore More 
          </Link>

        </div>

      </section>

      {/* ITINERARY BUNDLE CHECKOUT MODAL */}
      {isItineraryModalOpen && (
        <div className="hotel-modal-backdrop" onClick={() => setIsItineraryModalOpen(false)}>
          <div className="hotel-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className="hotel-modal-header">
              <div className="hotel-modal-badge">[ITINERARY BUNDLE & CHECKOUT]</div>
              <button
                type="button"
                className="hotel-modal-close-btn"
                onClick={() => setIsItineraryModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
              <h2>Confirm & Reserve Your Trip</h2>
              <p className="hotel-modal-subtitle">
                {days} Days in <strong>{destinationName}</strong> • {persons} Traveler(s)
              </p>
            </div>

            <div className="hotel-modal-summary">
              <div className="hotel-modal-summary-item">
                <span>Destination</span>
                <strong>📍 {destinationName}</strong>
              </div>
              <div className="hotel-modal-summary-item">
                <span>Departure Date</span>
                <strong>{startDate || "Upcoming"}</strong>
              </div>
              <div className="hotel-modal-summary-item highlight">
                <span>Total Bundle Value</span>
                <strong className="price-tag">₹{totalBundleCost.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {itineraryBookingError && (
              <div className="hotel-modal-error">⚠️ {itineraryBookingError}</div>
            )}

            {/* Bundle items selector */}
            <div style={{ marginBottom: "16px", background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "10px" }}>
                BUNDLE INCLUSIONS (SELECT ALL OR CUSTOMIZE)
              </label>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={bundleTransport}
                      onChange={(e) => setBundleTransport(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>🚆 Intercity Transit / Trains</strong>
                      <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                        {originCity ? `${originCity} ⇄ ${destinationName}` : "Round-trip rail/transit"}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: "#0c2340", fontSize: "13px" }}>₹{bundleTransportCost.toLocaleString("en-IN")}</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={bundleHotel}
                      onChange={(e) => setBundleHotel(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>🏨 Verified Hotel Accommodations</strong>
                      <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                        {selectedHotelName || recommendedHotel?.name || "Verified Stay"} ({Math.max(1, days - 1)} Nights)
                      </p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: "#0c2340", fontSize: "13px" }}>₹{bundleHotelCost.toLocaleString("en-IN")}</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={bundleActivities}
                      onChange={(e) => setBundleActivities(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>🎟️ Curated Experiences & Activities Pass</strong>
                      <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                        Activities, local guided tours, entry passes
                      </p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: "#0c2340", fontSize: "13px" }}>₹{bundleActivitiesCost.toLocaleString("en-IN")}</span>
                </label>
              </div>
            </div>

            {/* Payment Plan selector: Installment 30% vs Full 100% */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "8px" }}>
                SELECT PAYMENT PLAN
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div
                  style={{
                    border: `1.5px solid ${itineraryPaymentPlan === "INSTALLMENT_ADVANCE" ? "#0284c7" : "#cbd5e1"}`,
                    background: itineraryPaymentPlan === "INSTALLMENT_ADVANCE" ? "#f0f9ff" : "#ffffff",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setItineraryPaymentPlan("INSTALLMENT_ADVANCE")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px", color: "#0c2340" }}>Trip Installment (30%)</strong>
                    <span style={{ fontSize: "9px", fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "1px 5px", borderRadius: "4px" }}>Recommended</span>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#0c2340" }}>
                    ₹{itineraryAdvanceCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "#64748b" }}>now</small>
                  </div>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: "4px 0 0" }}>
                    Pay 30% advance now to lock bundle. Remainder ₹{itineraryRemainingCost.toLocaleString("en-IN")} payable upon departure.
                  </p>
                </div>

                <div
                  style={{
                    border: `1.5px solid ${itineraryPaymentPlan === "FULL" ? "#0284c7" : "#cbd5e1"}`,
                    background: itineraryPaymentPlan === "FULL" ? "#f0f9ff" : "#ffffff",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setItineraryPaymentPlan("FULL")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px", color: "#0c2340" }}>Full Payment (100%)</strong>
                    <span style={{ fontSize: "9px", fontWeight: 700, background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px" }}>Complete</span>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#0c2340" }}>
                    ₹{totalBundleCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "#64748b" }}>now</small>
                  </div>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: "4px 0 0" }}>
                    Complete 100% upfront settlement with zero balance remaining.
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <form onSubmit={handleItineraryProceedToPay} className="hotel-modal-form">
              <div className="hotel-modal-form-group">
                <label htmlFor="itn-lead-guest">Lead Traveler Full Name *</label>
                <input
                  id="itn-lead-guest"
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="hotel-modal-form-row">
                <div className="hotel-modal-form-group">
                  <label htmlFor="itn-guest-email">Email Address *</label>
                  <input
                    id="itn-guest-email"
                    type="email"
                    required
                    placeholder="e.g. ananya@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>
                <div className="hotel-modal-form-group">
                  <label htmlFor="itn-guest-phone">Mobile Phone</label>
                  <input
                    id="itn-guest-phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="hotel-modal-submit-btn"
                disabled={itineraryBookingLoading}
              >
                {itineraryBookingLoading ? "Processing..." : `Proceed to Pay (₹${payableNowAmount.toLocaleString("en-IN")}) ➔`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Universal Razorpay Modal for Itinerary */}
      {isRazorpayModalOpen && (
        <RazorpayPaymentModal
          isOpen={isRazorpayModalOpen}
          onClose={() => setIsRazorpayModalOpen(false)}
          onPaymentSuccess={handleItineraryPaymentSuccess}
          totalAmount={totalBundleCost}
          bookingTitle={`Trip to ${destinationName} (${days} Days)`}
          bookingSubtitle={`${persons} Traveler(s) • ${itineraryPaymentPlan === "INSTALLMENT_ADVANCE" ? "30% Advance Installment" : "Full Payment"}`}
          bookingType="TripPlan"
          guestInfo={{
            name: guestName,
            email: guestEmail,
            phone: guestPhone,
          }}
          allowInstallment={true}
          defaultPlan={itineraryPaymentPlan}
          advancePercentage={itineraryAdvancePercentage}
        />
      )}

    </div>
  );
}

function TripPlanWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <TripPlan {...props} />
    </ErrorBoundary>
  );
}

export default TripPlanWithErrorBoundary;