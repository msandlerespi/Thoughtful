document.addEventListener('DOMContentLoaded', () => {
    let ntButton = document.getElementById('new-thought');
    ntButton.onclick = () => {
        document.getElementById('display1').style.display = 'none';
        document.getElementById('display2').style.display = 'block';
    }
})