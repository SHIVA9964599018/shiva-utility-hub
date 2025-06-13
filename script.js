import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Initialize Supabase Client
const supabaseClient = createClient(
  "https://wzgchcvyzskespcfrjvi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z2NoY3Z5enNrZXNwY2ZyanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjQwNDEsImV4cCI6MjA1NzQ0MDA0MX0.UuAgu4quD9Vg80tOUSkfGJ4doOT0CUFEUeoHsiyeNZQ"
);

let loggedInUsername = null;

window.showSection = function (sectionId) {
  document.querySelectorAll("section, div[id^='utility-']").forEach((el) => {
    el.style.display = "none";
  });

  const utilitiesSection = document.getElementById("utilities");
  if (sectionId.startsWith("utility-") && utilitiesSection) {
    utilitiesSection.style.display = "block";
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

window.promptCalorieLogin = function () {
  if (loggedInUsername) {
    window.showSection("utility-daily-calorie");
    window.loadDailyDishes();
    window.loadDishSummaryTable();
  } else {
    document.getElementById("loginModal").style.display = "block";
  }
};

window.handleCalorieLogin = async function () {
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("app_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    alert("Invalid username or password.");
    return;
  }

  loggedInUsername = data.username;
  document.getElementById("loginModal").style.display = "none";
  window.showSection("utility-daily-calorie");
  window.loadDailyDishes();
  window.loadDishSummaryTable();
};

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
};

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
    await supabaseClient
      .from("daily_dishes")
      .insert(rowsToInsert);
  }
};

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
  }
};

// Auto-load main section
window.addEventListener("DOMContentLoaded", () => {
  window.showSection("utilities");
});
