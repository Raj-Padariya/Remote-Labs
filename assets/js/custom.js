
document.addEventListener("DOMContentLoaded", function () {
  
  gsap.registerPlugin(SplitText, ScrollTrigger);

function textAnimation() {
  const SplittingTextConfig = {
    selector: "h1, h2, p",
    type: "lines", // 👈 only split into lines
    linesClass: "line",
    duration: 0.8,
    yPercent: 100,
    opacity: 0,
    stagger: 0.15,
    ease: "cubic-bezier(0.77, 0, 0.175, 1)",
    start: "top 95%",
  };

  // Hide all initially
  document.querySelectorAll(SplittingTextConfig.selector).forEach((el) => {
    el.style.visibility = "hidden";
  });

  document.fonts.ready.then(() => {
    if (!document.body.classList.contains("animation_init")) {
      console.log("Animation not initialized: missing .animation_init class");
      return;
    }

    const elements = document.querySelectorAll(SplittingTextConfig.selector);
    if (!elements.length) return;

    elements.forEach((element) => {
      element.style.visibility = "visible";

      // Split text into lines only
      const split = new SplitText(element, {
        type: SplittingTextConfig.type,
        linesClass: SplittingTextConfig.linesClass,
      });

      const animation = gsap.timeline({ paused: true });

      // Animate whole lines instead of words
      animation.from(
        split.lines,
        {
          duration: SplittingTextConfig.duration,
          yPercent: SplittingTextConfig.yPercent,
          opacity: SplittingTextConfig.opacity,
          ease: SplittingTextConfig.ease,
          stagger: SplittingTextConfig.stagger,
        }
      );

      // ScrollTrigger setup
      ScrollTrigger.create({
        trigger: element,
        start: SplittingTextConfig.start,
        animation: animation,
        toggleActions: "play none none reverse",
        // markers: true,
      });
    });
  });
}

// Init
document.body.classList.add("animation_init");
textAnimation();
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
