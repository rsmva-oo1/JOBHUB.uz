// Foydalanuvchi kirganligini tekshirish
document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
  setupLogout();
  initSearch();
  initFilters();
});

// Autentifikatsiya tekshiruvi
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const protectedPages = [
    "index.html",
    "profil.html",
    "vakansiya.html",
    "rezyume.html",
    "suhbat.html",
  ];

  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage)) {
    if (!currentUser) {
      window.location.href = "login.html";
    } else {
      displayUserInfo(currentUser);
    }
  }
}

// Foydalanuvchi ma'lumotlarini ko'rsatish
function displayUserInfo(user) {
  const header = document.querySelector("header");
  if (!header) return;

  const userInfoDiv = document.createElement("div");
  userInfoDiv.className = "user-info";
  userInfoDiv.innerHTML = `
        <span class="username">${user.username}</span>
        <button id="logoutBtn" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i> Chiqish
        </button>
    `;

  header.appendChild(userInfoDiv);
}

// Chiqish funksiyasi
function setupLogout() {
  document.addEventListener("click", function (e) {
    if (e.target.closest("#logoutBtn")) {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    }
  });
}

// Qidiruv funksiyasi
function initSearch() {
  const searchBtn = document.querySelector(".search-btn");
  const searchBox = document.querySelector(".search-box");

  if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", function () {
      const searchTerm = searchBox.value.trim();
      if (searchTerm) {
        alert(
          `Siz qidirgan: ${searchTerm}\n(Ushbu funksiya to'liq ishlashi uchun backend qo'shishingiz kerak)`
        );
        // searchJobs(searchTerm); // Kelajakda ishlab chiqiladi
      }
    });

    searchBox.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  }
}

// Filtrlash funksiyasi
function initFilters() {
  const filters = document.querySelectorAll(".panel select");

  filters.forEach((select) => {
    select.addEventListener("change", function () {
      const location = document.querySelector(
        ".panel select:nth-child(1)"
      ).value;
      const district = document.querySelector(
        ".panel select:nth-child(2)"
      ).value;
      const jobType = document.querySelector(
        ".panel select:nth-child(3)"
      ).value;

      console.log(`Filtrlar: ${location}, ${district}, ${jobType}`);
      // filterJobs(location, district, jobType); // Kelajakda ishlab chiqiladi
    });
  });
}

// Vakansiyalarni yuklash (namuna)
function loadJobs() {
  // Bu funksiya backend bilan ishlash uchun mo'ljallangan
  fetch("jobs.json")
    .then((response) => response.json())
    .then((data) => displayJobs(data))
    .catch((error) => console.error("Xatolik:", error));
}

function displayJobs(jobs) {
  // Vakansiyalarni sahifada ko'rsatish
  console.log(jobs);
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    alert("Noto'g'ri foydalanuvchi nomi yoki parol!");
  }
});

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const user = {
      username: document.getElementById("reg-username").value,
      email: document.getElementById("reg-email").value,
      password: document.getElementById("reg-password").value,
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "index.html";
  });

// Soddalashtirilgan shifrlash
function encryptPassword(password) {
  return btoa(password);
}

// 1 soatlik session
localStorage.setItem("sessionExpire", Date.now() + 3600000);

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
