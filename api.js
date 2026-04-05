// 🔑 Replace with your actual Supabase credentials
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  errorMsg.textContent = "Logging in...";

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    errorMsg.textContent = "Invalid credentials ❌";
    return;
  }

  // Save session locally
  localStorage.setItem("user", JSON.stringify(data));

  errorMsg.textContent = "Login successful ✔️";

  // Redirect based on role
  if (data.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "dashboard.html";
  }
});
