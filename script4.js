const habitForm = document.getElementById("habitForm");
const habitName = document.getElementById("habitName");
const category = document.getElementById("category");
const habitList = document.getElementById("habitList");
const errorMessage = document.getElementById("errorMessage");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const totalHabits = document.getElementById("totalHabits");
const longestStreak = document.getElementById("longestStreak");
const completedToday = document.getElementById("completedToday");
const emptyState = document.getElementById("emptyState");
const editModal = document.getElementById("editModal");
const editHabitName = document.getElementById("editHabitName");
const editCategory = document.getElementById("editCategory");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");
const themeBtn = document.getElementById("themeBtn");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let currentCategory = "All";
let searchText = "";
let editingId = null;

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function updateDashboard() {

    totalHabits.textContent = habits.length;

    if (habits.length === 0) {
        longestStreak.textContent = 0;
        completedToday.textContent = 0;
        return;
    }

    longestStreak.textContent = Math.max(...habits.map(h => h.streak));

    completedToday.textContent =
        habits.filter(h => h.lastCompleted === today()).length;
}

function today() {
    return new Date().toISOString().split("T")[0];
}

function renderHabits() {

    habitList.innerHTML = "";

    let filtered = habits;

    if (currentCategory !== "All") {
        filtered = filtered.filter(h => h.category === currentCategory);
    }

    if (searchText !== "") {

        filtered = filtered.filter(h =>
            h.name.toLowerCase().includes(searchText.toLowerCase())
        );

    }

    if (filtered.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }

    filtered.forEach(habit => {

        const progress = Math.min((habit.completedDays / 21) * 100, 100);

        const card = document.createElement("div");

        card.className = "habit-card";

        card.innerHTML = `

        <div class="habit-header">

            <h3>${habit.name}</h3>

            <span class="habit-category">

            ${habit.category}

            </span>

        </div>

        <p>🔥 Streak : ${habit.streak} Day(s)</p>

        <p>✅ Completed : ${habit.completedDays}</p>

        <div class="progress-container">

            <div
                class="progress-bar"
                style="width:${progress}%">
            </div>

        </div>

        <p>${Math.floor(progress)}% Completed</p>

        <div class="habit-actions">

            <button
                class="complete-btn"
                onclick="completeHabit(${habit.id})">

                Complete

            </button>

            <button
                class="edit-btn"
                onclick="openEdit(${habit.id})">

                Edit

            </button>

            <button
                class="delete-btn"
                onclick="deleteHabit(${habit.id})">

                Delete

            </button>

        </div>

        `;

        habitList.appendChild(card);

    });

    updateDashboard();

}

habitForm.addEventListener("submit", e => {

    e.preventDefault();

    const name = habitName.value.trim();

    if (name === "") {

        errorMessage.textContent = "Habit name cannot be empty.";

        return;

    }

    errorMessage.textContent = "";

    const habit = {

        id: Date.now(),

        name: name,

        category: category.value,

        streak: 0,

        completedDays: 0,

        lastCompleted: ""

    };

    habits.push(habit);

    saveHabits();

    habitForm.reset();

    renderHabits();

});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentCategory = button.dataset.category;

        renderHabits();

    });

});

searchInput.addEventListener("input", () => {

    searchText = searchInput.value;

    renderHabits();

});

function completeHabit(id) {

    const habit = habits.find(h => h.id === id);

    if (!habit) return;

    if (habit.lastCompleted === today()) {
        alert("You have already completed this habit today.");
        return;
    }

    if (habit.lastCompleted !== "") {

        const previous = new Date(habit.lastCompleted);
        const current = new Date(today());

        const difference =
            (current - previous) / (1000 * 60 * 60 * 24);

        if (difference === 1) {
            habit.streak++;
        } else {
            habit.streak = 1;
        }

    } else {

        habit.streak = 1;

    }

    habit.completedDays++;

    habit.lastCompleted = today();

    saveHabits();

    renderHabits();

}

function deleteHabit(id) {

    const confirmDelete = confirm("Are you sure you want to delete this habit?");

    if (!confirmDelete) return;

    habits = habits.filter(h => h.id !== id);

    saveHabits();

    renderHabits();

}

function openEdit(id) {

    const habit = habits.find(h => h.id === id);

    if (!habit) return;

    editingId = id;

    editHabitName.value = habit.name;

    editCategory.value = habit.category;

    editModal.style.display = "flex";

}

saveEdit.addEventListener("click", () => {

    const habit = habits.find(h => h.id === editingId);

    if (!habit) return;

    if (editHabitName.value.trim() === "") {

        alert("Habit name cannot be empty.");

        return;

    }

    habit.name = editHabitName.value.trim();

    habit.category = editCategory.value;

    saveHabits();

    editModal.style.display = "none";

    renderHabits();

});

cancelEdit.addEventListener("click", () => {

    editModal.style.display = "none";

});

window.addEventListener("click", e => {

    if (e.target === editModal) {

        editModal.style.display = "none";

    }

});

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem("theme", darkMode);

});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "true") {

    document.body.classList.add("dark");

}

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        editModal.style.display = "none";

    }

});

renderHabits();