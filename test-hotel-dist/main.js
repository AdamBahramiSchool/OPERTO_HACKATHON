// Test Hotel - Main JavaScript

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.querySelector('nav');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
    });
  }

  // Contact form submission handler
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var message = document.getElementById('message').value;

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Simulate form submission
      console.log('Form submitted:', { name: name, email: email, message: message });
      alert('Thank you, ' + name + '! We will get back to you at ' + email + ' within 24 hours.');
      contactForm.reset();
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Lazy load images
  var images = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    images.forEach(function (img) { observer.observe(img); });
  }
});

// Business info constants (used for structured data and analytics)
var HOTEL_INFO = {
  name: 'Test Hotel',
  address: '1234 Ocean Drive, Miami Beach, FL 33139',
  phone: '(305) 555-0199',
  email: 'info@testhotel.com',
  city: 'Miami Beach',
  state: 'FL',
  zip: '33139',
  country: 'US',
  latitude: 25.7814,
  longitude: -80.1300,
};

console.log('Test Hotel site loaded. Location:', HOTEL_INFO.address);
