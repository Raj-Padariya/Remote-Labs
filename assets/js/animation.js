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
      feature: { axis: "y", distance: 75 },
      stagger: {
        amount: 0.4, // Total stagger time
        from: "start", // Direction: "start", "center", "end", "edges"
        axis: "y",
        distance: 40,
      },
      duration: 2.5,
      pause: 0.5,
      easeIn: "power2.out",
      easeOut: "power2.in",
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
    const screens = gsap.utils.toArray(".feature-bg", container);
    
    // Get categories-row__left elements for stagger animations
    const staggerElements = texts.map(feature => {
      const categoryRow = feature.querySelector('.categories-row__left');
      if (categoryRow) {
        return {
          parent: categoryRow,
          children: gsap.utils.toArray(categoryRow.children)
        };
      }
      return { parent: null, children: [] };
    });

    // Check for matching counts
    if (texts.length !== screens.length) {
      console.error(`Mismatch in element counts for container ${index + 1}`);
      console.log(`Found ${texts.length} .feature elements and ${screens.length} .feature-bg elements`);
      return;
    }

    // Set initial states for .feature elements
    gsap.set([texts[0]], { opacity: 1, x: 0, y: 0, className: 'feature active' });
    gsap.set([screens[0]], { opacity: 1, x: 0, y: 0 });
    
    // Set initial state for first categories-row__left children
    if (staggerElements[0].parent) {
      gsap.set(staggerElements[0].children, { opacity: 1, x: 0, y: 0 });
    }
    
    gsap.set([...texts.slice(1)], {
      opacity: 0,
      [config.feature.axis]: config.feature.distance,
      className: 'feature non-active'
    });
    gsap.set([...screens.slice(1)], {
      opacity: 0,
      [config.screen.axis]:
        config.screen.axis === "x"
          ? config.screen.distance
          : -config.screen.distance,
    });
    
    // Set initial states for remaining categories-row__left children
    staggerElements.slice(1).forEach(({ parent, children }) => {
      if (parent && children.length > 0) {
        gsap.set(children, {
          opacity: 0,
          [config.stagger.axis]: config.stagger.distance,
        });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "+=" + window.innerHeight * texts.length,
        scrub: 1,
        pin: wrapper,
        snap: {
          snapTo: 1 / (texts.length - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1,
          ease: "power2.inOut"
        },
        markers: false,
        onUpdate: self => {
          const progress = self.progress;
          let activeFeature = Math.round(progress * (texts.length - 1)) + 1;
          activeFeature = Math.max(1, Math.min(texts.length, activeFeature));
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

      const textAnim = { ...animProps, [config.feature.axis]: 0, className: 'feature active' };
      const screenAnim = { ...animProps, [config.screen.axis]: 0 };
      const textExit = {
        ...exitProps,
        [config.feature.axis]: -config.feature.distance,
        className: 'feature non-active'
      };
      const screenExit = {
        ...exitProps,
        [config.screen.axis]:
          config.screen.axis === "x"
            ? -config.screen.distance
            : config.screen.distance,
      };
      
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

      tl.add(`feature${i + 1}_start`);

      if (i < texts.length - 1) {
        tl.to(txt, textAnim)
          .to(screens[i], screenAnim, "<");
          
        // Add stagger animation for categories-row__left children
        if (staggerElements[i].parent && staggerElements[i].children.length > 0) {
          tl.to(staggerElements[i].children, staggerAnimIn, "<0.1");
        }
        
        tl.to({}, { duration: config.pause })
          .to(txt, textExit)
          .to(screens[i], screenExit, "<");
          
        // Add stagger exit animation
        if (staggerElements[i].parent && staggerElements[i].children.length > 0) {
          tl.to(staggerElements[i].children, staggerAnimOut, "<0.1");
        }
      } else {
        tl.to(txt, textAnim)
          .to(screens[i], screenAnim, "<");
          
        // Add stagger animation for last element
        if (staggerElements[i].parent && staggerElements[i].children.length > 0) {
          tl.to(staggerElements[i].children, staggerAnimIn, "<0.1");
        }
        
        tl.to({}, { duration: config.pause });
      }
    });
  });

  gsap.delayedCall(0.1, refreshScrollTrigger);

  window.addEventListener("resize", refreshScrollTrigger);
}


