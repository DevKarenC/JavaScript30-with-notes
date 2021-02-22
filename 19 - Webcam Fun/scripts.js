const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  // navigator.getUserMedia() is deprecated
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((localMediaStream) => {
      // video.src = window.URL.createObjectURL(localMediaStream) no longer works
      // because setting the src property to the URL DOMstring is deprecated in browsers
      // you should set the srcObject property directly to the stream
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      alert("Oh no! Perhaps you want to allow webcam permission?");
      console.log(err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // accessing each pixel on the image - there are over millions of pixels!
    let pixels = ctx.getImageData(0, 0, width, height);
    // apply filter to the pixels
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // play the snapping sound
  snap.currentTime = 0;
  snap.play();

  // save the image on canvas and download it
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "cool");
  // link.textContent = "Download Image";
  link.innerHTML = `<img src="${data}" alt="Cool Image"/>`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  // since pixels is not an "array", we cannot use higher order array methods on it
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] += 100; // red
    pixels.data[i + 1] -= 50; // green
    pixels.data[i + 2] *= 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
