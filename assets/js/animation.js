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


function stickyAnimation() {
  const animationConfigs = {
    BG_right: {
       screen: { axis: "y", distance: "-75" },
      featureBg: { axis: "x", distance: 75 },
      feature: { axis: "y", distance: 75 },
      stagger: {
        amount: 0.4, 
        from: "start", 
        axis: "y",
        distance: 40,
      },
      duration: 10,
      pause: 0.5,
      easeIn: "linear",
      easeOut: "linear",
    },
  };

  const containers = document.querySelectorAll(".stacking_section-container");

  const refreshScrollTrigger = () => {
    ScrollTrigger.refresh();
  };

  containers.forEach((container, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("pin-wrapper");
    container.parentNode.insertBefore(wrapper, container);
    wrapper.appendChild(container);

    let configKey = "default";
    if (container.classList.contains("UI_right")) {
      configKey = "UI_right";
    } else if (container.classList.contains("BG_right")) {
      configKey = "BG_right";
    }

    const config = animationConfigs[configKey] || animationConfigs.default;

    const texts = gsap.utils.toArray(".feature", container);
    // Changed from .screen to .feature-bg to match your HTML structure
    const screens = gsap.utils.toArray(".feature-bg", container);
    const bgs = gsap.utils.toArray(".feature-bg", container);
    
    // Get stagger elements for each feature - target all direct children of categories-row__left
    const staggerElements = texts.map(feature => {
      const categoryRow = feature.querySelector('.categories-row__left');
      if (categoryRow) {
        return gsap.utils.toArray(categoryRow.children);
      }
      return [];
    });

    // Check if we have matching counts
    if (texts.length !== screens.length) {
      console.error(`Mismatch in element counts for container ${index + 1}`);
      console.log(`Found ${texts.length} .feature elements and ${screens.length} .feature-bg elements`);
      return;
    }

    // Set initial states
    gsap.set([texts[0]], { opacity: 1, x: 0, y: 0 });
    gsap.set([screens[0]], { opacity: 1, x: 0, y: 0 });
    
    // Set initial states for stagger elements
    gsap.set(staggerElements[0], { opacity: 1, x: 0, y: 0 });
    
    gsap.set([...texts.slice(1)], {
      opacity: 0,
      [config.feature.axis]: config.feature.distance,
    });
    gsap.set([...screens.slice(1)], {
      opacity: 0,
      [config.screen.axis]:
        config.screen.axis === "x"
          ? config.screen.distance
          : -config.screen.distance,
    });
    
    // Set initial states for remaining stagger elements
    staggerElements.slice(1).forEach(elements => {
      if (elements && elements.length > 0) {
        gsap.set(elements, {
          opacity: 0,
          [config.stagger.axis]: config.stagger.distance,
        });
      }
    });

    const dropdown = container.querySelector("#sectionDropdown");
    let currentActiveFeature = null;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "+=" + window.innerHeight * 5,
        scrub: true,
        pin: wrapper,
        markers: false,
        onUpdate: self => {
          const currentTime = tl.time();
          let activeFeature = null;

          // Determine the active feature based on timeline time
          for (let j = 1; j <= texts.length; j++) {
            const start = tl.labels[`feature${j}_start`];
            const nextStart = j < texts.length ? tl.labels[`feature${j + 1}_start`] : tl.duration();
            if (currentTime >= start && currentTime < nextStart) {
              activeFeature = j;
              break;
            }
          }

          // Update dropdown if the active feature changes and dropdown exists
          if (activeFeature !== currentActiveFeature && dropdown) {
            dropdown.value = `section${activeFeature}`;
            currentActiveFeature = activeFeature;
          }
        },
      },
    });

    texts.forEach((txt, i) => {
      const animProps = {
        opacity: 1,
        duration: config.duration,
        ease: config.easeIn,
      };
      const exitProps = {
        opacity: 0,
        duration: config.duration,
        ease: config.easeOut,
      };

      const textAnim = { ...animProps, [config.feature.axis]: 0 };
      const screenAnim = { ...animProps, [config.screen.axis]: 0 };
      const textExit = {
        ...exitProps,
        [config.feature.axis]: -config.feature.distance,
      };
      const screenExit = {
        ...exitProps,
        [config.screen.axis]:
          config.screen.axis === "x"
            ? -config.screen.distance
            : config.screen.distance,
      };
      
      // Stagger animations for child elements
      const staggerAnimIn = {
        opacity: 1,
        [config.stagger.axis]: 0,
        duration: config.duration * 0.6,
        ease: config.easeIn,
        stagger: {
          amount: config.stagger.amount,
          from: config.stagger.from,
        }
      };
      
      const staggerAnimOut = {
        opacity: 0,
        [config.stagger.axis]: -config.stagger.distance,
        duration: config.duration * 0.6,
        ease: config.easeOut,
        stagger: {
          amount: config.stagger.amount,
          from: config.stagger.from,
        }
      };

      // Add label at the start of the feature's entrance animation
      tl.add(`feature${i + 1}_start`);

      if (i < texts.length - 1) {
        tl.to(txt, textAnim)
          .to(screens[i], screenAnim, "<");
          
        // Add stagger animation if elements exist and config is available
        if (staggerElements[i].length > 0 && config.stagger) {
          tl.to(staggerElements[i], staggerAnimIn, "<0.1");
        }
        
        tl.to({}, { duration: config.pause })
          .to(txt, textExit)
          .to(screens[i], screenExit, "<");
          
        // Add stagger exit animation
        if (staggerElements[i].length > 0 && config.stagger) {
          tl.to(staggerElements[i], staggerAnimOut, "<0.1");
        }
      } else {
        tl.to(txt, textAnim)
          .to(screens[i], screenAnim, "<");
          
        // Add stagger animation for last element
        if (staggerElements[i].length > 0 && config.stagger) {
          tl.to(staggerElements[i], staggerAnimIn, "<0.1");
        }
        
        tl.to({}, { duration: config.pause });
      }
    });
  });

  gsap.delayedCall(0.1, refreshScrollTrigger);

  window.addEventListener("resize", refreshScrollTrigger);
}



// stickyAnimation();
















function initSiteAnimations() {
  stickyScroll();
  initToggleMenu();
  dropDownMenu();
  stickyAnimation();
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
