const MAXITER = 500;
const TOLERANCE = 0.000001;

/* MATHEMATICAL CONSTANTS*/
const PHI = (1 + Math.sqrt(5))/2




///////////////////////////////////////////////////////
/* CANVAS VARIABLES*/
const WIDTH  = 1000;
let   HEIGHT = WIDTH/PHI;
if (HEIGHT % 2 != 0){
  HEIGHT++;
}
let MyCanvas;
let rootsBuffer;
////////////////////////////////////////////////////////



////////////////////////////////////////////////////////
/* ARRAYS FOR VERTICES */
let REALS = [-0.5, 0, 0.5];
let IMAGS = [-0.5, 0.5, -0.5];
////////////////////////////////////////////////////////

/* COLOR FUNCTIONS */
function hsv2rgb(h,s,v) {                              
  let f = (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5)*255,f(3)*255,f(1)*255];       
} 
function HueRange(N, beg, end){
  return (end-beg)*N + beg;
}


/* COMPLEX NUMBER FUNCTIONS */
function Multiply(C1_R, C1_I, C2_R, C2_I){

  const R = C1_R*C2_R - C1_I*C2_I;
  const I = C1_R*C2_I + C1_I*C2_R;

  return [R, I];

}

function Inverse(REAL, IMAG){

  const DENOM = (REAL*REAL + IMAG*IMAG) 

  const R = REAL/DENOM;
  const I = -1*IMAG/DENOM;

  return [R, I];

}

function Modulo(REAL, IMAG){

  return Math.sqrt(REAL*REAL + IMAG*IMAG);

}

/* POLYNOMIAL FUNCTIONS */

function Poly(VERTEX_REAL, VERTEX_IMAG, REAL, IMAG){
  
  let tmp;

  let tmp_r;
  let tmp_i;

  let result_r = REAL - VERTEX_REAL[0];
  let result_i = IMAG - VERTEX_IMAG[0];

  for (let i = 1; i < VERTEX_REAL.length; i++){
    tmp_r = REAL - VERTEX_REAL[i];
    tmp_i = IMAG - VERTEX_IMAG[i];

    tmp = Multiply(result_r, result_i, tmp_r, tmp_i);
    result_r = tmp[0];
    result_i = tmp[1];

  }

  return [result_r, result_i];
    
}

function dPoly(VERTEX_REAL, VERTEX_IMAG, REAL, IMAG){

  let RES_R = 0;
  let RES_I = 0;
  let res_r;
  let res_i;
  let tmp;
  let tmp_r;
  let tmp_i;

  for (let i = 0; i < VERTEX_REAL.length; i++){
    let n = 0;
    for (let j = 0; j < VERTEX_REAL.length; j++){
      if (i != j){
        if (n === 0){
          res_r = REAL - VERTEX_REAL[j];
          res_i = IMAG - VERTEX_IMAG[j];
          n += 1;
        }
        else{
          tmp_r = REAL - VERTEX_REAL[j];
          tmp_i = IMAG - VERTEX_IMAG[j];

          tmp = Multiply(res_r, res_i, tmp_r, tmp_i);
          res_r = tmp[0];
          res_i = tmp[1];
        }
      }
    }

    RES_R = RES_R + res_r;
    RES_I = RES_I + res_i;
    
  }

  return [RES_R, RES_I];

}

/* COMPUTATION FUNCTIONS */

function Comput(R, I){

  let MOD;

  let RES;
  let Pol;
  let dPol;

  let n = 0;

  while (n < MAXITER){

    Pol   = Poly(REALS, IMAGS, R, I);
    
    MOD = Modulo(Pol[0], Pol[1]);

    if (MOD < TOLERANCE){
      return sqrt(n/MAXITER);
    }

    dPol = dPoly(REALS, IMAGS, R, I);
    
    dPol = Inverse(dPol[0], dPol[1]);
    
    RES  = Multiply(Pol[0], Pol[1], dPol[0], dPol[1]);
    
    R = R - RES[0];
    I = I - RES[1];
    
    n++;

  }

  return sqrt(n/MAXITER);
}

