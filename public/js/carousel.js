const carouselContainers = document.querySelectorAll(".carousel-container");
const carouselNextBtn = document.querySelector(".carousel-btns-nextBtn");
const carouselPrevBtn = document.querySelector(".carousel-btns-prevBtn");

let carouselIndex = 0;

function showImage(index) {
  carouselContainers.forEach((container, i) => {
    if (i === index) {
      container.style.display = "flex";
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

carouselNextBtn.addEventListener("click", nextImage);
carouselPrevBtn.addEventListener("click", prevImage);

// Trigger initial slide display
showImage(carouselIndex);
