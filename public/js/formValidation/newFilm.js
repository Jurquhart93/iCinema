// forms
const newFilmForm = document.querySelector("#new-film-form");

// input data
const title = document.getElementById("title");
const rating = document.getElementById("rating");
const runtime = document.getElementById("runtime");
const releaseDate = document.getElementById("releasedate");
const description = document.getElementById("description");
const genre = document.getElementById("genre");
const image = document.getElementById("image");
const imageCurrent = document.getElementById("imageValue");
const stock = document.getElementById("stock");

newFilmForm.addEventListener("submit", (e) => {
  validateInputs();

  if (isFormValid() === true) {
    newFilmForm.submit();
  } else {
    e.preventDefault(); // prevent the form from submitting
  }
});

const setError = (element, message) => {
  const formField = element.parentElement; // grabbing the parent div
  const errorDisplay = formField.querySelector(".forms__error");

  errorDisplay.innerText = message;
  formField.classList.add("error");
  formField.classList.remove("success");
};

const setSuccess = (element) => {
  const formField = element.parentElement; // grabbing the parent div
  const errorDisplay = formField.querySelector(".forms__error");
  errorDisplay.innerText = "";
  formField.classList.add("success");
  formField.classList.remove("error");
};

const isFormValid = () => {
  const formFieldContainers = newFilmForm.querySelectorAll(".forms__field");
  let result = true;

  formFieldContainers.forEach((container) => {
    if (container.classList.contains("error")) {
      result = false;
    }
  });

  return result;
};

const validateInputs = () => {
  const titleValue = title.value.trim();
  const ratingValue = rating.value.trim();
  const runtimeValue = runtime.value.trim();
  const releaseDateValue = releaseDate.value.trim();
  const descriptionValue = description.value.trim();
  const genreValue = genre.value.trim();
  const stockValue = stock.value.trim();

  if (titleValue === "") {
    setError(title, "Title is required");
  } else {
    setSuccess(title);
  }

  if (ratingValue === "") {
    setError(rating, "Rating is required");
  } else {
    setSuccess(rating);
  }

  if (runtimeValue === "") {
    setError(runtime, "Release Date is required");
  } else if (runtimeValue > 500 || runtimeValue < 0) {
    setError(runtime, "Runtime value exceeds the limit");
  } else {
    setSuccess(runtime);
  }

  if (releaseDateValue === "") {
    setError(releaseDate, "Release Date is required");
  } else if (releaseDateValue < 2000) {
    setError(releaseDate, "Release date must be at least year 2000");
  } else {
    setSuccess(releaseDate);
  }

  if (descriptionValue === "") {
    setError(description, "Description is required");
  } else if (descriptionValue.length < 10 || descriptionValue.length > 500) {
    setError(
      description,
      "Description must be at lease 3 characters, and a max of 500"
    );
  } else {
    setSuccess(description);
  }

  if (genreValue === "") {
    setError(genre, "Genre is required");
  } else {
    setSuccess(genre);
  }

  if (stockValue === "") {
    setError(stock, "Stock is required");
  } else if (stockValue < 0 || stockValue > 100) {
    setError(stock, "Stock must be between 1 and 100");
  }
};