// function stickyAnimation() {
//   const animationConfigs = {
//     BG_right: {
//       screen: { axis: "y", distance: "-75" },
//       feature: { axis: "y", distance: 75 },
//       stagger: {
//         amount: 0.4, // Total stagger time
//         from: "start", // Direction: "start", "center", "end", "edges"
//         axis: "y",
//         distance: 40,
//       },
//       duration: 2.5,
//       pause: 0.5,
//       easeIn: "power2.out",
//       easeOut: "power2.in",
//     },
//   };

//   const containers = document.querySelectorAll(".stacking_section-container");

//   const setupAnimations = () => {
//     // Check if screen width is greater than 768px
//     const isDesktop = window.matchMedia("(min-width: 991px)").matches;

//     containers.forEach((container, index) => {
//       // Reset styles for all screens to avoid lingering GSAP effects
//       const texts = gsap.utils.toArray(".feature", container);
//       const screens = gsap.utils.toArray(".feature-bg", container);
//       const staggerElements = texts.map(feature => {
//         const categoryRow = feature.querySelector('.categories-row__left');
//         if (categoryRow) {
//           return {
//             parent: categoryRow,
//             children: gsap.utils.toArray(categoryRow.children)
//           };
//         }
//         return { parent: null, children: [] };
//       });

//       if (!isDesktop) {
//         // Reset styles for mobile (≤768px)
//         gsap.set(texts, { opacity: 1, x: 0, y: 0, clearProps: "all" });
//         gsap.set(screens, { opacity: 1, x: 0, y: 0, clearProps: "all" });
//         staggerElements.forEach(({ parent, children }) => {
//           if (parent && children.length > 0) {
//             gsap.set(children, { opacity: 1, x: 0, y: 0, clearProps: "all" });
//           }
//         });
//         // Remove any existing pin wrappers to prevent layout issues
//         const wrapper = container.parentNode;
//         if (wrapper.classList.contains("pin-wrapper")) {
//           wrapper.parentNode.insertBefore(container, wrapper);
//           wrapper.remove();
//         }
//         return; // Skip animation setup for mobile
//       }

//       // Animation setup for desktop (>768px)
//       const wrapper = document.createElement("div");
//       wrapper.classList.add("pin-wrapper");
//       container.parentNode.insertBefore(wrapper, container);
//       wrapper.appendChild(container);

//       let configKey = "default";
//       if (container.classList.contains("UI_right")) {
//         configKey = "UI_right";
//       } else if (container.classList.contains("BG_right")) {
//         configKey = "BG_right";
//       }

//       const config = animationConfigs[configKey] || animationConfigs.default;

//       // Check for matching counts
//       if (texts.length !== screens.length) {
//         console.error(`Mismatch in element counts for container ${index + 1}`);
//         console.log(`Found ${texts.length} .feature elements and ${screens.length} .feature-bg elements`);
//         return;
//       }

//       // Set initial states for .feature elements
//       gsap.set([texts[0]], { opacity: 1, x: 0, y: 0, className: 'feature active' });
//       gsap.set([screens[0]], { opacity: 1, x: 0, y: 0 });
      
//       // Set initial state for first categories-row__left children
//       if (staggerElements[0].parent) {
//         gsap.set(staggerElements[0].children, { opacity: 1, x: 0, y: 0 });
//       }
      
//       gsap.set([...texts.slice(1)], {
//         opacity: 0,
//         [config.feature.axis]: config.feature.distance,
//         className: 'feature non-active'
//       });
//       gsap.set([...screens.slice(1)], {
//         opacity: 0,
//         [config.screen.axis]:
//           config.screen.axis === "x"
//             ? config.screen.distance
//             : -config.screen.distance,
//       });
      
