document.addEventListener('DOMContentLoaded', () => {
    let msg = document.getElementById('message')
    if(msg) makePopup(msg.innerHTML);
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