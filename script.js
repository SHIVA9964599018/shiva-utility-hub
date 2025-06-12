import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Initialize Supabase Client
const supabaseClient = createClient(
    "https://wzgchcvyzskespcfrjvi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z2NoY3Z5enNrZXNwY2ZyanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjQwNDEsImV4cCI6MjA1NzQ0MDA0MX0.UuAgu4quD9Vg80tOUSkfGJ4doOT0CUFEUeoHsiyeNZQ"
);

window.currentImageIndex = 0;
window.images = [];

window.openLightbox = function(index) {
    window.images = Array.from(document.querySelectorAll(".gallery-card img"));
    window.currentImageIndex = index;

    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");

    if (lightbox && lightboxImg) {
        lightboxImg.src = window.images[index].src;
        lightbox.style.display = "flex";
    }
};

window.closeLightbox = function() {
    let lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.style.display = "none";
    }
};

window.nextImage = function() {
    if (window.images.length === 0) return;

    window.currentImageIndex = (window.currentImageIndex + 1) % window.images.length;
    document.getElementById("lightbox-img").src = window.images[window.currentImageIndex].src;
};

window.prevImage = function() {
    if (window.images.length === 0) return;

    window.currentImageIndex = (window.currentImageIndex - 1 + window.images.length) % window.images.length;
    document.getElementById("lightbox-img").src = window.images[window.currentImageIndex].src;
};

// Attach event listeners to all images
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".gallery-card img").forEach((img, index) => {
        img.addEventListener("click", function() {
            openLightbox(index);
        });
    });
});



// Automatically show the 'home' section when the page loads
document.addEventListener("DOMContentLoaded", () => {
  showSection("home"); // Change this to 'bike-summary' if you prefer that
});

window.showSection = function (sectionId) {
  console.log(`Switching to Section: ${sectionId}`);

  // Hide all sections and utility divs
  document.querySelectorAll("section, div[id^='utility-']").forEach((section) => {
    section.style.display = "none";
  });

  // Show the parent "utilities" section if it's a utility sub-section
  if (sectionId.startsWith("utility-")) {
    const utilitiesSection = document.getElementById("utilities");
    if (utilitiesSection) {
      utilitiesSection.style.display = "block";
    }
  }

  // Now show the actual requested sub-section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = "block";
    console.log(`Showing: ${targetSection.id}`);

    if (sectionId === "gallery") {
      const dropdownMenu = document.querySelector(".dropdown-menu");
      if (dropdownMenu) dropdownMenu.style.display = "block";
    }

    if (sectionId === "bike-summary") {
      loadBikeSummary();
    }
  } else {
    console.error(`Error: Section ${sectionId} not found.`);
  }
};




 window.showGalleryTab = function () {
    console.log("Switching to Gallery...");

    // Hide all sections
    document.querySelectorAll("section").forEach((section) => {
        section.style.display = "none";
    });

    // Show only the Gallery section
    let gallerySection = document.getElementById("gallery");
    if (gallerySection) {
        gallerySection.style.display = "block";
        gallerySection.scrollIntoView({ behavior: "smooth" });
    } else {
        console.error("Gallery section not found!");
    }

    // Hide all gallery content initially
    document.querySelectorAll(".gallery-section").forEach((section) => {
        section.style.display = "none";
    });

    // Show dropdown menu
    let dropdownMenu = document.querySelector(".dropdown-menu");
    if (dropdownMenu) {
        dropdownMenu.style.display = "block";
    }
};




