// forms
const loginForm = document.querySelector("#login-form");

// input data
const userName = document.getElementById("username");
const password = document.getElementById("password");

loginForm.addEventListener("submit", (e) => {
  validateInputs();

  if (isFormValid() === true) {
    loginForm.submit();
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
  const formFieldContainers = loginForm.querySelectorAll(".forms__field");
  let result = true;

  formFieldContainers.forEach((container) => {
    if (container.classList.contains("error")) {
      result = false;
    }
  });

  return result;
};

const validateInputs = () => {
  const userNameValue = userName.value.trim();
  const passwordValue = password.value;

  if (userNameValue === "") {
    setError(username, "Username is required");
  } else if (userNameValue.length < 4) {
    setError(userName, "Username must be more than 3 characters");
  } else if (userNameValue.length > 15) {
    setError(userName, "Username must not exceed 15 characters");
  } else {
    setSuccess(userName);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be more than 8 characters");
  } else if (passwordValue.length > 20) {
    setError(password, "Password must not exceed 20 characters");
  } else {
    setSuccess(password);
  }
};
