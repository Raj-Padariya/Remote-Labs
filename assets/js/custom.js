
document.addEventListener("DOMContentLoaded", function () {



gsap.registerPlugin(SplitText, ScrollTrigger);
//  Splitting text animation
  function textAnimation() {
    const SplittingTextConfig = {
      selector: "h1, h2, p",
      type: "words,lines",
      linesClass: "line",
      duration: 0.5,
      yPercent: 100,
      opacity: 0,
      stagger: 0.1,
      ease: "cubic-bezier(0.77, 0, 0.175, 1)",
      start: "top 95%",
    };
 
    // Set initial visibility to hidden for all targeted elements
    document
      .querySelectorAll(SplittingTextConfig.selector)
      .forEach((element) => {
        element.style.visibility = "hidden";
      });
 
    document.fonts.ready.then(() => {
      if (document.body.classList.contains("animation_init")) {
        const elements = document.querySelectorAll(
          SplittingTextConfig.selector
        );
 
        if (elements.length === 0) {
          console.warn("No elements found for SplitText animation");
          return;
        }
 
        elements.forEach((element) => {
          element.style.visibility = "visible";
          element.style.opacity = "1";
 
          const split = new SplitText(element, {
            type: SplittingTextConfig.type,
            linesClass: SplittingTextConfig.linesClass,
          });
 
          const animation = gsap.timeline({ paused: true });
          split.lines.forEach((line, index) => {
            const wordsInLine = line.querySelectorAll("div");
            animation.from(
              wordsInLine,
              {
                duration: SplittingTextConfig.duration,
                yPercent: SplittingTextConfig.yPercent,
                opacity: SplittingTextConfig.opacity,
                ease: SplittingTextConfig.ease,
              },
              index * SplittingTextConfig.stagger
            );
          });
 
          ScrollTrigger.create({
            trigger: element,
            scroller: document.body,
            start: SplittingTextConfig.start,
            animation: animation,
            toggleActions: "play none none reverse",
            // markers: true,
          });
        });
      } else {
        console.log(
          'Animation not initialized: body does not have "animation_init" class'
        );
      }
    });
  }
 
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
