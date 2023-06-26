document.addEventListener("DOMContentLoaded", function () {
  const textboxGroup = document.querySelector(".textbox-group");
  const textboxContainers = Array.from(
    textboxGroup.querySelectorAll(".textbox-container")
  );
  const buttonGroup = textboxGroup.querySelector(".button-group");
  const backBtn = buttonGroup.querySelector("#back-btn");
  const nextBtn = buttonGroup.querySelector("#next-btn");
  let currentContainerIndex = 0;

  function showNextContainer() {
    const currentContainer = textboxContainers[currentContainerIndex];
    const nextContainerIndex =
      (currentContainerIndex + 1) % textboxContainers.length;
    const nextContainer = textboxContainers[nextContainerIndex];

    // Hide the current container and show the next container
    currentContainer.classList.remove("visible");
    nextContainer.classList.add("visible");

    currentContainerIndex = nextContainerIndex;

    // Enable the "Back" button if we're not on the first container
    if (currentContainerIndex > 0) {
      backBtn.disabled = false;
    }
  }

  function showPreviousContainer() {
    const currentContainer = textboxContainers[currentContainerIndex];
    const previousContainerIndex =
      (currentContainerIndex - 1 + textboxContainers.length) %
      textboxContainers.length;
    const previousContainer = textboxContainers[previousContainerIndex];

    // Hide the current container and show the previous container
    currentContainer.classList.remove("visible");
    previousContainer.classList.add("visible");

    currentContainerIndex = previousContainerIndex;

    // Disable the "Back" button if we're on the first container
    if (currentContainerIndex === 0) {
      backBtn.disabled = true;
    }
  }

  // Show the first container initially
  textboxContainers[0].classList.add("visible");

  // Disable the "Back" button initially
  backBtn.disabled = true;

  nextBtn.addEventListener("click", showNextContainer);
  backBtn.addEventListener("click", showPreviousContainer);
});
