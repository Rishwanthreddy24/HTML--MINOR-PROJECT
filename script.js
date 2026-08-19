const body = document.body;
const themeBtn = document.getElementById("theme-btn");
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");
const topBtn = document.getElementById("topBtn");
const typingElement = document.getElementById("typing");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

const roles = [
    "Frontend Developer",
    "Web Developer",
    "JavaScript Developer",
    "UI Developer"
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeEffect() {
    if (!typingElement) {
        return;
    }

    const currentRole = roles[roleIndex];

    if (!deleting) {
        typingElement.textContent = currentRole.substring(0, characterIndex + 1);
        characterIndex++;

        if (characterIndex === currentRole.length) {
            deleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        typingElement.textContent = currentRole.substring(0, characterIndex - 1);
        characterIndex--;

        if (characterIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeEffect, deleting ? 60 : 100);
}

typeEffect();

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
    body.classList.add("dark");
    if (themeBtn) {
        themeBtn.classList.remove("fa-moon");
        themeBtn.classList.add("fa-sun");
    }
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        body.classList.toggle("dark");

        const isDark = body.classList.contains("dark");

        localStorage.setItem(
            "portfolio-theme",
            isDark ? "dark" : "light"
        );

        themeBtn.classList.toggle("fa-moon", !isDark);
        themeBtn.classList.toggle("fa-sun", isDark);
    });
}

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        body.classList.toggle("menu-open");

        const menuOpen = navLinks.classList.contains("active");

        menuBtn.classList.toggle("fa-bars", !menuOpen);
        menuBtn.classList.toggle("fa-xmark", menuOpen);
    });
}

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        body.classList.remove("menu-open");

        if (menuBtn) {
            menuBtn.classList.remove("fa-xmark");
            menuBtn.classList.add("fa-bars");
        }
    });
});

const sections = document.querySelectorAll("section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

function updateActiveLink() {
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {
            navigationLinks.forEach(link => {
                link.classList.remove("active");

                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

window.addEventListener("scroll", updateActiveLink);

function updateTopButton() {
    if (window.scrollY > 500) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }
}

window.addEventListener("scroll", updateTopButton);

if (topBtn) {
    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function setFieldState(field, valid) {
    field.classList.remove("error", "success");

    if (valid) {
        field.classList.add("success");
    } else {
        field.classList.add("error");
    }
}

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const message = document.getElementById("message");

        const validName = validateName(name.value);
        const validEmail = validateEmail(email.value);
        const validMessage = validateMessage(message.value);

        setFieldState(name, validName);
        setFieldState(email, validEmail);
        setFieldState(message, validMessage);

        if (!validName) {
            formMessage.textContent = "Please enter your name.";
            formMessage.className = "error";
            name.focus();
            return;
        }

        if (!validEmail) {
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.className = "error";
            email.focus();
            return;
        }

        if (!validMessage) {
            formMessage.textContent = "Message must contain at least 10 characters.";
            formMessage.className = "error";
            message.focus();
            return;
        }

        formMessage.textContent =
            "Message validated successfully! You can connect with me through email or LinkedIn.";
        formMessage.className = "success";

        contactForm.reset();

        [name, email, message].forEach(field => {
            field.classList.remove("success", "error");
        });
    });
}

const revealElements = document.querySelectorAll(
    ".about, .skills, .projects, .contact, .skill-card, .project-card, .about-info div"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    observer.observe(element);
});