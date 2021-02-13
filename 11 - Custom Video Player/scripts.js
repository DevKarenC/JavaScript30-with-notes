/* HTMLMediaElement Properties, DOM Events, data-attributes, short-circuit evaluation, Fullscreen API */

/* Features I added for additional practice */
// Pressing a space bar can also toggle play and pause
// Toggle full-screen mode

/* Video Player Features */
// play and pause button
// play and pause the video when you click on the video
// volume slider
// increase or decrease the play speed
// skip buttons (10s backward and 25s forward)

/* Get the elements */
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const playButton = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const fullscreenButton = player.querySelector(".full-screen");

/* Build out functions */
function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function togglePlaySpaceBar(e) {
  if (video.paused && e.key === " ") {
    video.play();
  } else if (e.key === " ") {
    video.pause();
  }
}

// to update the play/pause button text, you may think that we should update it inside of togglePlay function.
// but since there are other ways to play or pause the video (not just clicking on the play button),
// we can listen to the video whenever it is playing or paused, regardless of how it was played or paused.
// good way to handle edge cases!
function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  playButton.textContent = icon;
}

// instead of hard-coding the number of seconds to skip, we can use the data-attribute and the this keyword
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

// no need to check the property name with if-else conditions! Super simple.
function handleRangeUpdate() {
  video[this.name] = this.value;
}

// 1. when the video is playing, the progress bar should be updating in real time (using % and video duration)
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// 2. when the user moves the progress bar, the video should update
function scrub(e) {
  const scrubTime = (e.layerX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

/* Hook up the event listeners */
playButton.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
window.addEventListener("keydown", togglePlaySpaceBar);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);
skipButtons.forEach((skipButton) => {
  skipButton.addEventListener("click", skip);
});
ranges.forEach((range) => {
  range.addEventListener("change", handleRangeUpdate);
});
ranges.forEach((range) => {
  range.addEventListener("mousemove", handleRangeUpdate);
});

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

fullscreenButton.addEventListener("click", toggleFullScreen);
