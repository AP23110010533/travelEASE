document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('package-form');
    const getStartedBtn = document.getElementById('get-started-btn');
    const plannerForm = document.getElementById('planner-form');
    const advancedOptionsBtn = document.getElementById('advanced-options-btn');
    const advancedOptions = document.getElementById('advanced-options');
    const hamburgerMenu = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const destinationInput = document.getElementById('destination');
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const testimonialControls = document.querySelectorAll('.testimonial-control');
  
    // Hamburger menu
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
      });
    }
  
    // Scroll to form
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        plannerForm.scrollIntoView({ behavior: 'smooth' });
      });
    }
  
    // Toggle advanced options
    if (advancedOptionsBtn && advancedOptions) {
      advancedOptionsBtn.addEventListener('click', function () {
        advancedOptions.classList.toggle('hidden');
        advancedOptionsBtn.innerHTML = advancedOptions.classList.contains('hidden')
          ? '<i class="fas fa-cog"></i> Advanced Options'
          : '<i class="fas fa-times"></i> Hide Advanced Options';
      });
    }
  
    // Destination autocomplete
    if (destinationInput) {
      const popularDestinations = [
        'Paris, France', 'Tokyo, Japan', 'New York City, USA',
        'Rome, Italy', 'London, UK', 'Barcelona, Spain',
        'Sydney, Australia', 'Bangkok, Thailand', 'Dubai, UAE', 'Singapore'
      ];
  
      destinationInput.addEventListener('input', function () {
        const value = this.value.toLowerCase();
        document.querySelector('.autocomplete-list')?.remove();
        if (!value) return;
  
        const matches = popularDestinations.filter((d) => d.toLowerCase().includes(value));
        if (matches.length > 0) {
          const list = document.createElement('ul');
          list.className = 'autocomplete-list';
          matches.forEach((match) => {
            const li = document.createElement('li');
            li.textContent = match;
            li.addEventListener('click', () => {
              destinationInput.value = match;
              list.remove();
            });
            list.appendChild(li);
          });
  
          const rect = destinationInput.getBoundingClientRect();
          Object.assign(list.style, {
            position: 'absolute',
            top: `${rect.bottom + window.scrollY}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            zIndex: 100,
          });
  
          document.body.appendChild(list);
          document.addEventListener('click', function closeList(e) {
            if (!list.contains(e.target) && e.target !== destinationInput) {
              list.remove();
              document.removeEventListener('click', closeList);
            }
          }, { once: true });
        }
      });
    }
  
    // Date input
    if (dateInputs.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      dateInputs.forEach((input) => input.setAttribute('min', today));
  
      const startDate = document.getElementById('start-date');
      const endDate = document.getElementById('end-date');
  
      if (startDate && endDate) {
        startDate.addEventListener('change', function () {
          endDate.setAttribute('min', this.value);
          if (endDate.value < this.value) {
            endDate.value = this.value;
          }
        });
      }
    }
  
    // Form validation
    function validateForm() {
      const destination = document.getElementById('destination');
      const startDate = document.getElementById('start-date');
      const endDate = document.getElementById('end-date');
      let isValid = true;
      document.querySelectorAll('.error-message')?.forEach(el => el.remove());
  
      if (!destination.value.trim()) {
        showError(destination, 'Please enter a destination');
        isValid = false;
      }
      if (!startDate.value) {
        showError(startDate, 'Please select a start date');
        isValid = false;
      }
      if (!endDate.value) {
        showError(endDate, 'Please select an end date');
        isValid = false;
      }
      if (startDate.value > endDate.value) {
        showError(endDate, 'End date must be after start date');
        isValid = false;
      }
      return isValid;
    }
  
    function showError(input, message) {
      const error = document.createElement('div');
      error.className = 'error-message';
      error.textContent = message;
      error.style.color = 'red';
      input.parentNode.appendChild(error);
    }
  
    // Submit form
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateForm()) return;
  
      const data = {
        destination: document.getElementById('destination').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        travelers: document.getElementById('travelers').value,
        tripType: document.getElementById('trip-type').value,
        budget: document.getElementById('budget')?.value || '',
        interests: Array.from(document.querySelectorAll('input[name="interests[]"]:checked')).map(i => i.value),
        pace: document.getElementById('pace')?.value || '',
        specialRequests: document.getElementById('special-requests')?.value || '',
      };
  
      try {
        const response = await fetch('process.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
        if (result.success) {
          localStorage.setItem("tripPlan", result.plan);
          localStorage.setItem("tripData", JSON.stringify(data));
          window.location.href = "plan.html";
        } else {
          alert("Error: " + result.error);
        }
      } catch (error) {
        alert("Unexpected error occurred. Try again.");
        console.error("Fetch error:", error);
      }
    });
  
    // Testimonial button logic
    if (testimonialControls.length > 0) {
      testimonialControls.forEach((btn) => {
        btn.addEventListener('click', () => {
          const quote = document.querySelector('.testimonial-content p');
          const name = document.querySelector('.author-info h4');
          const trip = document.querySelector('.author-info p');
  
          quote.style.opacity = name.style.opacity = trip.style.opacity = '0.5';
  
          setTimeout(() => {
            if (quote.textContent.includes('Barcelona')) {
              quote.textContent = '"TravelEASE made planning our Tokyo vacation incredibly easy."';
              name.textContent = 'Michael Chen';
              trip.textContent = 'Couple trip to Tokyo';
            } else {
              quote.textContent = '"TravelEASE saved me hours of planning for my trip to Barcelona."';
              name.textContent = 'Sarah Johnson';
              trip.textContent = 'Family trip to Barcelona';
            }
  
            quote.style.opacity = name.style.opacity = trip.style.opacity = '1';
          }, 500);
        });
      });
    }
  });
  