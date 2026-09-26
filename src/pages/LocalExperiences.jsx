import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import localBusinessData from "../data/localBusinessData";
import destinations from "../data/destinations";

const categories = [
  {
    key: "food",
    label: "Restaurants & Food",
    icon: "🍴",
  },
  {
    key: "guides",
    label: "Local Guides",
    icon: "🧑‍🏫",
  },
  {
    key: "shopping",
    label: "Shopping & Bazaars",
    icon: "🛍️",
  },
  {
    key: "activities",
    label: "Local Experiences",
    icon: "✨",
  },
];

function LocalExperiences() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] =
    useState("food");

  const [selectedItem, setSelectedItem] =
    useState(null);

  const destinationNames =
    Object.keys(localBusinessData);

  const destinationName =
    searchParams.get("destination") ||
    destinationNames[0] ||
    "Mussoorie";

  const selectedStorageKey =
    `travelGurujiLocalExperiences:${destinationName}`;

  const [selectedItems, setSelectedItems] =
    useState(() => {
      try {
        const saved = sessionStorage.getItem(
          selectedStorageKey
        );

        const parsed = saved
          ? JSON.parse(saved)
          : [];

        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    });

  useEffect(() => {
    try {
      sessionStorage.setItem(
        selectedStorageKey,
        JSON.stringify(selectedItems)
      );
    } catch (error) {
      console.error(
        "Local experiences selection could not be saved:",
        error
      );
    }
  }, [selectedItems, selectedStorageKey]);


  const selectedDestination = useMemo(() => {
    return destinations.find(
      (item) =>
        item.name?.toLowerCase() ===
        destinationName.toLowerCase()
    );
  }, [destinationName]);

  const currentData =
    localBusinessData[destinationName] || {
      food: [],
      guides: [],
      shopping: [],
      activities: [],
    };

  const activeCategoryInfo =
    categories.find(
      (item) => item.key === activeCategory
    );

  const activeItems =
    currentData[activeCategory] || [];

  function buildExperience(item, categoryKey = activeCategory) {
    const categoryInfo = categories.find(
      (category) => category.key === categoryKey
    );

    return {
      name: item.name,
      detail: item.detail,
      price: item.price,
      tag: item.tag,
      category: categoryKey,
      categoryLabel: categoryInfo?.label,
      icon: categoryInfo?.icon,
    };
  }

  function isItemSelected(item) {
    return selectedItems.some(
      (selected) =>
        selected.name === item.name &&
        selected.category === activeCategory
    );
  }

  function toggleSelection(item) {
    const experience = buildExperience(item);

    setSelectedItems((previousItems) => {
      const alreadySelected = previousItems.some(
        (selected) =>
          selected.name === experience.name &&
          selected.category === experience.category
      );

      if (alreadySelected) {
        return previousItems.filter(
          (selected) =>
            !(
              selected.name === experience.name &&
              selected.category === experience.category
            )
        );
      }

      return [...previousItems, experience];
    });

    setSelectedItem(null);
  }

  function removeSelectedItem(index) {
    setSelectedItems((previousItems) =>
      previousItems.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function selectAndBackToDestination() {
    try {
      sessionStorage.setItem(
        selectedStorageKey,
        JSON.stringify(selectedItems)
      );
    } catch (error) {
      console.error(
        "Local experiences selection could not be saved:",
        error
      );
    }

    if (selectedDestination) {
      window.location.href =
        `/destinations/${selectedDestination.id}`;
    }
  }

  return (
    <main
      className="local-experiences-page"
      style={{
        "--local-experiences-bg": `url(${
          selectedDestination?.image || ""
        })`,
      }}
    >
      <section className="local-experiences-hero">
        <div className="local-experiences-hero-overlay" />

        <div className="local-experiences-hero-content">
          <span className="local-experiences-eyebrow">
            ✨ TRAVEL GURUJI PICKS
          </span>

          <h1>
            Explore Local Experiences
          </h1>

          <p>
            Find cafes, guides, shopping spots and
            experiences worth adding to your trip to {destinationName}.
          </p>

        </div>
      </section>

      <section className="local-experiences-container">
        <div className="local-experiences-heading">
          <div>
            <span>DISCOVER AROUND YOU</span>

            <h2>
              Things to explore in{" "}
              {destinationName}
            </h2>

            <p>
              Handpicked options for restaurants, shopping, local guides and activities.
            </p>
          </div>

          <div className="local-experiences-destination-picker" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#475569" }}>
              📍 Select Destination:
            </span>
            <select
              value={destinationName}
              onChange={(e) => setSearchParams({ destination: e.target.value })}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                background: "#ffffff",
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                outline: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {destinationNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="local-experiences-category-row">
          {categories.map((category) => (
            <button
              type="button"
              key={category.key}
              className={`local-experiences-category ${
                activeCategory === category.key
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveCategory(
                  category.key
                )
              }
            >
              <span>
                {category.icon}
              </span>

              {category.label}
            </button>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <section className="local-experiences-selection-panel">
            <div className="local-experiences-selection-top">
              <div>
                <span>YOUR SELECTION</span>
                <h3>
                  {selectedItems.length}{" "}
                  {selectedItems.length === 1
                    ? "experience"
                    : "experiences"}{" "}
                  ready for your trip
                </h3>
              </div>

              <button
                type="button"
                className="details-home-button"
                onClick={selectAndBackToDestination}
              >
                Select & Back 
              </button>
            </div>

            <div className="local-experiences-selected-list">
              {selectedItems.map((item, index) => (
                <div
                  className="local-experiences-selected-chip"
                  key={`${item.category}-${item.name}`}
                >
                  <span>{item.icon || "✨"}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.categoryLabel}</small>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeSelectedItem(index)
                    }
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="local-experiences-grid">
          {activeItems.length > 0 ? (
            activeItems.map((item) => (
              <article
                className="local-experience-card"
                key={item.name}
              >
                <div className="local-experience-card-top">
                  <div className="local-experience-icon">
                    {activeCategoryInfo?.icon}
                  </div>

                  <span className="local-experience-tag">
                    {item.tag}
                  </span>
                </div>

                <div className="local-experience-card-body">
                  <span className="local-experience-type">
                    {activeCategoryInfo?.label}
                  </span>

                  <h3>{item.name}</h3>

                  <p>{item.detail}</p>
                </div>

                <div className="local-experience-card-footer">
                  <strong>
                    {item.price}
                  </strong>

                  <button
                    type="button"
                    className={
                      isItemSelected(item)
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      if (isItemSelected(item)) {
                        toggleSelection(item);
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                  >
                    {isItemSelected(item)
                      ? "Selected ✓"
                      : "View Details →"}
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="local-experiences-empty">
              <div>🌿</div>

              <h3>
                More options coming soon
              </h3>

              <p>
                We are adding more{" "}
                {activeCategoryInfo?.label.toLowerCase()}{" "}
                around {destinationName}.
              </p>
            </div>
          )}
        </div>

        

        {selectedDestination && (
          <div className="local-experiences-back-wrapper">
            <Link
              to={`/destinations/${selectedDestination.id}`}
              className="details-home-button"
            >
              ← Back to {destinationName}
            </Link>
          </div>
        )}
      </section>

      {selectedItem && (
        <div
          className="local-experience-modal-backdrop"
          onClick={() =>
            setSelectedItem(null)
          }
        >
          <div
            className="local-experience-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="local-experience-modal-close"
              onClick={() =>
                setSelectedItem(null)
              }
              aria-label="Close"
            >
              ×
            </button>

            <div className="local-experience-modal-icon">
              {activeCategoryInfo?.icon}
            </div>

            <span className="local-experience-type">
              {activeCategoryInfo?.label}
            </span>

            <h2>{selectedItem.name}</h2>

            <p>
              {selectedItem.detail}
            </p>

            <div className="local-experience-modal-price">
              <span>Estimated Price</span>

              <strong>
                {selectedItem.price}
              </strong>
            </div>

            <div className="local-experience-modal-actions">
              <button
                type="button"
                className="local-experience-modal-plan"
                onClick={() =>
                  toggleSelection(selectedItem)
                }
              >
                {isItemSelected(selectedItem)
                  ? "Remove from Trip Plan"
                  : "Add to Trip Plan"}
              </button>

              <button
                type="button"
                className="local-experience-modal-back"
                onClick={() =>
                  setSelectedItem(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LocalExperiences;