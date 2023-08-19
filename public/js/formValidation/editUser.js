// forms
const editUserForm = document.querySelector("#edit-user-form");

// input data
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const userName = document.getElementById("username");
const email = document.getElementById("email");

editUserForm.addEventListener("submit", (e) => {
  validateInputs();

  if (isFormValid() === true) {
    editUserForm.submit();
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
  const formFieldContainers = editUserForm.querySelectorAll(".forms__field"); // change for new forms
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
};
