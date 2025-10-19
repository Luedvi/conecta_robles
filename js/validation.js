document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDisplay = document.getElementById('errorMsg');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        errorDisplay.textContent = '';
        let isValid = true;
        let errorMessage = '';
        if (fullNameInput.value.trim() === '') {
            errorMessage = 'El nombre completo es obligatorio.';
            isValid = false;}

        if (isValid && !emailRegex.test(emailInput.value)) {
            errorMessage = 'Por favor, introduce un correo electrónico válido.';
            isValid = false;}
      
        if (isValid && !passwordRegex.test(passwordInput.value)) {
            errorMessage = 'La contraseña debe tener al menos 8 caracteres, incluyendo un número y una letra.';
            isValid = false;}
      
        if (isValid) {
            alert('¡Registro exitoso! Redireccionando a la página de chat...');
            window.location.href = 'chat.html';}
        else {
            errorDisplay.textContent = 'Error: ' + errorMessage;}});});
