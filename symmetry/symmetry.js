const PHI = (1+Math.sqrt(5))/2;

const capturer = new CCapture({
  framerate: 24,
  format: "webm",
  name: "benotafraid_2",
  quality: 100,
  verbose: true,
});

function Polygon(NSides, CenterX, CenterY, R, Theta_0){
  const delta_theta = TWO_PI/NSides;

  let X = [];
  let Y = [];

  for (let n = 0; n < NSides; n++){
    X[n] = CenterX + R*cos(n*delta_theta + Theta_0);
    Y[n] = CenterY + R*sin(n*delta_theta + Theta_0);
  }

  return [X, Y];

}

const WIDTH = 700;
let HEIGHT = WIDTH/PHI;

if (HEIGHT % 2 != 0){
  HEIGHT++;
}

let canvas;

function setup(){
  
  canvas = createCanvas(WIDTH, HEIGHT);
  frameRate(24);
  //noLoop();

}

function PolyBezier(XY, i, N, O, Color){

  let Anchor1X = XY[0][i % N];
  let Anchor1Y = XY[1][i % N];

  let Anchor2X = XY[0][(i+3 + O) % N];
  let Anchor2Y = XY[1][(i+3 + O) % N];

  let Control1X = XY[0][(i+1 + O) % N];
  let Control1Y = XY[1][(i+1 + O) % N];

  let Control2X = XY[0][(i+2 + O) % N];
  let Control2Y = XY[1][(i+2 + O) % N];

  beginShape();
  fill(Color);
  strokeWeight(2.5);
  bezier(Anchor1X, Anchor1Y, Control1X, Control1Y, Control2X, Control2Y, Anchor2X, Anchor2Y);
  endShape();
}

function DrawFlower(N, CX, CY, R, Angle, Offset, Recursion, K, Level = 0){

  let XY;
  XY = Polygon(N[Level], CX, CY, R, Angle);

  let from = color('rgba(51, 86, 0, 0.7)');
  let to   = color('rgba(163, 37, 8, 0.3)');
  
  for (let i = 0; i < N[Level]; i++){
    colorMode(RGB);
    let Color = lerpColor(from, to, i/(N[Level] - 1));
    PolyBezier(XY, i, N[Level], Offset[Level], Color);
  }

  if (Level < Recursion-1){
    Level++;
    for (let i = 0; i < N[Level-1]; i++){
      DrawFlower(N, XY[0][i], XY[1][i], R*K*(0.2*sin(S - Level*HALF_PI) + 1), -1*Angle - Level*PI, Offset, Recursion, K, Level);
    }
  }
}

let angle = 0;

let N = [13, 5, 8, 7];
let O = [1, 4, 3, 1];

const R0 = 0.29*HEIGHT;
let   R;
let   S;

function Eyelid(CX, CY, R, Size, TensionX, TensionY, Color){

  let Anchor1X = CX - Size*R;
  let Anchor1Y = CY;
  
  let Anchor2X = CX + Size*R;
  let Anchor2Y = CY;

  let Control1X = CX - Size*TensionX*R;
  let Control1Y = CY - TensionY*R;

  let Control2X = CX + Size*TensionX*R;
  let Control2Y = CY - TensionY*R;

  beginShape();
  fill(Color);
  strokeWeight(3);
  bezier(Anchor1X, Anchor1Y, Control1X, Control1Y, Control2X, Control2Y, Anchor2X, Anchor2Y);
  endShape();

}

function Pupil(CX, CY, R, Size, TensionX, TensionY, Color){

  let Anchor1X = CX;
  let Anchor1Y = CY - Size*R;
  
  let Anchor2X = CX;
  let Anchor2Y = CY + Size*R;

  let Control1X = CX - TensionX*R;
  let Control1Y = CY - Size*TensionY*R;

  let Control2X = CX - TensionX*R;
  let Control2Y = CY + Size*TensionY*R;

  beginShape();
  fill(Color);
  strokeWeight(3);
  bezier(Anchor1X, Anchor1Y, Control1X, Control1Y, Control2X, Control2Y, Anchor2X, Anchor2Y);
  endShape();

}

function draw(){

  /*
  if (frameCount === 1){
    capturer.start();
  }
  */

  background('rgba(61, 71, 97, 0.333)');

  S = radians(360*((frameCount % (24*5)) / (24*5)));
  R = R0*(0.125*sin(S) + 1.125);

  DrawFlower(N, width/2, height/2, R, angle, O, 3, 0.3);

  let Color = color('rgba(255, 84, 87, 0.5)');
  Eyelid(width/2, height/2, R, 0.575, 0.5,  0.25*(0.99*sin(S) - 1), Color);
  Eyelid(width/2, height/2, R, 0.575, 0.5, -0.25*(0.99*sin(S) - 1), Color);

  let Color2 = color(0,0,0);
  Pupil(width/2, height/2, -R*0.3*(0.99*sin(S) - 1), 0.575, -0.5, 0.25, Color2);
  Pupil(width/2, height/2, -R*0.3*(0.99*sin(S) - 1), 0.575,  0.5, 0.25, Color2);

  angle += TWO_PI/(20*24);
  angle %= TWO_PI;

  /*
  capturer.capture(canvas.canvas);

  if (frameCount === 480){
    noLoop();
    capturer.stop();
    capturer.save();
  }

  //saveGif('benotafraid.gif', 20);

  //saveCanvas(canvas, 'frame_'+str(frameCount), 'png');
  */
}
