import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getDestinations, getHotels } from "../services/api";
import { savePlan } from "../services/planApi";
import { jsPDF } from "jspdf";

const CONTACT_PHONE = "7596870561";
const CONTACT_EMAIL = "travelGuruji2026@gmail.com";

function PlanConfirmed() {
  const [searchParams] = useSearchParams();

  const destinationName =
    searchParams.get("destination") || "Your Destination";
  const startDate = searchParams.get("startDate") || "";
  const hotelName = searchParams.get("hotel") || "Selected Hotel";
  const persons = Number(searchParams.get("persons")) || 1;
  const days = Number(searchParams.get("days")) || 1;
  const budget = Number(searchParams.get("budget")) || 0;
  const tripType = searchParams.get("tripType") || "Friends";

  const bookingRef = searchParams.get("bookingRef") || "";
  const paymentPlan = searchParams.get("paymentPlan") || "";
  const amountPaid = Number(searchParams.get("amountPaid")) || 0;
  const remainingBalance = Number(searchParams.get("remainingBalance")) || 0;
  const razorpayId = searchParams.get("razorpayId") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "";

  const [destination, setDestination] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const loadPlanData = async () => {
      try {
        const [destinationResponse, hotelResponse] =
          await Promise.all([
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
              item.name?.toLowerCase() ===
              destinationName.toLowerCase()
          ) ||
          destinationList[0] ||
          null;

        const matchedHotel =
          hotelList.find(
            (item) =>
              item.name?.toLowerCase() ===
              hotelName.toLowerCase()
          ) || null;

        setDestination(matchedDestination);
        setHotel(matchedHotel);
      } catch (error) {
        console.error(
          "Plan confirmation data loading failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlanData();
  }, [destinationName, hotelName]);

  useEffect(() => {
    const token = localStorage.getItem("travelGurujiToken");

    if (!token) {
      setSaveMessage("Login to sync this trip with your account Plan History.");
      return;
    }

    const historyKey = `travelGurujiPlan:${destinationName}:${startDate}:${hotelName}:${persons}:${days}:${budget}:${tripType}`;

    if (sessionStorage.getItem(historyKey)) {
      setSaveMessage("Saved in your Plan History.");
      return;
    }

    savePlan({
      planType: "Full",
      destination: destinationName,
      startDate,
      hotel: hotel?.name || hotelName,
      persons,
      days,
      budget,
      tripType,
      localExperiences: [],
    })
      .then(() => {
        sessionStorage.setItem(historyKey, "saved");
        setSaveMessage("Saved in your Plan History.");
      })
      .catch((err) => {
        console.warn("Auto save plan history error:", err);
      });
  }, [
    destinationName,
    startDate,
    hotelName,
    hotel,
    persons,
    days,
    budget,
    tripType,
  ]);

  const createFullPlanPdf = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const green = [18, 77, 61];
    const dark = [28, 55, 48];
    const muted = [100, 116, 108];
    const line = [216, 229, 223];
    const soft = [242, 248, 245];
    const pale = [232, 244, 238];
    const white = [255, 255, 255];

    let y = 32;
    let pageNumber = 1;

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
        console.warn("Travel PDF image could not be loaded:", error);
        return null;
      }
    };

    const loadFaviconLogo = async () => {
      try {
        const response = await fetch("/favicon.svg");
        if (!response.ok) throw new Error("favicon.svg could not be loaded");
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
        if (document.fonts?.ready) await document.fonts.ready;

        const faviconImage = await loadFaviconLogo();
        const scale = 3;
        const canvas = document.createElement("canvas");
        canvas.width = 1100 * scale;
        canvas.height = 180 * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.scale(scale, scale);

        const size = 58;
        const logoSize = 76;
        const gap = 18;
        const textStart = logoSize + gap;
        const centerY = 90;

        ctx.font = `700 ${size}px Rockwell, sans-serif`;
        const travelWidth = ctx.measureText("Travel").width;

        ctx.font = `400 ${size}px "Segoe Print", cursive`;
        const gurujiWidth = ctx.measureText("_Guruji").width;

        const totalWidth = textStart + travelWidth + gurujiWidth + 12;
        const offsetX = Math.max(0, (1100 - totalWidth) / 2);

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

        ctx.font = `700 ${size}px Rockwell, sans-serif`;
        ctx.fillText("Travel", offsetX + textStart, centerY);

        ctx.font = `400 ${size}px "Segoe Print", cursive`;
        ctx.fillText(
          "_Guruji",
          offsetX + textStart + travelWidth,
          centerY
        );

        return { dataUrl: canvas.toDataURL("image/png") };
      } catch (error) {
        console.warn("Travel_Guruji PDF logo could not be rendered:", error);
        return null;
      }
    };

    const brandDark = await createBrandImage("#17241f");
    const brandWhite = await createBrandImage("#ffffff");

    const drawBrand = (brand, x, yPos, width = 39, height = 6.5) => {
      if (!brand) return;
      doc.addImage(
        brand.dataUrl,
        "PNG",
        x,
        yPos - height + 1,
        width,
        height
      );
    };

    const destinationImage = await toDataUrl(destination?.image);

    const createBlurredBackground = async (image) => {
      if (!image || typeof document === "undefined") return null;

      try {
        const loaded = await new Promise((resolve, reject) => {
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
        const sourceRatio = loaded.width / loaded.height;

        let sw = loaded.width;
        let sh = loaded.height;
        let sx = 0;
        let sy = 0;

        if (sourceRatio > targetRatio) {
          sw = loaded.height * targetRatio;
          sx = (loaded.width - sw) / 2;
        } else if (sourceRatio < targetRatio) {
          sh = loaded.width / targetRatio;
          sy = (loaded.height - sh) / 2;
        }

        ctx.save();
        ctx.filter = "blur(10px)";
        ctx.drawImage(
          loaded,
          sx,
          sy,
          sw,
          sh,
          -18,
          -18,
          canvas.width + 36,
          canvas.height + 36
        );
        ctx.restore();

        ctx.fillStyle = "rgba(255,255,255,0.76)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return {
          dataUrl: canvas.toDataURL("image/jpeg", 0.84),
          format: "JPEG",
        };
      } catch (error) {
        console.warn("Travel PDF blurred background failed:", error);
        return image;
      }
    };

    const background = await createBlurredBackground(destinationImage);

    const drawHeader = () => {
      if (background) {
        doc.addImage(
          background.dataUrl,
          background.format,
          0,
          0,
          pageWidth,
          pageHeight
        );
      } else {
        doc.setFillColor(...soft);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      }

      doc.setFillColor(...green);
      doc.rect(0, 0, pageWidth, 5, "F");

      drawBrand(brandDark, margin, 15, 39, 6.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text("Explore  •  Plan  •  Travel  •  Repeat", margin, 20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("TRAVEL RESERVATION", pageWidth - margin, 15, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${pageNumber}`, pageWidth - margin, 20, {
        align: "right",
      });

      doc.setDrawColor(...line);
      doc.setLineWidth(0.35);
      doc.line(margin, 25, pageWidth - margin, 25);
    };

    const drawFooter = () => {
      const footerY = pageHeight - 13;

      doc.setDrawColor(...line);
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
      doc.text("Full Travel Plan", pageWidth - margin, footerY, {
        align: "right",
      });
    };

    const newPage = () => {
      drawFooter();
      doc.addPage();
      pageNumber += 1;
      drawHeader();
      y = 32;
    };

    const ensureSpace = (height = 20) => {
      if (y + height > pageHeight - 25) newPage();
    };

    const sectionTitle = (title) => {
      ensureSpace(20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...green);
      doc.text(title, margin, y);

      y += 5;
      doc.setDrawColor(...line);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    };

    const addWrapped = (text, x, startY, width, size = 7, color = muted) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(String(text || ""), width);
      doc.text(lines.slice(0, 2), x, startY);
    };

    drawHeader();

    // NORMAL / FULL PLAN ONLY
    const heroY = 32;
    const heroH = 62;

    if (destinationImage) {
      doc.addImage(
        destinationImage.dataUrl,
        destinationImage.format,
        margin,
        heroY,
        contentWidth,
        heroH
      );
      doc.setFillColor(...green);
      doc.setGState(new doc.GState({ opacity: 0.48 }));
      doc.rect(margin, heroY, contentWidth, heroH, "F");
      doc.setGState(new doc.GState({ opacity: 1 }));
    } else {
      doc.setFillColor(...green);
      doc.roundedRect(
        margin,
        heroY,
        contentWidth,
        heroH,
        6,
        6,
        "F"
      );
    }

    drawBrand(brandWhite, margin + 9, heroY + 16, 42, 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...white);
    doc.text("CONFIRMED TRAVEL JOURNEY", margin + 54, heroY + 13);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Your Travel Plan is Confirmed", margin + 9, heroY + 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `A complete Travel Guruji plan for ${destinationName}`,
      margin + 9,
      heroY + 40
    );

    y = heroY + heroH + 14;

    sectionTitle("TRIP DETAILS");

    const details = [
      ["Destination", destinationName],
      ["Start Date", startDate || "Not selected"],
      ["Duration", `${days} ${days === 1 ? "Day" : "Days"}`],
      ["Travellers", `${persons} ${persons === 1 ? "Person" : "Persons"}`],
      ["Trip Type", tripType],
      ["Hotel", hotel?.name || hotelName],
      ["Budget", `Rs. ${budget.toLocaleString("en-IN")}`],
    ];

    const half = contentWidth / 2;

    details.forEach(([label, value], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = margin + col * half;
      const rowY = y + row * 17;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text(label.toUpperCase(), x, rowY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...dark);

      const lines = doc.splitTextToSize(String(value), half - 10);
      doc.text(lines.slice(0, 2), x, rowY + 6);
    });

    y += Math.ceil(details.length / 2) * 17 + 5;

    sectionTitle("YOUR ITINERARY");

    if (
      destination?.attractions &&
      Array.isArray(destination.attractions) &&
      destination.attractions.length > 0
    ) {
      destination.attractions
        .slice(0, Math.max(days, 5))
        .forEach((item, index) => {
          ensureSpace(28);
          const rowHeight = item.description ? 24 : 15;

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
          doc.text(String(index + 1), margin + 7, y + 9.3, {
            align: "center",
          });

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(...dark);
          doc.text(
            `Day ${index + 1}  •  ${item.name}`,
            margin + 15,
            y + 7
          );

          if (item.description) {
            addWrapped(
              item.description,
              margin + 15,
              y + 14,
              contentWidth - 20,
              7,
              muted
            );
          }

          y += rowHeight + 4;
        });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...muted);
      doc.text(
        "Your selected itinerary will be followed for this trip.",
        margin,
        y
      );
      y += 12;
    }

    sectionTitle("TRIP COST SUMMARY");

    const costItems = [
      ["Planned Budget", `Rs. ${budget.toLocaleString("en-IN")}`],
      ["Travellers", String(persons)],
      ["Duration", `${days} days`],
      ["Hotel", hotel?.name || hotelName],
    ];

    costItems.forEach(([label, value]) => {
      ensureSpace(11);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...muted);
      doc.text(label, margin, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...dark);
      doc.text(String(value), pageWidth - margin, y, {
        align: "right",
      });

      y += 8;
    });

    y += 5;

    doc.setFillColor(...pale);
    doc.roundedRect(margin, y, contentWidth, 22, 4, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...green);
    doc.text("CONFIRMED TRAVEL PLAN", margin + 7, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text(
      "This is your standard full Travel Guruji trip plan.",
      margin + 7,
      y + 15
    );

    y += 31;

    sectionTitle("ABOUT TRAVEL GURUJI");

    ensureSpace(32);

    doc.setFillColor(...soft);
    doc.roundedRect(margin, y, contentWidth, 30, 4, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...green);
    doc.text("Plan. Travel. Experience.", margin + 7, y + 9);

    addWrapped(
      "Travel Guruji helps travellers discover destinations, plan trips easily, find suitable hotels, explore local experiences and manage travel budgets in one place. Our goal is to make travel simple, practical and enjoyable.",
      margin + 7,
      y + 16,
      contentWidth - 14,
      7.5,
      muted
    );

    y += 39;

    ensureSpace(22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...green);
    doc.text("Thank you for choosing Travel Guruji.", margin, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text(
      "We hope your journey is safe, comfortable and memorable.",
      margin,
      y
    );

    drawFooter();

    return doc.output("blob");
  };

  const openFullPlanPdf = async () => {
    try {
      const blob = await createFullPlanPdf();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error("Full Travel Plan PDF creation failed:", error);
      alert("Full Travel Plan PDF could not be created. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="plan-confirmed-page">
        <div className="plan-confirmed-card">
          <div className="plan-confirmed-icon">✓</div>
          <h2>Confirming your plan...</h2>
          <p>
            Preparing your confirmed Travel Guruji reservation.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="plan-confirmed-page">
      <section className="plan-confirmed-card">
        <div className="plan-confirmed-icon">✓</div>

        <span className="plan-confirmed-label">
          TRAVEL GURUJI • TRAVEL RESERVATION
        </span>

        <h1>Plan Confirmed</h1>

        <p>
          Your {destinationName} travel plan has been
          successfully confirmed.
        </p>

        <div className="plan-confirmed-summary">
          <div>
            <span>DESTINATION</span>
            <strong>{destinationName}</strong>
          </div>

          <div>
            <span>DURATION</span>
            <strong>
              {days} {days === 1 ? "Day" : "Days"}
            </strong>
          </div>

          <div>
            <span>TRAVELLERS</span>
            <strong>{persons}</strong>
          </div>

          <div>
            <span>HOTEL</span>
            <strong>{hotel?.name || hotelName}</strong>
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
                <strong style={{ color: "#166534", fontSize: "15px" }}>Verified Reservation Confirmed</strong>
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
                  <span style={{ color: "#92400e", fontSize: "11px", display: "block" }}>DUE UPON TRIP START</span>
                  <strong style={{ color: "#b45309", fontSize: "15px" }}>₹{remainingBalance.toLocaleString("en-IN")}</strong>
                </div>
              )}
            </div>

            {remainingBalance > 0 && (
              <div style={{ marginTop: "10px", fontSize: "11px", color: "#6b7280", background: "#fef3c7", padding: "6px 10px", borderRadius: "6px" }}>
                ℹ️ <strong>Installment Plan:</strong> Remaining balance of ₹{remainingBalance.toLocaleString("en-IN")} can be settled upon departure or hotel check-in.
              </div>
            )}
          </div>
        )}

        <div className="plan-confirmed-message">
          <span>📄</span>

          <div>
            <strong>Confirmed Travel Plan PDF is ready</strong>
            <p>
              Your complete confirmed travel plan is
              formatted for printing and saving.
            </p>
          </div>
        </div>

        <div className="plan-confirmed-contact">
          <span>TRAVEL GURUJI CONTACT</span>
          <p>
            Phone: {CONTACT_PHONE} &nbsp; • &nbsp;
            Email: {CONTACT_EMAIL}
          </p>
        </div>

        {saveMessage && (
          <div
            style={{
              margin: "16px auto",
              padding: "10px 18px",
              background: "#ecfdf5",
              border: "1px solid #10b981",
              borderRadius: "8px",
              color: "#065f46",
              fontSize: "14px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>✓</span>
            <span>{saveMessage}</span>
          </div>
        )}

        <div className="plan-confirmed-actions" style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            className="plan-confirmed-pdf-button"
            onClick={openFullPlanPdf}
          >
            📄 Open Full Plan PDF
          </button>

          <Link
            to="/plan-history"
            className="plan-confirmed-pdf-button"
            style={{ background: "#0284c7" }}
          >
            🗂️ View in Plan History
          </Link>

          <Link
            to="/my-trips"
            className="plan-confirmed-pdf-button"
            style={{ background: "#059669" }}
          >
            🗺️ My Journey Hub
          </Link>

          <Link
            to={`/trip-plan?destination=${encodeURIComponent(
              destinationName
            )}&startDate=${encodeURIComponent(
              startDate
            )}&hotel=${encodeURIComponent(
              hotelName
            )}&persons=${persons}&days=${days}&budget=${budget}&tripType=${encodeURIComponent(
              tripType
            )}`}
            className="plan-confirmed-back-button"
          >
            ← Back to Trip Plan
          </Link>
        </div>
      </section>
    </main>
  );
}

export default PlanConfirmed;
