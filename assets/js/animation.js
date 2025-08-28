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

function dropDownMenu() {
  function animateToAutoHeight(element) {
    const curHeight = element.offsetHeight;
    element.style.height = "auto";
    const autoHeight = element.offsetHeight;
    element.style.height = curHeight + "px";
    gsap.to(element, { height: autoHeight, duration: 0.3, ease: "power2.out" });
  }
  // Close all menus except the current
  function closeAllMenus(currentItem) {
    document.querySelectorAll(".menu-item-has-children").forEach((item) => {
      if (item !== currentItem) {
        const menu = item.querySelector(".sub-menu");
        const link = item.querySelector(".sub-menu li a");
        menu.classList.remove("site_megaMenu__Active");
        link.classList.remove("site_megaMenu__Active");
        gsap.to(menu, { height: 0, duration: 0.3, ease: "power2.out" });
        const items = menu.querySelectorAll(".sub-menu li");
        gsap.to(items, {
          opacity: 0,
          y: 20,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    });
  }
  // Main hover logic
  document.querySelectorAll(".menu-item-has-children").forEach((item) => {
    const megaMenu = item.querySelector(".sub-menu");
    const navLink = item.querySelector("li a");
    const items = megaMenu.querySelectorAll(".sub-menu li");
    // Initially set items hidden
    gsap.set(items, { opacity: 0, y: 20 });
    item.addEventListener("mouseenter", () => {
      closeAllMenus(item);
      megaMenu.classList.add("site_megaMenu__Active");
      navLink.classList.add("site_megaMenu__Active");
      animateToAutoHeight(megaMenu);
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.1,
        ease: "power2.out",
      });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(megaMenu, { height: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(items, { opacity: 0, y: 20, duration: 0.2, ease: "power2.out" });
      megaMenu.classList.remove("site_megaMenu__Active");
      navLink.classList.remove("site_megaMenu__Active");
    });
  });
}

function initToggleMenu() {
  const toggleButton = document.querySelector(".toggle");
  const sidebarNav = document.querySelector("nav");
  const body = document.querySelector("body");

  toggleButton.addEventListener("click", function () {
    sidebarNav.classList.toggle("open");
    toggleButton.classList.toggle("open");
    body.classList.toggle("openmenu");
  });
}
function initSiteAnimations() {
  stickyScroll();
  initToggleMenu();
  dropDownMenu();
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
