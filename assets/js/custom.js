horizonSlider({
  ".my-custom-slider": {
    // Use the class name of your slider container
    loop: true,
    margin: 20,
    nav: false,
    showTracker: false,
    drag: true,

    responsive: {
      0: { items: 1 }, // 1 item on screens < 768px
      768: { items: 2 }, // 2 items on screens >= 768px
      1024: { items: 3 }, // 3 items on screens >= 1024px
    },
  },
});