window.toggleDropdown = function() {
    var dropdownMenu = document.querySelector(".dropdown-menu");
    
    // Toggle visibility
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

window.showGallerySection = function (sectionId) {
    console.log(`Navigating to: ${sectionId}`);

    // ✅ Ensure the main gallery section is visible
    const gallerySection = document.getElementById("gallery");
    if (!gallerySection) {
        console.error("Gallery section not found!");
        return;
    }
    gallerySection.style.display = "block";

    // ✅ Hide only inner gallery sections
    document.querySelectorAll(".gallery-section").forEach((section) => {
        section.style.display = "none";
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = "block";
        console.log(`Showing: ${sectionId}`);

        // ✅ Re-bind lightbox click handlers when new section is shown
        bindLightboxClickHandlers();
    } else {
        console.error(`Section ${sectionId} not found`);
    }

    // Hide dropdown if applicable
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (dropdownMenu) dropdownMenu.style.display = "none";
};

window.showGalleryDropdown = function (show) {
  var dropdown = document.getElementById("gallery-dropdown");
  dropdown.style.display = show ? "block" : "none";
}




function bindLightboxClickHandlers() {
    window.images = Array.from(document.querySelectorAll(".gallery-card img"));
    window.images.forEach((img, index) => {
        img.onclick = () => openLightbox(index);
    });
}

// Call once on DOM load
document.addEventListener("DOMContentLoaded", () => {
    bindLightboxClickHandlers();
});









document.addEventListener("DOMContentLoaded", () => {
  let dropdownToggle = document.querySelector(".dropdown-toggle");
  let dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdownToggle && dropdownMenu) {
    // ✅ Toggle dropdown on click
    dropdownToggle.addEventListener("click", function (event) {
      event.preventDefault();
      dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // ✅ Hide dropdown on outside click
    document.addEventListener("click", function (event) {
      if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = "none";
      }
    });

    // ✅ Handle submenu clicks using data attributes
    dropdownMenu.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", function (event) {
        event.preventDefault();

        const subId = item.getAttribute("data-sub");
        const loadType = item.getAttribute("data-load");

        if (subId) {
          showSection("utilities");
          showUtilitySubSection(subId);

          if (loadType === "food-facts") {
            loadFoodFacts(); // Only run if required
          }
        }

        dropdownMenu.style.display = "none"; // Close menu after click
      });
    });
  }
});




// ✅ Handle Feedback Submission
document.getElementById("feedback-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let feedbackText = document.getElementById("feedbackText").value.trim();

    if (!name || !feedbackText) {
        alert("Please enter both name and feedback.");
        return;
    }

    const { data, error } = await supabaseClient
        .from("Feedback")
        .insert([{ name: name, message: feedbackText }])
        .select();

    if (error) {
        console.error("Error submitting feedback:", error.message);
        document.getElementById("message").textContent = "Error submitting feedback. Try again!";
    } else {
        document.getElementById("message").textContent = "Feedback submitted successfully!";
        document.getElementById("feedback-form").reset();
        fetchFeedback();
    }
});

