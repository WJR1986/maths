function toggleNav() {
    const sideNav = document.getElementById("sideNav");
    if (sideNav.style.width === "250px") {
      sideNav.style.width = "0";
    } else {
      sideNav.style.width = "250px";
    }
  }
  
  function closeNav() {
    const sideNav = document.getElementById("sideNav");
    sideNav.style.width = "0";
  }
  
  function checkScrollbar() {
    const body = document.body;
    const collapsibles = document.querySelectorAll(".table-container");
    let anyOpen = false;
  
    collapsibles.forEach((collapsible) => {
      if (collapsible.dataset.state === "open") {
        anyOpen = true;
      }
    });
  
    if (anyOpen) {
      body.classList.add("no-scroll"); // Add the class to hide the scrollbar
    } else {
      body.classList.remove("no-scroll"); // Remove the class to show the scrollbar
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    checkScrollbar(); // Check scrollbar on page load
  
    function toggleSection(collapsible, toggleIcon, contents) {
      if (collapsible.dataset.state === "open") {
        collapsible.dataset.state = "closed";
        toggleIcon.classList.remove("fa-minus-circle");
        toggleIcon.classList.add("fa-plus-circle");
        contents.forEach((content) => {
          content.style.maxHeight = null;
        });
      } else {
        collapsible.dataset.state = "open";
        toggleIcon.classList.remove("fa-plus-circle");
        toggleIcon.classList.add("fa-minus-circle");
        contents.forEach((content) => {
          content.style.maxHeight = content.scrollHeight + "px";
        });
      }
      checkScrollbar(); // Check scrollbar after opening/closing a section
    }
  
    const collapsibles = document.querySelectorAll(".table-container");
  
    collapsibles.forEach((collapsible) => {
      const toggleIcon = collapsible.querySelector(".toggle-icon");
      const contents = collapsible.querySelectorAll(".collapsible-content");
  
      if (toggleIcon) {
        collapsible.dataset.state = "closed";
        toggleIcon.classList.remove("fa-minus-circle");
        toggleIcon.classList.add("fa-plus-circle");
  
        contents.forEach((content) => {
          content.style.maxHeight = "0";
        });
  
        toggleIcon.addEventListener("click", () => {
          toggleSection(collapsible, toggleIcon, contents);
        });
      }
    });
  
    // Add event listeners to close the navigation on link click
    const sideNavLinks = document.querySelectorAll(".side-navigation a");
    sideNavLinks.forEach((link) => {
      link.addEventListener("click", closeNav);
    });
  });
  
  // Add an event listener to check for the scrollbar on window resize
  window.addEventListener('resize', checkScrollbar);
  
  // Back to Top Button Functionality
  const backToTopButton = document.getElementById("backToTopButton");

  window.addEventListener("scroll", scrollFunction);
  
  function scrollFunction() {
    if (window.scrollY > 100) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  }
  
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
  });

  function navigateToMaths(subject) {
    window.location.href = `testPage.html?subject=${subject}`;
  }