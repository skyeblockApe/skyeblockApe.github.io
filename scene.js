/* Camera-only starfield approach. The host is fixed in the destination scene. */
(function(global){
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const smooth=(a,b,v)=>{v=clamp((v-a)/(b-a));return v*v*(3-2*v);};
  function sampleFlight(p){
    p=clamp(p);
    return {progress:p,travel:2500*(1-Math.pow(1-p,2.6)),trail:(.8+.24*Math.sin(p*7))*(1-smooth(.28,.57,p)),starOpacity:1-smooth(.32,.69,p),environmentScale:.28+.72*smooth(.20,.94,p),environmentOpacity:smooth(.21,.58,p),edge:18*(1-smooth(.50,.90,p))};
  }
  class StarVolume{
    constructor(canvas){
      this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});this.available=false;
      if(!this.gl){this.ctx=canvas.getContext('2d');let seed=8796;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};this.fallbackStars=Array.from({length:550},()=>[(rand()-.5)*1100,(rand()-.5)*700,rand()*600]);return;}
      const gl=this.gl;try{
        const vs=`attribute vec4 a_star;uniform float u_travel,u_aspect,u_trail,u_time,u_dpr;varying float v_alpha;void main(){float z=mod(a_star.z-u_travel+1200.0,600.0)+3.0;float tz=z+a_star.w*(1.0+u_trail*24.0);vec2 screen=vec2(a_star.x/(tz*u_aspect),a_star.y/tz);gl_Position=vec4(screen*1.32,0.0,1.0);gl_PointSize=clamp(2.8-z*.003,1.0,2.8)*u_dpr;v_alpha=(.22+.7*(1.0-z/603.0))*(.82+.18*sin(a_star.x+u_time*.5));}`;
        const fs=`precision mediump float;uniform float u_point;varying float v_alpha;void main(){float a=1.0;if(u_point>.5){vec2 d=gl_PointCoord-.5;a=1.0-smoothstep(.1,.5,length(d));}gl_FragColor=vec4(.72,.87,1.0,v_alpha*a);}`;
        const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
        this.program=gl.createProgram();gl.attachShader(this.program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(this.program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error('Star shader link failed');gl.useProgram(this.program);
        let seed=8796;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};let points=[],lines=[];
        for(let i=0;i<1250;i++){const x=(rand()-.5)*1100,y=(rand()-.5)*700,z=rand()*600;points.push(x,y,z,0);lines.push(x,y,z,0,x,y,z,1);}
        this.pointCount=points.length/4;this.lineCount=lines.length/4;this.points=this.buffer(points);this.lines=this.buffer(lines);this.attribute=gl.getAttribLocation(this.program,'a_star');this.uniforms={};for(const n of ['travel','aspect','trail','time','dpr','point'])this.uniforms[n]=gl.getUniformLocation(this.program,'u_'+n);
        gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);this.available=true;
      }catch(e){console.warn('Starfield unavailable; static environment remains usable.',e);this.available=false;}
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.available=false;});
    }
    buffer(data){const gl=this.gl,b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b;}
    draw(travel,trail,time){if(!this.available){this.drawFallback(travel,trail);return;}const gl=this.gl,c=this.canvas,r=c.getBoundingClientRect(),dpr=Math.min(global.devicePixelRatio||1,1.75);const w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(c.width!==w||c.height!==h){c.width=w;c.height=h;gl.viewport(0,0,w,h);}gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);gl.uniform1f(this.uniforms.travel,travel);gl.uniform1f(this.uniforms.aspect,w/Math.max(h,1));gl.uniform1f(this.uniforms.trail,trail);gl.uniform1f(this.uniforms.time,time);gl.uniform1f(this.uniforms.dpr,dpr);gl.enableVertexAttribArray(this.attribute);
      const render=(buffer,count,mode,isPoint)=>{gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.vertexAttribPointer(this.attribute,4,gl.FLOAT,false,0,0);gl.uniform1f(this.uniforms.point,isPoint);gl.drawArrays(mode,0,count);};
      if(trail>.02)render(this.lines,this.lineCount,gl.LINES,0);render(this.points,this.pointCount,gl.POINTS,1);
    }
    drawFallback(travel,trail){if(!this.ctx)return;const c=this.canvas,ctx=this.ctx,r=c.getBoundingClientRect();if(c.width!==r.width||c.height!==r.height){c.width=r.width;c.height=r.height;}const w=c.width,h=c.height;ctx.clearRect(0,0,w,h);for(const [x,y,depth] of this.fallbackStars){const z=((depth-travel)%600+600)%600+3,px=w/2+x/z*h*.66,py=h/2-y/z*h*.66;if(px<0||px>w||py<0||py>h)continue;const opacity=.2+.65*(1-z/603);ctx.fillStyle=ctx.strokeStyle=`rgba(185,223,255,${opacity})`;ctx.beginPath();if(trail>.03){const zz=z+trail*25;ctx.moveTo(w/2+x/zz*h*.66,h/2-y/zz*h*.66);ctx.lineTo(px,py);ctx.lineWidth=1;ctx.stroke();}else{ctx.arc(px,py,1.2,0,Math.PI*2);ctx.fill();}}}
  }
  global.SkyeblockScene={StarVolume,sampleFlight,smooth,clamp,DURATION:6200};
})(window);


