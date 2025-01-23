document.addEventListener('DOMContentLoaded', function() {
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function validatePhone(phone) {
    const phoneRegex = /^(\+40|0)7\d{8}$/;
    return phoneRegex.test(phone);
    }
    function applyRandomDiscounts() {
    const products = document.querySelectorAll('.record-cover');
        products.forEach(product => {
            if (Math.random() < 0.3) { 
                const discount = Math.floor(Math.random() * 30) + 10; 


                const discountTag = document.createElement('div');
                
                discountTag.className = 'discount-tag';
                discountTag.textContent = `-${discount}%`;
                discountTag.style.position = 'absolute';
                discountTag.style.top = '10px';
                discountTag.style.right = '10px';
                discountTag.style.backgroundColor = 'red';
                discountTag.style.color = 'white';
                discountTag.style.padding = '5px 10px';
                discountTag.style.borderRadius = '5px';
                product.style.position = 'relative';
                product.appendChild(discountTag);
            }
        });
    }
    function startDiscountTimer() {
        const navbarText = document.querySelector('.navbartext');
        const timerContainer = document.createElement('div');
        timerContainer.className = 'navbar-timer-container';
        timerContainer.style.display = 'flex';
        timerContainer.style.alignItems = 'center';
        timerContainer.style.marginLeft = '20px';
        
        const timerElement = document.createElement('div');
        timerElement.id = 'discount-timer';
        timerElement.style.backgroundColor = 'rgba(44, 31, 2, 0.8)';
        timerElement.style.color = 'white';
        timerElement.style.padding = '5px 10px';
        timerElement.style.borderRadius = '4px';
        timerElement.style.fontSize = '0.9em';
        
        timerContainer.appendChild(timerElement);
        navbarText.appendChild(timerContainer);
    
        let timeLeft = 300; 
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `Reduceri: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timerElement.textContent = 'Reducerile s-au terminat!';
                setTimeout(() => {
                    timerContainer.remove();
                    document.querySelectorAll('.discount-tag').forEach(tag => tag.remove());
                }, 2000);
            }
            timeLeft--;
        }, 1000);
    }
    const dropdownButton = document.querySelector('.buton');
    const dropdownOptions = document.querySelector('.dropdown-options');

    if (dropdownButton && dropdownOptions) {
        dropdownButton.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', function(e) {
            if (!dropdownButton.contains(e.target)) {
                dropdownOptions.style.display = 'none';
            }
        });
    }
    document.querySelectorAll('.record-cover').forEach(cover => {
        cover.addEventListener('mouseover', function() {
        const computedStyle = window.getComputedStyle(this);
        const currentScale = computedStyle.transform;
            
        if (currentScale === 'none' || currentScale === 'matrix(1, 0, 0, 1, 0, 0)') {
                
            
            this.style.transform = 'scale(1.1)';
                this.style.transition = 'transform 0.3s ease';
            }
        });

        cover.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
    const contactSection = document.querySelector('#contactsec');
if (contactSection) {
const contactForm = document.createElement('div');
    contactForm.className = 'contact-form';
    contactForm.innerHTML = `
            <h3>Contact Us</h3>
            <form id="contactForm">
                <input type="text" placeholder="Nume" id="contactName" required>
                <input type="email" placeholder="Email" id="contactEmail" required>
                <input type="tel" placeholder="Telefon" id="contactPhone" required>
                <textarea placeholder="Mesaj" id="contactMessage" required></textarea>
                <button type="submit">Trimite</button>
            </form>
        `;
        contactSection.appendChild(contactForm);
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            
            if (!validateEmail(email)) {
                alert('Adresa de email nu este validă!');
                return;
            }
            
            if (!validatePhone(phone)) {
            alert('Numărul de telefon nu este valid!');
                    return;
            }
            
                    alert('Formularul a fost trimis cu succes!');
            form.reset();
        });
    }
    applyRandomDiscounts();
    startDiscountTimer();
});