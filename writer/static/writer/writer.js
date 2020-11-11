let prevTarget = null;
document.addEventListener("DOMContentLoaded", () => {
    let divider = document.getElementById('divider');
    divider.style.height = window.innerHeight + "px";

    [].forEach.call(document.getElementsByClassName('arg'), elem => {
        elem.style.left = elem.style.left === '1px' ? window.innerWidth / 2 - 6 + 'px' : window.innerWidth / 2 - 207 + 'px';
        console.log(elem.style.left);
        elem.style.top = parseFloat(elem.style.top.substring(0, elem.style.top.length - 2)) * window.innerHeight + 'px';
    });



    document.onmousemove = pullout;
    let pulloutWindow = document.getElementById('pullout');
    pulloutWindow.style.height = window.innerHeight + 'px';

    document.onkeydown = event => {
        let key = event.key;
        if (key === "Delete") {
            let currentArg = document.getElementsByClassName('arg-selected');
            if (currentArg.length === 1) {
                currentArg = currentArg[0];
                if (!currentArg.classList.contains('arg')) {
                    currentArg = currentArg.parentElement;
                }
                let argId = parseInt(currentArg.id.substring(3));
                let thoughtId = parseInt(document.getElementById('thoughtId').value);
                let index = ' ';
                if (document.getElementById('index').value) {
                    index = document.getElementById('index').value;
                }
                let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                fetch(`/deleteArg/${argId}/${index}/${thoughtId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result.message);
                    });
                currentArg.remove();
            }
        }
    }

    document.addEventListener('dblclick', function (event) {
        let elem = event.target;
        if (elem.classList.contains('arg')) {
            saveCurrent(() => {
                let index = document.getElementById('index').value;
                if (index) {
                    index += ` ${elem.id.substring(3)}`;
                } else {
                    index = `${elem.id.substring(3)}`;
                }
                let thoughtId = document.getElementById('thoughtId').value;
                window.location.replace(`/argument/${index}/${thoughtId}`);
            })

        }
    });
    document.addEventListener('mousedown', event => {
        let elem = event.target;
        if (elem.classList.toString().includes('arg')) {
            if (prevTarget) prevTarget.classList.remove('arg-selected');
            if (elem.classList.contains('edit-arg')) {
                if (elem.innerHTML === 'edit') elem.innerHTML = 'save';
                else elem.innerHTML = 'edit';
                elem = elem.nextElementSibling;
                elem.readOnly = !elem.readOnly;
            }
            if (!elem.classList.contains('arg')) elem = elem.parentElement;
            elem.classList.add('arg-selected');
            prevTarget = elem;
        } else if (elem.id === 'save') {
            saveCurrent(() => { console.log("saved!") });
        } else if (elem.classList.contains('traverse') && !elem.classList.contains('traverse-current')) {
            saveCurrent(() => {
                let newIndex = " ";
                let thoughtId = document.getElementById('thoughtId').value;
                [].forEach.call(document.getElementsByClassName('traverse'), traverser => {
                    if (traverser === elem) {
                        if (newIndex !== " ") newIndex = newIndex.substring(2);
                        window.location.replace(`/argument/${newIndex}/${thoughtId}`);
                    } else if (!traverser.classList.contains('traverse-current')) {
                        newIndex += " " + traverser.dataset.index;
                    }
                });
            });
        } else if (window.innerWidth > 500 && !prevTarget && event.clientY > divider.getBoundingClientRect().top && event.clientX > 200) {
            let bTop = divider.getBoundingClientRect().top;
            let bBot = divider.getBoundingClientRect().bottom;
            let newArg = createArgument(event.clientX, event.clientY - 50);
            document.onmousemove = function (event) {
                if (event.clientY + - 50 < bTop) newArg.style.top = bTop + window.pageYOffset + 'px';
                else if (event.clientY + 50 > bBot) newArg.style.top = (bBot + window.pageYOffset - 100) + 'px';
                else newArg.style.top = (event.clientY + window.pageYOffset - 50) + 'px';
            }
        } else if (prevTarget) {
            prevTarget.classList.remove('arg-selected');
            prevTarget = null;
        }
    });
    document.addEventListener('mouseup', () => {
        document.onmousemove = pullout;
        // just incase of bugs
        let drags = document.getElementsByClassName('arg-drag')
        for (let i = 0; i < drags.length; ++i) {
            drags[i].classList.remove('arg-drag');
        }
    });
});

function saveCurrent(func) {
    let thoughtId = document.getElementById("thoughtId").value;
    let index = document.getElementById("index").value;
    if (index) {
        index = index.split(" ");
    } else {
        index = [];
    }
    let args = [];
    [].forEach.call(document.getElementsByClassName('arg'), arg => {
        let content = arg.childNodes;
        let temp = null;
        [].forEach.call(content, e => {
            if (temp === null && e.classList !== undefined && e.classList.contains('arg-input')) {
                temp = e.value;
            }
        });
        content = temp;
        let strength = parseInt(arg.style.top.substring(0, arg.style.top.length - 2));
        strength /= window.innerHeight;
        console.log(arg.innerHTML.indexOf('Yes'));
        args.push({
            procon: arg.innerHTML.indexOf('Yes') > -1 && (arg.innerHTML.indexOf('No') === -1 || arg.innerHTML.indexOf('Yes') < arg.innerHTML.indexOf('No')),
            content: content,
            strength: strength,
            smallId: parseInt(arg.id.substring(3)),
        });
    });
    let csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    fetch('/save', {
        method: 'PUT',
        body: JSON.stringify({
            thoughtId: thoughtId,
            index: index,
            arguments: args,
        }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            func();
        });
}

function createArgument(x, y) {
    let newId = -1;
    let elems = document.getElementsByClassName('arg');
    for (let i = 0; i < elems.length; ++i) {
        let bool = true;
        [].forEach.call(elems, elem => {
            if (bool && i === parseInt(elem.id.substring(3))) {
                bool = false;
            }
        })
        if (bool) {
            newId = i;
            break;
        }
    }
    if (newId === -1) {
        let i = elems.length;
        newId = i;
    }
    let arg = document.createElement('div');
    arg.classList = "arg arg-drag";
    arg.id = "arg" + newId;
    let half = window.innerWidth / 2 - 6;
    if (x < window.innerWidth / 2) {
        arg.style.left = half - 201 + 'px';
        arg.innerHTML = 'No, because ';
    } else {
        arg.style.left = half + 'px';
        arg.innerHTML = 'Yes, because ';
    }
    arg.style.top = y + window.pageYOffset + 'px';
    let editbtn = document.createElement('div');
    editbtn.innerHTML = 'save';
    editbtn.classList = 'edit-arg';
    arg.append(editbtn);
    arg.innerHTML += '<textarea class="arg-input" rows=3></textarea>';
    document.body.append(arg);
    return arg;
}

function pullout(event) {
    if (event.clientX < 200 && event.clientY > divider.getBoundingClientRect().top) document.getElementById('pullout').style.left = 0;
    else document.getElementById('pullout').style.left = -200 + 'px';
}