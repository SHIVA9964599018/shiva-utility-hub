import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Initialize Supabase Client
const supabaseClient = createClient(
    "https://wzgchcvyzskespcfrjvi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z2NoY3Z5enNrZXNwY2ZyanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjQwNDEsImV4cCI6MjA1NzQ0MDA0MX0.UuAgu4quD9Vg80tOUSkfGJ4doOT0CUFEUeoHsiyeNZQ"
);

// Only keeping essential DOMContentLoaded once
document.addEventListener("DOMContentLoaded", () => {
  showSection("utilities");

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
});
