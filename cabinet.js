(function(){
'use strict';
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const safeGet=key=>{try{return localStorage.getItem(key)}catch{return null}};
const safeSet=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
const normalizeLang=value=>value==='zh'||value==='zh-Hant'||value==='zh-TW'?'zh-TW':['en','ja'].includes(value)?value:'zh-TW';
const langToHtml={"zh-TW":"zh-Hant",en:'en',ja:'ja'};
const fallback={
  language:'語言',navLabel:'主導覽',soundOff:'聲音 關',soundOn:'聲音 開',soundBlocked:'點此恢復聲音',relatedNews:'相關報導',readOriginal:'閱讀原文 ↗',permanentSnapshot:'永久快照 ↗',archiveLoading:'正在整理檔案…',
  cabinet:{metaTitle:'THE CABINET｜聯名實體紀錄 — Skyeblock',metaDescription:'走進 Skyeblock clubhouse 的展示櫃，閱讀共同完成的聯名實體與故事。',yearPending:'年份待確認',partners:'合作方',character:'角色識別',archiveEntry:'ARCHIVE ENTRY',videoSource:'原始影片來源',previousImage:'上一張圖片',nextImage:'下一張圖片',showImage:'顯示圖片',empty:'目前沒有可公開展示的物件。',loadError:'展示櫃資料暫時無法載入；你仍可返回 clubhouse。'}
};
const requestedLang=new URLSearchParams(location.search).get('lang');
let lang=normalizeLang(requestedLang||safeGet('skyeblock-language'));
let copy=fallback;
let dataset=null;
let soundEnabled=safeGet('skyeblock-sound-enabled')==='true';
let soundBlocked=false;
let stopCarousels=[];

function getPath(object,path){return path.split('.').reduce((value,key)=>value&&value[key],object)}
function t(key){return getPath(copy,key)??getPath(fallback,key)??key}
async function getJSON(url){const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error(`${url}: ${response.status}`);return response.json()}
function applyCopy(){
  document.documentElement.lang=langToHtml[lang];
  $('#language').value=lang;
  $$('[data-i18n]').forEach(element=>{const value=t(element.dataset.i18n);if(value!==element.dataset.i18n)element.innerHTML=value});
  $$('[data-aria]').forEach(element=>element.setAttribute('aria-label',t(element.dataset.aria)));
  document.title=t('cabinet.metaTitle');
  const description=document.querySelector('meta[name="description"]');if(description)description.content=t('cabinet.metaDescription');
  ['meta[property="og:title"]','meta[name="twitter:title"]'].forEach(selector=>{const meta=$(selector);if(meta)meta.content=t('cabinet.metaTitle')});
  ['meta[property="og:description"]','meta[name="twitter:description"]'].forEach(selector=>{const meta=$(selector);if(meta)meta.content=t('cabinet.metaDescription')});
  const canonicalUrl=lang==='zh-TW'?'https://skyeblock.com/cabinet.html':`https://skyeblock.com/cabinet.html?lang=${lang}`;
  const canonical=$('link[rel="canonical"]');if(canonical)canonical.href=canonicalUrl;
  const ogUrl=$('meta[property="og:url"]');if(ogUrl)ogUrl.content=canonicalUrl;
  updateSound();
}
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node}
function formatDate(value){if(!value)return '';const [year,month,day]=value.split('-');return `${year}.${month}.${day}`}
function renderNews(ids,news){
  const records=ids.map(id=>news.find(entry=>entry.id===id)).filter(entry=>entry?.status==='verified');
  if(!records.length)return null;
  const details=el('details','archive-details');const summary=el('summary','',t('relatedNews'));details.append(summary);
  records.forEach(record=>{const article=el('article','news-entry');article.append(el('p','news-meta',`${formatDate(record.date)} · ${record.outlet}`),el('h4','',record.original_title),el('p','',t(record.summary_key)));
    const links=el('div','news-links');const original=el('a','',t('readOriginal'));original.href=record.url;original.target='_blank';original.rel='noopener noreferrer';links.append(original);
    if(record.archive_url){const archive=el('a','',t('permanentSnapshot'));archive.href=record.archive_url;archive.target='_blank';archive.rel='noopener noreferrer';links.append(archive)}
    article.append(links);details.append(article)});
  return details;
}
function renderCarousel(item){
  const carousel=el('div','exhibit-carousel');carousel.setAttribute('role','region');carousel.setAttribute('aria-roledescription','carousel');carousel.setAttribute('aria-label',t(item.alt_key));
  const track=el('div','carousel-track');let active=0;let timer=null;let visible=false;let paused=false;
  const slides=item.images.map((source,index)=>{const image=el('img');image.src=source;image.alt=index?`${t(item.alt_key)} — ${index+1}`:t(item.alt_key);image.width=700;image.height=875;image.loading='lazy';image.decoding='async';image.classList.toggle('is-active',index===0);image.setAttribute('aria-hidden',String(index!==0));track.append(image);return image});
  const controls=el('div','carousel-controls');const previous=el('button','carousel-arrow','←');const next=el('button','carousel-arrow','→');previous.type=next.type='button';previous.setAttribute('aria-label',t('cabinet.previousImage'));next.setAttribute('aria-label',t('cabinet.nextImage'));
  const dots=el('div','carousel-dots');const dotButtons=slides.map((_,index)=>{const button=el('button','carousel-dot');button.type='button';button.setAttribute('aria-label',`${t('cabinet.showImage')} ${index+1}`);button.setAttribute('aria-current',String(index===0));dots.append(button);return button});
  function show(index){active=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{const selected=i===active;slide.classList.toggle('is-active',selected);slide.setAttribute('aria-hidden',String(!selected));dotButtons[i].setAttribute('aria-current',String(selected))})}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function start(){stop();if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&visible&&!paused)timer=setInterval(()=>show(active+1),4200)}
  previous.addEventListener('click',()=>{show(active-1);start()});next.addEventListener('click',()=>{show(active+1);start()});dotButtons.forEach((button,index)=>button.addEventListener('click',()=>{show(index);start()}));
  carousel.addEventListener('pointerenter',()=>{paused=true;stop()});carousel.addEventListener('pointerleave',()=>{paused=false;start()});carousel.addEventListener('focusin',()=>{paused=true;stop()});carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){paused=false;start()}});
  controls.append(previous,dots,next);carousel.append(track,controls);
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{visible=entry.isIntersecting;if(visible)start();else stop()}),{threshold:.2});observer.observe(carousel);stopCarousels.push(()=>{stop();observer.disconnect()})}else{visible=true;start();stopCarousels.push(stop)}
  return carousel;
}
function renderItems(){
  if(!dataset)return;
  stopCarousels.forEach(stop=>stop());stopCarousels=[];const root=$('#cabinet-items');root.replaceChildren();
  const published=dataset.items.filter(item=>item.status==='published');
  if(!published.length){root.append(el('p','cabinet-empty',t('cabinet.empty')));root.setAttribute('aria-busy','false');return}
  published.forEach((item,index)=>{
    const article=el('article','cabinet-exhibit');article.id=`exhibit-${item.id}`;
    const visual=el('div','exhibit-visual');visual.append(el('span','exhibit-number',`${t('cabinet.archiveEntry')} ${String(index+1).padStart(2,'0')}`));
    if(item.video){const figure=el('figure','exhibit-video');const video=el('video');video.dataset.src=item.video.src;video.dataset.poster=item.video.poster;video.controls=true;video.muted=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-label',t(item.video.caption_key));figure.append(video);const caption=el('figcaption');caption.append(el('span','',t(item.video.caption_key)),document.createTextNode(' · '));const source=el('a','',`${t('cabinet.videoSource')}：${item.video.source_title} ↗`);source.href=item.video.source_url;source.target='_blank';source.rel='noopener noreferrer';caption.append(source,el('small','',t(item.video.usage_key)));figure.append(caption);visual.append(figure)}
    if(item.gallery_mode==='carousel'&&item.images.length>1)visual.append(renderCarousel(item));else{const gallery=el('div',item.images.length>1?'exhibit-gallery':'exhibit-single');item.images.forEach((source,imageIndex)=>{const image=el('img');image.src=source;image.alt=imageIndex?`${t(item.alt_key)} — ${imageIndex+1}`:t(item.alt_key);image.width=700;image.height=700;image.loading='lazy';image.decoding='async';gallery.append(image)});visual.append(gallery)}
    const content=el('div','exhibit-copy');const meta=el('div','exhibit-meta');meta.append(el('span','',item.type.replaceAll('-',' ')),el('span','',item.year||t('cabinet.yearPending')));content.append(meta,el('h3','',t(item.name_key)),el('p','exhibit-story',t(item.story_key)));
    const facts=el('dl','exhibit-facts');const partners=item.partner_ids.map(id=>dataset.partners.find(partner=>partner.id===id)?.name).filter(Boolean).join(' × ');facts.append(el('div',''));facts.lastChild.append(el('dt','',t('cabinet.partners')),el('dd','',partners));
    const characterRoles=(item.character_refs||[]).filter(ref=>ref.identification_status==='confirmed'&&ref.role_key).map(ref=>t(ref.role_key));facts.append(el('div',''));facts.lastChild.append(el('dt','',t('cabinet.character')),el('dd','',characterRoles.length?characterRoles.join(' '):t('cabinet.yearPending')));content.append(facts);
    const related=renderNews(item.related_news_ids||[],dataset.news);if(related)content.append(related);article.append(visual,content);root.append(article)
  });
  root.setAttribute('aria-busy','false');
  const activateVideo=video=>{video.poster=video.dataset.poster;video.src=video.dataset.src;delete video.dataset.poster;delete video.dataset.src};const videos=$$('video[data-src]');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;activateVideo(entry.target);observer.unobserve(entry.target)}),{rootMargin:'300px'});videos.forEach(video=>observer.observe(video))}else{videos.forEach(activateVideo)}
}
async function loadLanguage(next,{syncUrl=false}={}){lang=normalizeLang(next);safeSet('skyeblock-language',lang);try{copy=await getJSON(`locales/${lang}.json`)}catch{copy=fallback}applyCopy();if(syncUrl){const url=new URL(location.href);if(lang==='zh-TW')url.searchParams.delete('lang');else url.searchParams.set('lang',lang);history.replaceState(null,'',url)}renderItems()}
async function loadData(){try{const [items,news,projects,partners]=await Promise.all(['data/items.json','data/news.json','data/projects.json','data/partners.json'].map(getJSON));dataset={items,news,projects,partners};renderItems()}catch(error){console.warn('Cabinet data unavailable',error);const root=$('#cabinet-items');root.replaceChildren(el('p','cabinet-error',t('cabinet.loadError')));root.setAttribute('aria-busy','false')}}
function updateSound(){const button=$('#sound');if(!button)return;button.textContent=t(soundBlocked?'soundBlocked':soundEnabled?'soundOn':'soundOff');button.setAttribute('aria-pressed',String(soundEnabled&&!soundBlocked))}
async function setSound(enabled){soundEnabled=enabled;soundBlocked=false;safeSet('skyeblock-sound-enabled',String(enabled));const music=$('#music-audio');music.volume=.38;if(!enabled){music.pause();updateSound();return}try{await music.play()}catch{soundBlocked=true}updateSound()}
$('#language').addEventListener('change',event=>loadLanguage(event.target.value,{syncUrl:true}));
$('#sound').addEventListener('click',()=>setSound(!soundEnabled||soundBlocked));
$('#year').textContent=new Date().getFullYear();
Promise.all([loadLanguage(lang),loadData()]).then(()=>{if(soundEnabled)setSound(true)});
})();
