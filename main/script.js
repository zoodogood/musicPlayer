
function clock() {
  var
    hours   = document.getElementById("hour"),
    minutes = document.getElementById("minute"),
    seconds = document.getElementById("second"),
    h       = new Date().getHours(),
    m       = new Date().getMinutes(),
    s       = new Date().getSeconds();

  if (!String(h)[1]) h = "0" + h;
  if (!String(m)[1]) m = "0" + m;
  if (!String(s)[1]) s = "0" + s;
  hours.innerHTML      = h;
  minutes.innerHTML    = m;
  seconds.innerHTML    = s;

}
clock();
var interval = setInterval(clock, 1000);




window.onload = function() {

  var
    file  = document.getElementById("file"),
    audio = document.getElementById("audio"),
    label = document.getElementById("label");

  file.onchange = function() {
    var files = this.files;
    console.log(files[0]);
    console.log(files[0].name);
    label.innerHTML = files[0].name;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    audio.volume = 0.3;
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 1024;

    var bufferLength = analyser.frequencyBinCount;

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);


      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        var r = 0//barHeight + 25;
        var g = 0//250 * (i / bufferLength);
        var b = 250 * (i / bufferLength) // barHeight / 255 *;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  };
};
