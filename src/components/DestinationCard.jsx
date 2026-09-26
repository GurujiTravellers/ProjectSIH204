import { Link } from "react-router-dom";

function DestinationCard({ destination, source, alertInfo }) {
  const destinationUrl =
    source === "home"
      ? `/destinations/${destination.id}?source=home`
      : `/destinations/${destination.id}`;

  const isRed = alertInfo?.alertTier === "RED" || alertInfo?.isDisasterZone;
  const isYellow = alertInfo?.alertTier === "YELLOW" || alertInfo?.isModerateAdvisory;
  const isRain = !!alertInfo?.isRainAlert;

  const fallbackImage = "/images/homeTaj.jpg";

  return (
    <article className="destination-card">
      <div className="destination-card-media">
        <img
          src={destination.image || fallbackImage}
          alt={destination.name}
          loading="lazy"
          className="destination-card-img"
          onError={(e) => {
            if (e.target.src !== fallbackImage) {
              e.target.src = fallbackImage;
            }
          }}
        />
        <div
          className="destination-alert-badge"
          style={{
            background: isRed
              ? "rgba(220, 38, 38, 0.92)"
              : isYellow
              ? "rgba(217, 119, 6, 0.92)"
              : "rgba(16, 185, 129, 0.92)",
          }}
        >
          {isRed
            ? "🔴 Disaster Zone"
            : isYellow
            ? "🟡 Caution Advisory"
            : isRain
            ? "🌧️ Rain Alert"
            : "🟢 Verified Clear"}
        </div>
      </div>

      <div className="destination-info">
        <p className="destination-state">
          📍 {destination.state}
        </p>
        <h3>{destination.name}</h3>
        <p className="destination-category">
          🏷️ {destination.category}
        </p>
        <p className="destination-description">
          {destination.description}
        </p>
        <div className="destination-card-bottom">
          <span className="destination-rating" title={`Rating: ${destination.rating} out of 10`}>
            ⭐ {destination.rating} <span>/10</span>
          </span>
          <Link
            to={destinationUrl}
            className="explore-button"
            aria-label={`Explore ${destination.name}`}
          >
            Explore ➔
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;