const bookingsForm = document.querySelector("#bookings-form");
const timeSlotSelected = document.getElementById("timeslot");
const noneSelected = document.getElementById("none");
const ticketCount = document.getElementById("ticket-count");

const bookingsContainer = document.querySelector("#bookings-container");
// const bookingsContainerStock = document.querySelector(
//   "#bookings-container-stock"
// );

bookingsForm.addEventListener("submit", (e) => {
  validateBookingInputs();

  if (isBookingFormValid() === true) {
    bookingsForm.submit();
  } else {
    e.preventDefault(); // prevent the form from submitting
  }
});

const setBookingError = (element, message) => {
  const formField = element.parentElement; // grabbing the parent div
  const errorDisplay = formField.querySelector(".forms__error");

  errorDisplay.innerText = message;
  formField.classList.add("error");
  formField.classList.remove("success");
};

const setBookingSuccess = (element) => {
  const formField = element.parentElement; // grabbing the parent div
  const errorDisplay = formField.querySelector(".forms__error");

  errorDisplay.innerText = "";
  formField.classList.add("success");
  formField.classList.remove("error");
};

const isBookingFormValid = () => {
  const formFieldContainers = bookingsForm.querySelectorAll(".forms__field");
  let result = true;

  formFieldContainers.forEach((container) => {
    if (container.classList.contains("error")) {
      result = false;
    }
  });

  return result;
};

const validateBookingInputs = () => {
  if (!timeSlotSelected.checked && !noneSelected.checked) {
    setBookingError(bookingsContainer, "Time slot is required");
  } else if (noneSelected.checked) {
    setBookingError(bookingsContainer, "Please select a valid time");
  } else if (timeSlotSelected.checked && !noneSelected.checked) {
    setBookingSuccess(bookingsContainer);
  }

  if (ticketCount.value < 1) {
    setBookingError(ticketCount, "Ticket is required");
  } else {
    setBookingSuccess(ticketCount);
  }
};
