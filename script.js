const header = document.querySelector("[data-header]");
const topButton = document.querySelector("[data-top]");
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll("[data-project-grid] article");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const slides = document.querySelectorAll(".hero-slide");
const dotsContainer = document.querySelector("[data-slider-dots]");
const prevSlideButton = document.querySelector("[data-slide-prev]");
const nextSlideButton = document.querySelector("[data-slide-next]");
const revealItems = document.querySelectorAll(".reveal");
const whatsAppNumber = "919840038641";
let currentSlide = 0;
let slideTimer;

const updateChrome = () => {
  const scrolled = window.scrollY > 40;
  header.classList.toggle("is-scrolled", scrolled);
  topButton.classList.toggle("is-visible", window.scrollY > 500);
};

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    projects.forEach((project) => {
      const tags = project.dataset.tags.split(" ");
      project.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

const showSlide = (index) => {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
  dotsContainer.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
  });
};

const startSlider = () => {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
};

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
  dot.addEventListener("click", () => {
    showSlide(index);
    startSlider();
  });
  dotsContainer.appendChild(dot);
});

prevSlideButton.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  startSlider();
});

nextSlideButton.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  startSlider();
});

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const contactPerson = String(formData.get("contactPerson")).trim();
  const companyName = String(formData.get("companyName")).trim();
  const phone = String(formData.get("phone")).trim();
  const email = String(formData.get("email")).trim() || "Not provided";
  const address = String(formData.get("address")).trim();
  const service = String(formData.get("service")).trim();
  const projectDetails = String(formData.get("projectDetails")).trim();

  const whatsAppMessage = [
    "New PlumbPro Tech enquiry",
    "",
    `Contact Person Name: ${contactPerson}`,
    `Name of Company: ${companyName}`,
    `Phone: ${phone}`,
    `Email ID: ${email}`,
    `Service Required Location and Address: ${address}`,
    "",
    `Service: ${service}`,
    `Project Details: ${projectDetails}`,
  ].join("\n");

  const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppMessage)}`;
  const whatsAppWindow = window.open(whatsAppUrl, "_blank");

  contactForm.reset();
  formStatus.classList.toggle("is-error", !whatsAppWindow);
  formStatus.textContent = whatsAppWindow
    ? "Your enquiry is ready in WhatsApp. The form has been cleared."
    : "Please allow popups, then send again. Your form has been cleared.";
});

window.addEventListener("scroll", updateChrome, { passive: true });
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

updateChrome();
showSlide(0);
startSlider();
