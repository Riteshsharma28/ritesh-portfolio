// 🌗 Theme Toggle (Light/Dark)
const toggle = document.getElementById("toggle-theme");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  toggle.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
});

// ⌨️ Typing Animation
const typingText = "B.Tech ECE | Aspiring Software & Data Engineer";
const typingElement = document.getElementById("typing-text");
let charIndex = 0;

function type() {
  if (charIndex < typingText.length) {
    typingElement.textContent += typingText.charAt(charIndex);
    charIndex++;
    setTimeout(type, 80);
  }
}

typingElement.textContent = "";
type();

// ✨ Scroll Fade-In Animation
const fadeElements = document.querySelectorAll(".fade-in");

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
      fadeObserver.unobserve(entry.target); // Unobserve once revealed
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";
  fadeObserver.observe(el);
});
