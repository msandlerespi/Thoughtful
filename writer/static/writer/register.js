document.addEventListener('DOMContentLoaded', () => {
    let signup = document.getElementById('signup');
    document.getElementById('signup').onclick = () => {
        let email = document.getElementById('register-email').value;
        let pass = document.getElementById('register-password').value;
        let name = document.getElementById('register-name').value;
        if(!(email.length > 4 && email.includes('@') && email.includes('.'))){
            makePopup('Please enter a valid email.')
        } else if(!(pass.length >= 8 && pass.toUpperCase() !== pass && pass.toLowerCase() !== pass)) {
            makePopup('Invalid password. Remember, your password must contain both capital and lowercase letters and be at least 8 characters long');
        } else if (!(name.length > 0)) {
            makePopup('Please enter your name.');
        } else {
            fetch('/check_username/' + email)
            .then(response => response.json())
            .then(result => {
                if(result) {
                    document.getElementById('register-p1').style.display = 'none';
                    document.getElementById('register-p2').style.display = 'block';
                } else {
                    makePopup('There is already an account under this email');
                }
            });
        }
    }
    let morals = document.getElementById('morals-input');
    morals.addEventListener('keydown', () => {
        if(morals.value.length > 0) document.getElementById('signup2').disabled = false;
        else document.getElementById('signup2').disabled = true;
    });
});

function makePopup(msg) {
    const elem = document.createElement('div');
    elem.innerHTML = msg;
    elem.classList = 'popup';
    let timeout = msg.length * 65;
    document.body.append(elem);
    window.setTimeout(() => {elem.style.opacity = 0;}, timeout);
    window.setTimeout(() => {elem.remove();}, timeout + 2000);
}