//       // Set initial states for remaining categories-row__left children
//       staggerElements.slice(1).forEach(({ parent, children }) => {
//         if (parent && children.length > 0) {
//           gsap.set(children, {
//             opacity: 0,
//             [config.stagger.axis]: config.stagger.distance,
//           });
//         }
//       });

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: wrapper,
//           start: "top top",
//           end: "+=" + window.innerHeight * texts.length,
//           scrub: 1,
//           pin: wrapper,
//           snap: {
//             snapTo: 1 / (texts.length - 1),
//             duration: { min: 0.2, max: 0.6 },
//             delay: 0.1,
//             ease: "power2.inOut"
//           },
//           markers: false,
//           onUpdate: self => {
//             const progress = self.progress;
//             let activeFeature = Math.round(progress * (texts.length - 1)) + 1;
//             activeFeature = Math.max(1, Math.min(texts.length, activeFeature));
//           },
//         },
//       });

//       texts.forEach((txt, i) => {
//         const animProps = {
//           opacity: 1,
//           duration: config.duration,
//           ease: config.easeIn,
//         };
//         const exitProps = {
//           opacity: 0,
//           duration: config.duration,
//           ease: config.easeOut,
//         };

//         const textAnim = { ...animProps, [config.feature.axis]: 0, className: 'feature active' };
//         const screenAnim = { ...animProps, [config.screen.axis]: 0 };
//         const textExit = {
//           ...exitProps,
//           [config.feature.axis]: -config.feature.distance,
//           className: 'feature non-active'
//         };
//         const screenExit = {
//           ...exitProps,
//           [config.screen.axis]:
//             config.screen.axis === "x"
//               ? -config.screen.distance
//               : config.screen.distance,
//         };
        
//         const staggerAnimIn = {
//           opacity: 1,
//           [config.stagger.axis]: 0,
//           duration: config.duration * 0.6,
//           ease: config.easeIn,
//           stagger: {
//             amount: config.stagger.amount,
//             from: config.stagger.from,
//           }
//         };
        
//         const staggerAnimOut = {
//           opacity: 0,
//           [config.stagger.axis]: -config.stagger.distance,
//           duration: config.duration * 0.6,
//           ease: config.easeOut,
//           stagger: {
//             amount: config.stagger.amount,
//             from: config.stagger.from,
//           }
//         };

//         tl.add(`feature${i + 1}_start`);

//         if (i < texts.length - 1) {
//           tl.to(txt, textAnim)
//             .to(screens[i], screenAnim, "<");
            
//           // Add stagger animation for categories-row__left children
//           if (staggerElements[i].parent && staggerElements[i].children.length > 0) {
//             tl.to(staggerElements[i].children, staggerAnimIn, "<0.1");
//           }
          
//           tl.to({}, { duration: config.pause })
//             .to(txt, textExit)
//             .to(screens[i], screenExit, "<");
            
//           // Add stagger exit animation
//           if (staggerElements[i].parent && staggerElements[i].children.length > 0) {
//             tl.to(staggerElements[i].children, staggerAnimOut, "<0.1");
//           }
//         } else {
//           tl.to(txt, textAnim)
//             .to(screens[i], screenAnim, "<");
            
//           // Add stagger animation for last element
//           if (staggerElements[i].parent && staggerElements[i].children.length > 0) {
//             tl.to(staggerElements[i].children, staggerAnimIn, "<0.1");
//           }
          
//           tl.to({}, { duration: config.pause });
//         }
//       });
//     });
//   };

//   // Initial setup
//   setupAnimations();

//   // Refresh ScrollTrigger and re-run setup on resize
//   const refreshScrollTrigger = () => {
//     ScrollTrigger.refresh();
//     setupAnimations();
//   };

//   gsap.delayedCall(0.1, refreshScrollTrigger);
//   window.addEventListener("resize", refreshScrollTrigger);
// }











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
