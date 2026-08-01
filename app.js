const phrases = [
  { title: "Get our ducks in a row", meaning: "Get organized and aligned before moving forward.", tags: "open a meeting alignment prepare" },
  { title: "Circle back", meaning: "Return to a topic or reconnect later.", tags: "follow up later buy time" },
  { title: "Good call", meaning: "Acknowledge a smart decision or suggestion.", tags: "agree casual small talk" },
  { title: "I see it differently", meaning: "Offer a respectful, direct disagreement.", tags: "disagree politely challenge" },
  { title: "Let's land this", meaning: "Bring a conversation to a decision or close.", tags: "wrap up close meeting" },
  { title: "Let me come back to you", meaning: "Ask for time to give a thoughtful answer.", tags: "buy time answer later" },
];

const toast = document.querySelector("#toast");
let toastTimer;
function showToast(message) {
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".save-button").forEach((button) => button.addEventListener("click", () => {
  button.classList.toggle("saved");
  showToast(button.classList.contains("saved") ? "Saved to your library" : "Removed from your library");
}));

let explored = 2;
document.querySelectorAll(".try-button").forEach((button) => button.addEventListener("click", () => {
  if (button.classList.contains("done")) return;
  button.classList.add("done");
  button.innerHTML = 'Explored <i data-lucide="check-check"></i>';
  explored = Math.min(5, explored + 1);
  document.querySelector("#progressText").textContent = `${explored} of 5 explored`;
  document.querySelector("#progressBar").style.width = `${explored * 20}%`;
  lucide.createIcons();
}));

const input = document.querySelector("#searchInput");
const results = document.querySelector("#searchResults");
function search(value) {
  input.value = value;
  const query = value.trim().toLowerCase();
  if (!query) { results.classList.remove("show"); return; }
  const matches = phrases.filter((phrase) => `${phrase.title} ${phrase.meaning} ${phrase.tags}`.toLowerCase().includes(query));
  results.innerHTML = matches.length ? matches.map((phrase) => `<div class="result"><div><strong>${phrase.title}</strong><span>${phrase.meaning}</span></div><i data-lucide="arrow-up-right"></i></div>`).join("") : '<div class="result"><div><strong>No exact match</strong><span>Try a goal like “disagree” or “wrap up”.</span></div></div>';
  results.classList.add("show");
  lucide.createIcons();
}
input.addEventListener("input", (event) => search(event.target.value));
document.querySelectorAll("[data-search]").forEach((button) => button.addEventListener("click", () => search(button.dataset.search)));
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key === "k") { event.preventDefault(); input.focus(); }});

document.querySelectorAll(".listen").forEach((button) => button.addEventListener("click", () => {
  const text = button.closest(".phrase-card").querySelector("h3").textContent;
  if ("speechSynthesis" in window) speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  showToast(`Playing “${text}”`);
}));
document.querySelector("#practiceButton").addEventListener("click", () => showToast("Your practice session is ready"));
lucide.createIcons();