/* Three depth bands of moving procedural mist; original artwork stays intact. */
(function(global){
 const sm=(a,b,x)=>{x=Math.max(0,Math.min(1,(x-a)/(b-a)));return x*x*(3-2*x)};
 const hash=(x,y)=>{const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v)};
 function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y);let a=x-ix,b=y-iy;a=a*a*(3-2*a);b=b*b*(3-2*b);return (hash(ix,iy)*(1-a)+hash(ix+1,iy)*a)*(1-b)+(hash(ix,iy+1)*(1-a)+hash(ix+1,iy+1)*a)*b;}
 class CinematicEnvironment{
  constructor(parent){
   this.canvas=document.createElement('canvas');this.canvas.className='cinematic-environment';this.canvas.setAttribute('aria-hidden','true');this.ctx=this.canvas.getContext('2d');this.available=!!this.ctx;if(!this.available)return;
   parent.append(this.canvas);this.layers=[];
   for(let layer=0;layer<3;layer++){
    const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d'),pixels=ctx.createImageData(c.width,c.height),rgb=[[25,40,49],[31,48,58],[39,59,67]][layer];
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
     let v=0,amp=.58,f=1;for(let o=0;o<4;o++){v+=amp*noise(x/100*f+layer*17,y/100*f+layer*9);amp*=.48;f*=2;}
     const i=(y*c.width+x)*4;pixels.data[i]=rgb[0];pixels.data[i+1]=rgb[1];pixels.data[i+2]=rgb[2];pixels.data[i+3]=Math.round(Math.min(.96,Math.max(.08,(v-.20)/.63))*255);
    }ctx.putImageData(pixels,0,0);this.layers.push(c);
   }
  }
  draw(p){
   if(!this.available)return;const c=this.canvas,ctx=this.ctx,r=c.parentElement.getBoundingClientRect();const w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));
   c.hidden=p<=0||p>=1;if(c.hidden)return;
   if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
   ctx.clearRect(0,0,w,h);
   this.layers.forEach((layer,j)=>{
    const strength=(j<2?.80:.64)*sm(.14,.32,p)*(1-sm(.46+j*.035,.78+j*.045,p));
    if(strength<.001)return;ctx.globalAlpha=strength*(1-.45*sm(.32,.62,p));
    const sx=(.12+p*(.16+j*.045))*layer.width,sy=(.08+p*.06)*layer.height;
    ctx.drawImage(layer,sx,sy,layer.width*.46,layer.height*.66,0,0,w,h);
   });ctx.globalAlpha=1;
  }
 }
 global.SkyeblockCinematicEnvironment=CinematicEnvironment;
})(window);
