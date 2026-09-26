import { getApiBaseUrl } from "../config/apiConfig";

const API_BASE_URL = getApiBaseUrl();

function getToken() {
  return localStorage.getItem("travelGurujiToken");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Please login to use Plan History.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function savePlan(planData) {
  try {
    const res = await request("/plans", {
      method: "POST",
      body: JSON.stringify(planData),
    });
    if (res && res.plan) {
      // Sync with localStorage
      const local = getLocalPlans();
      const updated = [res.plan, ...local.filter((p) => p._id !== res.plan._id)];
      saveLocalPlans(updated);
      return res;
    }
  } catch (err) {
    console.warn("Backend save failed, using local storage fallback:", err.message);
  }

  // Local fallback
  const fallbackPlan = {
    _id: "local_plan_" + Date.now(),
    ...planData,
    status: "Confirmed",
    confirmedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  const local = getLocalPlans();
  saveLocalPlans([fallbackPlan, ...local]);

  return {
    success: true,
    message: "Plan saved successfully to My Trips.",
    plan: fallbackPlan,
  };
}

function getStorageKey() {
  try {
    const raw = localStorage.getItem("travelGurujiUser");
    if (raw) {
      const u = JSON.parse(raw);
      if (u.email) return `travelGurujiSavedPlans_${u.email}`;
    }
  } catch {}
  return "travelGurujiSavedPlans";
}

function getLocalPlans() {
  try {
    const key = getStorageKey();
    const raw = localStorage.getItem(key) || localStorage.getItem("travelGurujiSavedPlans");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPlans(plans) {
  try {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(plans));
  } catch {}
}

export async function getPlanHistory() {
  try {
    const res = await request("/plans");
    if (res && Array.isArray(res.plans)) {
      const local = getLocalPlans();
      const map = new Map();
      // Add local offline fallback plans first
      local.forEach((p) => {
        if (p._id) map.set(p._id, p);
      });
      // Verified backend plans take precedence
      res.plans.forEach((p) => {
        if (p._id) map.set(p._id, p);
      });
      const combined = Array.from(map.values()).sort((a, b) => {
        const tA = new Date(a.confirmedAt || a.createdAt || 0).getTime();
        const tB = new Date(b.confirmedAt || b.createdAt || 0).getTime();
        return tB - tA;
      });
      saveLocalPlans(combined);
      return { plans: combined };
    }
  } catch (err) {
    console.warn("Backend plan history unreachable, using local storage:", err.message);
  }
  return { plans: getLocalPlans() };
}

export async function deletePlan(planId) {
  try {
    await request(`/plans/${planId}`, {
      method: "DELETE",
    });
  } catch {}
  const local = getLocalPlans().filter((p) => p._id !== planId);
  saveLocalPlans(local);
  return { message: "Plan deleted successfully" };
}

