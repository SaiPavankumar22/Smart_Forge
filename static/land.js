document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email === 'test@example.com' && password === '123456') {
        alert('Login Successful');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials. Try again!');
    }
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Sign-up successful. You can now log in!');
    document.querySelector('#signupModal .btn-close').click();
});


document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    alert(`Thank you, ${name}! Your message has been sent successfully.`);
    this.reset();
});
