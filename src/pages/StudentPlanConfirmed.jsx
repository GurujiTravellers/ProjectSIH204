import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getDestinations, getHotels } from "../services/api";
import { jsPDF } from "jspdf";
import { savePlan } from "../services/planApi";

const CONTACT_PHONE = "7596870561";
const CONTACT_EMAIL = "travelGuruji2026@gmail.com";

function StudentPlanConfirmed() {
  const [searchParams] = useSearchParams();

  const destinationName =
    searchParams.get("destination") || "Your Destination";
  const startDate = searchParams.get("startDate") || "";
  const hotelName = searchParams.get("hotel") || "Selected Hotel";
  const persons = Number(searchParams.get("persons")) || 1;
  const days = Number(searchParams.get("days")) || 1;
  const budget = Number(searchParams.get("budget")) || 0;
  const tripType = searchParams.get("tripType") || "Friends";
  const studentCost = Number(searchParams.get("studentCost")) || 0;
  const bookingRef = searchParams.get("bookingRef") || "";
  const paymentPlan = searchParams.get("paymentPlan") || "";
  const amountPaid = Number(searchParams.get("amountPaid")) || 0;
  const remainingBalance = Number(searchParams.get("remainingBalance")) || 0;
  const razorpayId = searchParams.get("razorpayId") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "";
  const [saveMessage, setSaveMessage] = useState("");
  const [destination, setDestination] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("travelGurujiToken");

    if (!token) {
      setSaveMessage("Login is required to save this plan to Plan History.");
      return;
    }

    const historyKey = `travelGurujiStudentPlan:${destinationName}:${startDate}:${hotelName}:${persons}:${days}:${budget}:${tripType}:${studentCost}`;

    if (sessionStorage.getItem(historyKey)) {
      setSaveMessage("Saved in your Plan History.");
      return;
    }

    savePlan({
      planType: "Student",
      destination: destinationName,
      startDate,
      hotel: hotelName,
      persons,
      days,
      budget,
      tripType,
      studentCost,
      localExperiences: [],
    })
      .then(() => {
        sessionStorage.setItem(historyKey, "saved");
        setSaveMessage("Saved in your Plan History.");
      })
      .catch((error) => {
        console.error("Student Plan History save failed:", error);
        setSaveMessage("Plan confirmed. History save failed — please check backend.");
      });
  }, [
    destinationName,
    startDate,
    hotelName,
    persons,
    days,
    budget,
    tripType,
    studentCost,
  ]);

  useEffect(() => {
    const loadPlanData = async () => {
      try {
        const [destinationResponse, hotelResponse] = await Promise.all([
          getDestinations({ search: destinationName }),
          getHotels({
            search: hotelName,
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
              item.name?.toLowerCase() === destinationName.toLowerCase()
          ) ||
          destinationList[0] ||
          null;

        const matchedHotel =
          hotelList.find(
            (item) =>
              item.name?.toLowerCase() === hotelName.toLowerCase()
          ) || null;

        setDestination(matchedDestination);
        setHotel(matchedHotel);
      } catch (error) {
        console.error("Student PDF data loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlanData();
  }, [destinationName, hotelName]);

  const itinerary = useMemo(() => {
    return Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      title:
        index === 0
          ? "Arrival & Local Exploration"
          : index === days - 1
          ? "Final Exploration & Departure"
          : "Explore & Enjoy",
      description:
        index === 0
          ? `Reach ${destinationName}, check in and explore nearby affordable places.`
          : index === days - 1
          ? "Enjoy one final activity and prepare for the return journey."
          : `Explore popular places in ${destinationName} and enjoy local experiences.`,
    }));
  }, [days, destinationName]);

  const createStudentPdf = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    // Travel Guruji project palette.
    const green = [18, 77, 61];
    const dark = [28, 55, 48];
    const muted = [100, 116, 108];
    const line = [216, 229, 223];
    const soft = [242, 248, 245];
    const pale = [232, 244, 238];
    const white = [255, 255, 255];

    let pageNumber = 1;
    let y = 32;

    const toDataUrl = async (src) => {
      if (!src) return null;
      if (src.startsWith("data:image/")) {
        return {
          dataUrl: src,
          format: src.includes("image/png") ? "PNG" : "JPEG",
        };
      }

      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error("Image request failed");

        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        return {
          dataUrl,
          format: blob.type.includes("png") ? "PNG" : "JPEG",
        };
      } catch (error) {
        console.warn("PDF image could not be loaded:", error);
        return null;
      }
    };

    const loadFaviconLogo = async () => {
      try {
        const response = await fetch("/favicon.svg");
        if (!response.ok) {
          throw new Error("favicon.svg could not be loaded");
        }

        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        return await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = dataUrl;
        });
      } catch (error) {
        console.warn("Travel Guruji favicon could not be loaded:", error);
        return null;
      }
    };

    const createBrandImage = async (textColor = "#17241f") => {
      if (typeof document === "undefined") return null;

      try {
        // The browser uses the same project branding fonts:
        // "Travel" -> Rockwell, "_Guruji" -> Segoe Print.
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        const faviconImage = await loadFaviconLogo();

        const scale = 3;
        const canvas = document.createElement("canvas");
        canvas.width = 1100 * scale;
        canvas.height = 180 * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.scale(scale, scale);
        ctx.clearRect(0, 0, 1100, 180);

        const baseFontSize = 58;
        const logoSize = 76;
        const logoGap = 18;
        const textStartX = logoSize + logoGap;
        const centerY = 90;

        ctx.font = `700 ${baseFontSize}px Rockwell, sans-serif`;
        const travelWidth = ctx.measureText("Travel").width;

        ctx.font = `400 ${baseFontSize}px "Segoe Print", cursive`;
        const gurujiWidth = ctx.measureText("_Guruji").width;

        const totalWidth = textStartX + travelWidth + gurujiWidth + 12;
        const offsetX = Math.max(0, (1100 - totalWidth) / 2);

        // Always place the supplied favicon.svg mark before Travel_Guruji.
        if (faviconImage) {
          ctx.drawImage(
            faviconImage,
            offsetX,
            centerY - logoSize / 2,
            logoSize,
            logoSize
          );
        }

        ctx.fillStyle = textColor;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";

        ctx.font = `700 ${baseFontSize}px Rockwell, sans-serif`;
        ctx.fillText("Travel", offsetX + textStartX, centerY);

        ctx.font = `400 ${baseFontSize}px "Segoe Print", cursive`;
        ctx.fillText(
          "_Guruji",
          offsetX + textStartX + travelWidth,
          centerY
        );

        return {
          dataUrl: canvas.toDataURL("image/png"),
          width: totalWidth,
          height: 130,
        };
      } catch (error) {
        console.warn("Travel_Guruji PDF logo could not be rendered:", error);
        return null;
      }
    };

    const brandDark = await createBrandImage("#17241f");
    const brandWhite = await createBrandImage("#ffffff");

    const drawBrand = (
      brandImage,
      x,
      yPos,
      width = 39,
      height = 6.5
    ) => {
      if (!brandImage) return false;

      doc.addImage(
        brandImage.dataUrl,
        "PNG",
        x,
        yPos - height + 1,
        width,
        height
      );
      return true;
    };

    const destinationImage = await toDataUrl(destination?.image);
    const hotelImage = await toDataUrl(hotel?.image);

    // Prepare a blurred full-page destination background. A light white veil
    // keeps the project's cards/text readable while preserving the destination.
    const createBlurredBackground = async (image) => {
      if (!image || typeof document === "undefined") return null;

      try {
        const loadedImage = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = image.dataUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = 1240;
        canvas.height = 1754;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        const targetRatio = canvas.width / canvas.height;
        const sourceRatio = loadedImage.width / loadedImage.height;

        let sourceWidth = loadedImage.width;
        let sourceHeight = loadedImage.height;
        let sourceX = 0;
        let sourceY = 0;

        if (sourceRatio > targetRatio) {
          sourceWidth = loadedImage.height * targetRatio;
          sourceX = (loadedImage.width - sourceWidth) / 2;
        } else if (sourceRatio < targetRatio) {
          sourceHeight = loadedImage.width / targetRatio;
          sourceY = (loadedImage.height - sourceHeight) / 2;
        }

        ctx.save();
        ctx.filter = "blur(10px)";
        ctx.drawImage(
          loadedImage,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          -18,
          -18,
          canvas.width + 36,
          canvas.height + 36
        );
        ctx.restore();

        // Soft project-style white overlay over the blurred destination.
        ctx.fillStyle = "rgba(255,255,255,0.76)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return {
          dataUrl: canvas.toDataURL("image/jpeg", 0.84),
          format: "JPEG",
        };
      } catch (error) {
        console.warn("Student PDF blurred background failed:", error);
        return image;
      }
    };

    const destinationBackground =
      await createBlurredBackground(destinationImage);

    const drawPageChrome = () => {
      if (destinationBackground) {
        doc.addImage(
          destinationBackground.dataUrl,
          destinationBackground.format,
          0,
          0,
          pageWidth,
          pageHeight
        );
      } else {
        doc.setFillColor(...soft);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      }

      // Project green top rule.
      doc.setFillColor(...green);
      doc.setGState(new doc.GState({ opacity: 0.96 }));
      doc.rect(0, 0, pageWidth, 5, "F");
      doc.setGState(new doc.GState({ opacity: 1 }));

      // Favicon + Travel_Guruji logo.
      drawBrand(brandDark, margin, 15, 39, 6.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text("Explore  •  Plan  •  Travel  •  Repeat", margin, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text(`Page ${pageNumber}`, pageWidth - margin, 15, {
        align: "right",
      });

      doc.setDrawColor(...line);
      doc.setLineWidth(0.35);
      doc.line(margin, 25, pageWidth - margin, 25);
    };

    const drawFooter = () => {
      const footerY = pageHeight - 13;

      doc.setDrawColor(...line);
      doc.setLineWidth(0.35);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

      drawBrand(brandDark, margin, footerY + 1, 34, 5.7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...muted);
      doc.text(
        `${CONTACT_PHONE}  •  ${CONTACT_EMAIL}`,
        pageWidth / 2,
        footerY,
        { align: "center" }
      );

      doc.text("Confirmed Student Plan", pageWidth - margin, footerY, {
        align: "right",
      });
    };

    const newPage = () => {
      drawFooter();
      doc.addPage();
      pageNumber += 1;
      drawPageChrome();
      y = 32;
    };

    const ensureSpace = (height = 20) => {
      if (y + height > pageHeight - 25) {
        newPage();
      }
    };

    const sectionTitle = (title, subtitle = "") => {
      ensureSpace(subtitle ? 24 : 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...green);
      doc.text(title, margin, y);

      if (subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...muted);
        doc.text(subtitle, pageWidth - margin, y, {
          align: "right",
        });
      }

      y += 5;
      doc.setDrawColor(...line);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    };

    const addWrappedText = (
      text,
      x,
      startY,
      width,
      fontSize = 8,
      color = muted,
      maxLines = 4
    ) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);

      const lines = doc.splitTextToSize(String(text || ""), width);
      doc.text(lines.slice(0, maxLines), x, startY);

      return Math.min(lines.length, maxLines) * (fontSize * 0.42);
    };

    drawPageChrome();

    // COVER / HERO — same visual language as the normal confirmed plan,
    // but explicitly branded for students.
    const heroY = 32;
    const heroHeight = 76;

    if (destinationImage) {
      doc.addImage(
        destinationImage.dataUrl,
        destinationImage.format,
        margin,
        heroY,
        contentWidth,
        heroHeight
      );

      doc.setFillColor(...green);
      doc.setGState(new doc.GState({ opacity: 0.46 }));
      doc.rect(margin, heroY, contentWidth, heroHeight, "F");
      doc.setGState(new doc.GState({ opacity: 1 }));
    } else {
      doc.setFillColor(...green);
      doc.roundedRect(
        margin,
        heroY,
        contentWidth,
        heroHeight,
        6,
        6,
        "F"
      );
    }

    drawBrand(brandWhite, margin + 9, heroY + 16, 42, 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...white);
    doc.text("CONFIRMED STUDENT JOURNEY", margin + 54, heroY + 13);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);
    doc.text(
      "Your Student Trip is Confirmed",
      margin + 9,
      heroY + 30
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `A personalised student travel plan for ${destinationName}`,
      margin + 9,
      heroY + 40
    );

    doc.setFillColor(...white);
    doc.roundedRect(
      margin + 9,
      heroY + 51,
      49,
      15,
      3,
      3,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...green);
    doc.text("CONFIRMED", margin + 33.5, heroY + 60.5, {
      align: "center",
    });

    y = heroY + heroHeight + 14;

    // SNAPSHOT — same six-box structure as the normal PDF.
    sectionTitle("TRIP SNAPSHOT", "PERSONALISED FOR YOU");

    const snapshot = [
      ["DESTINATION", destinationName],
      ["START DATE", startDate || "Not selected"],
      ["DURATION", `${days} ${days === 1 ? "Day" : "Days"}`],
      ["STUDENTS", `${persons} ${persons === 1 ? "Student" : "Students"}`],
      ["TRIP TYPE", tripType],
      ["HOTEL", hotel?.name || hotelName],
    ];

    const boxGap = 4;
    const boxWidth = (contentWidth - boxGap * 2) / 3;
    const boxHeight = 24;

    snapshot.forEach(([label, value], index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = margin + col * (boxWidth + boxGap);
      const boxY = y + row * (boxHeight + boxGap);

      doc.setFillColor(...soft);
      doc.setDrawColor(...line);
      doc.roundedRect(
        x,
        boxY,
        boxWidth,
        boxHeight,
        3,
        3,
        "FD"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...muted);
      doc.text(label, x + 5, boxY + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...dark);

      const valueLines = doc.splitTextToSize(
        String(value),
        boxWidth - 10
      );
      doc.text(valueLines.slice(0, 2), x + 5, boxY + 14);
    });

    y += (boxHeight + boxGap) * 2 + 6;

    // STAY DETAILS — uses the selected hotel visually while the student
    // budget remains the student-plan amount passed to this page.
    sectionTitle(
      "STAY DETAILS",
      hotel?.rating ? `${hotel.rating} / 5 RATING` : "SELECTED HOTEL"
    );

    const hotelCardHeight = hotelImage ? 48 : 36;
    ensureSpace(hotelCardHeight + 6);

    doc.setFillColor(249, 252, 250);
    doc.setDrawColor(...line);
    doc.roundedRect(
      margin,
      y,
      contentWidth,
      hotelCardHeight,
      4,
      4,
      "FD"
    );

    if (hotelImage) {
      doc.addImage(
        hotelImage.dataUrl,
        hotelImage.format,
        margin + 4,
        y + 4,
        58,
        40
      );
    }

    const hotelX = hotelImage ? margin + 69 : margin + 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text(hotel?.name || hotelName, hotelX, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);

    const hotelLocation =
      hotel?.location || hotel?.destination || destinationName;

    doc.text(`Location: ${hotelLocation}`, hotelX, y + 17);

    if (hotel?.price) {
      doc.text(
        `Listed rate: Rs. ${Number(hotel.price).toLocaleString("en-IN")} / night`,
        hotelX,
        y + 24
      );
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...green);
    doc.text("Student stay: shared-room estimate", hotelX, y + 32);

    y += hotelCardHeight + 8;

    // ITINERARY — same card/list rhythm as normal confirmed PDF.
    sectionTitle(
      "YOUR STUDENT ITINERARY",
      `${days} ${days === 1 ? "DAY" : "DAYS"} PLAN`
    );

    itinerary.forEach((item) => {
      ensureSpace(28);

      const rowHeight = 24;

      doc.setFillColor(250, 252, 251);
      doc.setDrawColor(...line);
      doc.roundedRect(
        margin,
        y,
        contentWidth,
        rowHeight,
        2,
        2,
        "FD"
      );

      doc.setFillColor(...green);
      doc.circle(margin + 7, y + 7, 4.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...white);
      doc.text(String(item.day), margin + 7, y + 9.3, {
        align: "center",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...dark);
      doc.text(
        `Day ${item.day}  •  ${item.title}`,
        margin + 15,
        y + 7
      );

      addWrappedText(
        item.description,
        margin + 15,
        y + 14,
        contentWidth - 20,
        7,
        muted,
        2
      );

      y += rowHeight + 4;
    });

    // Keep the normal-plan budget summary position and style, but use the
    // actual student cost.
    sectionTitle(
      "BUDGET & TRIP SUMMARY",
      "STUDENT-FRIENDLY ESTIMATE"
    );

    ensureSpace(58);

    const budgetCardY = y;
    const budgetCardHeight = 46;

    doc.setFillColor(...green);
    doc.roundedRect(
      margin,
      budgetCardY,
      contentWidth,
      budgetCardHeight,
      5,
      5,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(205, 230, 218);
    doc.text("PLANNED STUDENT BUDGET", margin + 8, budgetCardY + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...white);
    doc.text(
      `Rs. ${studentCost.toLocaleString("en-IN")}`,
      margin + 8,
      budgetCardY + 24
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(220, 239, 230);
    doc.text(
      `Approx. Rs. ${Math.round(
        studentCost / Math.max(1, persons)
      ).toLocaleString("en-IN")} per student`,
      margin + 8,
      budgetCardY + 33
    );

    doc.setFillColor(...white);
    doc.roundedRect(
      pageWidth - margin - 44,
      budgetCardY + 10,
      36,
      25,
      4,
      4,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...green);
    doc.text(
      "STUDENT",
      pageWidth - margin - 26,
      budgetCardY + 19,
      { align: "center" }
    );
    doc.text(
      "PLAN",
      pageWidth - margin - 26,
      budgetCardY + 27,
      { align: "center" }
    );

    y += budgetCardHeight + 12;

    sectionTitle("STUDENT PLAN NOTES");

    const notes = [
      "Budget is designed around shared student travel, simple local food and controlled daily spending.",
      "Accommodation is presented as a shared-room student estimate rather than the hotel's full standard rate.",
      "Actual transport, food and hotel prices can vary by destination, date and availability.",
    ];

    notes.forEach((note) => {
      ensureSpace(16);

      doc.setFillColor(...soft);
      doc.roundedRect(
        margin,
        y,
        contentWidth,
        13,
        3,
        3,
        "F"
      );

      doc.setFillColor(...green);
      doc.circle(margin + 6, y + 6.5, 2.1, "F");

      addWrappedText(
        note,
        margin + 11,
        y + 8.5,
        contentWidth - 18,
        7,
        muted,
        2
      );

      y += 17;
    });

    sectionTitle("ABOUT TRAVEL GURUJI");

    ensureSpace(32);

    doc.setFillColor(...soft);
    doc.roundedRect(
      margin,
      y,
      contentWidth,
      30,
      4,
      4,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...green);
    doc.text(
      "Plan. Travel. Experience.",
      margin + 7,
      y + 9
    );

    addWrappedText(
      "Travel Guruji helps travellers discover destinations, plan trips easily, find suitable hotels, explore local experiences and manage travel budgets in one place. We aim to make travel simple, practical and enjoyable, including for college students.",
      margin + 7,
      y + 16,
      contentWidth - 14,
      7.5,
      muted,
      3
    );

    y += 39;

    ensureSpace(22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...green);
    doc.text(
      "Thank you for choosing Travel Guruji.",
      margin,
      y
    );

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text(
      "Keep this confirmed Student Plan for your travel reference.",
      margin,
      y
    );

    drawFooter();

    return doc.output("blob");
  };

  const openStudentPdf = async () => {
    if (loading) {
      alert("Student Plan PDF is still preparing. Please try again in a moment.");
      return;
    }

    try {
      const blob = await createStudentPdf();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Student PDF creation failed:", error);
      alert("Student Plan PDF could not be created.");
    }
  };

  return (
    <main className="student-confirmed-page">
      <section className="student-confirmed-card">
        <div className="student-confirmed-icon">✓</div>

        <span className="student-confirmed-label">
          TRAVEL GURUJI • STUDENT TRAVEL
        </span>

        <h1>Student Plan Confirmed</h1>

        <p>
          Your student-friendly {destinationName} trip has
          been confirmed successfully.
        </p>

        <div className="student-confirmed-status">
          <span>🎓</span>
          <div>
            <strong>Student trip booked</strong>
            <p>
              Your affordable Student Plan has been saved
              as your confirmed student trip.
            </p>
          </div>
        </div>

        <div className="student-confirmed-summary">
          <div>
            <span>DESTINATION</span>
            <strong>{destinationName}</strong>
          </div>

          <div>
            <span>DURATION</span>
            <strong>{days} Days</strong>
          </div>

          <div>
            <span>STUDENTS</span>
            <strong>{persons}</strong>
          </div>

          <div>
            <span>STUDENT COST</span>
            <strong>
              ₹{studentCost.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {bookingRef && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1.5px solid #86efac",
              borderRadius: "12px",
              padding: "16px 20px",
              margin: "20px 0",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>🛡️</span>
                <strong style={{ color: "#166534", fontSize: "15px" }}>Student Package Confirmed</strong>
              </div>
              <span style={{ background: "#22c55e", color: "#ffffff", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
                ● Paid via Razorpay
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "13px" }}>
              <div>
                <span style={{ color: "#4b5563", fontSize: "11px", display: "block" }}>BOOKING REFERENCE</span>
                <strong style={{ color: "#0c2340", fontFamily: "monospace", fontSize: "14px" }}>{bookingRef}</strong>
              </div>
              {razorpayId && (
                <div>
                  <span style={{ color: "#4b5563", fontSize: "11px", display: "block" }}>RAZORPAY PAYMENT ID</span>
                  <strong style={{ color: "#0284c7", fontFamily: "monospace", fontSize: "14px" }}>{razorpayId}</strong>
                </div>
              )}
              {amountPaid > 0 && (
                <div>
                  <span style={{ color: "#4b5563", fontSize: "11px", display: "block" }}>AMOUNT PAID NOW</span>
                  <strong style={{ color: "#16a34a", fontSize: "15px" }}>₹{amountPaid.toLocaleString("en-IN")}</strong>
                </div>
              )}
              {remainingBalance > 0 && (
                <div>
                  <span style={{ color: "#92400e", fontSize: "11px", display: "block" }}>REMAINDER UPON ARRIVAL</span>
                  <strong style={{ color: "#b45309", fontSize: "15px" }}>₹{remainingBalance.toLocaleString("en-IN")}</strong>
                </div>
              )}
            </div>

            {remainingBalance > 0 && (
              <div style={{ marginTop: "10px", fontSize: "11px", color: "#6b7280", background: "#fef3c7", padding: "6px 10px", borderRadius: "6px" }}>
                ℹ️ <strong>Student Installment Token:</strong> 25% advance token confirmed. Settle remaining ₹{remainingBalance.toLocaleString("en-IN")} upon campus departure or check-in.
              </div>
            )}
          </div>
        )}

        <div className="student-confirmed-pdf-box">
          <span>📄</span>
          <div>
            <strong>Student Plan PDF</strong>
            <p>
              Your confirmed student-friendly plan is
              ready to open and print.
            </p>
          </div>
        </div>

        <div className="student-confirmed-contact">
          <span>TRAVEL GURUJI CONTACT</span>
          <p>
            Phone: {CONTACT_PHONE} &nbsp; • &nbsp;
            Email: {CONTACT_EMAIL}
          </p>
        </div>

        {saveMessage && (
          <p className="plan-history-save-message">{saveMessage}</p>
        )}

        <div className="student-confirmed-actions">
          <button
            type="button"
            className="student-confirmed-pdf-button"
            onClick={openStudentPdf}
          >
            📄 Open Student Plan PDF
          </button>

          <Link
            to={`/student-plan?destination=${encodeURIComponent(
              destinationName
            )}&startDate=${encodeURIComponent(
              startDate
            )}&hotel=${encodeURIComponent(
              hotelName
            )}&persons=${persons}&days=${days}&budget=${budget}&tripType=${encodeURIComponent(
              tripType
            )}&studentCost=${studentCost}`}
            className="student-confirmed-back-button"
          >
            ← View Student Plan
          </Link>
        </div>
      </section>
    </main>
  );
}
export default StudentPlanConfirmed;
