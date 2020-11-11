document.addEventListener('DOMContentLoaded', () => {
    let bgs = document.getElementsByClassName('login-background');
    for(let i = 0; i < 2; i++) {
        bgs[i].height = window.innerHeight - 1;
        bgs[i].width = window.innerWidth/2 - 1;
    }
    bgs[0].style.left = 0;
    bgs[1].style.left = window.innerWidth/2 - 1  + "px";
    let box = document.getElementsByClassName("float-form")[0];
    box.style.height = window.innerHeight * .6 + "px";
    box.style.top = window.innerHeight * .2 + "px";
});