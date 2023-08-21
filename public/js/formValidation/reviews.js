const reviewsForm = document.querySelector("#reviews-form");

const reviewBody = document.getElementById("reviewBody");

reviewsForm.addEventListener("submit", (e) => {
  validateInputs();

  if (isFormValid() === true) {
    reviewsForm.submit();
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
  const formFieldContainers = reviewsForm.querySelectorAll(".forms__field");
  let result = true;

  formFieldContainers.forEach((container) => {
    if (container.classList.contains("error")) {
      result = false;
    }
  });

  return result;
};

const validateInputs = () => {
  const reviewBodyValue = reviewBody.value.trim();

  if (reviewBodyValue === "") {
    setError(reviewBody, "Review text is required");
  } else {
    setSuccess(reviewBody);
  }
};
