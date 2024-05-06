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
    let currentAudio = null;
    let currentAudioTimeout = null;

    hiddenReset.addEventListener("click", () => {
        hiddenResetClicks++;
        if (hiddenResetClicks == 10) {
            clearLocalData();
        }
    });
    
    document.querySelector('.audio').addEventListener('click', function playAudio() {
        let audioSrc = this.getAttribute('data-src');
        if (!audioSrc) {
            console.error('No audio source found');
            return;
        }

        if (currentAudio || currentAudioTimeout) {
            clearTimeout(currentAudioTimeout);
            currentAudio.pause();
            currentAudio = null;
        }
    
        currentAudio = new Audio(audioSrc);
        currentAudio.play().catch(error => console.error(`Error playing audio: ${error}`));
    
        currentAudioTimeout = setTimeout(function() {
            currentAudio.pause();
            currentAudio = null;
        }, 5000);
    });
}
