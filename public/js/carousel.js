const carouselContainers = document.querySelectorAll(".carousel-container"); // Use the class selector
const carouselNextBtn = document.querySelectorAll(".carousel__button--next");
const carouselPrevBtn = document.querySelectorAll(".carousel__button--prev");

carouselNextBtn.forEach((btn) => {
  btn.addEventListener("click", nextImage);
});

carouselPrevBtn.forEach((btn) => {
  btn.addEventListener("click", prevImage);
});

let carouselIndex = 0;

function showImage(index) {
  carouselContainers.forEach((container, i) => {
    if (i === index) {
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }
  });
}

function nextImage() {
  carouselIndex = (carouselIndex + 1) % carouselContainers.length;
  console.log(carouselIndex);
  showImage(carouselIndex);
}

function prevImage() {
  carouselIndex =
    (carouselIndex - 1 + carouselContainers.length) % carouselContainers.length;
  console.log(carouselIndex);
  showImage(carouselIndex);
}

// Trigger initial slide display
showImage(carouselIndex);
