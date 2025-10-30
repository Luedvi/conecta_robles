document.addEventListener('DOMContentLoaded', function() {
    const creditCardMethod = document.getElementById('creditCardMethod');
    const bankTransferMethod = document.getElementById('bankTransferMethod');
    const paymentForm = document.getElementById('paymentForm');
    const bankTransferInfo = document.getElementById('bankTransferInfo');
    const payButton = document.getElementById('payButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const successMessage = document.getElementById('successMessage');
    const paymentStatus = document.getElementById('paymentStatus');
    
    const cardNumberInput = document.getElementById('card-number');
    const cardHolderInput = document.getElementById('card-holder');
    const expiryDateInput = document.getElementById('fecha-expiracion');
    const cvvInput = document.getElementById('cvv');
    
    const cardNumberError = document.getElementById('cardNumberError');
    const cardHolderError = document.getElementById('cardHolderError');
    const expiryDateError = document.getElementById('expiryDateError');
    const cvvError = document.getElementById('cvvError');
    
    creditCardMethod.addEventListener('click', function() {
        selectPaymentMethod('credit-card');
    });
    
    bankTransferMethod.addEventListener('click', function() {
        selectPaymentMethod('bank-transfer');
    });
    
    function selectPaymentMethod(metodo) {
        if (metodo === 'credit-card') {
            creditCardMethod.classList.add('seleccionado');
            bankTransferMethod.classList.remove('seleccionado');
            document.getElementById('credit-card').checked = true;
            paymentForm.style.display = 'block';
            bankTransferInfo.style.display = 'none';
            payButton.textContent = 'Realizar Pago';
        } else {
            bankTransferMethod.classList.add('seleccionado');
            creditCardMethod.classList.remove('seleccionado');
            document.getElementById('bank-transfer').checked = true;
            paymentForm.style.display = 'none';
            bankTransferInfo.style.display = 'block';
            payButton.textContent = 'Marcar como Pagado';
        }
    }
    
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        validateCardNumber();
    });
    
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
        
        validateExpiryDate();
    });
    
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
        validateCVV();
    });
    
    cardHolderInput.addEventListener('input', function() {
        validateCardHolder();
    });
    
    function validateCardNumber() {
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const isValid = /^\d{16}$/.test(cardNumber);
        
        if (cardNumber && !isValid) {
            cardNumberError.style.display = 'block';
            return false;
        } else {
            cardNumberError.style.display = 'none';
            return true;
        }
    }
    
    function validateCardHolder() {
        const cardHolder = cardHolderInput.value.trim();
        const isValid = cardHolder.length >= 3;
        
        if (cardHolder && !isValid) {
            cardHolderError.style.display = 'block';
            return false;
        } else {
            cardHolderError.style.display = 'none';
            return true;
        }
    }
    
    function validateExpiryDate() {
        const expiryDate = expiryDateInput.value;
        const isValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
        
        if (expiryDate && !isValid) {
            expiryDateError.style.display = 'block';
            return false;
        } else {
            expiryDateError.style.display = 'none';
            return true;
        }
    }
    
    function validateCVV() {
        const cvv = cvvInput.value;
        const isValid = /^\d{3,4}$/.test(cvv);
        
        if (cvv && !isValid) {
            cvvError.style.display = 'block';
            return false;
        } else {
            cvvError.style.display = 'none';
            return true;
        }
    }
    
    function validateForm() {
        const isCreditCardSelected = document.getElementById('credit-card').checked;
        
        if (isCreditCardSelected) {
            return validateCardNumber() && 
                validateCardHolder() && 
                validateExpiryDate() && 
                validateCVV();
        }
        
        return true;  
    }
    
    payButton.addEventListener('click', function() {
        if (!validateForm()) {
            alert('Por favor, corrija los errores en el formulario antes de continuar.');
            return;
        }
        
        loadingIndicator.style.display = 'block';
        payButton.disabled = true;
        
        setTimeout(function() {
            loadingIndicator.style.display = 'none';
            
            successMessage.style.display = 'block';
            
            paymentStatus.textContent = 'Al día';
            paymentStatus.style.color = '#4CAF50';
            
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(function() {
                successMessage.style.display = 'none';
                payButton.disabled = false;
                
                if (document.getElementById('credit-card').checked) {
                    cardNumberInput.value = '';
                    cardHolderInput.value = '';
                    expiryDateInput.value = '';
                    cvvInput.value = '';
                }
            }, 5000);
        }, 2000);
    });
    
    selectPaymentMethod('credit-card');
});
