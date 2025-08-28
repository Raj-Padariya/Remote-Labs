horizonSlider({
  ".my-custom-slider": {
    // Use the class name of your slider container
    loop: true,
    margin: 20,
    nav: false,
    showTracker: false,
    drag: true,
    autoplay: false,

    responsive: {
      0: { items: 1 }, // 1 item on screens < 768px
      768: { items: 1.2 }, // 2 items on screens >= 768px
      1024: { items: 1.5 }, // 3 items on screens >= 1024px
    },
  },
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
