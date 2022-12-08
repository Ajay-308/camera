let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record");
let recordbtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture");
let capturebtn = document.querySelector(".capture-btn");
let transparentcolor = "transparent";

let recordFlag = false;
let captureFlag = false;
let recorder;
let capture;
//for ask about video or audio
let constraints = {
  video: true,
  audio: true,
};
let chunks = [];

//for streaming video we use navigator

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    //conversion media chunk into data
    const blob = new Blob(chunks, { type: "video/mp4" });

    const videoUrl = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = videoUrl;
    a.download = "video.mp4";
    a.click();
  });
});

captureBtnCont.addEventListener("click", (e) => {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.height, canvas.width);

  
  tool.fillStyle = transparentcolor;
  tool.fillRect(0, 0, canvas.height, canvas.width);

  let imageUrl = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = imageUrl;
  a.download = "image.jpg";
  a.click();
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;
  recordFlag = !recordFlag;

  if (recordFlag) {
    recorder.start();
    recordbtn.classList.add("scale-record");
    startTimer();
  } else {
    recorder.stop();
    recordbtn.classList.remove("scale-record");
    stopTimer();
  }
});
captureBtnCont.addEventListener("click", (e) => {
  if (!capture) return;
  captureFlag = !captureFlag;

  if (captureFlag) {
    capture.start();
    capturebtn.classList.add("scale-record");
  } else {
    capture.stop();
    capturebtn.classList.remove("scale-record");
  }
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalsec = counter;
    let hours = Number.parseInt(totalsec / 3600);
    totalsec = totalsec % 3600; //remain value

    let minutes = Number.parseInt(totalsec / 60);
    totalsec = totalsec % 60; //remain value

    let seconds = totalsec;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timer.innerText = `${hours}:${minutes}:${seconds}`;
    counter++;
  }
  timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timerID);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}
