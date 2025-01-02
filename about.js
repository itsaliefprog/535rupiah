document.addEventListener('DOMContentLoaded', () => {
    // Apply fade-in effect
    const aboutSection = document.querySelector('.about-section');
    const fansSection = document.querySelector('.fans-section');
  
    setTimeout(() => {
      aboutSection.style.opacity = 1;
    }, 100); 
    setTimeout(() => {
      fansSection.style.opacity = 1;
    }, 500); 
  });
  
