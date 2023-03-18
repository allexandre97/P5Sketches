function HueRange(N, beg, end){
    return (end-beg)*N + beg;
}


function hsv2rgb(h,s,v){                              
  let f = (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5)*255,f(3)*255,f(1)*255];       
} 
