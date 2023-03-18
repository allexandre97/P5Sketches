function GetIndices(NROWS, NCOLS, i, j){

    let i1;
    let j1;
    let i_1;
    let j_1;

    i1  = (i+1) % NCOLS;
    j1  = (j+1) % NROWS;
    i_1 = (i-1); 
    j_1 = (j-1);
    
    if (i_1 < 0){
        i_1 = NCOLS + i_1;
    }
    if (j_1 < 0){
        j_1 = NROWS + j_1;
    }

    return {i1:  i1,
            i_1: i_1,
            j1:  j1,
            j_1: j_1}

}


function Neighbors(grid, force = 1/8){

    let value;
    const NROWS = grid.length;
    const NCOLS = grid[0].length;

    let indices;

    let d1;
    let d2;
    let d3;
    let d4;
    let d5;
    let d6;
    let d7;
    let d8;

    for (let i = 0; i < NCOLS; i++){
        
        for (let j = 0; j < NROWS; j++){

            value = grid[j][i];

            indices = GetIndices(NROWS, NCOLS, i, j);

            d1 = grid[indices.j1][i]  - value;
            d2 = grid[indices.j_1][i] - value;
            d3 = grid[j][indices.i1]  - value;
            d4 = grid[j][indices.i_1] - value;

            d5 = grid[indices.j1][indices.i_1]  - value;
            d6 = grid[indices.j1][indices.i1]   - value;
            d7 = grid[indices.j_1][indices.i1]  - value;
            d8 = grid[indices.j_1][indices.i_1] - value;

            grid[j][i] = value +  force*(d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8);

        }
    }
}

function NextStep(grid, mask, cutoff = 0.6){

    const ln  = Math.log(0.5);
    const ln2 = Math.log(1/1.5);

    let d1;
    let d2;
    let d3;
    let d4;
    let d5;
    let d6;
    let d7;
    let d8;
    let d;

    const NROWS = grid.length;
    const NCOLS = grid[0].length;

    let indices;
    let value;

    let q;

    for (let i = 0; i <  NCOLS; i++){
        for (let j = 0; j < NROWS; j++){

            value = grid[j][i];

            if (value < 0){
                grid[j][i] = 0;
            }

            else{

                if (mask[j][i] === 1){
                    grid[j][i] = 0;
                    mask[j][i] = 0;
                }

                else{

                    indices = GetIndices(NROWS, NCOLS, i, j);

                    d1 = grid[indices.j1][i];
                    d2 = grid[indices.j_1][i];
                    d3 = grid[j][indices.i1];
                    d4 = grid[j][indices.i_1];

                    d5 = grid[indices.j1][indices.i_1];
                    d6 = grid[indices.j1][indices.i1];
                    d7 = grid[indices.j_1][indices.i1];
                    d8 = grid[indices.j_1][indices.i_1];

                    d = (d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8)/8;

                    q = d/value;

                    if (Math.random() * (2*Math.exp(ln*q*q)) < cutoff){
                        grid[j][i] = value + (-1*Math.exp(ln2*q*q) + 2);
                    }
                    else{
                        grid[j][i] = value;
                    }
                }
            }
        }
    }
}

function Propagate(grid, mask, pixels, maxval = 25, prob = 0.1){

    const NROWS = grid.length;
    const NCOLS = grid[0].length;

    let value;

    let index;

    let COLOR;
    let HUE;

    for (let i = 0; i < NCOLS; i++){
        for (let j = 0; j < NROWS; j++){

            value = grid[j][i];

            index = (NROWS * i + j) * 4;

            if (value > maxval){

                if (Math.random() < prob){

                    HUE = (value+(3*maxval))/(maxval+60);

                    HUE = HueRange(HUE, -1, 3);
                    HUE = Math.E*HUE*HUE*exp(-HUE*HUE);

                    COLOR = hsv2rgb(360*HUE, 0.75, 0.85);

                    pixels[index + 0] = COLOR[0];
                    pixels[index + 1] = COLOR[1];
                    pixels[index + 2] = COLOR[2];
                    pixels[index + 3] = 255;

                    grid[j][i] = value + 3*maxval;
                }
                mask[j][i] = 1;
            }
            else{

                HUE = value/(maxval+60);

                HUE = HueRange(HUE, -1, 3);
                HUE = Math.E*HUE*HUE*exp(-HUE*HUE);

                COLOR = hsv2rgb(360*HUE, 0.75, 0.85);

                pixels[index + 0] = COLOR[0];
                pixels[index + 1] = COLOR[1];
                pixels[index + 2] = COLOR[2];
                pixels[index + 3] = 255;
            }
        }
    }
}