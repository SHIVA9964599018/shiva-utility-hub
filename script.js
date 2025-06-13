// ✅ script.js (module-compatible with full function support)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseClient = createClient(
  "https://wzgchcvyzskespcfrjvi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z2NoY3Z5enNrZXNwY2ZyanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjQwNDEsImV4cCI6MjA1NzQ0MDA0MX0.UuAgu4quD9Vg80tOUSkfGJ4doOT0CUFEUeoHsiyeNZQ"
);

let loggedInUsername = null;
window.dishNames = [];

window.showSection = function (sectionId) {
  console.log(`Switching to Section: ${sectionId}`);

  // Hide all sections
  document.querySelectorAll("section, div[id^='utility-']").forEach((el) => {
    el.style.display = "none";
  });

  // Show main utility section if needed
  if (sectionId.startsWith("utility-")) {
    const utilitiesSection = document.getElementById("utilities");
    if (utilitiesSection) {
      utilitiesSection.style.display = "block";
    }
  }

  // Show the requested section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = "block";
  } else {
    console.error(`Section '${sectionId}' not found`);
  }
};

// Show utility sub-section
window.showUtilitySubSection = function (subSectionId) {
  document.querySelectorAll("div[id^='utility-']").forEach(el => el.style.display = "none");
  const target = document.getElementById(subSectionId);
  if (target) target.style.display = "block";
};

let dishNames = [];

window.loadDishNames = async function () {
  const { data, error } = await supabaseClient.from("food_items").select("dish_name");
  if (!error && data) {
    dishNames = data.map(d => d.dish_name);
  } else {
    console.error("Failed to load dish names:", error);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  loadDishNames(); // make sure this is called on page load
});



// ✅ Set up autocomplete dropdown
window.setupAutocomplete = function (input) {
  input.addEventListener("input", function () {
    const val = input.value.toLowerCase();
    const suggestions = dishNames
      .filter(name => name.toLowerCase().includes(val))
      .slice(0, 5); // limit suggestions

    let suggestionBox = input.nextElementSibling;
    if (!suggestionBox || !suggestionBox.classList.contains("autocomplete-box")) {
      suggestionBox = document.createElement("div");
      suggestionBox.className = "autocomplete-box";
      suggestionBox.style.position = "absolute";
      suggestionBox.style.background = "#fff";
      suggestionBox.style.border = "1px solid #ccc";
      suggestionBox.style.zIndex = "1000";
      suggestionBox.style.width = input.offsetWidth + "px";
      input.parentNode.appendChild(suggestionBox);
    }

    suggestionBox.innerHTML = "";
    suggestions.forEach(s => {
      const div = document.createElement("div");
      div.textContent = s;
      div.style.padding = "4px";
      div.style.cursor = "pointer";
      div.addEventListener("click", () => {
        input.value = s;
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(div);
    });
  });

  // Hide on outside click
  document.addEventListener("click", function (e) {
    if (!input.contains(e.target) && input.nextElementSibling?.classList.contains("autocomplete-box")) {
      input.nextElementSibling.innerHTML = "";
    }
  });
};


// ✅ Add a dish row
window.addDishRow = function (mealType, name = "", grams = "") {
  const container = document.getElementById(`${mealType}-container`);
  const row = document.createElement("div");
  row.className = "dish-row";

  row.innerHTML = `
    <input type="text" class="dish-name" value="${name}" placeholder="Dish Name" />
    <input type="number" class="dish-grams" value="${grams}" placeholder="Grams" />
    <button type="button" onclick="this.parentElement.remove()">Remove</button>
  `;

  container.appendChild(row);

  const input = row.querySelector(".dish-name");
  setupAutocomplete(input); // 🔁 This must be called here
};



// ✅ Fetch dish info
window.getDishInfo = async function (name) {
  const { data, error } = await supabaseClient
    .from("food_items")
    .select("*")
    .ilike("dish_name", name.trim());

  if (!error && data && data.length) return data[0];
  return null;
};


// ✅ Calculate total macros
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

      const factor = grams / 100;
      totals.calories += (info.calorie_per_100gm || 0) * factor;
      totals.protein += (info.protein_per_100gm || 0) * factor;
      totals.carbs += (info.carbs_per_100gm || 0) * factor;
      totals.fibre += (info.fibre_per_100gm || 0) * factor;
      totals.fats += (info.fats_per_100gm || 0) * factor;

      dishEntries.push({
        date: today,
        meal_type: meal,
        dish_name: name,
        quantity_grams: grams
      });
    }
  }

  document.getElementById("calorie-result").innerHTML = `
    <strong>Total:</strong><br>
    Calories: ${totals.calories.toFixed(2)} kcal<br>
    Protein: ${totals.protein.toFixed(2)} g<br>
    Carbs: ${totals.carbs.toFixed(2)} g<br>
    Fibre: ${totals.fibre.toFixed(2)} g<br>
    Fats: ${totals.fats.toFixed(2)} g`;

  await window.saveDishRowsToDB(dishEntries);
  await window.loadDishSummaryTable();
};

