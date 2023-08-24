const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);

    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

// COMING IN FROM THE LEFT
const hiddenElementsLeft = document.querySelectorAll(".hidden-left");
hiddenElementsLeft.forEach((el) => observer.observe(el));

// COMING IN FROM THE RIGHT
const hiddenElementsRight = document.querySelectorAll(".hidden-right");
hiddenElementsRight.forEach((el) => observer.observe(el));

// COMING IN FROM THE BOTTOM
const hiddenElementsBottom = document.querySelectorAll(".hidden-bottom");
hiddenElementsBottom.forEach((el) => observer.observe(el));

// COMING IN FROM THE TOP
const hiddenElementsTop = document.querySelectorAll(".hidden-top");
hiddenElementsTop.forEach((el) => observer.observe(el));
