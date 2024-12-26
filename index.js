document.addEventListener("DOMContentLoaded", () => {
    const slideElements = document.querySelectorAll(".slide-effect");
  
    const handleScroll = () => {
      slideElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
        }
      });
    };
  
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on page load to show elements in view
  });

  document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-effect");
  
    const handleFadeIn = () => {
      fadeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
        }
      });
    };
  
    window.addEventListener("scroll", handleFadeIn);
    handleFadeIn(); // Trigger on page load to show elements in view
  });
  
  