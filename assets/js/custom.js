
document.addEventListener("DOMContentLoaded", function () {
  
    // Register plugins
    gsap.registerPlugin(SplitText, ScrollTrigger);

    (function () {
      const selector = "h1, h2, p";
      let splitInstances = [];
      let timelines = [];
      let triggers = [];

      // Remove any existing splits, timelines and triggers
      function clearAll() {
        triggers.forEach(t => t && t.kill());
        timelines.forEach(tl => tl && tl.kill());
        splitInstances.forEach(s => s && s.revert && s.revert());
        triggers = [];
        timelines = [];
        splitInstances = [];
        // also clear any custom references on elements
        document.querySelectorAll(selector).forEach(el => delete el._split);
      }

      // Create animations — called after layout is stable (fonts + load + refresh)
      function createAnimations() {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        elements.forEach(el => {
          // Ensure element is visible for layout measurement (do NOT use visibility:hidden)
          // We'll hide the split lines immediately after splitting with gsap.set to prevent flicker.
          el.style.opacity = '1';

          // If element had a previous split, revert it (safety)
          if (el._split) {
            el._split.revert();
            el._split = null;
          }

          // Split into lines only (we'll animate the whole line as a block)
          const split = new SplitText(el, { type: "lines", linesClass: "line" });
          el._split = split; // keep reference
          splitInstances.push(split);

          // Immediately set each line to starting state (hidden / shifted) — synchronous, avoids flicker
          gsap.set(split.lines, { yPercent: 100, opacity: 0 });

          // Timeline for the element
          const tl = gsap.timeline({ paused: true });
          tl.to(split.lines, {
            duration: 0.8,
            yPercent: 0,
            opacity: 1,
            ease: "cubic-bezier(0.77, 0, 0.175, 1)",
            stagger: 0.12
          });

          timelines.push(tl);

          // ScrollTrigger
          const trig = ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            animation: tl,
            toggleActions: "play none none reverse",
            //markers: true // uncomment for debugging
          });
          triggers.push(trig);
        });
      }

      // Wait for fonts + window load — Chrome needs both to measure layout reliably
      const whenReady = Promise.all([
        // document.fonts may not exist in older browsers; if not, resolve immediately
        (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve(),
        new Promise(resolve => {
          if (document.readyState === 'complete') resolve();
          else window.addEventListener('load', resolve, { once: true });
        })
      ]);

      // After fonts+load, trigger a ScrollTrigger.refresh which will run the refresh lifecycle
      whenReady.then(() => {
        // small delay helps Chrome finalize layout/subpixel calculations
        setTimeout(() => {
          // Call refresh so our refreshInit / refresh handlers run and create animations
          ScrollTrigger.refresh();
        }, 80);
      });

      // On refreshInit: revert and kill everything BEFORE ScrollTrigger recalculates sizes
      ScrollTrigger.addEventListener('refreshInit', () => {
        // revert split markup and kill timelines/triggers so layout calc is correct
        splitInstances.forEach(s => s && s.revert && s.revert());
        timelines.forEach(tl => tl && tl.kill());
        triggers.forEach(t => t && t.kill());
        splitInstances = [];
        timelines = [];
        triggers = [];
      });

      // On refresh (after layout calc), recreate splits & triggers
      ScrollTrigger.addEventListener('refresh', () => {
        // small timeout to let browser finish layout paint on some Chrome builds
        setTimeout(() => {
          createAnimations();
        }, 20);
      });

      // Debounced resize: ask ScrollTrigger to refresh (which triggers the revert/create cycle above)
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      });

      // Optional: a manual API to force a full rebuild if you dynamically change text
      window.rebuildSplitTextAnimations = function () {
        ScrollTrigger.refresh();
      };

    })();
});

// 
$('.Testimonial-Slider').owlCarousel({

  loop:true,

  center:true,

  margin:30,

  nav:false,

  dots:true,

  animateOut: 'fadeOut',

  responsive:{

      0:{

          items:1

      },

      600:{

          items:1.5,

      },

      1000:{

          items:2.1

      }

  }

});



// Open and close modals
$(document).ready(function () {
  $(document).on('click', '.poptrigger', function () {
    const modalId = $(this).data('modal');
    $(`#${modalId}`).fadeIn();
    $('body').addClass('modal-open');
  });

  $(document).on('click', '.closePop', function () {
    $(this).closest('.pop-upbox').fadeOut();
    $('body').removeClass('modal-open');
  });
});


// Popup open and close for video handling
$(document).ready(function () {
  
  $(document).on('click', '.poptrigger', function () {
    const targetPopupId = $(this).data('modal');
    const targetPopup = $(`#${targetPopupId}`);
    if (window.location.pathname !== 'https://theme.remotecleanacademy.com/build-remote/') {

      if (targetPopup.length) {
        $('video').not(targetPopup.find('video')).not('.donotstopvideo').each(function () {
          this.pause();
        });
        $('iframe').not(targetPopup.find('iframe')).each(function () {
          const src = $(this).attr('src');
          if (src) $(this).attr('src', src.replace(/[?&]autoplay=1/, ''));
        });

        targetPopup.fadeIn();

        targetPopup.find('video').each(function () {
          this.play().catch(err => console.warn('Error playing video:', err));
        });

        targetPopup.find('iframe').each(function () {
          const src = $(this).attr('src');
          if (src && !src.includes('autoplay=1')) {
            $(this).attr('src', `${src}${src.includes('?') ? '&' : '?'}autoplay=1`);
          }
        });
      }
    }
  });

  $(document).on('click', '.closePop', function () {
    const popupBox = $(this).closest('.pop-upbox');
    
      popupBox.hide();
      popupBox.find('video').not('.donotstopvideo').each(function () {
        this.pause();
      });
      popupBox.find('iframe').each(function () {
        const src = $(this).attr('src');
        if (src) $(this).attr('src', src.replace(/[?&]autoplay=1/, ''));
      });
   
  });
  
 
});
