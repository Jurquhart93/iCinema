const mediaScroller = document.querySelector(".media-scroller");

mediaScroller.onmousedown = (e) => {
  let isDragging = true;
  let startX = e.pageX - mediaScroller.offsetLeft;
  let scrollLeft = mediaScroller.scrollLeft;

  mediaScroller.onmousemove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - mediaScroller.offsetLeft;
    const dragDistance = x - startX;
    const containerWidth = mediaScroller.offsetWidth;
    const scrollThreshold = 0.5; // Adjust this value (0.3 means 30% of container width)

    if (Math.abs(dragDistance) >= containerWidth * scrollThreshold) {
      isDragging = false;

      // Determine the direction to snap
      const snapDirection = dragDistance > 0 ? 1 : -1;

      // Snap to the next or previous item
      const currentIndex = Math.floor(
        mediaScroller.scrollLeft / containerWidth
      );
      const targetIndex = currentIndex + snapDirection;
      const targetScrollLeft = targetIndex * containerWidth;

      mediaScroller.scrollLeft = targetScrollLeft;

      mediaScroller.onmousemove = null;
      mediaScroller.onmouseup = null;
    } else {
      mediaScroller.scrollLeft = scrollLeft - dragDistance;
    }
  };

  mediaScroller.onmouseup = () => {
    isDragging = false;
    mediaScroller.onmousemove = null;
    mediaScroller.onmouseup = null;
  };

  mediaScroller.onmouseleave = () => {
    isDragging = false;
    mediaScroller.onmousemove = null;
    mediaScroller.onmouseup = null;
  };
};
