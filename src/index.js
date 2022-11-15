let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            document.getElementById("daily").href += `&r=${this.responseText}`;
        } else {
            document.getElementById("daily").parentNode.hidden = true;
            console.error("Failed to fetch daily puzzle");
        }
    }
}
xmlhttp.open("GET", "../api/daily.php", true);
xmlhttp.send();