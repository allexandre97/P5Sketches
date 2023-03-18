
const PHI = (1 + Math.sqrt(5))/2;

let CANVAS;
const WIDTH = 500;
let HEIGHT = WIDTH/PHI;
if (HEIGHT % 2 != 0){
    HEIGHT++;
}

let grid = [];
let msk = [];

let CUTOFF;
let MAXVAL;
let FIREPR;

function setup(){

    createCanvas(WIDTH, HEIGHT);
    setAttributes('antialias', true);
    pixelDensity(1);

    for (let i = 0; i < WIDTH; i++){
        let tmp = [];
        let tmp2 = [];
        for (let j = 0;  j < HEIGHT; j++){
            tmp.push(random(0, 10));
            tmp2.push(random(0));
        }
        grid.push(tmp);
        msk.push(tmp2);
    }

    CUTOFF = createSlider(0, 1, 0.1, 0.01);
    CUTOFF.position(0, HEIGHT+10);
    let txt = createDiv("Neighbor Influence");
    txt.style("color", "white");
    txt.position(CUTOFF.x, CUTOFF.y + 25);

    MAXVAL = createSlider(1, 100, 25, 1);
    MAXVAL.position(CUTOFF.width*(1+0.05), HEIGHT+10);
    let txt2 = createDiv("Threshold Value");
    txt2.style("color", "white");
    txt2.position(MAXVAL.x*(1 + 0.075), MAXVAL.y + 25);

    FIREPR = createSlider(0, 0.5, 0.25, 0.005);
    FIREPR.position(2*CUTOFF.width*(1+0.05), HEIGHT+10);
    let txt3 = createDiv("Fire Probability");
    txt3.style("color", "white");
    txt3.position(FIREPR.x*(1 + 0.05), MAXVAL.y + 25);

    frameRate(24);
    //noLoop();
}

let maxval = 25;
let prob = 0.4;

function draw(){

    //background(255);
    

    const NROWS = grid.length;
    const NCOLS = grid[0].length;

    loadPixels();

    Neighbors(grid);
    NextStep(grid, msk, CUTOFF.value());
    Propagate(grid, msk, pixels, MAXVAL.value(), FIREPR.value());

    updatePixels();

    //console.log(pixels);
    




}