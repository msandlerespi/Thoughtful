document.addEventListener("DOMContentLoaded", () => {
    document.onmousemove = pullout;
    let pulloutWindow = document.getElementById('pullout');
    pulloutWindow.style.height = window.innerHeight + 'px';
    if (window.innerWidth > 500) {
        let divider = document.getElementById('divider');
        divider.style.height = window.innerHeight + "px";

        [].forEach.call(document.getElementsByClassName('arg'), elem => {
            elem.style.left = elem.style.left === '1px' ? window.innerWidth / 2 - 6 + 'px' : window.innerWidth / 2 - 207 + 'px';
            console.log(elem.style.left);
            elem.style.top = parseFloat(elem.style.top.substring(0, elem.style.top.length - 2)) * window.innerHeight + 'px';
        });
    } else {
        let top = 250;
        [].forEach.call(document.getElementsByClassName('arg'), elem => {
            elem.style.left = window.innerWidth / 2 - 100 + 'px';
            elem.style.top = top + 'px';
            top += 110;
        });
    }
    document.addEventListener('dblclick', function (event) {
        let elem = event.target;
        if (elem.classList.contains('arg')) {
            let user = document.getElementById('currentUser').value;
            let index = document.getElementById('index').value;
            if (index) {
                index += ` ${elem.id.substring(3)}`;
            } else {
                index = `${elem.id.substring(3)}`;
            }
            let thoughtId = document.getElementById('thoughtId').value;
            window.location.replace(`/argument/${user}/${index}/${thoughtId}`);
        }
    });

    document.addEventListener('mousedown', event => {
        let elem = event.target;
        if (elem.classList.contains('traverse') && !elem.classList.contains('traverse-current')) {
            let user = document.getElementById('currentUser').value;
            let newIndex = " ";
            let thoughtId = document.getElementById('thoughtId').value;
            [].forEach.call(document.getElementsByClassName('traverse'), traverser => {
                if (traverser === elem) {
                    if (newIndex !== " ") newIndex = newIndex.substring(2);
                    window.location.replace(`/argument/${user}/${newIndex}/${thoughtId}`);
                } else if (!traverser.classList.contains('traverse-current')) {
                    newIndex += " " + traverser.dataset.index;
                }
            });
        }
    });
});

function pullout(event) {
    if (window.innerWidth > 500) {
        if (event.clientX < 200 && event.clientY > divider.getBoundingClientRect().top) document.getElementById('pullout').style.left = 0;
        else document.getElementById('pullout').style.left = -200 + 'px';
    } else {
        if (event.clientX < 100 && event.clientY > divider.getBoundingClientRect().top) document.getElementById('pullout').style.left = 0;
        else document.getElementById('pullout').style.left = -100 + 'px';
    }
}