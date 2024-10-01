console.log("Hello");
var songNames = [];
var artists = [];
let allAlbums = [];
let allJsons = [];
let folder = "KR$NA";

function formatHoursMinutesSeconds(timeInSeconds) {

    if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return "00:00:00";
    }

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

async function song(folder) {
    let songsList = await fetch(`http://0.0.0.0:3000/Media/Songs/${folder}/`);
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

async function getSongs(folder) {
    // Getting the list of songs
    let songs = await song(folder);

    // //Obtaining the seconds of the song played
    // firstSong.addEventListener("loadeddata", () => {
    //     let songDuration = firstSong.duration;
    //     console.log(songDuration);
    // })

    //Preparing the song cards to be displayed in the left section
    let cards = document.querySelector(".songsList").getElementsByTagName("ol")[0];
    for (const song of songs) {
        let songName = song.split(`/Songs/${folder}/`)[1].replaceAll("%20", " ").split("-")[0];
        let singer = song.split(`/Songs/${folder}/`)[1].replaceAll("%20", " ").split("-")[1].replaceAll(".mp3", "");
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

    for (let song of songs) {
        songNames.push(song.split(`/Songs/${folder}/`)[1].replaceAll("%20", " ").replaceAll("%7C", "|").split("-")[0]);
        artists.push(song.split(`/Songs/${folder}/`)[1].replaceAll("%20", " ").split("-")[1].replaceAll(".mp3", ""));
    }

    let songCard = document.querySelectorAll(".playNow");
    for (let index = 0; index < songCard.length; index++) {
        const card = songCard[index];
        card.addEventListener("click", () => {
            playSong(songNames[index], artists[index], true, folder)
        });
    };

    //Predefining the 1st song when the page loads!
    playSong(songNames[0], artists[0], false, folder);
};

getSongs(folder);

let clickedSong = new Audio();

let playSong = (songName, artist, onPageLoad = true, folder) => {

    clickedSong.src = `/Media/Songs/${folder}/${songName}-${artist}.mp3`;
    songName = songName.replaceAll("%7C", "|");
    document.querySelector(".songInfo").innerHTML = `<b class="trackName">${songName}</b> - <i class="artistName">${artist}</i>`;
    if (onPageLoad) {
        clickedSong.play();
        pauseButton.hidden = false;
        playButton.hidden = true;
    }
    else {
        clickedSong.pause();
        pauseButton.hidden = true;
        playButton.hidden = false;
    }
    // document.querySelector(".songTime").innerHTML = "00:00:00 / 00:00:00";

    // // Adjusting the height of the song info according to the height of the song name!
    // let songNameLength = document.querySelector(".trackName").innerText.length;
    // let artistLength = document.querySelector(".artistName").innerText.length;

    // if(screen.width <= 1400) {
    //     if(songNameLength > 20) {
    //         document.querySelector(".songPlayer").style.height = 12 + "vh";
    //     }
    //     else if (artistLength > 10) {
    //         document.querySelector(".songPlayer").style.height = 11 + "vh";
    //     }
    //     else if (songNameLength > 20 && artistLength > 10) {
    //         document.querySelector(".songPlayer").style.height = 14 + "vh";
    //     }
    //     else {
    //         document.querySelector(".songPlayer").style.height = 9 + "vh";
    //     }
    // }
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
// This is the game of percentages! Try to understand this code! Explanation in the leranings.txt file!
document.querySelector(".seekbar").addEventListener("click", (e) => {
    let proceedingCircle = document.querySelector(".proceeder");
    let percentageChange = (e.offsetX / e.target.getBoundingClientRect().width);
    proceedingCircle.style.left = (percentageChange * 100) + "%";
    clickedSong.currentTime = percentageChange * clickedSong.duration;
});

let popUpMenu = document.querySelector(".left-sec");
//Adding the Hamburger Functionality
document.querySelector(".popSide").addEventListener("click", () => {
    popUpMenu.style.left = 0;
});

//Closing the Hamburger
document.querySelector(".close").addEventListener("click", () => {
    popUpMenu.style.left = (-100) + "%";
});

//Adding the functionality of next and previous buttons
let previousButton = document.querySelector(".previousButton");
let nextButton = document.querySelector(".nextButton");

function getCurrentPlayingSong(folder) {
    let currentPlaying = clickedSong.src.split(`/Songs/${folder}/`)[1].split("-")[0].replaceAll("%20", " ").replaceAll("%7C", "|");
    for (let index = 0; index < songNames.length; index++) {
        const songName = songNames[index];
        if (songName == currentPlaying) {
            return index;
        }
    }
}

previousButton.addEventListener("click", () => {
    let currentSong = getCurrentPlayingSong(folder);
    let previousSong;
    if (currentSong == 0) {
        previousSong = (songNames.length) - 1;
    }
    else {
        previousSong = currentSong - 1;
    }
    playSong(songNames[previousSong], artists[previousSong], true, folder);
});

nextButton.addEventListener("click", () => {
    let currentSong = getCurrentPlayingSong(folder);
    let nextSong;
    if (currentSong == (songNames.length) - 1) {
        nextSong = 0;
    }
    else {
        nextSong = currentSong + 1;
    }
    playSong(songNames[nextSong], artists[nextSong], true, folder);
});

//Volume changing
document.getElementsByTagName("input")[0].addEventListener("change", (e) => {
    clickedSong.volume = (e.target.value / 100);
});

let isMute = false;
document.querySelector(".volumeControl").addEventListener("click", () => {
    if (isMute) {
        document.querySelector(".volumeChanger").value = 100;
        clickedSong.volume = 1;
        isMute = false;
    }
    else {
        document.querySelector(".volumeChanger").value = 0;
        clickedSong.volume = 0;
        isMute = true;
    }
});

// let allCards = Array.from(document.getElementsByClassName("card"));
let allCardPlays = Array.from(document.getElementsByClassName("play"));
for (const cardPlay of allCardPlays) {
    cardPlay.addEventListener("click", () => {
        document.querySelector(".cardHolder").innerHTML = "";
        folder = cardPlay.parentElement.dataset.folder;
        songNames = [];
        artists = [];
        getSongs(folder);

    });
};