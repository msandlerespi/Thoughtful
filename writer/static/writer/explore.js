document.addEventListener('DOMContentLoaded', () => {
    [].forEach.call(document.getElementsByClassName('delete'), elem => {
        console.log(elem);
        elem.onclick = () => {
            console.log('hi');
            document.getElementById('delPage').style.display = 'block';
            document.getElementById('delObject').innerHTML = 'Thought ' + elem.id.substring(4);
        }
    });
    document.getElementById('delYes').onclick = () => {
        let csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        let thoughtId = parseInt(document.getElementById('delObject').innerHTML.substring(8));
        fetch('/deleteThought/' + thoughtId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })
            .then(() => {
                document.getElementById('del_' + thoughtId).parentElement.remove();
            })
            .then(() => {
                closeDelPage();
            })

    }
    document.getElementById('delNo').onclick = () => {
        closeDelPage();
    }
    function closeDelPage() {
        document.getElementById('delPage').style.display = 'none';
        document.getElementById('delObject').innerHTML = "";
    }
});