function BuildFractal(){

  MyCanvas.loadPixels();
  
  for (let i = 0; i < WIDTH; i++){
    for (let j = 0; j < HEIGHT; j++){

      let index = (WIDTH * j + i) * 4;
      let R = map(i, 0, WIDTH, -1, 1);
      let I = map(j, 0, HEIGHT, -1, 1);

      if (REALS.length > 1){

        let h = Comput(R, I);
        
        h = 0.5*18.6*h*h*exp(-(h*h)/(0.5*0.144))*360;
        let RGB = hsv2rgb(h, 0.85, 0.75);
        
        pixels[index + 0] = RGB[0];
        pixels[index + 1] = RGB[1];
        pixels[index + 2] = RGB[2];
        pixels[index + 3] = 255;
      }
    }
  }
  MyCanvas.updatePixels();

  image(MyCanvas, 0 ,0, WIDTH, HEIGHT);

}

function DrawRoots(){
  rootsBuffer.background(0, 0, 0, 0);
  for (let p = 0; p < REALS.length; p++){
    let x = map(REALS[p], -1, 1, 0, WIDTH);
    let y = map(IMAGS[p], -1, 1, 0, HEIGHT);
    rootsBuffer.stroke('black');
    rootsBuffer.strokeWeight(15);
    rootsBuffer.point(x, y);
  }
}

let BUTTON_ADD;
let BUTTON_RMV;

let SLIDERS_R = [];
let SLIDERS_C = [];

function setup(){

  BUTTON_ADD = createButton("Click to add a Root");
  BUTTON_RMV = createButton("Click to remove a Root");

  BUTTON_ADD.mousePressed(AddRandomRoot);
  BUTTON_RMV.mousePressed(DeleteRoot);

  for (let n = 0; n < REALS.length; n++){

    let slider_r = createSlider(-1, 1, REALS[n], 1/WIDTH);
    let slider_c = createSlider(-1, 1, IMAGS[n], 1/HEIGHT);

    REALS[n] = slider_r.value();
    IMAGS[n] = slider_c.value();

    SLIDERS_R[n] = slider_r;
    SLIDERS_C[n] = slider_c;

  }

  createCanvas(WIDTH, HEIGHT);
  pixelDensity(1);

  rootsBuffer = createGraphics(WIDTH, HEIGHT);
  MyCanvas    = createCanvas(WIDTH, HEIGHT);

  rootsBuffer.pixelDensity(1);
  //MyCanvas.pixelDensity(1);
  frameRate(24);
  //noLoop();
}


let FIRST = true;
let NPREV;


function draw(){

  if (keyIsPressed === true){

    if (keyCode === 70){
      BuildFractal();
    }

  }

  //DrawRoots();

  
  //image(rootsBuffer, 0, 0);

  for (let n = 0; n < REALS.length; n++){

    REALS[n] = SLIDERS_R[n].value();
    IMAGS[n] = SLIDERS_C[n].value();

    let x = map(REALS[n], -1, 1, 0, WIDTH);
    let y = map(IMAGS[n], -1, 1, 0, HEIGHT);
    strokeWeight(15);
    point(x, y)
  }
  
  NPREV = REALS.length;

}


function AddRandomRoot(){

  let R = random(-1, 1);
  let I = random(-1, 1);

  REALS.push(R);
  IMAGS.push(I);

}

function DeleteRoot(){
  REALS.pop();
  IMAGS.pop();
  SLIDERS.pop();
}

function mouseClicked(){

  let R = map(mouseX, 0, WIDTH,  -1, 1);
  let C = map(mouseY, 0, HEIGHT, -1, 1);

  REALS.push(R);
  IMAGS.push(C);

}

function keyPressed(){

  if (keyCode === 67){
    rootsBuffer.clear();    
    REALS = [];
    IMAGS = [];
  }

  console.log(keyCode);

}