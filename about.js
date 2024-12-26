document.addEventListener('DOMContentLoaded', () => {
    // Apply fade-in effect
    const aboutSection = document.querySelector('.about-section');
    const fansSection = document.querySelector('.fans-section');
  
    setTimeout(() => {
      aboutSection.style.opacity = 1;
    }, 100); // 0.1 seconds delay for a smoother effect
  
    setTimeout(() => {
      fansSection.style.opacity = 1;
    }, 500); // 0.5 seconds delay for fans section
  });
  