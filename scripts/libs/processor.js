function doLoad(vidID) {
  const video = document.getElementById(vidID);
  this.video = video;

  this.c1 = document.getElementById("c1");
  this.ctx1 = this.c1.getContext("2d");

  this.c2 = document.getElementById("c2");
  this.ctx2 = this.c2.getContext("2d");
  ctx2.scale(0.5, 0.5);
  var oScope = this;
  video.addEventListener(
    "play",
    () => {
      this.width = video.videoWidth;
      this.height = video.videoHeight;
      oScope.timerCallback();
    },
    false,
  );
};
function timerCallback() {
  if (this.video.paused || this.video.ended) {
    return;
  }
  this.computeFrame();
  setTimeout(() => {
    this.timerCallback();
  }, 0);
};

function computeFrame() {
  this.ctx1.drawImage(this.video, 0, 0, this.width/2, this.height/2);
  const frame = this.ctx1.getImageData(0, 0, this.width/2, this.height/2);
  const data = frame.data;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i + 0];
    const green = data[i + 1];
    const blue = data[i + 2];
	if(green != red && red != blue){
		if ((green <= 130 && green >= 25) && red <= 45 && blue <= 40) {
		  data[i + 3] = 0;
		}
	}
  }
  this.ctx2.putImageData(frame, 0, 0);
};