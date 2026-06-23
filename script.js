const header = document.querySelector("[data-header]");
const topButton = document.querySelector("[data-top]");
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll("[data-project-grid] article");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const jobPosition = document.querySelector("[data-job-position]");
const jobApplyButtons = document.querySelectorAll("[data-job]");
const emailApplicationForm = document.querySelector("[data-email-application-form]");
const applicationToast = document.querySelector("[data-application-toast]");
const careerModal = document.querySelector("[data-career-modal]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
const modalJobTitle = document.querySelector("[data-modal-job-title]");
const modalRoleLabel = document.querySelector("[data-modal-role-label]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const galleryButtons = document.querySelectorAll(".gallery-open");
const slides = document.querySelectorAll(".hero-slide");
const dotsContainer = document.querySelector("[data-slider-dots]");
const prevSlideButton = document.querySelector("[data-slide-prev]");
const nextSlideButton = document.querySelector("[data-slide-next]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector(".nav-links");
const profileMenus = document.querySelectorAll(".profile-menu");
const revealItems = document.querySelectorAll(
  ".reveal, .service-grid article, .project-grid article, .outcome-grid figure, .gallery-grid figure, .career-card, .application-panel"
);
const whatsAppNumber = "919840038641";
let currentSlide = 0;
let slideTimer;

document.addEventListener("click", (event) => {
  if (event.target.closest(".profile-menu")) {
    return;
  }

  profileMenus.forEach((menu) => {
    menu.open = false;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    profileMenus.forEach((menu) => {
      menu.open = false;
    });
  }
});

const updateChrome = () => {
  const scrolled = window.scrollY > 40;
  header?.classList.toggle("is-scrolled", scrolled);
  topButton?.classList.toggle("is-visible", window.scrollY > 500);
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
  if (!slides.length) {
    return;
  }

  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
  dotsContainer?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
  });
};

const startSlider = () => {
  if (!slides.length) {
    return;
  }

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
  dotsContainer?.appendChild(dot);
});

prevSlideButton?.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  startSlider();
});

nextSlideButton?.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  startSlider();
});

menuToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("is-open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("is-open"));
});

topButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    const figure = button.closest("figure");
    const caption = figure?.querySelector("figcaption")?.textContent || image?.alt || "";

    if (!image || !lightbox || !lightboxImage || !lightboxCaption) {
      return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");
  });
});

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("is-lightbox-open");
};

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeCareerModal();
  }
});

jobApplyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (jobPosition) {
      jobPosition.value = button.dataset.job || "";
    }
    if (modalJobTitle) {
      modalJobTitle.textContent = button.dataset.job || "Join PlumbPro Tech";
    }
    if (modalRoleLabel) {
      modalRoleLabel.textContent = button.dataset.jobLabel || "Open position";
    }
    if (careerModal) {
      careerModal.hidden = false;
      document.body.classList.add("is-modal-open");
      careerModal.querySelector("input")?.focus();
    }
  });
});

const closeCareerModal = () => {
  if (!careerModal) return;
  careerModal.hidden = true;
  document.body.classList.remove("is-modal-open");
};

modalCloseButtons.forEach((button) => button.addEventListener("click", closeCareerModal));

emailApplicationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = emailApplicationForm.querySelector('[type="submit"]');

  applicationToast?.classList.add("is-visible");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending Application...";
  }

  window.setTimeout(() => emailApplicationForm.submit(), 850);
});

contactForm?.addEventListener("submit", (event) => {
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
  formStatus?.classList.toggle("is-error", !whatsAppWindow);
  if (formStatus) {
    formStatus.textContent = whatsAppWindow
      ? "Your enquiry is ready in WhatsApp. The form has been cleared."
      : "Please allow popups, then send again. Your form has been cleared.";
  }
});

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  if (!item.classList.contains("from-right") && !item.classList.contains("from-bottom")) {
    item.classList.add(index % 2 === 0 ? "from-left" : "from-right");
  }
});

if ("IntersectionObserver" in window) {
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
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", updateChrome, { passive: true });
updateChrome();
showSlide(0);
startSlider();
