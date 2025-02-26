document.addEventListener("DOMContentLoaded", function () {
  let menuIcon = document.querySelector("#menu-icon");
  let navbar = document.querySelector(".navbar");
  let logoText = document.querySelector(".logo-area p");
  let aboutText = document.querySelector(".mission-area #about p");
  let missionText = document.querySelectorAll(".about-area #about p");
  let menuTitle = document.querySelector(".menu-title");
  let logoimg = document.querySelector(".logo");
  let homeTitle = document.querySelector("#home-title");

  menuIcon.onclick = () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
    document.body.classList.toggle("menu-open");

    const navItems = navbar.querySelectorAll("li");

    if (navbar.classList.contains("active")) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      if (logoText) logoText.style.display = "none";
      if (aboutText) aboutText.style.display = "none";
      missionText.forEach((p) => (p.style.display = "none"));
      menuTitle.style.display = "block";
      menuTitle.style.position = "fixed";
      logoimg.style.display = "none";
      homeTitle.style.display = "block";

      // Animate each nav item with a delay
      navItems.forEach((item, index) => {
        item.style.transitionDelay = `${0.3 + index * 0.1}s`;
      });
    } else {
      document.body.style.position = "static";
      document.body.style.width = "auto";
      if (logoText) logoText.style.display = "block";
      if (aboutText) aboutText.style.display = "block";
      missionText.forEach((p) => (p.style.display = "block"));
      menuTitle.style.display = "none";
      menuTitle.style.position = "relative";
      logoimg.style.display = "block";
      homeTitle.style.display = "none";

      // Reset transition delays
      navItems.forEach((item) => {
        item.style.transitionDelay = "2s";
      });
    }
  };

  // Scroll animation setup
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, 100);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "50px",
    }
  );

  // Elements to animate
  const animateElements = [
    ".home-img_1",
    ".about-content",
    ".about-area",
    ".about-area p",
    ".program-title",
    ".program p",
    ".program-content",
    ".form-container",
    "#feature .fe-box",
    ".logo-area",
    ".banner-img h1",
    "footer",
  ].join(",");

  // Start observing elements
  const elements = document.querySelectorAll(animateElements);
  elements.forEach((element) => {
    if (element) {
      element.classList.add("fade-in");
      observer.observe(element);
    }
  });
});

document
  .getElementById("form-contact")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Log form values to check if they are correct
    console.log("Form Data: ", { firstName, lastName, email, message });

    // Create form data object
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      message: message,
    };

    // Get the submit button and change its text to "Submitting..."
    const submitButton = document.querySelector(".contact-btn");
    submitButton.textContent = "Submitting...";
    submitButton.disabled = true; // Disable the button to prevent multiple submissions

    // Use Fetch to send form data to server
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.text();
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error("Response parsing error:", data);
          throw new Error("Invalid server response");
        }
      })
      .then((data) => {
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.textContent = "Email was sent!";
        feedbackMessage.style.color = "#16b3ce";
        feedbackMessage.style.fontWeight = "500";
        feedbackMessage.style.fontSize = "1.2rem";
        feedbackMessage.style.display = "block";

        submitButton.textContent = "Submit";
        submitButton.disabled = false;

        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.textContent = "Failed to send email. Please try again";
        feedbackMessage.style.color = "red";
        feedbackMessage.style.display = "block";

        submitButton.textContent = "Submit";
        submitButton.disabled = false;
      });
  });
