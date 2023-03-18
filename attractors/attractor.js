
const PHI    = (1+ Math.sqrt(5))/2;
const WIDTH  = 1000;
let HEIGHT = WIDTH/PHI;

if (HEIGHT % 2 != 0){
    HEIGHT++;
}

function hsv2rgb(h,s,v) 
{                              
  let f = (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5)*255,f(3)*255,f(1)*255];       
} 


let CANVAS;

let NPARTICLES = 1000;
let PARTICLES  = [];
const L = 20;

const DT = 0.075;


function Thomas(OLDSTATE, a = 0.208186, speed = 4){

    let VX = speed*(sin(OLDSTATE[1]) - a*OLDSTATE[0]);
    let VY = speed*(sin(OLDSTATE[2]) - a*OLDSTATE[1]);
    let VZ = speed*(sin(OLDSTATE[0]) - a*OLDSTATE[2]);

    let X = OLDSTATE[0] + DT*VX;
    let Y = OLDSTATE[1] + DT*VY;
    let Z = OLDSTATE[2] + DT*VZ;

    return {

        x: X,
        y: Y,
        z: Z,

        vx: VX,
        vy: VY,
        vz: VZ,

    }

}

function Lorenz(OLDSTATE, a = 10, b = 28, c = 8/3, speed = 1){

    let VX = speed*(a*(OLDSTATE[1] - OLDSTATE[0]));
    let VY = speed*(OLDSTATE[0]*(b - OLDSTATE[2]) - OLDSTATE[1]);
    let VZ = speed*(OLDSTATE[0]*OLDSTATE[1] - c*OLDSTATE[2]);

    let X = OLDSTATE[0] + DT*VX;
    let Y = OLDSTATE[1] + DT*VY;
    let Z = OLDSTATE[2] + DT*VZ;

    return {

        x: X,
        y: Y,
        z: Z,

        vx: VX,
        vy: VY,
        vz: VZ,

    }

}

function V3D(V){

    return Math.sqrt(V[0]*V[0] + V[1]*V[1] + V[2]*V[2]);
}

var easycam;

let SPEED;
let PARAM;

function setup(){

    CANVAS = createCanvas(WIDTH, HEIGHT, WEBGL);
    setAttributes('antialias', true);

    for (var i = 0; i < NPARTICLES; i++) {
        PARTICLES[i] = new Particle(random(-L, L), random(-L, L), random(-L, L),
                                    random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01),
                                    0, DT);
    }

    easycam = new Dw.EasyCam(this._renderer, {
        distance: 10
    });

    PARAM = createSlider(0.5*0.208186, 2*0.208186, 0.208186, 0.001);
    SPEED = createSlider(0.5, 2, 1, 0.001);

    frameRate(24);
    
}

let h;
let COLOR;

function draw(){

    // projection
    perspective(60 * PI / 180, width / height, 1, 5000);

    // BG
    background('rgba(125, 125, 125, 0.1)');
    
    //updating and displaying the particles
    for (var i = PARTICLES.length - 1; i >= 0; i -= 1) {
        let p = PARTICLES[i];
        p.update(PARAM.value(), SPEED.value());
        p.display();
        if (p.x > 80 || p.y > 80 || p.z > 80 || p.x < -80 || p.y < -80 || p.z < -80) {
            PARTICLES.splice(i, 1);
            PARTICLES.push(new Particle(random(-7, 7), random(-6, 6), random(-6, 6),
                                        random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01),
                                        0, DT));
        }
    }

}

class Particle{

    constructor(_x, _y, _z, _u, _v, _w, _t, _h){

        this.x = _x;
        this.y = _y;
        this.z = _z;

        this.u = _u;
        this.v = _v;
        this.w = _w;

        this.time = _t;

        this.h = _h;

        this.radius = random(0.1, 0.15);

        this.hue = map(V3D([this.u, this.v, this.w]), 0, 0.025*L/this.h, 270, 360);
        this.color = hsv2rgb(this.hue, 0.85, 0.75);
        
        
    }

    update(p, s){

        let tmp = Thomas([this.x, this.y, this.z], p, s);
        //let tmp = Thomas([this.x, this.y, this.z]);

        this.u = tmp.vx;
        this.v = tmp.vy;
        this.w = tmp.vz;
        
        this.x = tmp.x;
        this.y = tmp.y;
        this.z = tmp.z;

        this.hue   = map(V3D([this.u, this.v, this.w]), 0, 0.005*L/this.h, 270, 360);
        this.color = hsv2rgb(this.hue, 0.85, 0.75);
        this.time += this.h;

    }

    display(){

        push();
        translate(this.x, this.y, this.z);
        ambientLight(255);
        ambientMaterial(...this.color);
        noStroke();
        sphere(this.radius, 6, 6);
        pop();

    }

}

