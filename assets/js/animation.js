if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
} else {
  console.warn(
    "GSAP or ScrollTrigger is not defined. Some animations may not work."
  );
}

// Lenis Setup
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

// Sticky Header Scroll
function stickyScroll() {
  const header = document.querySelector("header");
  if (!header) {
    console.warn("Header element not found. Sticky scroll disabled.");
    return;
  }

  let lastScrollTop = 50; // Initial value to avoid hiding header on first scroll
  let isHeaderFixed = false;

  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;
    let viewportHeight = window.innerHeight;
    let scrollThreshold = viewportHeight * 0.5; // 50% of viewport height for hiding

    // Hide header when scrolling down past threshold
    if (currentScroll > lastScrollTop) {
      if (
        currentScroll > scrollThreshold &&
        !header.classList.contains("header--hidden")
      ) {
        header.classList.add("header--hidden");
      }
    } else {
      if (header.classList.contains("header--hidden")) {
        header.classList.remove("header--hidden");
      }
    }

    // Add header--fixed class earlier (e.g., after scrolling 10 pixels)
    const fixedThreshold = 10; // Adjust this value to control when header--fixed is applied
    if (currentScroll > fixedThreshold && !isHeaderFixed) {
      header.classList.add("header--fixed");
      isHeaderFixed = true;
    } else if (currentScroll <= fixedThreshold && isHeaderFixed) {
      header.classList.remove("header--fixed");
      isHeaderFixed = false;
    }

    // Ensure header is not hidden when near the top
    if (currentScroll < 50) {
      header.classList.remove("header--hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}

// Image Reveal Animation
function imageRevealinti() {
  const sections = document.querySelectorAll("[data-image-container]");

  sections.forEach((section) => {
    const images = section.querySelectorAll("[data-image-reveal]");

    if (images.length > 0) {
      images.forEach((image) => {
        gsap.set(image, {
          clipPath: "inset(0 0 100% 0)",
          webkitClipPath: "inset(0 0 100% 0)",
          opacity: 0,
        });

        const animate = () => {
          ScrollTrigger.create({
            trigger: image,
            start: "top 75%",
            once: true,
            onEnter: () => {
              gsap.to(image, {
                clipPath: "inset(0 0 0% 0)",
                webkitClipPath: "inset(0 0 0% 0)",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
                delay: Math.random() * 0.2,
                onStart: () => image.classList.add("reveal-active"),
              });
            },
          });
        };

        if (image.complete) {
          animate();
        } else {
          image.onload = animate;
        }
      });
    }
  });
}

function initSiteAnimations() {
  stickyScroll();
  imageRevealinti();
}

document.addEventListener("DOMContentLoaded", initSiteAnimations);

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }
    initSiteAnimations();
  }, 250);
});
