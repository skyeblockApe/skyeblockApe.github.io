(function(){
'use strict';
const designReview=document.documentElement.dataset.review==='interior'||new URLSearchParams(location.search).get('review')==='interior';
if(designReview)document.documentElement.dataset.review='interior';
const $=s=>document.querySelector(s),sound=$('#sound'),music=$('#music-audio');
const safeGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
const safeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const normalizeLang=value=>value==='zh'||value==='zh-Hant'||value==='zh-TW'?'zh-TW':['en','ja'].includes(value)?value:'zh-TW';
const requestedLang=new URLSearchParams(location.search).get('lang');
let lang=normalizeLang(requestedLang||safeGet('skyeblock-language')),enabled=safeGet('skyeblock-sound-enabled')==='true',blocked=false,currentCopy=null;
const zh={metaTitle:'Skyeblock — 讓好奇，成為作品。',metaDescription:'Skyeblock 是以好奇心為起點的創意工作室，設計 MythFog、HENI Care、History 101、GeneDex，以及健康 Podcast《病了才知道》。',soundOff:'聲音 關',soundOn:'聲音 開',soundBlocked:'點此恢復聲音',pause:'暫停',resume:'繼續',relatedNews:'相關報導',readOriginal:'閱讀原文 ↗',permanentSnapshot:'永久快照 ↗',archiveLoading:'正在整理檔案…',archiveError:'檔案暫時無法載入，請稍後再試。',cabinetEntry:'進入展示櫃 ↗'};
document.querySelectorAll('[data-i18n]').forEach(e=>{zh[e.dataset.i18n]??=e.innerHTML;});
document.querySelectorAll('[data-aria]').forEach(e=>{zh[e.dataset.aria]??=e.getAttribute('aria-label');});
const additions={en:{navContact:'Contact',archiveLink:'Past projects ↗',podcastLink:'Podcast ↗',eventShort:'Precision Health Carnival 2026 ↗',eventCredit:'Oct 17–18 · Hosted by CancerFree Biotech',cabinetEntry:'Enter the Cabinet ↗',relatedNews:'Related coverage',readOriginal:'Read original ↗',permanentSnapshot:'Permanent snapshot ↗',archiveLoading:'Opening the archive…',archiveError:'The archive is temporarily unavailable.'},ja:{navContact:'連絡',archiveLink:'過去の活動 ↗',podcastLink:'ポッドキャスト ↗',eventShort:'精準健康嘉年華 2026 ↗',eventCredit:'10.17–18 · CancerFree Biotech 主催',cabinetEntry:'展示室へ ↗',relatedNews:'関連報道',readOriginal:'原文を読む ↗',permanentSnapshot:'保存版 ↗',archiveLoading:'アーカイブを読み込み中…',archiveError:'アーカイブを一時的に読み込めません。'}};
for(const k of ['en','ja'])Object.assign(window.SKYEBLOCK_COPY[k],additions[k]);
const getPath=(object,path)=>path.split('.').reduce((value,key)=>value&&value[key],object);
const t=k=>getPath(currentCopy,k)??(lang==='zh-TW'?zh:window.SKYEBLOCK_COPY[lang])?.[k]??zh[k]??k;
async function loadLocale(next){try{const response=await fetch(`locales/${next}.json`,{cache:'no-cache'});if(!response.ok)throw new Error(response.status);return response.json()}catch{return next==='zh-TW'?zh:window.SKYEBLOCK_COPY[next]}}
function updateSound(){sound.textContent=t(blocked?'soundBlocked':enabled?'soundOn':'soundOff');sound.setAttribute('aria-pressed',String(enabled&&!blocked))}
function updateDiscoveryMeta(){
  document.title=t('metaTitle');
  const description=t('metaDescription');
  const canonicalUrl=lang==='zh-TW'?'https://skyeblock.com/':`https://skyeblock.com/?lang=${lang}`;
  const setContent=(selector,value)=>{const node=$(selector);if(node)node.content=value};
  setContent('meta[name="description"]',description);setContent('meta[property="og:title"]',t('metaTitle'));setContent('meta[property="og:description"]',description);setContent('meta[name="twitter:title"]',t('metaTitle'));setContent('meta[name="twitter:description"]',description);setContent('meta[property="og:url"]',canonicalUrl);
  const canonical=$('link[rel="canonical"]');if(canonical)canonical.href=canonicalUrl;
}
async function setLang(next,{syncUrl=false}={}){lang=normalizeLang(next);currentCopy=await loadLocale(lang);$('#language').value=lang;document.documentElement.lang={"zh-TW":'zh-Hant',en:'en',ja:'ja'}[lang];document.querySelectorAll('[data-i18n]').forEach(e=>e.innerHTML=t(e.dataset.i18n).replace(e.dataset.i18n==='heroTitle'?/<br\s*\/?\s*>/g:/$^/g,' '));document.querySelectorAll('[data-aria]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.aria)));updateDiscoveryMeta();safeSet('skyeblock-language',lang);if(syncUrl){const url=new URL(location.href);if(lang==='zh-TW')url.searchParams.delete('lang');else url.searchParams.set('lang',lang);history.replaceState(null,'',url)}updateSound();document.dispatchEvent(new CustomEvent('skyeblock:languagechange'))}
$('#language').addEventListener('change',e=>setLang(e.target.value,{syncUrl:true}));setLang(lang);$('#year').textContent=new Date().getFullYear();music.volume=.45;

const stage=$('.stage'),world=$('.clubhouse-world'),arrival=$('#arrival'),hud=$('#flight-hud'),bar=$('.scene-bar'),progress=$('#flight-progress'),pauseButton=$('#pause'),flightAudio=$('#flight-audio');
const {StarVolume,sampleFlight,DURATION,smooth}=window.SkyeblockScene,stars=new StarVolume($('#stars')),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let state='loading',paused=false,elapsed=0,last=0,visible=true,wasPaused=false,renderClock=0,quiet=0,ready=false;
const cinema=window.SkyeblockCinematicEnvironment?new window.SkyeblockCinematicEnvironment($('.scene-backdrop')):null;
arrival.inert=true;bar.inert=true;
async function audioPlay(audio){if(!enabled||paused||document.hidden)return;try{await audio.play();blocked=false}catch{blocked=true}updateSound()}
async function setSound(on){enabled=on;blocked=false;safeSet('skyeblock-sound-enabled',String(on));music.pause();flightAudio.pause();if(on&&(state==='flight'||state==='arrived'))await audioPlay(state==='flight'?flightAudio:music);updateSound()}
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
else if(designReview||reduced.matches||qp.get('from')==='cabinet')arrive();
else start();
prepareScene().catch(()=>arrive());
window.SkyeblockApp={getState:()=>({state,enabled,lang,paused,elapsed,ready,renderer:'starfield-camera'}),setSound,start,arrive};
  const dialog=$('#gene-dialog');document.querySelectorAll('[data-open-gene]').forEach(b=>b.addEventListener('click',()=>{if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}));
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const projects={myth:{name:'MythFog',url:'https://www.mythfog.com/'},heni:{name:'HENI Care',url:'https://henicare.com/'},history:{name:'History 101',url:'https://history101.skyeblock.com/'}};
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.project,item=projects[key];$('#peek-name').textContent=item.name;$('#peek-status').textContent=t(key+'Status');$('#peek-description').textContent=t(key+'Desc');$('#peek-link').href=item.url;$('#project-dialog').showModal();}));

  let archiveNews=[];
  const make=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
  const dateLabel=value=>value?value.split('-').join('.'):'';
  function renderArchiveNews(){document.querySelectorAll('[data-news-project]').forEach(details=>{const list=details.querySelector('.news-list'),records=archiveNews.filter(item=>item.project===details.dataset.newsProject&&item.status==='verified');list.replaceChildren();if(!records.length){list.append(make('p','news-empty',t('archiveError')));return}records.forEach(record=>{const article=make('article','news-entry');article.append(make('p','news-meta',`${dateLabel(record.date)} · ${record.outlet}`),make('h4','',record.original_title),make('p','news-summary',t(record.summary_key)));const links=make('div','news-links'),original=make('a','',t('readOriginal'));original.href=record.url;original.target='_blank';original.rel='noopener noreferrer';links.append(original);if(record.archive_url){const archive=make('a','',t('permanentSnapshot'));archive.href=record.archive_url;archive.target='_blank';archive.rel='noopener noreferrer';links.append(archive)}article.append(links);list.append(article)})})}
  fetch('data/news.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error(response.status);return response.json()}).then(data=>{archiveNews=data;renderArchiveNews()}).catch(()=>renderArchiveNews());
  document.addEventListener('skyeblock:languagechange',renderArchiveNews);


})();
