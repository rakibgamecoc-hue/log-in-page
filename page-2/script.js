const root = document.documentElement;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const sectionLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");
const modal = document.querySelector(".project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalSummary = document.querySelector(".modal-summary");
const modalStack = document.querySelector(".modal-stack");
const modalHighlights = document.querySelector(".modal-highlights");
const modalClose = document.querySelector(".modal-close");
const modalBackdrop = document.querySelector(".project-modal-backdrop");
const projectButtons = document.querySelectorAll(".project-card-link");
const contactForm = document.querySelector(".contact-form");
const formMessage = document.querySelector(".form-message");
const pageLoader = document.querySelector(".page-loader");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = document.querySelectorAll("a, button, input, textarea, .project-card");

const storedTheme = localStorage.getItem("portfolio-theme");

const syncThemeLabel = () => {
    if (!themeToggle) {
        return;
    }

    themeToggle.textContent = root.classList.contains("light-theme") ? "Dark" : "Light";
};

if (storedTheme === "light") {
    root.classList.add("light-theme");
}

syncThemeLabel();

window.addEventListener("load", () => {
    window.setTimeout(() => {
        document.body.classList.add("is-loaded");
        pageLoader?.setAttribute("hidden", "");
    }, 450);
});

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        navLinks.classList.toggle("is-open");
    });
}

sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (!navToggle || !navLinks) {
            return;
        }

        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
    });
});

themeToggle?.addEventListener("click", () => {
    root.classList.toggle("light-theme");
    const theme = root.classList.contains("light-theme") ? "light" : "dark";
    localStorage.setItem("portfolio-theme", theme);
    syncThemeLabel();
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        sectionLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", isCurrent);
        });
    });
}, { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 });

sections.forEach((section) => sectionObserver.observe(section));

if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
        document.body.classList.add("cursor-active");
        const x = `${event.clientX}px`;
        const y = `${event.clientY}px`;
        cursorDot.style.left = x;
        cursorDot.style.top = y;
        cursorRing.style.left = x;
        cursorRing.style.top = y;
    });

    document.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-active");
        document.body.classList.remove("cursor-hover");
    });

    hoverTargets.forEach((target) => {
        target.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });

        target.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });
    });
}

const closeModal = () => {
    if (!modal) {
        return;
    }

    modal.hidden = true;
    document.body.classList.remove("modal-open");
};

projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!modal || !modalTitle || !modalSummary || !modalStack || !modalHighlights) {
            return;
        }

        modalTitle.textContent = button.dataset.project || "";
        modalSummary.textContent = button.dataset.summary || "";
        modalStack.textContent = button.dataset.stack || "";
        modalHighlights.textContent = button.dataset.highlights || "";
        modal.hidden = false;
        document.body.classList.add("modal-open");
    });
});

modalClose?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
        closeModal();
    }
});

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        formMessage.textContent = "Please fill in your name, email, and message.";
        formMessage.dataset.state = "error";
        return;
    }

    if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.dataset.state = "error";
        return;
    }

    formMessage.textContent = "Thanks. Your prototype message has been queued successfully.";
    formMessage.dataset.state = "success";
    contactForm.reset();
});
