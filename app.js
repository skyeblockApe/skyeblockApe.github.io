(function(){
'use strict';
const designReview=document.documentElement.dataset.review==='interior'||new URLSearchParams(location.search).get('review')==='interior';
if(designReview)document.documentElement.dataset.review='interior';
const $=s=>document.querySelector(s),sound=$('#sound'),music=$('#music-audio');
let lang='zh',enabled=false,blocked=false;
const zh={soundOff:'聲音 關',soundOn:'聲音 開',soundBlocked:'點此開啟聲音',pause:'暫停',resume:'繼續'};
document.querySelectorAll('[data-i18n]').forEach(e=>{zh[e.dataset.i18n]??=e.innerHTML;});
document.querySelectorAll('[data-aria]').forEach(e=>{zh[e.dataset.aria]??=e.getAttribute('aria-label');});
const additions={en:{navContact:'Contact',archiveLink:'Past projects ↗',podcastLink:'Podcast ↗',eventShort:'Precision Health Carnival 2026 ↗',eventCredit:'Oct 17–18 · Hosted by CancerFree Biotech'},ja:{navContact:'連絡',archiveLink:'過去の活動 ↗',podcastLink:'ポッドキャスト ↗',eventShort:'精準健康嘉年華 2026 ↗',eventCredit:'10.17–18 · CancerFree Biotech 主催'}};
for(const k of ['en','ja'])Object.assign(window.SKYEBLOCK_COPY[k],additions[k]);
const t=k=>(lang==='zh'?zh:window.SKYEBLOCK_COPY[lang])[k]??zh[k]??k;
const safeGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
function updateSound(){sound.textContent=t(blocked?'soundBlocked':enabled?'soundOn':'soundOff');sound.setAttribute('aria-pressed',String(enabled&&!blocked))}
function setLang(next){lang=['zh','en','ja'].includes(next)?next:'zh';$('#language').value=lang;document.documentElement.lang={zh:'zh-Hant',en:'en',ja:'ja'}[lang];document.querySelectorAll('[data-i18n]').forEach(e=>e.innerHTML=t(e.dataset.i18n).replace(e.dataset.i18n==='heroTitle'?/<br\s*\/?\s*>/g:/$^/g,' '));document.querySelectorAll('[data-aria]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.aria)));document.title='Skyeblock — '+$('.hero-copy h1').textContent;try{localStorage.setItem('skyeblock-language',lang)}catch{}updateSound()}
$('#language').addEventListener('change',e=>setLang(e.target.value));setLang(safeGet('skyeblock-language')||'zh');$('#year').textContent=new Date().getFullYear();music.volume=.45;

const stage=$('.stage'),world=$('.clubhouse-world'),arrival=$('#arrival'),hud=$('#flight-hud'),bar=$('.scene-bar'),progress=$('#flight-progress'),pauseButton=$('#pause'),flightAudio=$('#flight-audio');
const {StarVolume,sampleFlight,DURATION,smooth}=window.SkyeblockScene,stars=new StarVolume($('#stars')),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let state='loading',paused=false,elapsed=0,last=0,visible=true,wasPaused=false,renderClock=0,quiet=0,ready=false;
const cinema=window.SkyeblockCinematicEnvironment?new window.SkyeblockCinematicEnvironment($('.scene-backdrop')):null;
const initialHash=location.hash;arrival.inert=true;bar.inert=true;
async function audioPlay(audio){if(!enabled||paused||document.hidden)return;try{await audio.play();blocked=false}catch{blocked=true}updateSound()}
async function setSound(on){enabled=on;blocked=false;music.pause();flightAudio.pause();if(on&&(state==='flight'||state==='arrived'))await audioPlay(state==='flight'?flightAudio:music);updateSound()}
sound.addEventListener('click',()=>setSound(!enabled));
function environment(p){
 const s=sampleFlight(p);
 world.style.transform=`scale(${s.environmentScale})`;
 world.style.opacity=s.environmentOpacity;
 world.style.setProperty('--edge',`${s.edge}%`);
 $('#stars').style.opacity=s.starOpacity;
 cinema?.draw(p);
 return s;
}
function draw(p,time){const s=environment(p);stars.draw(s.travel,s.trail,time);progress.value=Math.round(p*1000)}
function arrive({focus=false}={}){state='arrived';elapsed=DURATION;paused=false;last=0;stage.dataset.state=state;arrival.inert=false;bar.inert=false;hud.hidden=true;flightAudio.pause();draw(1,DURATION/1000);if(enabled)audioPlay(music);if(focus){const h=$('.hero-copy h1');h.tabIndex=-1;h.focus({preventScroll:true})}}
function start(){if(designReview){arrive();return;}stage.scrollIntoView({behavior:'instant',block:'start'});blocked=false;elapsed=0;paused=false;last=0;renderClock=0;music.pause();music.currentTime=0;flightAudio.pause();flightAudio.currentTime=0;if(reduced.matches){arrive({focus:true});return}state='flight';stage.dataset.state=state;arrival.inert=true;bar.inert=true;hud.hidden=false;pauseButton.textContent=t('pause');draw(0,0);audioPlay(flightAudio)}
function setPaused(on){paused=on;last=0;pauseButton.textContent=t(on?'resume':'pause');if(on){flightAudio.pause();music.pause();}else{if(enabled&&(state==='flight'||state==='arrived'))audioPlay(state==='flight'?flightAudio:music)}}
$('#replay').addEventListener('click',start);$('#skip-flight').addEventListener('click',()=>arrive({focus:true}));pauseButton.addEventListener('click',()=>setPaused(!paused));
progress.addEventListener('input',()=>{setPaused(true);elapsed=Number(progress.value)/1000*DURATION;flightAudio.currentTime=Math.min(elapsed/1000,flightAudio.duration||7.2);draw(elapsed/DURATION,elapsed/1000)});
document.addEventListener('visibilitychange',()=>{if(document.hidden){wasPaused=paused;setPaused(true)}else{setPaused(wasPaused)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state==='flight')arrive({focus:true})});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(state!=='arrived')arrive()}));
reduced.addEventListener('change',()=>{if(reduced.matches&&state==='flight')arrive()});
if('IntersectionObserver' in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting}).observe(stage);
window.addEventListener('resize',()=>{if(ready)draw(elapsed/DURATION,elapsed/1000)});
function frame(now){const dt=last?Math.min(now-last,1000):0;last=now;if(!document.hidden&&!paused&&visible){if(state==='flight'){elapsed+=dt;renderClock+=dt;if(renderClock>=30||elapsed>=DURATION){draw(Math.min(1,elapsed/DURATION),elapsed/1000);renderClock=0}if(elapsed>=DURATION)arrive()}else if(state==='idle'&&!reduced.matches){quiet+=dt/1000;stars.draw(quiet*8,.03,quiet)}}requestAnimationFrame(frame)}requestAnimationFrame(frame);
function imageReady(im){return im.complete&&im.naturalWidth?Promise.resolve():new Promise((resolve,reject)=>{im.addEventListener('load',resolve,{once:true});im.addEventListener('error',reject,{once:true})})}
async function prepareScene(){
 await Promise.all([$('#host'),$('.clubhouse')].map(imageReady));
 ready=true;draw(elapsed/DURATION,elapsed/1000);
}
const qp=new URLSearchParams(location.search);
if(qp.has('motion-preview')){enabled=false;state='flight';stage.dataset.state=state;hud.hidden=false;elapsed=Math.max(0,Math.min(1,Number(qp.get('motion-preview'))||0))*DURATION;setPaused(true);draw(elapsed/DURATION,elapsed/1000);}
else if(designReview||initialHash||reduced.matches)arrive();
else start();
prepareScene().catch(()=>arrive());
window.SkyeblockApp={getState:()=>({state,enabled,lang,paused,elapsed,ready,renderer:'starfield-camera'}),setSound,start,arrive};
  const dialog=$('#gene-dialog');document.querySelectorAll('[data-open-gene]').forEach(b=>b.addEventListener('click',()=>{if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}));
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const projects={myth:{name:'MythFog',url:'https://www.mythfog.com/'},heni:{name:'HENI Care',url:'https://henicare.com/'},history:{name:'History 101',url:'https://history101.skyeblock.com/'}};
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.project,item=projects[key];$('#peek-name').textContent=item.name;$('#peek-status').textContent=t(key+'Status');$('#peek-description').textContent=t(key+'Desc');$('#peek-link').href=item.url;$('#project-dialog').showModal();}));


})();
