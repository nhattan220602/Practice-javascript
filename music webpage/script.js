const mySong = document.getElementById("mySong");
const icon = document.getElementById("icon");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const volumeSlider = document.getElementById("volumeSlider");
const seekSlider = document.getElementById("seekSlider");
const songTitle = document.getElementById("songTitle");
const timeLabel = document.getElementById("timeLabel");
const playlist = document.getElementById("playlist");

const iconPaths = {
    play: "assets/images/play_circle_200dp_000000_FILL0_wght400_GRAD0_opsz48.png",
    pause: "assets/images/pause_circle_200dp_000000_FILL0_wght400_GRAD0_opsz48.png"
};

const songs = [
    { src: "assets/musics/Ribs.mp3", title: "Ribs" },
    { src: "assets/musics/The 1975 - About You (Official).mp3", title: "About You" },
    { src: "assets/musics/The 1975 - Happiness (Official Video).mp3", title: "Happiness" },
    { src: "assets/musics/The 1975 - Robbers.mp3", title: "Robbers" }
];

let currentSongIndex = 0;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60) || 0;
    const remainingSeconds = Math.floor(seconds % 60) || 0;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updatePlayIcon() {
    icon.src = mySong.paused ? iconPaths.play : iconPaths.pause;
}

function updateTimeLabel() {
    const current = formatTime(mySong.currentTime);
    const duration = formatTime(mySong.duration);
    timeLabel.textContent = `${current} / ${duration}`;
}

function updateActiveSongUI() {
    songTitle.textContent = songs[currentSongIndex].title;
    const allItems = playlist.querySelectorAll("li");
    allItems.forEach((item, index) => {
        item.classList.toggle("active", index === currentSongIndex);
    });
}

function setSong(index, autoplay = false) {
    currentSongIndex = (index + songs.length) % songs.length;
    mySong.src = songs[currentSongIndex].src;
    seekSlider.value = 0;
    updateActiveSongUI();
    if (autoplay) {
        mySong.play();
    }
    updatePlayIcon();
    updateTimeLabel();
}

function renderPlaylist() {
    playlist.innerHTML = "";
    songs.forEach((song, index) => {
        const item = document.createElement("li");
        item.textContent = song.title;
        item.onclick = () => setSong(index, true);
        playlist.appendChild(item);
    });
}

icon.onclick = function () {
    if (mySong.paused) {
        mySong.play();
    } else {
        mySong.pause();
    }
    updatePlayIcon();
};

prevButton.onclick = function () {
    setSong(currentSongIndex - 1, true);
};

nextButton.onclick = function () {
    setSong(currentSongIndex + 1, true);
};

volumeSlider.oninput = function () {
    mySong.volume = Number(volumeSlider.value);
};

seekSlider.oninput = function () {
    if (mySong.duration) {
        mySong.currentTime = (Number(seekSlider.value) / 100) * mySong.duration;
    }
};

mySong.ontimeupdate = function () {
    if (mySong.duration) {
        seekSlider.value = (mySong.currentTime / mySong.duration) * 100;
    }
    updateTimeLabel();
};

mySong.onended = function () {
    setSong(currentSongIndex + 1, true);
};

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        icon.click();
    } else if (event.code === "ArrowRight") {
        nextButton.click();
    } else if (event.code === "ArrowLeft") {
        prevButton.click();
    }
});

mySong.onplay = updatePlayIcon;
mySong.onpause = updatePlayIcon;

renderPlaylist();
setSong(currentSongIndex);
volumeSlider.dispatchEvent(new Event("input"));