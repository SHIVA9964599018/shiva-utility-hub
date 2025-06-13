// ✅ Supabase Initialization
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabaseClient = createClient(
  "https://wzgchcvyzskespcfrjvi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z2NoY3Z5enNrZXNwY2ZyanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjQwNDEsImV4cCI6MjA1NzQ0MDA0MX0.UuAgu4quD9Vg80tOUSkfGJ4doOT0CUFEUeoHsiyeNZQ"
);

let loggedInUsername = null;

// ✅ Global section control
window.showSection = function (sectionId) {
  document.querySelectorAll("section, div[id^='utility-']").forEach((el) => {
    el.style.display = "none";
  });

  if (sectionId.startsWith("utility-")) {
    const utilitiesSection = document.getElementById("utilities");
    if (utilitiesSection) {
      utilitiesSection.style.display = "block";
    }
  }

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = "block";
  } else {
    console.error(`Section ${sectionId} not found.`);
  }
};

// ✅ Utility subsection control
window.showUtilitySubSection = function (subSectionId) {
  document.querySelectorAll("div[id^='utility-']").forEach((el) => {
    el.style.display = "none";
  });

  const subSection = document.getElementById(subSectionId);
  if (subSection) {
    subSection.style.display = "block";
  } else {
    console.error(`Utility sub-section '${subSectionId}' not found.`);
  }
};

// ✅ Login prompt handler
window.promptCalorieLogin = function () {
  if (loggedInUsername) {
    window.showSection("utility-daily-calorie");
    window.loadDailyDishes();
    window.loadDishSummaryTable();
  } else {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "block";
    else console.error("Login modal not found.");
  }
};

// ✅ Dummy placeholders for testing
window.loadDailyDishes = function () {
  console.log("[Mock] loadDailyDishes triggered");
};

window.loadDishSummaryTable = function () {
  console.log("[Mock] loadDishSummaryTable triggered");
};

// ✅ Show 'utilities' section when ready
document.addEventListener("DOMContentLoaded", () => {
  window.showSection("utilities");
});
