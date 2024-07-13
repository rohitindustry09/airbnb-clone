const inputField = document.getElementById('search-inp-nav');
    const submitButton = document.getElementById('search-btn-nav');

    // Function to toggle button state based on input field value
    function toggleButtonState() {
      if (inputField.value.trim() !== '') {
        submitButton.removeAttribute('disabled');
      } else {
        submitButton.setAttribute('disabled', true);
      }
    }
    inputField.addEventListener('input', toggleButtonState);
    toggleButtonState();
    
        function handleSubmit() {
            const value = document.getElementById('search-inp-nav').value;
            const form = document.getElementById('dynamicForm');
            form.action = `/listings/show/${value}`;
            form.method = 'get';
            return true; // Allow the form to submit
        }
        