function clearLocalData() {
    if (confirm("Êtes-vous sûr de vouloir effacer les données locales ?")) {
        localStorage.clear();
        alert("Données locales effacées.");
        window.history.back();
    } else {
        hiddenResetClicks = 0;
    }
}

window.onload = function () {
    const hiddenReset = document.getElementById("hidden-reset");
    let hiddenResetClicks = 0;

    hiddenReset.addEventListener("click", () => {
        hiddenResetClicks++;
        if (hiddenResetClicks == 10) {
            clearLocalData();
        }
    });
}