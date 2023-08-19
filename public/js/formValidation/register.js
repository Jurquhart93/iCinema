// forms
const registerForm = document.querySelector("#register-form");

// input data
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const userName = document.getElementById("username");
const email = document.getElementById("email");
const age = document.getElementById("age");
const password = document.getElementById("password");
const repeatPassword = document.getElementById("repeatpassword");

registerForm.addEventListener("submit", (e) => {
  validateInputs();

  if (isFormValid() === true) {
    registerForm.submit();
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

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isFormValid = () => {
  const formFieldContainers = registerForm.querySelectorAll(".forms__field"); // change for new forms
  let result = true;

  formFieldContainers.forEach((container) => {
    if (container.classList.contains("error")) {
      result = false;
    }
  });

  return result;
};

const validateInputs = () => {
  const firstNameValue = firstName.value.trim();
  const lastNameValue = lastName.value.trim();
  const userNameValue = userName.value.trim();
  const emailValue = email.value.trim();
  const ageValue = age.value;
  const passwordValue = password.value;
  const repeatPasswordValue = repeatPassword.value;

  if (firstNameValue === "") {
    setError(firstName, "First name is required");
  } else if (firstNameValue.length < 3) {
    setError(firstName, "First name must be more than 3 characters");
  } else if (firstNameValue.length > 50) {
    setError(firstName, "First name must not exceed 50 characters");
  } else {
    setSuccess(firstName);
  }

  if (lastNameValue === "") {
    setError(lastName, "Title is required");
  } else if (lastNameValue.length < 3) {
    setError(lastName, "Last name must be more than 3 characters");
  } else if (lastNameValue.length > 50) {
    setError(lastName, "Last name must not exceed 50 characters");
  } else {
    setSuccess(lastName);
  }

  if (userNameValue === "") {
    setError(username, "Username is required");
  } else if (userNameValue.length < 4) {
    setError(userName, "Username must be more than 3 characters");
  } else if (userNameValue.length > 15) {
    setError(userName, "Username must not exceed 15 characters");
  } else {
    setSuccess(userName);
  }

  if (emailValue === "") {
    setError(email, "Email is required");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else {
    setSuccess(email);
  }

  if (ageValue === "") {
    setError(age, "Age is required");
  } else {
    const today = new Date();
    const selectedDate = new Date(ageValue);

    const yearsDiff = today.getFullYear() - selectedDate.getFullYear();
    const monthsDiff = today.getMonth() - selectedDate.getMonth();
    const daysDiff = today.getDate() - selectedDate.getDate();

    if (
      yearsDiff < 12 ||
      (yearsDiff === 12 && monthsDiff < 0) ||
      (yearsDiff === 12 && monthsDiff === 0 && daysDiff < 0)
    ) {
      setError(age, "You must be at least 12 years of age");
    } else {
      setSuccess(age);
    }
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

  if (repeatPasswordValue === "") {
    setError(repeatPassword, "Password is required");
  } else if (repeatPasswordValue !== passwordValue) {
    setError(repeatPassword, "Passwords do not match");
  } else {
    setSuccess(repeatPassword);
  }
};
