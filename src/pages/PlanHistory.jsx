import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deletePlan,
  getPlanHistory,
} from "../services/planApi";

function buildPlanUrl(plan, page) {
  const params = new URLSearchParams();

  params.set("destination", plan.destination || "");
  params.set("startDate", plan.startDate || "");
  params.set("hotel", plan.hotel || "");
  params.set("persons", String(plan.persons || 1));
  params.set("days", String(plan.days || 1));
  params.set("budget", String(plan.budget || 0));
  params.set("tripType", plan.tripType || "Friends");

  if (plan.planType === "Student") {
    params.set("studentCost", String(plan.studentCost || 0));
  }

  return `/${page}?${params.toString()}`;
}

function PlanHistory() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");

      const data = await getPlanHistory();
      setPlans(Array.isArray(data.plans) ? data.plans : []);
    } catch (err) {
      console.error("Plan history error:", err);
      setError(err.message || "Could not load your plan history.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(planId) {
    const confirmed = window.confirm(
      "Delete this confirmed plan from your history?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePlan(planId);
      setPlans((previousPlans) =>
        previousPlans.filter((plan) => plan._id !== planId)
      );
    } catch (err) {
      alert(err.message || "Could not delete this plan.");
    }
  }

  function formatDate(value) {
    if (!value) {
      return "Not selected";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="plan-history-page">
        <section className="plan-history-container">
          <div className="plan-history-loading">
            Loading your confirmed plans...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="plan-history-page">
      <section className="plan-history-container">
        <div className="plan-history-heading">
          <span>MY PLANS • YOUR TRIPS</span>
          <h1>Plan History</h1>
          <p>
            All your confirmed Travel Guruji plans in one place.
            Open an old plan anytime and access its PDF again.
          </p>
        </div>

        {error ? (
          <div className="plan-history-error">
            <h2>Unable to load Plan History</h2>
            <p>{error}</p>
            <button type="button" onClick={loadHistory}>
              Try Again
            </button>
          </div>
        ) : plans.length === 0 ? (
          <div className="plan-history-empty">
            <div className="plan-history-empty-icon">🧳</div>
            <h2>No confirmed plans yet</h2>
            <p>
              Create and confirm your first trip. It will appear here
              automatically.
            </p>
            <Link to="/planner" className="plan-history-primary-button">
              Create a Trip
            </Link>
          </div>
        ) : (
          <div className="plan-history-list">
            {plans.map((plan) => {
              const isStudent = plan.planType === "Student";
              const viewUrl = buildPlanUrl(
                plan,
                isStudent ? "student-plan" : "trip-plan"
              );
              const confirmationUrl = buildPlanUrl(
                plan,
                isStudent
                  ? "student-plan-confirmed"
                  : "plan-confirmed"
              );

              return (
                <article className="plan-history-card" key={plan._id}>
                  <div className="plan-history-card-top">
                    <div className="plan-history-card-icon">
                      {isStudent ? "🎓" : "🧳"}
                    </div>

                    <div className="plan-history-card-title">
                      <div className="plan-history-badges">
                        <span className="plan-history-status">
                          ✓ {plan.status || "Confirmed"}
                        </span>
                        <span
                          className={
                            isStudent
                              ? "plan-history-type student"
                              : "plan-history-type"
                          }
                        >
                          {isStudent ? "Student Plan" : "Full Plan"}
                        </span>
                      </div>

                      <h2>{plan.destination}</h2>
                      <p>
                        Confirmed on{" "}
                        {new Date(plan.confirmedAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="plan-history-details">
                    <div>
                      <span>START DATE</span>
                      <strong>{formatDate(plan.startDate)}</strong>
                    </div>
                    <div>
                      <span>DURATION</span>
                      <strong>
                        {plan.days} {plan.days === 1 ? "Day" : "Days"}
                      </strong>
                    </div>
                    <div>
                      <span>TRAVELLERS</span>
                      <strong>{plan.persons}</strong>
                    </div>
                    <div>
                      <span>HOTEL</span>
                      <strong>{plan.hotel || "Selected Hotel"}</strong>
                    </div>
                  </div>

                  <div className="plan-history-actions">
                    <Link
                      to={viewUrl}
                      className="plan-history-view-button"
                    >
                      👁 View Plan
                    </Link>

                    <Link
                      to={confirmationUrl}
                      className="plan-history-pdf-button"
                    >
                      📄 Open PDF
                    </Link>

                    <button
                      type="button"
                      className="plan-history-delete-button"
                      onClick={() => handleDelete(plan._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default PlanHistory;
