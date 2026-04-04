function fmt(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
}

function showLoader(show) {
  const el = document.getElementById("loader");
  if (el) el.style.display = show ? "flex" : "none";
}