// ✅ Save dish entries to DB
window.saveDishRowsToDB = async function (dishEntries) {
  const today = new Date().toISOString().split("T")[0];

  await supabaseClient
    .from("daily_dishes")
    .delete()
    .eq("date", today)
    .eq("user_id", loggedInUsername);

  const rowsToInsert = [];

  for (const entry of dishEntries) {
    const info = await window.getDishInfo(entry.dish_name);
    if (!info) continue;

    const factor = entry.quantity_grams / 100;
    rowsToInsert.push({
      user_id: loggedInUsername,
      date: today,
      meal_type: entry.meal_type,
      dish_name: entry.dish_name,
      grams: entry.quantity_grams,
      calories: (info.calorie_per_100gm || 0) * factor,
      protein: (info.protein_per_100gm || 0) * factor,
      carbs: (info.carbs_per_100gm || 0) * factor,
      fibre: (info.fibre_per_100gm || 0) * factor,
      fats: (info.fats_per_100gm || 0) * factor
    });
  }

  if (rowsToInsert.length) {
    await supabaseClient.from("daily_dishes").insert(rowsToInsert);
  }
};

// Load summary table
window.loadDishSummaryTable = async function () {
  const today = new Date().toISOString().split("T")[0];
  const { data: dishes, error } = await supabaseClient
    .from("daily_dishes")
    .select("*")
    .eq("date", today)
    .eq("user_id", loggedInUsername);

  if (error) {
    console.error("Error fetching dish summary:", error.message);
    return;
  }

  const tbody = document.getElementById("dish-summary-body");
  tbody.innerHTML = "";

  dishes.forEach(dish => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${dish.dish_name}</td>
      <td>${dish.grams}</td>
      <td>${dish.calories.toFixed(1)}</td>
      <td>${dish.protein.toFixed(1)}</td>
      <td>${dish.carbs.toFixed(1)}</td>
      <td>${dish.fibre.toFixed(1)}</td>
      <td>${dish.fats.toFixed(1)}</td>`;
    tbody.appendChild(row);
  });
};

// Login handlers
window.promptCalorieLogin = function () {
  if (loggedInUsername) {
    window.showSection('utility-daily-calorie');
    window.loadDishSummaryTable();
  } else {
    document.getElementById('loginModal').style.display = 'block';
  }
};

window.handleCalorieLogin = async function () {
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  const { data, error } = await supabaseClient
    .from('app_users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    alert("Invalid username or password.");
    return;
  }

  loggedInUsername = data.username;
  document.getElementById("loginModal").style.display = "none";
  window.showSection('utility-daily-calorie');
  window.loadDishSummaryTable();
};

// Load food facts
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
        <td>${dish.fats_per_100gm || 0}</td>`;
      tbody.appendChild(row);
    });
    enableTableSorting();  // <-- important call added here
  }
};


// Show 'utilities' section on load
document.addEventListener("DOMContentLoaded", () => {
  window.showSection("utilities");
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nutrition-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dishName = document.getElementById("dish_name").value.trim();
      const calorie = parseFloat(document.getElementById("calorie").value);
      const protein = parseFloat(document.getElementById("protein").value);
      const carbs = parseFloat(document.getElementById("carbs").value);
      const fibre = parseFloat(document.getElementById("fibre").value);
      const fats = parseFloat(document.getElementById("fats").value);

      const { error } = await supabaseClient.from("food_items").insert([
        {
          dish_name: dishName,
          calorie_per_100gm: calorie,
          protein_per_100gm: protein,
          carbs_per_100gm: carbs,
          fibre_per_100gm: fibre,
          fats_per_100gm: fats
        }
      ]);

      const message = document.getElementById("nutrition-message");
      if (error) {
        message.textContent = "❌ Failed to save dish.";
        message.style.color = "red";
      } else {
        message.textContent = "✅ Dish saved successfully.";
        message.style.color = "green";
        form.reset();
      }
    });
  }
});

function enableTableSorting() {
  const table = document.getElementById("food-facts-table");
  const headers = table.querySelectorAll("th");
  const tbody = table.querySelector("tbody");

  headers.forEach((header, index) => {
    header.style.cursor = "pointer";
    header.addEventListener("click", () => {
      const isAsc = header.classList.contains("asc");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      rows.sort((a, b) => {
        const aVal = parseFloat(a.children[index].textContent) || a.children[index].textContent.toLowerCase();
        const bVal = parseFloat(b.children[index].textContent) || b.children[index].textContent.toLowerCase();
        return (isAsc ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1));
      });
      headers.forEach(h => h.classList.remove("asc", "desc"));
      header.classList.add(isAsc ? "desc" : "asc");
      rows.forEach(row => tbody.appendChild(row));
    });
  });
}

