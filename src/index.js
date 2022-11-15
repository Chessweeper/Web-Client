async function updateDailyPuzzle() {
    const resp = await fetch("../api/daily.php");
    if (resp.ok)
    {
        const text = await resp.text();
        if (text.length > 20) { // Somehow launching this in local environment returns index.html?
            console.error("Failed to fetch daily puzzle");
        } else {
            document.getElementById("daily").href += `&r=${text}`;
            document.getElementById("daily").parentNode.hidden = false;
        }
    }
    else
    {
        console.error("Failed to fetch daily puzzle");
    }
}
