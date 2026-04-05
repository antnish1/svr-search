// 🔑 Replace with your actual Supabase credentials
const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";



const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("🔥 Login button clicked");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log("👤 Username:", username);
  console.log("🔑 Password:", password);

  errorMsg.textContent = "Logging in...";

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("name", username)
      .eq("password", password)
      .single();

    console.log("📦 Supabase response data:", data);
    console.log("❗ Supabase error:", error);

    if (error || !data) {
      errorMsg.textContent = "Invalid credentials ❌";
      return;
    }

    console.log("✅ Login success, saving user...");

    localStorage.setItem("user", JSON.stringify(data));

    console.log("➡️ Redirecting to dashboard...");

    window.location.href = "dashboard.html";

  } catch (err) {
    console.log("🚨 Unexpected error:", err);
    errorMsg.textContent = "Something went wrong!";
  }
});
