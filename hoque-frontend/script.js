const BASE_URL = "http://localhost:5000";

/* =========================
   TOKEN MANAGEMENT
========================= */

function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}


/* =========================
   LOGIN FUNCTION
========================= */

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Login failed");
    return;
  }

  saveToken(data.token);

  // Decode JWT payload to get role
  const payload = JSON.parse(atob(data.token.split(".")[1]));
  const role = payload.role;

  if (role === "receptionist") {
    window.location.href = "receptionist.html";
  } else if (role === "doctor") {
    window.location.href = "doctor.html";
  } else if (role === "patient") {
    window.location.href = "patient.html";
  }
  else if (role === 'admin') window.location.href = 'admin.html';
}