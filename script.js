console.log("Hello");

function formatHoursMinutesSeconds(timeInSeconds) {
    const totalSeconds = Math.floor(timeInSeconds);  // Get the whole seconds part
    const hours = Math.floor(totalSeconds / 3600);  // Calculate hours
    const mins = Math.floor((totalSeconds % 3600) / 60);  // Calculate minutes
    const secs = totalSeconds % 60;  // Remaining seconds
    const milliseconds = Math.round((timeInSeconds - totalSeconds) * 1000); // Extract milliseconds (if needed)

    // Pad with zeros to ensure 2 digits for hours, minutes, and seconds
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    // Return in HH:MM:SS format (excluding milliseconds)
    return `${formattedHours}:${formattedMins}:${formattedSecs}`;
}

async function song() {
    let songsList = await fetch("http://0.0.0.0:3000/Media/Songs/");
    let response = await songsList.text();
    let recdHTML = document.createElement("div");
    recdHTML.innerHTML = response;
    let links = recdHTML.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

async function getSongs() {
    // Getting the list of songs
    let songs = await song();

    // //Obtaining the seconds of the song played
    // firstSong.addEventListener("loadeddata", () => {
    //     let songDuration = firstSong.duration;
    //     console.log(songDuration);
    // })

    //Preparing the song cards to be displayed in the left section
    let cards = document.querySelector(".songsList").getElementsByTagName("ol")[0];
    for (const song of songs) {
        let songName = song.split("/Songs/")[1].replaceAll("%20", " ").split("-")[0];
        let singer = song.split("/Songs/")[1].replaceAll("%20", " ").split("-")[1].replaceAll(".mp3", "");
        //Extra String Formatting;
        songName = songName.replaceAll("%7C", "|");
        //Done
        cards.innerHTML += `<li>
                            <div class="songTemplate">
                                <img src="Media/song.svg" alt="song icon">
                                <div class="songName">
                                    <p>${songName}</p>
                                    <div class="artist">
                                    ${singer}
                                    </div>
                                </div>
                            </div>
                            <div class="playNow">
                                <p>Play Now</p>
                                <img src="Media/play.svg" alt="play now">
                            </div>
                        </li>`;
    }

    var songNames = [];
    var artists = [];

    for (let song of songs) {
        songNames.push(song.split("/Songs/")[1].replaceAll("%20", " ").split("-")[0]);
        artists.push(song.split("/Songs/")[1].replaceAll("%20", " ").split("-")[1].replaceAll(".mp3", ""));
    }

    let songCard = document.querySelectorAll(".playNow");
    for (let index = 0; index < songCard.length; index++) {
        const card = songCard[index];
        card.addEventListener("click", () => {
            playSong(songNames[index], artists[index])
        });
    };
};

getSongs();

let clickedSong = new Audio();

let playSong = (songName, artist) => {
    clickedSong.src = `/Media/Songs/${songName}-${artist}.mp3`;
    clickedSong.play();
    pauseButton.hidden = false;
    playButton.hidden = true;
    songName = songName.replaceAll("%7C", "|");
    document.querySelector(".songInfo").innerHTML = `<b>${songName}</b> - <i>${artist}</i>`;
    document.querySelector(".songTime").innerHTML = "00:00:00 / 00:00:00";
}

let playButton = document.querySelector(".playButton");
let pauseButton = document.querySelector(".pauseButton");
pauseButton.hidden = true;

playButton.addEventListener("click", () => {
    clickedSong.play();
    pauseButton.hidden = false;
    playButton.hidden = true;
})

pauseButton.addEventListener("click", () => {
    clickedSong.pause();
    pauseButton.hidden = true;
    playButton.hidden = false;
})

// Listennig to seek bar and also updating time in the abovebar
clickedSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${formatHoursMinutesSeconds(clickedSong.currentTime)} / ${formatHoursMinutesSeconds(clickedSong.duration)}`;
    document.querySelector(".proceeder").style.left = (clickedSong.currentTime / clickedSong.duration) * 100 + "%";
});

//Adding event listener to seek bar
document.querySelector(".seekbar").addEventListener("click", (e) => {
    console.log(e.offsetX, e.);
})