// ✅ Fetch Feedback from Supabase
async function fetchFeedback() {
    const { data, error } = await supabaseClient.from("Feedback").select("*").order("id", { ascending: false });

    if (error) {
        console.error("Error fetching feedback:", error.message);
        return;
    }

    let feedbackList = document.getElementById("feedback-list");
    feedbackList.innerHTML = "";

    data.forEach((feedback) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${feedback.name}:</strong> ${feedback.message}`;
        feedbackList.appendChild(listItem);
    });
}

// ✅ Load feedback on page load
document.addEventListener("DOMContentLoaded", fetchFeedback);
async function loadBikeSummary() {
  const summaryUrl = "https://my-feedback-site.onrender.com/api/bike-summary";
  const expensesUrl = "https://my-feedback-site.onrender.com/api/bike-expenses";

  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) loadingOverlay.style.display = "flex";

  try {
    // Fetch both summary and expenses in parallel
    const [summaryResponse, expenseResponse] = await Promise.all([
      fetch(summaryUrl),
      fetch(expensesUrl),
    ]);

    const summaryData = await summaryResponse.json();
    const expenseData = await expenseResponse.json();

    // Populate summary data
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("total-distance", summaryData.total_distance_km);
    setText("total-fuel", summaryData.total_fuel_liters);
    setText("mileage", summaryData.mileage_kmpl);
    setText("total-expense", summaryData.total_expense);
    setText("monthly-expense", summaryData.monthly_expense);
    setText("weekly-expense", summaryData.weekly_expense);

    // Render expense breakdowns
    if (expenseData?.monthly_expenses && expenseData?.weekly_expenses) {
      renderMonthlyExpenses(expenseData.monthly_expenses);
      renderWeeklyExpenses(expenseData.weekly_expenses);
    } else {
      console.warn("Missing expense breakdown data", expenseData);
    }

  } catch (err) {
    console.error("Failed to load bike data:", err);
  } finally {
    // ✅ Always hide overlay no matter what
    if (loadingOverlay) loadingOverlay.style.display = "none";
  }
}




function renderMonthlyExpenses(monthlyData) {
    const container = document.getElementById("monthly-expenses-container");
    container.innerHTML = ""; // Clear previous content

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    Object.entries(monthlyData).forEach(([year, months]) => {
        const yearDiv = document.createElement("div");
        const yearHeader = document.createElement("h4");
        yearHeader.textContent = `${year}`;
        yearHeader.style.cursor = "pointer";

        const monthsList = document.createElement("ul");
        monthsList.style.display = "none";

        // Convert object to array and sort by our monthOrder
        const sortedMonths = Object.entries(months).sort((a, b) => {
            return monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]);
        });

        sortedMonths.forEach(([month, data]) => {
            const li = document.createElement("li");
            li.textContent = `${month}: ₹${data.amount}, Distance: ${data.distance} km`;
            monthsList.appendChild(li);
        });

        yearHeader.addEventListener("click", () => {
            monthsList.style.display = monthsList.style.display === "none" ? "block" : "none";
        });

        yearDiv.appendChild(yearHeader);
        yearDiv.appendChild(monthsList);
        container.appendChild(yearDiv);
    });
}



function renderWeeklyExpenses(weeklyData) {
    const container = document.getElementById("weekly-expenses-container");
    container.innerHTML = "";

    const monthGroups = {};

    Object.entries(weeklyData).forEach(([dateStr, amount]) => {
        const date = new Date(dateStr);
        const label = `${date.getFullYear()}-${date.toLocaleString("default", { month: "short" })}`;
        if (!monthGroups[label]) monthGroups[label] = [];
        monthGroups[label].push({ date: dateStr, amount });
    });

    Object.entries(monthGroups).forEach(([monthLabel, weeks]) => {
        const monthDiv = document.createElement("div");

        const monthHeader = document.createElement("div");
        monthHeader.textContent = monthLabel;
        monthHeader.className = "section-header"; // unified styling

        const weeksList = document.createElement("ul");
        weeksList.style.display = "none";

        weeks.forEach(week => {
            const li = document.createElement("li");
            li.textContent = `${week.date}: ₹${week.amount}`;
            weeksList.appendChild(li);
        });

        monthHeader.addEventListener("click", () => {
            weeksList.style.display = weeksList.style.display === "none" ? "block" : "none";
        });

        monthDiv.appendChild(monthHeader);
        monthDiv.appendChild(weeksList);
        container.appendChild(monthDiv);
    });
}

function loadDynamic(file) {
  console.log(`Attempting to load dynamic content from: ${file}`);

  fetch(file)
    .then(response => {
      if (!response.ok) {
        console.error(`Failed to load file: ${file}, Status: ${response.status}`);
        throw new Error(`Failed to load file: ${file}`);
      }
      return response.text();
    })
    .then(data => {
      console.log("Dynamic content successfully loaded.");

      const container = document.getElementById("dynamic-section");
      console.log("Container found:", container);

      if (container) {
        // Hide all other sections
        const allSections = document.querySelectorAll("section");
        allSections.forEach(sec => {
          sec.style.display = "none";
        });

        // Load the content and show the dynamic section
        container.innerHTML = data;
        container.style.display = "block";

        console.log("Dynamic section displayed with new content.");

        // Reattach lightbox event listeners if gallery.html was loaded
        if (file.includes("gallery.html")) {
          console.log("Reattaching gallery image click listeners...");
          const galleryImages = container.querySelectorAll(".gallery-card img");
          galleryImages.forEach((img, index) => {
            img.addEventListener("click", function () {
              openLightbox(index);
            });
          });
        }

      } else {
        console.error("Container with ID 'dynamic-section' not found.");
      }
    })
    .catch(error => {
      console.error("Error loading dynamic section:", error);
    });
}


window.loadDynamic = loadDynamic;


// ✅ Handle Utilities Dish Nutrition Form Submission
document.addEventListener("DOMContentLoaded", function () {
    const nutritionForm = document.getElementById("nutrition-form");

    if (nutritionForm) {
        nutritionForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Get form values
            const dishName = document.getElementById("dish_name").value.trim();
            const calorie = parseFloat(document.getElementById("calorie").value);
            const protein = parseFloat(document.getElementById("protein").value);
            const carbs = parseFloat(document.getElementById("carbs").value);
            const fibre = parseFloat(document.getElementById("fibre").value);
            const fats = parseFloat(document.getElementById("fats").value);

            // Basic validation
            if (!dishName || isNaN(calorie) || isNaN(protein) || isNaN(carbs) || isNaN(fibre) || isNaN(fats)) {
                alert("Please enter all fields properly.");
                return;
            }

            // Save to Supabase
            const { data, error } = await supabaseClient
                .from("food_items")
                .insert([
                    {
                        dish_name: dishName,
                        calorie_per_100gm: calorie,
                        protein_per_100gm: protein,
                        carbs_per_100gm: carbs,
                        fibre_per_100gm: fibre,
                        fats_per_100gm: fats
                    }
                ]);

            const messageEl = document.getElementById("nutrition-message");
            if (error) {
                console.error("Error saving dish:", error.message);
                messageEl.textContent = "Error saving dish.";
            } else {
                messageEl.textContent = "Dish saved successfully!";
                nutritionForm.reset();
            }
        });
    }
});

window.showUtilitySubSection = function (subSectionId) {
  // Hide all sub divs inside utilities
  document.querySelectorAll("#utilities > div").forEach(div => {
    div.style.display = "none";
  });

  // Show the selected sub-section
  let target = document.getElementById(subSectionId);
  if (target) {
    target.style.display = "block";
    console.log(`Showing Utility Sub-section: ${subSectionId}`);

    // ✅ Load today's dishes if calorie calculator is shown
    if (subSectionId === "utility-daily-calorie") {
      window.loadDailyDishes();
    }
  } else {
    console.error(`Utility Sub-section ${subSectionId} not found.`);
  }
};




window.addEventListener("load", function ()  {

    let dropdown = document.querySelector(".dropdown");
    let dropdownToggle = document.querySelector(".dropdown-toggle");
    let dropdownMenu = document.querySelector(".dropdown-menu");

    if (dropdown && dropdownToggle && dropdownMenu) {

        // ✅ On Click (mobile)
        dropdownToggle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation(); // do not bubble up
            dropdownMenu.style.display = (dropdownMenu.style.display === "block") ? "none" : "block";
        });

        // ✅ On Hover (desktop)
        dropdown.addEventListener("mouseenter", function () {
            dropdownMenu.style.display = "block";
        });

        dropdown.addEventListener("mouseleave", function () {
            dropdownMenu.style.display = "none";
        });

        // ✅ On clicking outside anywhere on document
        document.addEventListener("click", function (event) {
            if (!dropdown.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });

        // ✅ On clicking menu item → hide dropdown
        dropdownMenu.querySelectorAll("a").forEach((item) => {
            item.addEventListener("click", function () {
                dropdownMenu.style.display = "none";
            });
        });
    }

});

// ✅ Global Dish Cache
let dishNames = [];

// ✅ Load Dish Names Once
async function loadDishNames() {
  const { data, error } = await supabaseClient
    .from("food_items")
    .select("dish_name");

  if (!error && data) {
    window.dishNames = data.map(d => d.dish_name); // ✅ assign to window
  } else {
    console.error("Failed to load dish names", error);
    window.dishNames = []; // fallback
  }
}




// ✅ Setup Autocomplete
window.setupAutocomplete = function (input) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("autocomplete-wrapper");
  input.parentElement.appendChild(wrapper);

  input.addEventListener("input", function () {
    const val = input.value.trim().toLowerCase();
    wrapper.innerHTML = "";
    if (!val) return;

const matches = Array.isArray(window.dishNames)
  ? window.dishNames.filter(d => d.toLowerCase().includes(val))
  : [];
    matches.forEach(match => {
      const div = document.createElement("div");
      div.textContent = match;
      div.classList.add("suggestion-item");
      div.addEventListener("click", () => {
        input.value = match;
        wrapper.innerHTML = "";
      });
      wrapper.appendChild(div);
    });
  });

  document.addEventListener("click", function (e) {
    if (!wrapper.contains(e.target) && e.target !== input) {
      wrapper.innerHTML = "";
    }
  });
};


// ✅ Add Dish Row
window.addDishRow = function (mealType, name = "", grams = "") {
  const container = document.getElementById(`${mealType}-container`);
  const row = document.createElement("div");
  row.className = "dish-row";

  row.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="position: relative;">
        <input type="text" class="dish-name" value="${name}" placeholder="Dish Name" autocomplete="off" />
      </div>
      <input type="number" class="dish-grams" style="width: 80px;" value="${grams}" placeholder="Grams" />
      <button type="button" onclick="this.parentElement.parentElement.remove()">❌</button>
    </div>
  `;

  container.appendChild(row);
  window.setupAutocomplete(row.querySelector(".dish-name"));
};


// ✅ Fetch Dish Info from Supabase

window.getDishInfo = async function (name) {
  const { data, error } = await supabaseClient
    .from("food_items")
    .select("*")
    .ilike("dish_name", name.trim());

  if (!error && data && data.length) return data[0];
  return null;
};


window.calculateCalories = async function () {
  const meals = ["breakfast", "lunch", "dinner"];
  let totals = { calories: 0, protein: 0, carbs: 0, fibre: 0, fats: 0 };

  let today = new Date().toISOString().split("T")[0];
  let dishEntries = [];

  for (const meal of meals) {
    const container = document.getElementById(`${meal}-container`);
    const rows = container.querySelectorAll(".dish-row");

    for (const row of rows) {
      const name = row.querySelector(".dish-name").value;
      const grams = parseFloat(row.querySelector(".dish-grams").value);
      if (!name || isNaN(grams)) continue;

      const info = await window.getDishInfo(name);
      if (!info) continue;

      totals.calories += (info.calorie_per_100gm || 0) * grams / 100;
      totals.protein += (info.protein_per_100gm || 0) * grams / 100;
      totals.carbs += (info.carbs_per_100gm || 0) * grams / 100;
      totals.fibre += (info.fibre_per_100gm || 0) * grams / 100;
      totals.fats += (info.fats_per_100gm || 0) * grams / 100;

      // Prepare dish entry for saving
      dishEntries.push({
        date: today,
        meal_type: meal,
        dish_name: name,
        quantity_grams: grams
      });
    }
  }

  // ✅ Show result
  document.getElementById("calorie-result").innerHTML = `
    <strong>Total for Today:</strong><br>
    Calories: ${totals.calories.toFixed(2)} kcal<br>
    Protein: ${totals.protein.toFixed(2)} g<br>
    Carbs: ${totals.carbs.toFixed(2)} g<br>
    Fibre: ${totals.fibre.toFixed(2)} g<br>
    Fats: ${totals.fats.toFixed(2)} g
  `;

  // ✅ Save daily summary and dish rows
  await window.saveDailySummary(totals);
  await window.saveDishRowsToDB(dishEntries);

  // ✅ Optionally reload summary history (if you show past days)
  if (typeof window.loadDailySummaries === "function") {
    await window.loadDailySummaries();
  }
};




// ✅ Table Sorting for Food Facts
window.enableTableSorting = function () {
  const table = document.getElementById("food-facts-table");
  const headers = table.querySelectorAll("th");
  const tbody = table.querySelector("tbody");

  headers.forEach((header, index) => {
    header.style.cursor = "pointer";
    header.addEventListener("click", () => {
      const isAsc = header.classList.contains("asc");
      const rows = Array.from(tbody.querySelectorAll("tr"));

      rows.sort((a, b) => {
        const aVal = parseFloat(a.children[index].textContent) || a.children[index].textContent;
        const bVal = parseFloat(b.children[index].textContent) || b.children[index].textContent;
        return isAsc ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
      });

      headers.forEach(h => h.classList.remove("asc", "desc"));
      header.classList.add(isAsc ? "desc" : "asc");
      rows.forEach(row => tbody.appendChild(row));
    });
  });
};

// ✅ Load Food Facts Table
window.loadFoodFacts = async function () {
  const { data, error } = await supabaseClient.from("food_items").select("*");
  const tbody = document.querySelector("#food-facts-table tbody");
  tbody.innerHTML = "";

  if (!error && data) {
    data.forEach(dish => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dish.dish_name}</td>
        <td>${dish.calorie_per_100gm || 0}</td>
        <td>${dish.protein_per_100gm || 0}</td>
        <td>${dish.carbs_per_100gm || 0}</td>
        <td>${dish.fibre_per_100gm || 0}</td>
        <td>${dish.fats_per_100gm || 0}</td>
      `;
      tbody.appendChild(row);
    });
    enableTableSorting();
  }
};

// ✅ DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  loadDishNames();

  const btn = document.getElementById("calculate-btn");
  if (btn) btn.addEventListener("click", calculateCalories);
});


// ✅ Save the calculated daily summary
window.saveDailySummary = async function (totals) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await supabaseClient
    .from("daily_summaries")
    .upsert(
      [
        {
          date: today,
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fibre: totals.fibre,
          fats: totals.fats,
        },
      ],
      { onConflict: ["date"] } // Update if entry for today exists
    );

  if (error) {
    console.error("Error saving daily summary:", error.message);
  } else {
    console.log("Daily summary saved successfully:", data);
  }
};

// ✅ Load and show summary history
window.loadDailySummaries = async function () {
  const { data, error } = await supabaseClient
    .from("daily_summaries")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error loading summary history:", error.message);
    return;
  }

  const historyContainer = document.getElementById("calorie-history");
  if (!historyContainer) return;

  historyContainer.innerHTML = "<h3>Calorie History</h3>";

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Calories</th>
        <th>Protein</th>
        <th>Carbs</th>
        <th>Fibre</th>
        <th>Fats</th>
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (row) => `
        <tr>
          <td>${row.date}</td>
          <td>${row.calories.toFixed(1)}</td>
          <td>${row.protein.toFixed(1)}</td>
          <td>${row.carbs.toFixed(1)}</td>
          <td>${row.fibre.toFixed(1)}</td>
          <td>${row.fats.toFixed(1)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;
  historyContainer.appendChild(table);
};

window.saveDishDetailsPerDay = async function (mealType, dishName, grams, info) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await supabaseClient
    .from("daily_dishes")
    .insert([
      {
        date: today,
        meal_type: mealType,
        dish_name: dishName,
        grams: grams,
        calories: (info.calorie_per_100gm || 0) * grams / 100,
        protein: (info.protein_per_100gm || 0) * grams / 100,
        carbs: (info.carbs_per_100gm || 0) * grams / 100,
        fibre: (info.fibre_per_100gm || 0) * grams / 100,
        fats: (info.fats_per_100gm || 0) * grams / 100
      }
    ]);

  if (error) {
    console.error(`❌ Error saving dish (${dishName}) to Supabase:`, error.message);
  } else {
    console.log(`✅ Saved dish: ${dishName}`, data);
  }
};



window.loadDailyDishes = async function () {
	console.log('loadDailyDishes is called');
  const today = new Date().toISOString().split("T")[0];

	const { data, error } = await supabaseClient
	  .from("daily_dishes")
	  .select("*")
	  .eq("date", today)
	  .eq("user_id", loggedInUsername)  // ✅ Filter by current user
	  .order("meal_type");


  if (error || !data) {
    console.error("Error loading daily dishes:", error);
    return;
  }

  const meals = ["breakfast", "lunch", "dinner"];
  meals.forEach(meal => {
    const container = document.getElementById(`${meal}-container`);
    container.innerHTML = "";

    data
      .filter(d => d.meal_type === meal)
      .forEach(dish => {
        window.addDishRow(meal, dish.dish_name, dish.grams); // ✅ Fixed
      });
  });
};



// ✅ Save dish rows for today (e.g., after Calculate)
window.saveDishRowsToDB = async function () {
  const today = new Date().toISOString().split("T")[0];
  const meals = ["breakfast", "lunch", "dinner"];
  const rowsToInsert = [];

  // 1. Delete previous entries
const { error: deleteError } = await supabaseClient
  .from("daily_dishes")
  .delete()
  .eq("date", today)
  .eq("user_id", loggedInUsername); // ✅ Only this user's dishes

  if (deleteError) {
    console.error("❌ Failed to delete previous entries:", deleteError.message);
    return;
  }

  // 2. Process all meals
  for (const meal of meals) {
    const container = document.getElementById(`${meal}-container`);
    const rows = container.querySelectorAll(".dish-row");

    for (const row of rows) {
      const name = row.querySelector(".dish-name").value.trim();
      const grams = parseFloat(row.querySelector(".dish-grams").value);
      if (!name || isNaN(grams)) continue;

      // 🔍 Fetch nutrition info from food_items table
      const { data: nutritionInfo, error } = await supabaseClient
        .from("food_items")
        .select("*")
        .ilike("dish_name", name);

      if (error) {
        console.error(`❌ Error fetching nutrition for "${name}":`, error.message);
        continue;
      }

      if (!nutritionInfo || nutritionInfo.length === 0) {
        console.warn(`⚠️ No match in food_items for "${name}"`);
        continue;
      }

      const info = nutritionInfo[0];
      const factor = grams / 100;


	 rowsToInsert.push({
	  user_id: loggedInUsername, 
	  date: today,
	  meal_type: meal,
	  dish_name: name,
	  grams: grams,
	  calories: Math.round((info.calorie_per_100gm || 0) * factor * 10) / 10,
	  protein:  Math.round((info.protein_per_100gm || 0) * factor * 10) / 10,
	  carbs:    Math.round((info.carbs_per_100gm || 0) * factor * 10) / 10,
	  fibre:    Math.round((info.fibre_per_100gm || 0) * factor * 10) / 10,
	  fats:     Math.round((info.fats_per_100gm || 0) * factor * 10) / 10
	});


    }
  }

  // 3. Insert all calculated rows
  if (rowsToInsert.length > 0) {
    const { error: insertError } = await supabaseClient
      .from("daily_dishes")
      .insert(rowsToInsert);

    if (insertError) {
      console.error("❌ Failed to insert data:", insertError.message);
    } else {
      console.log("✅ Dishes inserted successfully with calculated macros");
	  await window.loadDishSummaryTable(); // 👈 Add this here
    }
  }
};


window.loadDishSummaryTable = async function () {
  // ✅ Get today's date in IST
  function getTodayInIST() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    return istDate.toISOString().split("T")[0];
  }

  const today = getTodayInIST();

  // ✅ Require login
  if (!loggedInUsername) {
    console.warn("No user logged in. Cannot load summary.");
    return;
  }

  // ✅ Load only this user's data for today
  const { data: dishes, error } = await supabaseClient
    .from("daily_dishes")
    .select("*")
    .eq("date", today)
    .eq("user_id", loggedInUsername);  // ✅ This is the fix

  if (error) {
    console.error("❌ Error fetching dish summary:", error.message);
    return;
  }

  // ✅ Render the table...
  const tbody = document.getElementById("dish-summary-body");
  tbody.innerHTML = "";

  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFibre = 0, totalFats = 0;

  dishes.forEach(dish => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${dish.dish_name}</td>
      <td>${(dish.grams || 0).toFixed(1)}</td>
      <td>${(dish.calories || 0).toFixed(1)}</td>
      <td>${(dish.protein || 0).toFixed(1)}</td>
      <td>${(dish.carbs || 0).toFixed(1)}</td>
      <td>${(dish.fibre || 0).toFixed(1)}</td>
      <td>${(dish.fats || 0).toFixed(1)}</td>
    `;
    tbody.appendChild(row);

    totalCalories += dish.calories || 0;
    totalProtein += dish.protein || 0;
    totalCarbs += dish.carbs || 0;
    totalFibre += dish.fibre || 0;
    totalFats += dish.fats || 0;
  });

  const totalRow = document.createElement("tr");
  totalRow.style.backgroundColor = "#f0f0f0";
  totalRow.style.fontWeight = "bold";
  totalRow.innerHTML = `
    <td colspan="2">Total</td>
    <td>${totalCalories.toFixed(1)}</td>
    <td>${totalProtein.toFixed(1)}</td>
    <td>${totalCarbs.toFixed(1)}</td>
    <td>${totalFibre.toFixed(1)}</td>
    <td>${totalFats.toFixed(1)}</td>
  `;
  tbody.appendChild(totalRow);
};


let loggedInUsername = null;

window.promptCalorieLogin = function () {
  if (loggedInUsername) {
    window.showSection('utility-daily-calorie'); // ✅ show section
    window.loadDailyDishes();                    // ✅ load user-specific dishes
	window.loadDishSummaryTable()
  } else {
    document.getElementById('loginModal').style.display = 'block';
  }
};
window.handleCalorieLogin = async function () {
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('app_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    console.log("Supabase login result:", { data, error });

    if (error || !data) {
      alert("Invalid username or password.");
      return;
    }

    // Success!
    loggedInUsername = data.username;

    document.getElementById("loginModal").style.display = "none";
    window.showSection('utility-daily-calorie');
    window.showUsernameOnTop(loggedInUsername);
	window.loadDailyDishes();

  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Please try again.");
  }
};




window.showUsernameOnTop = function (username) {
  let existing = document.getElementById("loggedInUser");
  if (!existing) {
    const userInfo = document.createElement("div");
    userInfo.id = "loggedInUser";
    userInfo.innerHTML = `<strong>Welcome, ${username}</strong><br><br>`;
    const calorieSection = document.getElementById("utility-daily-calorie");
    calorieSection.insertBefore(userInfo, calorieSection.firstChild);
  } else {
    existing.innerHTML = `<strong>Welcome, ${username}</strong><br><br>`;
  }
};


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.log('Service Worker registration failed:', error);
    });
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});
