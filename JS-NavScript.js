// ==UserScript==================================================================================================================================================
// @name        導航捷徑 → *://*/*
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      SHUN
// @description Test Nav Script.
// @run-at      document-start
// @icon        https://raw.githubusercontent.com/pk007sheep/repo/main/images/avatar.mickey.png
// ==/UserScript=================================================================================================================================================

(function navScript(){
  // 嚴格模式
  'use strict';
  // 指派 TrustedHTML,使用受信任類型 API 建立策略
  if ( window.trustedTypes && window.trustedTypes.createPolicy ) { window.trustedTypes.createPolicy('default',{ createHTML:(string,sink) => string }) };

// 設定 Style ==================================================================================================================================================

  var navCss = document.createElement('style');
  navCss.setAttribute('type','text/css');
  navCss.innerHTML = window.trustedTypes.defaultPolicy.createHTML( `
/* <style type="text/css"> */
	/* 全局 */
	@media (prefers-color-scheme:dark) { .nav-Html { --fontsmall:13px; --fontwell:15px; --fontbig:16px; --fontbody:"MicrosoftJhengHeiUI",Roboto,-apple-system,BlinkMacSystemFont,Arial,sans-serif } }
	.nav-Html { --fontsmall:13px; --fontwell:15px; --fontbig:16px; --fontbody:"MicrosoftJhengHeiUI",Roboto,-apple-system,BlinkMacSystemFont,Arial,sans-serif }
	.nav-Html { z-index:9999; display:flex; align-items:center; justify-content:center; opacity:0.98; top:0; right:0; bottom:0; left:0; max-width:100%; cursor:crosshair; user-select:none; text-size-adjust:100%; -webkit-tap-highlight-color:rgba(0,0,0,0); -webkit-font-smoothing:antialiased !important; accent-color:#FF00FF }
  .nav-Html,.nav-Html :is(*,*:before,*:after) { box-sizing:border-box; position:relative; margin:0; padding:0; background:transparent; border:none; outline:none;
              color:White; font-size:var(--fontwell); font-weight:normal; font-variant:normal; font-family:var(--fontbody); text-decoration:none;
              text-align:start; text-indent:0; line-height:1.5; letter-spacing:normal; white-space:pre; vertical-align:middle;
              transform:none; transition:all 0.2s ease-out allow-discrete; overflow:visible; &::-webkit-scrollbar { width:10px } &::-webkit-scrollbar-thumb { background-color:rgb(0 0 0/0.3); border-radius:5px } }

/* 全局字體 */
  .nav-Html :is(tab,topic,note,msg,series,type,tips) { padding-left:0.5em }
  .nav-Html :is(tab,topic,series,ep,type) 	 { font-size:var(--fontsmall) }
  .nav-Html :is(msg,note,tips) 							 { font-variant:all-small-caps }
  .nav-Html :is(p,msg,ep,type,note,tips,.ep) { font-weight:bold }
  .nav-Html :is(topic,series,type,note) 		 { text-shadow:0   0   transparent,0    0   transparent }
  .nav-Html :is() 	 												 { text-shadow:1px 1px Red,-1px -1px Red }
  .nav-Html :is(.ep) 												 { text-shadow:1px 1px DodgerBlue,-1px -1px DodgerBlue }
  .nav-Html p      { color:White; font-size:var(--fontbig); height:3em; line-height:3em; padding-left:2em; letter-spacing:5px; animation:text-Shadow 2s infinite alternate; text-shadow:2px 2px 10px rgba(255,0,0,0.8),2px -2px 10px rgba(0,255,0,0.8),-2px 2px 10px rgba(0,0,255,0.8),-2px -2px 10px rgba(255,0,255,0.8) }
  .nav-Html a      {  }
  .nav-Html button {  }
  .nav-Html tab    { color:LightGray }
  .nav-Html topic  { color:SlateBlue }
  .nav-Html series { color:LightSkyBlue }
  .nav-Html note   { color:MediumOrchid }
  .nav-Html msg    { color:White;        margin:auto 0; text-shadow:2px 2px DodgerBlue;  }
  .nav-Html tips   { color:White;        margin:auto 0; text-shadow:2px 2px Red }
  .nav-Html type   { color:RoyalBlue;    opacity:0 }
  .nav-Html ep     { color:Cyan;         position:absolute; bottom:0; left:0; width:3em; text-align:end; opacity:0 }
  .nav-Html :is(a,input):is(:link,:visited,:focus) { color:White;   text-decoration:none; outline:none; appearance:none }
  .nav-Html :is(a,span):is(:hover,:active)         { color:Crimson; text-decoration:none; cursor:pointer; text-shadow:0 0 transparent; animation:text-Shine-Crimson 1s infinite alternate }
  :is(.pop-AnimeCH,.pop-AnimeJP) a:hover>:is(type,ep) { opacity:1 }

/* 分隔線 */
  .nav-Html hr  { width:100%; margin:0.25em 0; height:1px; background:transparent; border:0 }
  .nav-Html .hrWrap					{ margin:0.5em 0;  height:1px; background:transparent; border:0 }
  .nav-Html .hrPurple     	{ margin:0.5em 0;  height:1px; background:linear-gradient(to right,transparent 0%,Fuchsia   20%,Fuchsia   70%,transparent 100%) }
  .nav-Html .hrBlue					{ margin:0.5em 0;  height:1px; background:linear-gradient(to right,transparent 0%,SteelBlue 20%,SteelBlue 70%,transparent 100%) }

/* 點擊事件 */
  .btn-Nav    { position:fixed; top:0; left:0; width:1em; height:1em }
  .btn-Extra  { position:fixed; bottom:0; left:0; width:1em; height:1em; cursor:no-drop }
  .btn-Clock  { position:fixed; top:0.5em; display:block; font-size:20px; text-shadow:1px 1px BlueViolet,-1px -1px BlueViolet; text-align:center; font-weight:bold }
  .btn-Delete { position:absolute; top:-1em; right:0 }
  .btn-Delete.deleting { display:none; opacity:0; height:0; transform:translate(25vw) }

/* 佈局 nav-Body */
  .nav-Body { display:flex; flex-flow:column nowrap; align-items:stretch; justify-content:flex-start; position:fixed; padding-top:1.5em; top:0; bottom:0; left:0;
              width:12em; background-image:linear-gradient(135deg,#231557 0%,#44107A 29%,#FF1361 67%,#FFF800 100%); box-shadow:0 0 1em 1em rgba(0,0,0,0.5);
              transform:translate(-50%) scaleX(0) }
  .nav-Body.switch { transform:translate(0) scaleX(1) }
  .nav-Body>hr { flex:0 0 1px }

/* 佈局 nav-Label */
  .nav-Body .nav-Label,.nav-Music { flex:0 0 2.5em; align-content:center }
  .nav-Body .nav-Label { padding-left:2em }
  .nav-Body .nav-Music { padding-left:3em }
  .nav-Body input[type=radio] { position:absolute; height:0; appearance:none }
  .nav-Body label:has(input[type=radio]):after         { content:'+'; position:absolute; right:0.5em; font-weight:900; filter:brightness(0.5) }
  .nav-Body label:has(input[type=radio]:checked):after { content:'–' }
  .nav-Body label:has(input[type=radio]:checked) { text-shadow:1px 1px DodgerBlue,-1px -1px DodgerBlue; backdrop-filter:brightness(0.5); animation:text-Shine-DodgerBlue 1s infinite alternate }
  .nav-Body label:has(input[type=radio]):is(:hover,:active) { color:Crimson; text-decoration:none; cursor:pointer; text-shadow:0 0 transparent }

/* 佈局 nav-Menu */
  .nav-Menu { display:flex; flex-flow:column nowrap; align-items:stretch; justify-content:flex-start; width:100%; backdrop-filter:brightness(0.5); overflow:hidden }
  .nav-Menu>button { flex:0 0 2.5em; align-content:center; padding-left:3em }
  .nav-Menu>hr { flex:0 0 1px }

/* 佈局 nav-List */
  .nav-List { display:flex; flex-flow:column nowrap; align-items:stretch; justify-content:flex-start; width:100%; backdrop-filter:brightness(0.5); overflow:hidden }
  .nav-List>button { flex:0 0 2.5em; align-content:center; display:none }

/* 佈局 nav-playlist,findVideo-Box,nav-Remote */
  .nav-Menu>.btn-btnEffect { display:flex; flex-flow:row wrap; justify-content:space-evenly; gap:0.5em 0 }
  .nav-Menu>.btn-btnEffect>button { width:93% }
  .nav-playlist a	{ width:100% }
  .nav-Remote a		{ width:100% }
  .nav-playlist>button	{ flex:0 0 93% }
  .nav-Remote>button 		{ flex:0 0 45% }
  .findVideo-Box>button { flex:0 0 45% }
  .findVideo-Bar { flex:0 0 100%; padding:0.5em 0; width:100%; text-align:center; border:0; background-color:rgb(0 0 0/0.2); caret-color:Fuchsia; appearance:none }

/* 佈局 pop-Box */
  .pop-Box         { display:flex; flex-flow:row nowrap;    gap:0; position:fixed; margin:auto 0; padding:1em 0 1em 1em; left:13em; max-height:calc(100% - 2em); overflow:auto; border-radius:0.5em; background:linear-gradient(rgba(255,255,255,0.9),rgba(0,0,0,0.9)); backdrop-filter:blur(2px); box-shadow:0 0 10px 0.5em rgba(0,0,0,0.5); &:popover-open { transform:scaleY(1); opacity:1 }; transform:scaleY(0); opacity:0 }
  .pop-rowBox      { display:flex; flex-flow:row nowrap;    gap:1em }
  .pop-colBox      { display:flex; flex-flow:column nowrap; gap:0 }
  .pop-Box section { display:flex; flex-flow:column wrap }
  .pop-Box p    { width:100% }
  .pop-rowBox :is(a,button) { width:100% }
  .pop-Box :is(a,button) { padding:0 2em 0 3em }
	.pop-tempBox { left:60%; }

/* btn => btnEffect 按鈕效果 */
  .btn-btnEffect>button { border:0; border-radius:0.5em; background:#111; cursor:pointer }
  .btn-btnEffect>button span { display:block; padding-top:1px; width:100%; font-size:var(--fontsmall); text-align:center; border:1px solid #000; border-radius:0.5em; background:#222; transform:translateY(-0.3em); transition:transform 0.1s ease-out }
  .btn-btnEffect>button:hover span { transform:translateY(-0.5em) }
  .btn-btnEffect>button:active span { transform:translateY(0) }

/* :hover => text-Shine 懸停 文字發光 *
  .hover-text-Shine>button:hover { animation:hover-text-Shine 1s infinite alternate; text-shadow:0 0 0 White }
  @keyframes hover-text-Shine { from { text-shadow:0 0 0 White } to { text-shadow:0 0 0.5em White } }

/* :hover => text-Shadow 懸停 文字陰影 *
  .hover-text-Shadow>button:hover { animation:hover-text-Shadow 1s infinite alternate;
    text-shadow:0 0 rgba(0,0,0,1) }
  @keyframes hover-text-Shadow { from { text-shadow:0 0 rgba(0,0,0,1) }
                                   to { text-shadow:1em 1em 5px rgba(0,0,0,0.5) } }

/* :hover => box-Diffuse 懸停 框架擴散 *
  .hover-box-Diffuse>button:hover { animation:hover-box-Diffuse 1s infinite alternate;
    box-shadow:inset 0 0 0 2em transparent,0 0 1em 1em transparent }
  @keyframes hover-box-Diffuse { from { box-shadow:inset 0 0 0 2em transparent,0 0 1em 1em transparent }
                                   to { box-shadow:inset 0 0 0 2em #ccc,0 0 1em 1em #ccc } }

/* :hover => border-Radius 懸停 邊框包圍 *
  .hover-border-Radius>button { --borderColor:#03A9F3; position:relative; border:1px solid var(--borderColor);
    &::before,&::after { content:""; position:absolute;
      width:20px; height:20px; transition:.3s ease-in-out }
    &::before { top:-5px; left:-5px;
      border-top:1px solid var(--borderColor); border-left:1px solid var(--borderColor) }
    &::after  { right:-5px; bottom:-5px;
      border-bottom:1px solid var(--borderColor); border-right:1px solid var(--borderColor) }
    &:hover::before,&:hover::after { width:calc(100% + 9px); height:calc(100% + 9px) } }

/* :hover => bg-Bubble 懸停 背景泡泡 *
  .hover-bg-Bubble>button { --c:Crimson; z-index:1; position:relative; color:var(--c);
    border:1px solid var(--c); border-radius:0.5em; overflow:hidden; transition:0.5s }
  .hover-bg-Bubble>button>span { z-index:-1; position:absolute; left:calc((var(--n) - 1) * 25%);
    width:25%; height:100%; border-radius:50%; background-color:var(--c);
    transform:translateY(150%); transition:0.5s; transition-delay:calc((var(--n) - 1) * 0.1s) }
  .hover-bg-Bubble>button>span:nth-child(1) { --n:1 }
  .hover-bg-Bubble>button>span:nth-child(2) { --n:2 }
  .hover-bg-Bubble>button>span:nth-child(3) { --n:3 }
  .hover-bg-Bubble>button>span:nth-child(4) { --n:4 }
  .hover-bg-Bubble>button:hover { color:black }
  .hover-bg-Bubble>button:hover>span { transform:translateY(0) scale(2) }

/* text => text-Shine 文字發光 */
  .text-Shine { animation:text-Shine-White 1s infinite alternate; text-shadow:0 0 0 White }
  @keyframes text-Shine-White { from { text-shadow:0 0 0 White } to { text-shadow:1px 1px 10px White,-1px -1px 10px White } }
  @keyframes text-Shine-Crimson { from { text-shadow:0 0 0 Crimson } to { text-shadow:1px 1px 5px Crimson,-1px -1px 5px Crimson } }
  @keyframes text-Shine-DodgerBlue { from { text-shadow:0 0 0 DodgerBlue } to { text-shadow:1px 1px 5px DodgerBlue,-1px -1px 5px DodgerBlue } }

/* text => text-Shadow 文字陰影 */
  .text-Shadow { animation:text-Shadow 2s infinite alternate; text-shadow:2px 2px 10px rgba(255,0,0,0.8),2px -2px 10px rgba(0,255,0,0.8),-2px 2px 10px rgba(0,0,255,0.8),-2px -2px 10px rgba(255,0,255,0.8) }
	@keyframes text-Shadow { to { filter:hue-rotate(360deg) } }

/* text => text-Gradient 文字漸層 *
  .text-Gradient { color:transparent;
		background-image:linear-gradient(135deg,#00F 0%,#F0F 50%,#F00 100%);
		background-clip:text }

/* text => text-3D 文字3D *
  .text-3D { color:#b393d3;	font-size:1em; text-transform:uppercase;
    text-shadow:1px 1px 0px #957dad,
                 1px 2px 0px #957dad,
                 1px 3px 0px #957dad,
                 1px 4px 0px #957dad,
                 1px 5px 0px #957dad,
                 1px 6px 0px #957dad,
                 1px 4px 2px rgba(16,16,16,0.5),
                 1px 6px 4px rgba(16,16,16,0.4),
                 1px 8px 10px rgba(16,16,16,0.3),
                 1px 10px 20px rgba(16,16,16,0.2) }

/* text => text-Gradient-Anime 文字漸變 *
  .text-Gradient-Anime { color:transparent; background-image:linear-gradient(90deg,#F0F 0%,#F00 25%,#F0F 50%,#00F 75%,#F0F 100%);
	  background-clip:text; background-size:600%; background-position:-600%;
	  animation:text-Gradient-Anime 60s ease-in-out infinite reverse }
  @keyframes text-Gradient-Anime { to { background-position:600% } }

/* text => text-typing-EN-Anime 文字英文打字機 *
  .text-typing-EN-Anime { border-right:5px solid #000; white-space:nowrap; overflow:hidden;
    animation:text-typing-Cursor-Anime 1s infinite step-end,text-typing-EN-Anime 10s infinite steps(14) }
  @keyframes text-typing-Cursor-Anime { 0%,100% { border-color:transparent } 50% { border-color:#000 } }
  @keyframes text-typing-EN-Anime { 0%{ width:0 }
                                    30%{ width:14ch }
                                   80%{ width:14ch }
                                   90%{ width:0 }
                                  100%{ width:0 } }

/* text => text-typing-CH-Anime 文字中文打字機 *
	.text-typing-CH-Anime { border-right:5px solid #000; white-space:nowrap; overflow:hidden;
    animation:text-typing-Cursor-Anime 1s infinite step-end,text-typing-CH-Anime 10s infinite steps(7) }
  @keyframes text-typing-Cursor-Anime { 0%,100% { border-color:transparent } 50% { border-color:#000 } }
  @keyframes text-typing-CH-Anime { 0%{ width:0 }
                                   30%{ width:14ch }
                                   80%{ width:14ch }
                                   90%{ width:0 }
                                  100%{ width:0 } }

/* border => ClipPath-Anime 邊框環繞 *
  .border-ClipPath-Anime>button { position:relative;	border:2.5px solid #FF00FF;
    &::before,&::after { content:""; position:absolute; top:-5px; left:-5px; right:-5px; bottom:-5px;
      border:1.25px solid #FF00FF; border-radius:5px; transition:all 0.2s;
      animation:border-ClipPath-Anime 3s infinite linear }
    &::after { animation:border-ClipPath-Anime 3s infinite -1.5s linear } }
  @keyframes border-ClipPath-Anime { 0%,100% { clip-path:inset(0 0 98% 0) }
                                         25% { clip-path:inset(0 98% 0 0) }
                                         50% { clip-path:inset(98% 0 0 0) }
                                         75% { clip-path:inset(0 0 0 98%) } }

/* border => Gradient-Anime 邊框漸變 *
  .border-Gradient-Anime>button { --borderWidth:2px; position:relative;
    border-radius:var(--borderWidth); background:#111 }
  .border-Gradient-Anime>button:after { content:''; z-index:-1; position:absolute;
    top:calc(-1 * var(--borderWidth)); left:calc(-1 * var(--borderWidth));
    height:calc(100% + var(--borderWidth) * 2); width:calc(100% + var(--borderWidth) * 2);
    background:linear-gradient(45deg,#f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82);
    background-size:300% 300%; border-radius:calc(2 * var(--borderWidth));
    animation:border-Gradient-Anime 3s ease alternate infinite }
	@keyframes border-Gradient-Anime {	0% { background-position:0% 50% }	50% { background-position:100% 50% } 100% { background-position:0% 50%;	} }

/* background => Hue-Rotate-Anime 背景漸變 *
  .bg-HueRotate-Anime>button {
  	background:linear-gradient(limegreen,transparent),linear-gradient(90deg,skyblue,transparent),linear-gradient(-90deg,coral,transparent);
	  background-blend-mode:screen; animation:bg-HueRotate-Anime 5s infinite alternate linear }
	@keyframes bg-HueRotate-Anime { 100% { filter:hue-rotate(360deg) } }

/* background => Gradient-Anime 背景漸變 *
  .bg-Gradient-Anime>button {
    background:linear-gradient(#4CAF50,#ff9800); animation:bg-Gradient-Anime 3s infinite }
	@keyframes bg-Gradient-Anime { 0% { filter:hue-rotate(0) } 100% { filter:hue-rotate(360deg) } }

/* background => Gradient-8color-Anime 背景漸變 *
  .bg-Gradient-8color-Anime>button { z-index:-1;  position:relative;
    background:linear-gradient(45deg,#f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82);
    animation:bg-Gradient-8Color-Anime 3s ease alternate infinite; background-size:300% 300% }
	@keyframes bg-Gradient-8Colo-Animer {
  	0% { background-position:0% 50% }
  	50% { background-position:100% 50% }
  	100% { background-position:0% 50%;	} }


*/
  `);

// 設定 快捷欄 ===================================================================================================================================================

  var navHtml = document.createElement('span');
  navHtml.classList.add('nav-Html');
  navHtml.setAttribute('lang','zh-Hant-TW');
  navHtml.innerHTML = window.trustedTypes.defaultPolicy.createHTML( `
<span class="btn-Nav"></span>
<span class="btn-Extra" popovertarget="pop-Extra"></span>
<span class="btn-Clock"></span>
<nav class="nav-Body">
  <button class="nav-Label" type="button"><a href="https://translate.google.com/"><span>Google 翻譯</span></a></button>
  <label class="nav-Label">網路工具<input type="radio" name="nav-Label" /></label>
	<menu class="nav-Menu">
	  <button type="button" popovertarget="pop-Cloud"><span>雲端修圖</span></button>
		<button type="button" popovertarget="pop-Assembler"><span>軟體編譯</span></button>
		<button type="button" popovertarget="pop-WebDev"><span>網頁開發</span></button>
		<button type="button" popovertarget="pop-Unlock"><span>iOS 修改</span></button>
	</menu>
  <hr class="hrPurple"/>
  <label class="nav-Label">休閒娛樂<input type="radio" name="nav-Label" /></label>
  <menu class="nav-Menu">
    <button type="button"><a href="https://h5.xin-stars.com/"><span>星城<tips>Web館</tips></span></a></button>
    <button type="button"><a href="https://tw.piliapp.com/random/coin/"><span>擲硬幣<tips>正反面</tips></span></a></button>
    <button type="button"><a href="https://tw.piliapp.com/random/lots/"><span>抽籤程式</span></a></button>
    <hr class="hrBlue"/>
    <button type="button"><a href="https://webatm.post.gov.tw/"><span>郵局<tips>WebATM</tips></span></a></button>
    <button type="button"><a href="https://eatm.tcb-bank.com.tw/neatm"><span>合作金庫<tips>eATM</tips></span></a></button>
  </menu>
  <label class="nav-Label">音樂歌單<input type="radio" name="nav-Label" /></label>
	<menu class="nav-Menu">
    <label class="nav-Music">流行音樂<tips>POP</tips><input type="radio" name="nav-Music" /></label>
    <menu class="nav-List btn-btnEffect nav-playlist">
			<hr/>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLmf_U4osdaTIXrxJ3sI9hU36OzIfUvdLN"><span>華語<msg>SHUN</msg></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLmf_U4osdaTICELkUv_Zgf4ADszEpSwo1"><span>日韓<msg>SHUN</msg></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLmf_U4osdaTIKH3ewthF0xVZ-pJhi-V4V"><span>歐美<msg>SHUN</msg></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLmf_U4osdaTLJ1XQ5EjpjkidsqsXoPjA7"><span>經典<msg>SHUN</msg></span></a></button>
      <button type="button"><a href="https://www.youtube.com/@chinesemusic2024/streams"><span>小小音樂花園<note>LIVE</note></span></a></button>
      <button type="button"><a href="https://www.youtube.com/@LiveMusicRadio/streams"><span>Radio Hits<note>LIVE</note></span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=tr77RbnfYIU"><span>avex J-POP<note>LIVE</note></span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=w0rhmlE_8-s"><span>KozyPop K-POP<note>LIVE</note></span></a></button>
			<hr/>
    </menu>
    <label class="nav-Music">背景音樂<tips>BGM</tips><input type="radio" name="nav-Music" /></label>
    <menu class="nav-List btn-btnEffect nav-playlist">
			<hr/>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLmf_U4osdaTIG1t24rh0-Zo8FO7vbqJd7"><span>Rainy BGM<msg>SHUN</msg></span></a></button>
      <button type="button"><a href="https://www.youtube.com/@LofiGirl/streams"><span>Lofi Girl<note>LIVE</note></span></a></button>
      <button type="button"><a href="https://www.youtube.com/@OCBRelaxMusic/streams"><span>OCB Relax<note>LIVE</note></span></a></button>
      <button type="button"><a href="https://www.youtube.com/@cafemusicbgmchannel/streams"><span>Cafe BGM<note>LIVE</note></span></a></button>
      <button type="button"><a href="https://www.youtube.com/@j-popmusicbgmchannel/streams"><span>J-POP BGM<note>LIVE</note></span></a></button>
			<hr/>
    </menu>
    <label class="nav-Music">抖抖抖音<tips>Remix</tips><input type="radio" name="nav-Music" /></label>
    <menu class="nav-List btn-btnEffect nav-playlist">
			<hr/>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLmf_U4osdaTKRORipODbVv1Zj-Ujju-8D"><span>抖音<msg>SHUN</msg></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLmf_U4osdaTIG1t24rh0-Zo8FO7vbqJd7"><span>DJ Live<msg>SHUN</msg></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLhqe7lTFb1aygQWbAJb1NjUX9gYAXRvJv"><span>Car Drift<topic>Bass</topic></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLhqe7lTFb1axeLPZnYq8QkddMBaZjaaYJ"><span>Psy Bounce<topic>Bass</topic></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLhqe7lTFb1axxTwOgZYYrNVmf8DdoXrzw"><span>Night Out Party<topic>Bass</topic></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PLI1EqADPdmAr4xKIyoqE5-BGLbXUup0Kj"><span>Reverse Bass<topic>EDM</topic></span></a></button>
      <button type="button"><a href="https://www.youtube.com/playlist?list=PL3zerhScqpx1jYqwahsKBXe_O7hOpTQGd"><span>Amped Music<topic>AMPED</topic></span></a></button>
      <button type="button"><a href="https://www.youtube.com/@knightedmmusic/streams"><span>Remix<topic>Knight EDM<note>LIVE</note></topic></span></a></button>
			<hr/>
    </menu>
	</menu>
  <label class="nav-Label">影劇動畫<input type="radio" name="nav-Label" /></label>
  <menu class="nav-Menu">
    <button type="button" popovertarget="pop-Drama"><span>電影劇集</span></button>
    <button type="button" popovertarget="pop-AnimeCH"><span>國語動畫</span></button>
    <button type="button" popovertarget="pop-AnimeJP"><span>日語動畫</span></button>
    <hr class="hrBlue"/>
    <hr/>
    <section class="btn-btnEffect findVideo-Box">
      <input class="findVideo-Bar" type="search" placeholder="影片搜尋欄" autofocus/>
      <hr/>
      <button type="button"><span alt="https://www.youtube.com/results?search_query=">YouTube</span></button>
      <button type="button"><span alt="https://search.bilibili.com/all?keyword=">B站 bili</span></button>
      <button type="button"><span alt="https://bowang.su/search.html?wd=">BoWang</span></button>
      <button type="button"><span alt="https://myself-bbs.com/search.php?mod=forum&orderby=lastpost&ascdesc=desc&searchsubmit=yes&srchtxt=">MySelf</span></button>
      <button type="button"><span alt="https://gimy.ai/search/-------------.html?wd=">Gimy劇迷</span></button>
      <button type="button"><span alt="https://anime1.me/?s=">Anime1</span></button>
      <button type="button"><span alt="https://www.duboku.tv/vodsearch/-------------.html?wd=">獨播庫</span></button>
      <button type="button"><span alt="https://www.xgcartoon.com/search?q=">西瓜卡通</span></button>
      <button type="button"><span alt="https://www.cnys.tv/vodsearch.html?wd=">CN影院</span></button>
      <button type="button"><span alt="https://yhdm.one/search?q=">櫻花動漫</span></button>
      <hr/>
    </section>
  </menu>
  <label class="nav-Label">電視頻道<input type="radio" name="nav-Label" /></label>
  <menu class="nav-Menu">
    <section class="btn-btnEffect nav-Remote">
			<hr/>
      <button type="button"><a href="https://www.youtube.com/watch?v=ylYJSBUgaMA"><span>民視新聞</span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=vr3XyVCR4T0"><span>中天新聞</span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=quwqlazU-c8"><span>公視新聞</span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=MV9mI0GChwo"><span>三立新聞</span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=6IquAgfvYmc"><span>寰宇新聞</span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=V1p33hqPrUk"><span>東森新聞</span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=5n0y6b0Q25o"><span>鏡新聞</span></a></button>
      <button type="button"><a href="https://www.youtube.com/watch?v=m_dhMSvUCIc"><span>TVBS新聞</span></a></button>
      <hr class="hrBlue"/>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii133"><span>臺灣啟示錄</span></a></button>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii134"><span>法眼黑與白</span></a></button>
      <hr class="hrBlue"/>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii32"><span>東森娛樂台</span></a></button>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii130"><span>綜藝玩很大</span></a></button>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii135"><span>天才衝衝衝</span></a></button>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii143"><span>11點熱吵店</span></a></button>
    </section>
    <section class="btn-btnEffect">
			<hr/>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii31"><span>食尚玩家</span></a></button>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii140"><span>食尚玩家<topic>瘋狂總部　</topic></span></a></button>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii137"><span>食尚玩家<topic>魚肉鄉民　</topic></span></a></button>
      <button type="button"><a href="https://www.ofiii.com/channel/watch/ofiii128"><span>食尚玩家<topic>2天1夜GO</topic></span></a></button>
			<hr/>
		</section>
  </menu>
</nav>

<div id="pop-Cloud" class="pop-Box pop-Cloud" popover>
  <article class="pop-rowBox">
    <section>
      <p>雲端空間</p>
      <a href="https://mega.io/zh-hant/storage">MEGA<topic>雲端空間</topic><note>50GB</note></a>
      <a href="https://archive.org/">Internet Archive<topic>網路檔案館</topic></a>
		  <hr class="hrPurple"/>
      <p>影片空間</p>
      <a href="https://sendvid.com/">Sendvid<topic>3GB｜90分鐘</topic><note>90天無觀看即刪</note></a>
      <a href="https://streamable.com/">Streamble<topic>250MB｜10分鐘</topic><note>90天</note></a>
      <a href="https://lurl.cc/video.html">LURL縮影片<topic>100MB</topic><note>永久、禁下載</note></a>
		  <hr class="hrPurple"/>
      <p>圖片空間</p>
      <a href="https://im.ge/shun/?lang=zh-TW">IM.GE<topic>100MB</topic></a>
      <a href="https://imgur.com/user/pk007sheep">Imgur<topic>20MB</topic><note>＞5MB壓縮</note></a>
      <a href="https://imgbox.com/">ImgBox<topic>10MB</topic></a>
      <a href="https://cubeupload.com/">Cubeupload<topic>5MB</topic></a>
		  <hr class="hrPurple"/>
      <p>傳檔空間</p>
      <a href="https://fromsmash.com/">Smash<topic>2GB</topic><note>7天</note></a>
      <a href="https://file.coffee/">FileCoffee<topic>30MB</topic><note>永久（限文字圖影）</note></a>
      <a href="https://www.swisstransfer.com/en-us">SwissTransfer<topic>50GB</topic><note>30天</note></a>
    </section>
    <section>
      <p>圖像編輯</p>
      <a href="https://pixlr.com/tw/remove-background/">PIXLR<topic>去背</topic></a>
      <a href="https://pixlr.com/tw/editor/">PIXLR<topic>編輯器</topic></a>
      <a href="https://www.toolfk.com/zh-tw/tools/online-photoshop.html">Photoshop<topic>編輯器</topic></a>
      <a href="https://www.designkit.com/editor/">美圖設計室<topic>編輯器</topic></a>
      <a href="https://www.iloveimg.com/zh-tw">iLoveIMG<topic>編輯工具</topic></a>
		  <hr class="hrPurple"/>
      <p>圖影轉檔</p>
      <a href="https://www.aconvert.com/tw/image/">Aconvert<topic>轉換影音圖檔</topic><topic>OCR取字</topic></a>
      <a href="https://www.pngoptimizer.com/">PNG Optimizer<topic>無損壓縮圖檔大小</topic></a>
      <a href="https://www.icoconverter.com/">ICO converter<topic>圖檔轉ICO</topic></a>
      <a href="https://realfavicongenerator.net/">Real Favicon Generator<topic>網站圖示產生器</topic></a>
		  <hr class="hrPurple"/>
      <p>圖影增強</p>
      <a href="https://jpghd.com/tw">JpgHD<topic>圖片無損修復</topic></a>
      <a href="https://bigjpg.com/tw">BigJPG<topic>圖片無損放大</topic></a>
      <a href="https://waifu2x.udp.jp/index.zh-TW.html">Waifu2x<topic>圖片放大降噪</topic></a>
      <a href="https://github.com/Baiyuetribe/paper2gui">Paper to GUI<topic>ＡＩ影像</topic><note>需顯卡</note></a>
      <a href="https://github.com/AaronFeng753/Waifu2x-Extension-GUI">Waifu2x Extension GUI<topic>插幀</topic><note>需顯卡</note></a>
		  <hr class="hrPurple"/>
      <p>圖片識字<tips>OCR</tips></p>
      <a href="https://www.toolfk.com/zh-tw/tools/online-ocr.html">TOOLFK<topic>OCR文字辨識</topic></a>
      <a href="https://www.aconvert.com/tw/document/ocr/">Aconvert<topic>OCR文字辨識</topic></a>
    </section>
  </article>
</div>

<div id="pop-Assembler" class="pop-Box pop-Assembler" popover>
  <article class="pop-rowBox">
    <section>
      <p>媒體下載</p>
      <a href="https://www.pngegg.com/">PNG EGG<topic>圖庫</topic></a>
      <a href="https://anydownloader.com/en/">AnyDownloader</a>
      <a href="https://telegramvideodownloader.net/zh-TW/">Telegram影片下載器</a>
      <p>編譯<tips>Command-Line</tips></p>
			<a href="https://gist.github.com/wellcheng/b95dbd9e041185d3460b1a4cb7b85630">Mac環境<topic>初始化設定</topic></a>
			<a href="https://ss64.com/">SS64<topic>命令列百科</topic></a>
      <a href="https://www.toolfk.com/zh-tw/tools/convert-hexadecimal.html">進製轉換<topic>Base2 ~ Base64</topic></a>
      <a href="https://www.52pojie.cn/thread-582852-1-1.html">吾愛脫殼<topic>脫殼</topic></a>
      <a href="https://down.52pojie.cn/">吾愛脫殼<topic>愛盤</topic></a>
      <a href="https://www.goggleheadedhacker.com/blog/post/6">解包.EXE<topic>脫殼</topic><note>EPS</note></a>
      <a href="https://www.hexacorn.com/blog/2015/01/08/decompiling-compiled-autoit-scripts-64-bit-take-two/">反編譯已編譯的AutoIT腳本<topic>脫殼</topic><note>64-bit</note></a>
      <p>字串<tips>中文化</tips></p>
      <a href="https://zhconvert.org/">繁化姬<topic>簡轉繁</topic><note>台灣化</note></a>
      <a href="https://convert.tw/">繁簡轉換王<topic>簡轉繁</topic></a>
      <a href="https://thunderko.com/c2t/">兩岸資訊用語轉換<topic>簡轉繁</topic><note>AI ChatGPT</note></a>
      <a href="https://opencc.byvoid.com/">開放中文轉換 BYVoid<topic>簡轉繁</topic><note>轉換詞彙、異體字</note></a>
      <a href="https://oyyd.github.io/wasm-opencc/">開放中文轉換 wasm<topic>簡轉繁</topic><note>轉換詞彙、異體字</note></a>
      <a href="https://zfly9.blogspot.com/2018/02/13-simplified-traditional-menu.html">字串轉碼<topic>簡轉繁</topic></a>
      <a href="https://shift0106hulen.com/sisulizer-add-net-sdk-path/#more-179">Sisulize<topic>加入.NET SDK</topic></a>
      <p>系統<tips>優化</tips></p>
      <a href="https://twideem.github.io/pages/bluesky/appendix.html">附錄：小祕訣</a>
    </section>
    <section>
      <p>軟體下載</p>
      <a href="https://www.puresys.net/">Puresys<topic>破解軟體</topic></a>
      <a href="https://www.423down.com/">423Down<topic>破解軟體</topic></a>
      <a href="https://www.jb51.net/softs/">腳本之家<topic>破解軟體</topic></a>
      <a href="https://www.tenlonstudio.com/windows">騰龍工作室<topic>破解軟體、正版軟體</topic></a>
      <a href="https://www.azofreeware.com/">阿榮福利味<topic>免費軟體</topic><note>繁體</note></a>
      <a href="https://zhtwnet.com/category/software-sharing/">中文化天地網<topic>免費軟體</topic><note>繁體</note></a>
      <a href="https://www.softwareok.com/">SoftwareOK<topic>小巧免裝版</topic><note>繁體</note></a>
      <a href="https://apk.tw/forum-984-1.html">APK.TW<topic>破解軟體、系統PE</topic><note>繁體</note></a>
			<button type="button" popovertarget="pop-WuTaFunCat"><span>屋塔房小貓的學習</span><topic>破解軟體</topic><note>繁體</note></button>
      <p>開機USB<tips>WinPE</tips></p>
			<a href="https://files.fm/u/cdrvgmch2#/list/">Ratiborus<topic>微軟啟用</topic><note>俄國</note></a>
      <a href="http://123.60.172.133:5244/">AList<topic>OS、PE、IT天空</topic><note>網盤</note></a>
      <a href="https://katfile.com/users/Ken7121">Ken7121<topic>OS、PE</topic><note>網盤</note></a>
      <a href="http://bbs.wuyou.net/forum.php">無憂啟動<topic>OS、PE、USB</topic></a>
			<button type="button" popovertarget="pop-WinPE" style="filter:brightness(0.5)"><span>暫存<topic>WinPE</topic></span></button>
      <a href="http://bbs.wuyou.net/forum.php?mod=viewthread&tid=425765&extra=">Win10PE<topic>22H2</topic><note>2024-09-09</note></a>
      <a href="https://www.azofreeware.com/search/label/1.1%20%E7%B3%BB%E7%B5%B1%E6%AA%A2%E6%B8%AC">阿榮福利味<topic>系統檢測</topic></a>
      <a href="https://www.azofreeware.com/search/label/1.2%20%E5%84%AA%E5%8C%96%E8%AA%BF%E6%A0%A1">阿榮福利味<topic>優化調校</topic></a>
      <a href="https://www.azofreeware.com/search/label/1.3%20%E7%AE%A1%E7%90%86%E6%93%8D%E4%BD%9C">阿榮福利味<topic>管理操作</topic></a>
      <a href="https://share.feijipan.com/s/dpAKE65d">綠茶吧<topic>PC工具箱</topic><note>2024.5.20</note></a>
      <a href="https://www.angel-pe.cn/gxhgatspwhkzgjx/">天使PE<topic>維護擴展工具箱</topic><note>2024.6.13</note></a>
      <a href="https://share.feijipan.com/s/jJBE7YKg">玩酷之家<topic>啟動隨身碟製作工具 10.0</topic><note>2024.11.18</note></a>
      <a href="https://winpemaker.ccpe.net/download-html">WinpeMaker<topic>鬥魚PE生成器</topic><note>2022.10.16</note></a>
      <a href="https://www.angel-pe.cn/uppdzzgj2019xzahyfqzsrfq/">U盤啟動製作工具<topic>2.0.1.9 三分區雙啟</topic><note>2022.04.17</note></a>
      <a href="https://www.angel-pe.cn/usbox7-0/">USBOX 7.0<topic>天使PE貼文</topic><note>2022.05.30</note><note>繁體</note></a>
      <a href="https://cowtransfer.com/s/de23451c948544">USBOX 7.0<topic>奶牛快傳</topic><note>2022.05.30</note><note>繁體</note></a>
      <a href="https://pan.baidu.com/share/init?surl=7Xk5NDIIOJyOYzTUj1zcPw&pwd=cys6">USBOX 7.0<topic>百度網盤</topic><note>2022.05.30</note><note>繁體</note></a>
      <a href="https://www.terabox.com/chinese/sharing/link?surl=4ebMKi3qXiT-BYPrx33R3w">USBOX 7.0<topic>TeraBox</topic><note>2022.06.05</note><note>繁體</note></a>
    </section>
  </article>
</div>

<div id="pop-WuTaFunCat" class="pop-Box pop-tempBox" popover>
	<article class="pop-rowBox">
		<section>
			<a href="https://wutafuncat.blogspot.com/">屋塔房小貓的學習</a>
			<hr class="hrPurple"/>
			<a href="https://wutafuncat.blogspot.com/2023/10/aida64-extreme-v6926618-final.html">AIDA64 Extreme<topic>v6.92.6618 Final</topic><note>系統、硬體檢測</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/aiseesoft-video-enhancer-v9260-ai.html">Aiseesoft Video Enhancer<topic>v9.2.60</topic><note>AI 影片增強軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2024/01/ccleaner-professional-v62010897.html">CCleaner Professional<topic>v6.20.10897</topic><note>硬碟清理工具</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/11/cyberlink-photodirector-ultra-2024_0773895917.html">CyberLink PhotoDirector Ultra<topic>2024 15.0.1123.0</topic><note>AI照片編輯軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/faststone-capture-v104.html">FastStone Capture<topic>v10.4</topic><note>螢幕擷取軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/filemenu-tools-v83.html">FileMenu Tools<topic>v8.3</topic><note>增強右鍵選單</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/10/freetube-v0191-youtube.html">FreeTube<topic>v0.19.1</topic><note>Youtube 播放電腦版</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/10/google-chrome-v11705938132.html">Google Chrome<topic>v117.0.5938.132</topic><note>網頁瀏覽器</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/hitpaw-photo-enhancer-v2232-64-bit.html">HitPaw Photo Enhancer<topic>v2.2.3.2</topic><note>照片畫質修復軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/11/hitpaw-video-converter-v3214.html">HitPaw Video Converter<topic>v3.2.1.4</topic><note>影片圖片轉檔軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2024/01/innoextractor-ultra-v731529-inno-setup.html">InnoExtractor Ultra<topic>v7.3.1.529</topic><note>快速提取安裝包</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/iobit-advanced-systemcare-pro-v1710157.html">IObit Advanced SystemCare Pro<topic>v17.1.0.157</topic><note>系統最佳化軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2024/01/iobit-driver-booster-pro-v112046.html">IObit Driver Booster Pro<topic>v11.2.0.46</topic><note>一鍵更新驅動程式</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/iobit-uninstaller-pro-v13205.html">IObit Uninstaller Pro<topic>v13.2.0.5</topic><note>軟體徹底移除程式</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/k-lite-codec-pack-v1800-v1799-update.html">K-Lite Codec Pack<topic>v18.0.0</topic><note>影片媒體編碼解碼器</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/09/mipony-pro-v330.html">MiPony Pro<topic>v3.3.0</topic><note>網路空間下載工具</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/11/picpick-professional-v725.html">PicPick Professional<topic>v7.2.5</topic><note>螢幕擷取、圖片編輯器</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/11/resource-hacker-v526425.html">Resource Hacker<topic>v5.2.7.427</topic><note>軟體資源編譯器和反編譯器</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/torrent-pro-v360-build-46984-bt.html">µTorrent Pro<topic>v3.6.0 Build 46984</topic><note>高效能 BT 軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/06/winrar-622-final-32.html">WinRAR<topic>6.24 Final</topic><note>解壓縮軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/wintoolsnet-premium-v2400.html">WinTools.net Premium<topic>v24.0.0</topic><note>系統優化工具軟體</note></a>
			<a href="https://wutafuncat.blogspot.com/2024/01/winx-videoproc-converter-ai-v63.html">WinX VideoProc Converter AI<topic>v6.3</topic><note>影片轉檔工具並支援影片下載</note></a>
			<a href="https://wutafuncat.blogspot.com/2023/12/winxvideo-ai-v2000-ai.html">WinXvideo AI<topic>v2.0.0.0</topic><note>AI視訊和影像增強軟體</note></a>
		</section>
	</article>
</div>

<div id="pop-WinPE" class="pop-Box pop-tempBox" popover>
	<article class="pop-rowBox">
		<section>
      <a href="https://blog.csdn.net/qq_39819990/article/details/118582475?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-8.control&spm=1001.2101.3001.4242">WinPE加入包</a>
      <a href="https://blog.csdn.net/duopancn/article/details/43678333">WinPE explorer(下)</a>
      <a href="https://www.wingwy.com/archives/2011_03_868.html">WinPE explorer(續)</a>
      <a href="https://proliantaholic.blogspot.com/2017/04/WSIMP3.html">WinPE回應檔案</a>
      <a href="https://newtoypia.blogspot.com/2013/01/grub-gfxboot.html">WinPE改grub</a>
      <a href="https://www.twblogs.net/a/5b7dd4812b717768385416bb">WinPE案例</a>
      <a href="http://taiwin.blogspot.com/2013/07/pe.html">WinPE開機</a>
      <a href="https://www.lizi.tw/pc/7490.html">制作WinPE</a>
      <a href="https://blog.csdn.net/glc22/article/details/69388729/?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-1.base&spm=1001.2101.3001.4242">制作WinPE 0</a>
      <a href="https://www.sysceo.com/Article-article_info-id-961.html">制作WinPE 1</a>
      <a href="https://www.sysceo.com/Article-article_info-id-1144.html">制作WinPE 2</a>
		</section>
	</article>
</div>

<div id="pop-WebDev" class="pop-Box pop-WebDev" popover>
  <article class="pop-rowBox">
    <section>
      <p>空間<tips>Web Site</tips></p>
      <a href="https://github.com/pk007sheep/repo">GitHub<topic>開源代碼倉庫</topic></a>
      <a href="https://pk007sheep.github.io/">GitHub<topic>pk007sheep</topic></a>
      <a href="https://tw.strikingly.com/s#/">Strikingly<topic>架站代管</topic><note>500MB</note></a>
		  <hr class="hrPurple"/>
      <p>CSS</p>
      <a href="https://uiverse.io/elements">UIverse<topic>開源 UI 元素模板</topic></a>
      <a href="https://cssgenerator.pl/">CSS 產生器<topic>陰影、漸變、變形、按鈕、FlexBox</topic></a>
      <a href="https://blog.tarswork.com/post/a-selection-of-cool-css-button-effects">按鈕動畫<topic>模板</topic></a>
      <a href="https://pk007sheep.github.io/cssSelectors.html">選擇器表<topic>Selectors</topic></a>
      <a href="https://www.toolfk.com/zh-tw/tools/format-css.html">格式化工具<topic>校驗、壓縮、加解密</topic></a>
		  <hr class="hrPurple"/>
      <p>HTML</p>
      <a href="https://www.toolfk.com/zh-tw/tools/encdec-transform.html">URL 編解碼<topic>Base64 編解碼、Base64 轉圖片</topic></a>
      <a href="https://www.toolfk.com/zh-tw/tools/format-html.html">格式化工具<topic>轉碼、壓縮、加解密</topic></a>
		  <hr class="hrPurple"/>
      <p>JavaScript</p>
      <a href="https://greasyfork.org/zh-TW">Greasy Fork<topic>腳本分享站</topic></a>
      <a href="https://www.toolfk.com/zh-tw/tools/format-javascript.html">格式化工具<topic>校驗、壓縮、加解密、混淆</topic></a>
		</section>
    <section>
      <p>教程<tips>Tools</tips></p>
      <a href="https://developer.mozilla.org/zh-TW/docs/Web">MDN<topic>網頁技術文件</topic></a>
      <a href="https://www.toolfk.com/zh-tw/">TOOLFK</a>
      <a href="https://www.bejson.com/otherformat/css/">BEJSON</a>
      <a href="https://www.runoob.com/">菜鳥教程</a>
      <a href="https://www.jb51.net/jiaoben/">腳本之家<topic>腳本下載</topic></a>
      <a href="https://toolgg.com/">我的工具箱</a>
		  <hr class="hrPurple"/>
      <p>字體<tips>Web Font</tips></p>
      <a href="https://github.com/be5invis/Sarasa-Gothic">Sarasa Gothic<topic>更紗黑體</topic></a>
      <a href="https://tw.piliapp.com/cool-text/small-caps/">SmallCaps<topic>小型大寫字母</topic></a>
      <a href="https://fontawesome.com">Font Awesome<topic>文字圖示庫</topic></a>
		  <hr class="hrPurple"/>
      <p>顔色<tips>HTML Color</tips></p>
      <a href="https://pk007sheep.github.io/htmlColor.html">HTML 顔色代碼<topic>代碼表</topic></a>
		  <hr class="hrPurple"/>
      <p>代碼測試</p>
      <a href="https://codepen.io/pk007sheep/pen/wBwvJgQ">CodePen<topic>CSS 為主</topic></a>
      <a href="https://jsfiddle.net/">JSFiddle<topic>JavaScript 為主</topic></a>
    </section>
  </article>
</div>

<div id="pop-Unlock" class="pop-Box pop-Unlock" popover>
  <article class="pop-rowBox">
    <section>
      <p>iOS 解鎖<tips>Unlock Tools</tips></p>
      <a href="https://onejailbreak.com/">ONE Jailbreak</a>
      <a href="https://gsmatoztool.com/category/icloud-unlock-tool/">GSM ATOZ TOOL</a>
      <a href="https://www.softwarecrackguru.com/">Software Crack Guru</a>
      <a href="https://www.ikbenabdelouahid.live/">IKBEN ABDELOUAHID</a>
		  <hr class="hrPurple"/>
      <p>iOS FMI 狀態<tips>IMEI Check</tips></p>
      <a href="https://sickw.com/">Sickw</a>
      <a href="https://www.pro-bangla.com/index.php">Skynet</a>
      <a href="https://ifreeicloud.co.uk/free-check">iFreeiCloud</a>
      <a href="http://mobilecheck.000.pe/home.php">Mobile Check</a>
    </section>
    <section>
      <p>iOS 越獄<tips>Jailbreak</tips></p>
      <a href="https://winra1n.net/">WinRa1n<topic>iPhone 5s - X | iOS 12 – 17.0</topic></a>
      <a href="https://ellekit.space/dopamine/">Dopamine<topic>A8 - A16 | iOS 15.0 - 16.6.1*</topic></a>
      <a href="https://github.com/iOS17/Jailbreak">iOS 17 相關</a>
		  <hr class="hrPurple"/>
      <p>iOS 調整<tips>misaka</tips></p>
      <a href="https://github.com/straight-tamago/misaka">misaka<topic>iOS 15.0 - 16.6.1</topic></a>
      <a href="https://github.com/straight-tamago/misakaX">misakaX<topic>iOS 16 - 18.0 / 18.1 beta 4</topic></a>
		  <hr class="hrPurple"/>
      <p>iOS 巨魔<tips>TrollStore</tips></p>
      <a href="https://iexmo.com/trollstore-checker/">TrollStore 適配器<topic>iOS 14.0 - 17.0</topic></a>
      <a href="https://ios.cfw.guide/installing-trollstore/">TrollStore 工具集<topic>iOS 14.0 - 17.0</topic></a>
      <a href="https://github.com/JJTech0130/TrollRestore">TrollRestore<topic>iOS 15.2 - 17.0</topic></a>
      <a href="https://github.com/alfiecg24/TrollInstallerX">TrollInstallerX<topic>iOS 14.0 - 17.0</topic></a>
      <a href="https://github.com/34306/TrollStar">TrollStar<topic>iOS 16.0 - 16.6.1</topic></a>
      <a href="https://ios.cfw.guide/installing-trollstore-trollhelperota/">TrollHelperOTA<topic>iOS 14.0 b2 - 16.0 b3</topic></a>
      <a href="https://dhinakg.github.io/apps.html">TrollInstallerMDC<topic>iOS 15.0 - 16.1.2</topic></a>
    </section>
  </article>
</div>

<div id="pop-Drama" class="pop-Box pop-Drama" popover>
  <article class="pop-rowBox">
    <section>
      <p id="Marvel_Brand">漫威電影<note id="Marvel">⇅</note></p>
      <a href="https://bowang.su/vod/1444.html">鋼鐵人<series>１</series></a>
      <a href="https://bowang.su/vod/6844.html">鋼鐵人<series>２</series></a>
      <a href="https://bowang.su/vod/52290.html">鋼鐵人<series>３</series></a>
      <a href="https://bowang.su/vod/1572.html">蜘蛛人<series>返校日</series></a>
      <a href="https://bowang.su/vod/1537.html">蜘蛛人<series>離家日</series></a>
      <a href="https://bowang.su/vod/58146.html">蜘蛛人<series>無家日</series></a>
      <a href="https://bowang.su/vod/6096.html">奇異博士<series>１</series></a>
      <a href="https://bowang.su/vod/110330.html">奇異博士<series>２</series></a>
      <a href="https://bowang.su/vod/3227.html">美國隊長<series>３：英雄內戰</series></a>
      <a href="https://bowang.su/vod/39504.html">雷神索爾<series>１</series></a>
      <a href="https://bowang.su/vod/4910.html">雷神索爾<series>２：黑暗世界</series></a>
      <a href="https://bowang.su/vod/3885.html">雷神索爾<series>３：諸神黃昏</series></a>
      <a href="https://bowang.su/vod/114713.html">雷神索爾<series>４：愛與雷霆</series></a>
      <a href="https://bowang.su/vod/3192.html">復仇者聯盟<series>１</series></a>
      <a href="https://bowang.su/vod/4909.html">復仇者聯盟<series>２：奧創紀元</series></a>
      <a href="https://bowang.su/vod/3886.html">復仇者聯盟<series>３：無限戰爭</series></a>
      <a href="https://bowang.su/vod/1978.html">復仇者聯盟<series>４：終局之戰</series></a>
      <a href="https://bowang.su/vod/11125.html">Ｘ戰警<series>第一戰</series></a>
      <a href="https://bowang.su/vod/40438.html">Ｘ戰警<series>未來昔日</series></a>
      <a href="https://bowang.su/vod/8022.html">Ｘ戰警<series>天啟</series></a>
      <a href="https://bowang.su/vod/6112.html">Ｘ戰警<series>黑鳳凰</series></a>
      <a href="https://bowang.su/vod/7579.html">蜘蛛人<series>１</series></a>
      <a href="https://bowang.su/vod/34440.html">蜘蛛人<series>２</series></a>
      <a href="https://bowang.su/vod/3864.html">蜘蛛人<series>３</series></a>
    </section>
    <section style="display:none;">
      <p id="Marvel_Timeline">漫威電影<note id="Marvel">⇅</note></p>
      <a href="https://bowang.su/vod/1444.html">鋼鐵人<series>１</series></a>
      <a href="https://bowang.su/vod/6844.html">鋼鐵人<series>２</series></a>
      <a href="https://bowang.su/vod/39504.html">雷神索爾<series>１</series></a>
      <a href="https://bowang.su/vod/3192.html">復仇者聯盟<series>１</series></a>
      <a href="https://bowang.su/vod/52290.html">鋼鐵人<series>３</series></a>
      <a href="https://bowang.su/vod/4910.html">雷神索爾<series>２：黑暗世界</series></a>
      <a href="https://bowang.su/vod/4909.html">復仇者聯盟<series>２：奧創紀元</series></a>
      <a href="https://bowang.su/vod/3227.html">美國隊長<series>３：英雄內戰</series></a>
      <a href="https://bowang.su/vod/1572.html">蜘蛛人<series>返校日</series></a>
      <a href="https://bowang.su/vod/6096.html">奇異博士<series>１</series></a>
      <a href="https://bowang.su/vod/3885.html">雷神索爾<series>３：諸神黃昏</series></a>
      <a href="https://bowang.su/vod/3886.html">復仇者聯盟<series>３：無限戰爭</series></a>
      <a href="https://bowang.su/vod/1978.html">復仇者聯盟<series>４：終局之戰</series></a>
      <a href="https://bowang.su/vod/1537.html">蜘蛛人<series>離家日</series></a>
      <a href="https://bowang.su/vod/58146.html">蜘蛛人<series>無家日</series></a>
      <a href="https://bowang.su/vod/110330.html">奇異博士<series>２</series></a>
      <a href="https://bowang.su/vod/114713.html">雷神索爾<series>４：愛與雷霆</series></a>
      <a href="https://bowang.su/vod/11125.html">Ｘ戰警<series>第一戰</series></a>
      <a href="https://bowang.su/vod/40438.html">Ｘ戰警<series>未來昔日</series></a>
      <a href="https://bowang.su/vod/8022.html">Ｘ戰警<series>天啟</series></a>
      <a href="https://bowang.su/vod/6112.html">Ｘ戰警<series>黑鳳凰</series></a>
      <a href="https://bowang.su/vod/7579.html">蜘蛛人<series>１</series></a>
      <a href="https://bowang.su/vod/34440.html">蜘蛛人<series>２</series></a>
      <a href="https://bowang.su/vod/3864.html">蜘蛛人<series>３</series></a>
    </section>
    <section>
      <p>歐美電影</p>
      <a href="https://bowang.su/vod/8967.html">玩命關頭<series>１</series></a>
      <a href="https://bowang.su/vod/8975.html">玩命關頭<series>２：飆風再起</series></a>
      <a href="https://bowang.su/vod/59265.html">玩命關頭<series>３：東京甩尾</series></a>
      <a href="https://bowang.su/vod/8974.html">玩命關頭<series>４</series></a>
      <a href="https://bowang.su/vod/8719.html">玩命關頭<series>５</series></a>
      <a href="https://bowang.su/vod/8966.html">玩命關頭<series>６</series></a>
      <a href="https://bowang.su/vod/4728.html">玩命關頭<series>７</series></a>
      <a href="https://bowang.su/vod/5339.html">玩命關頭<series>８</series></a>
      <a href="https://bowang.su/vod/1818.html">玩命關頭<series>９</series></a>
      <a href="https://bowang.su/vod/172793.html">玩命關頭<series>１０</series></a>
      <a class="ep" href="javascript:" title="上映日期：2026"><ep>－</ep>玩命關頭<series>１１</series></a>
      <a href="https://bowang.su/vod/5338.html">玩命關頭<series>：特別行動</series></a>
      <a class="ep" href="javascript:" title="上映日期：未定"><ep>－</ep>玩命關頭<series>：特別行動２</series></a>
      <a href="https://bowang.su/vod/40336.html">出神入化<series>１</series></a>
      <a href="https://bowang.su/vod/10371.html">出神入化<series>２</series></a>
      <a href="https://bowang.su/vod/9487.html">全面啟動</a>
      <a href="https://bowang.su/vod/33883.html">決勝21點</a>
      <a href="https://bowang.su/vod/67363.html">怪物奇兵</a>
      <a href="https://bowang.su/vod/9412.html">鐵達尼號</a>
      <a href="https://bowang.su/vod/41332.html">穿著Prada的惡魔</a>
      <p>台灣電影</p>
      <a class="ep" href="https://www.cnys1.tv/voddetai-364440.html" title="一棟位在台北市中心的大廈，曾在30多年內發生超過20多件命案，靈異傳言不斷。\n其中最著名的事件便是在80年代的一場火災，造成300多人受困，最後奪走19條人命。\n而一名女子因感情問題跳樓自殺，卻意外壓死樓下賣燒肉粽的小販的都市傳說的「燒肉粽事件」，也是發生在此大樓。\n20年後，擁有乩身體質的陳妤決定入住這棟兇樓找出火災真相，釐清大樓內的恐怖事件。"><ep>－</ep>鬼天廈</a>
      <a class="ep" href="https://w.duboku.io/voddetail/4714.html" title="全３４集\n「沒有鬼的恐怖故事」極短篇，呈現潛藏恐懼的六大都市樣貌，深入那些習以為常生活中細思極恐的未知人性。"><ep>－</ep>都市懼集</a>
    </section>
    <section>
      <p>韓國劇集</p>
      <a href="https://bowang.su/vod/69280.html" title="全１２集">殺之</a>
      <a href="https://bowang.su/vod/78498.html" title="全２１集">想你</a>
      <a href="https://bowang.su/vod/71906.html" title="全２６集">龍82</a>
      <a href="https://bowang.su/vod/100896.html" title="全１６集">THE K2</a>
      <a href="https://bowang.su/vod/8288.html" title="全２０集">繼承者們</a>
      <a href="https://bowang.su/vod/74755.html" title="全２０集">城市獵人</a>
      <a href="https://bowang.su/vod/70423.html" title="全２０集">任意依戀</a>
      <a href="https://bowang.su/vod/190658.html" title="全８集">死期將至</a>
      <a href="https://bowang.su/vod/64471.html" title="全１６集">W<tab>兩個世界</tab></a>
      <a href="https://bowang.su/vod/68277.html" title="全１６集">太陽的後裔</a>
      <a href="https://bowang.su/vod/6719.html" title="全２０集">異鄉人醫生</a>
      <a href="https://bowang.su/vod/73400.html" title="全１６集">當你沉睡時</a>
      <a class="ep" href="https://bowang.su/vod/179383.html" title="全１７集"><ep>－</ep>７人的逃脫</a>
      <a class="ep" href="https://bowang.su/vod/226271.html" title="全１６集"><ep>－</ep>７人的復活</a>
      <a href="https://bowang.su/vod/72860.html" title="全１２集（量子雲）">機智醫生生活<series>第１季</series></a>
      <a href="https://bowang.su/vod/73998.html" title="全１２集">機智醫生生活<series>第２季</series></a>
      <p>韓國網路劇</p>
      <a href="https://www.youtube.com/watch?v=GPBxJ7Z1XYw" title="全８集">男人女神</a>
      <a href="https://www.youtube.com/playlist?list=PLqCoVH1bdO98BQEy45gUshePzaI2xREMD" title="全６集">愛情簡介</a>
      <a href="https://www.youtube.com/playlist?list=PLS--ClexQbQ0T-Tlwv8sS8B1bzP67pkjG" title="全２４集">A-TEEN<series>第１季</series></a>
      <a href="https://www.youtube.com/playlist?list=PLS--ClexQbQ2bhw_a8LU2XUPJozqbRX9y" title="全２０集">A-TEEN<series>第２季</series></a>
      <a href="https://www.youtube.com/watch?v=UcUq5a1yANI" title="全１１集">妹妹成了女朋友</a>
      <a href="https://www.youtube.com/playlist?list=PLS--ClexQbQ2BcRL2i4faCPmtoEttWxbJ" title="全６集">My Fuxxxxx Romance</a>
    </section>
    <section>
      <p>韓國電影</p>
      <a href="https://bowang.su/vod/226053.html">破墓</a>
      <a href="https://bowang.su/vod/45606.html">盲證</a>
      <a href="https://bowang.su/vod/53378.html">昆池岩</a>
      <a href="https://bowang.su/vod/115838.html">非常殺手</a>
      <a href="https://bowang.su/vod/81793.html">悲傷電影</a>
      <a href="https://bowang.su/vod/131492.html">20世紀少女</a>
      <a href="https://bowang.su/vod/52267.html">屍速列車<tab>釜山行</tab></a>
      <a href="https://bowang.su/vod/75782.html">殺人者的記憶法</a>
      <p>日本電影</p>
      <a href="https://bowang.su/vod/53501.html">戀空</a>
      <a href="https://bowang.su/vod/54694.html">熱血高校<series>１</series></a>
      <a href="https://bowang.su/vod/54691.html">熱血高校<series>２</series></a>
      <a href="https://bowang.su/vod/72651.html">只是愛著你</a>
      <p>日本劇集</p>
      <a href="https://bowang.su/vod/65796.html" title="全１０集">唯一的愛</a>
      <a href="https://bowang.su/vod/106313.html" title="全１１集 + SP">求婚大作戰</a>
      <a href="https://bowang.su/vod/103841.html" title="全１１集">一公升的眼淚</a>
      <a href="https://bowang.su/vod/113725.html" title="第１季 全８集\n第２季 全２集">Animals<series>第１~２季</series></a>
      <a href="https://bowang.su/play/104858-4-1.html" title="全１１集">零秒出手<tab>懸崖上的英雄</tab></a>
      <a href="https://bowang.su/vod/105910.html" title="全１１集">空中急診英雄<series>第１季</series></a>
      <a href="https://bowang.su/vod/104848.html" title="全１１集">空中急診英雄<series>第２季</series></a>
      <a href="https://bowang.su/vod/98711.html" title="第３季 全１０集\n番外篇 全５集\n劇場版 全１集">空中急診英雄<series>第３季</series></a>
      <a href="https://bowang.su/vod/172083.html" title="全１集">空中急診英雄<series>另一個戰場</series><type>特別篇</type></a>
    </section>
  </article>
</div>

<div id="pop-AnimeCH" class="pop-Box pop-AnimeCH" popover>
  <article class="pop-colBox">
    <p>國語動畫<tips>3D</tips></p>
    <section>
      <a class="ep" href="https://tw.xgcartoon.com/detail/jianlaiguoyu-fenghuoxizhuhou" title="全２６集">劍來<ep>18</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/xianniguoyu-qieyingshi" title="全７６集">仙逆<ep>65</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/wuniguoyu-zhishixiaoxiami" title="全？？集">武逆<ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/zhetianguoyu-chendong" title="全１０４集">遮天<ep>63</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/shenmuguoyu-chendong" title="第１季 全１６集\n第２季 全２７集">神墓<series>第１~２季</series><ep>－</ep></a>
      <a href="https://tw.xgcartoon.com/detail/yuanzunguoyu-tiancantudou" title="全２６集">元尊</a>
      <a href="https://tw.xgcartoon.com/detail/zhuxianguoyu-xiaoding" title="全５２集">誅仙</a>
      <a href="https://tw.xgcartoon.com/detail/zichuanguoyu-laozhu" title="全４２集">紫川</a>
      <a href="https://www.cnys1.tv/voddetai-224620.html" title="全１６集">元龍<series>第１季</series></a>
      <a href="https://www.cnys1.tv/voddetai-166951.html" title="全１６集">元龍<series>第２季</series></a>
      <a href="https://www.cnys1.tv/voddetai-167095.html" title="全１６集">元龍<series>第３季</series></a>
      <a href="https://tw.xgcartoon.com/detail/yongsheng_di1jiguoyu-mengrushenji" title="第１季 無盡仙途 全１２集\n第２季 十年之約 全１２集\n第３季 氣壯山河 全１６集\n第４季 海噬仙靈 全１６集">永生<series>第１~４季</series></a>
      <a class="ep" href="https://www.cnys.tv/voddetai-37051.html" title="全？？集">饕餮記<ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/mushenjiguoyu-xuanjikeji" title="全？？集">牧神記<ep>07</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/zhangshengjieguoyu-chendong" title="全？？集">長生界<ep>06</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/cangyuantuguoyu-zhangyili" title="全５７集">滄元圖<ep>26</ep></a>
      <a href="https://tw.xgcartoon.com/detail/nianwushuangguoyu-gujiangshan" title="全１４集">念無雙</a>
      <a href="https://tw.xgcartoon.com/detail/dazhuzainianfanguoyu-tiancantudou" title="全５２集">大主宰</a>
      <a href="https://tw.xgcartoon.com/detail/buxingsi_yuanqiguoyu-yueguan" title="全１８集">捕星司<series>源起</series></a>
      <a href="https://tw.xgcartoon.com/detail/juansiliangguoyu-zhaoyuqing" title="第１季 全１５集\n第２季 全１５集">眷思量<series>第１~２季</series></a>
      <a href="https://tw.xgcartoon.com/detail/nitianxieshen4kguoyu-huoxingyinli__cBRw" title="全３０集">逆天邪神</a>
      <a href="https://tw.xgcartoon.com/detail/juedaishuangjiaoguoyu-pengqingzheng" title="全１８集">絕代雙驕</a>
      <a href="https://www.cnys.tv/voddetai-36937.html" title="全１集">絕代雙驕<series>之天外有天</series><type>番外篇</type></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/tunshixingkongdi1jiguoyu-wochixihongshi" title="全１５６集">吞噬星空<ep>125</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/tunshixingkongjuchangban_xueluodaluguoyu-wochixihongshi" title="全１集">吞噬星空<series>血洛大陸</series><type>劇場版</type><ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/wanmeishijieguoyu-chendong" title="全２３４集">完美世界<ep>162</ep></a>
      <a href="https://tw.xgcartoon.com/detail/wanmeishijiezhihuozhihuijinguoyu-chendong" title="全３集">完美世界<series>火之灰燼</series><type>劇場版</type></a>
      <a href="https://tw.xgcartoon.com/detail/douluodaluguoyu-tangjiasanshao" title="全２６３集">鬥羅大陸</a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/douluodalujueshitangmenguoyu-tangjiasanshao" title="全１０４集">鬥羅大陸<series>絕世唐門</series><ep>73</ep></a>
      <a href="https://tw.xgcartoon.com/detail/shaoniangexingguoyu-zhongyingniannian" title="全２６集">少年歌行<series>第１季</series></a>
      <a href="https://bowang.su/vod/47646.html" title="全３２集\n特別篇 全１集">少年歌行<series>第２季</series><series>風花雪月篇</series></a>
      <a href="https://tw.xgcartoon.com/detail/shaoniangexing_haiwaixianshanpianguoyu-zhongyingniannian" title="全２６集">少年歌行<series>第３季</series><series>海外仙山篇</series></a>
      <a href="https://tw.xgcartoon.com/detail/junyouyunguoyu-zhoumunan" title="全２４集">少年歌行<series>君有云</series></a>
      <a href="https://tw.xgcartoon.com/detail/shaoniangexingzhianhechuan-zhoumunan" title="全２６集">少年歌行<series>暗河傳</series></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/shaonianbaimazuichunfeng-zhoumunan" title="第１季 全２０集\n第２季 全２６集">少年歌行<series>少年白馬醉春風</series><series>第１~２季</series><ep>－</ep></a>
      <a href="https://myself-bbs.com/thread-48705-1-1.html" title="全３集">鬥破蒼穹<series>緣起</series></a>
      <a href="https://tw.xgcartoon.com/detail/doupocangqiongdi1ji-tiancantudou" title="第１季 全１２集\n第２季 全１２集\n第３季 全１２集\n第４季 全２４集">鬥破蒼穹<series>第１~４季</series></a>
      <a href="https://myself-bbs.com/thread-43109-1-1.html" title="全２集">鬥破蒼穹<type>特別篇</type></a>
      <a href="https://myself-bbs.com/thread-45068-1-1.html" title="全３集">鬥破蒼穹<series>沙之瀾歌</series><type>特別篇 Ⅱ</type></a>
      <a href="https://tw.xgcartoon.com/detail/doupocangqiongsannianzhiyueguoyu-tiancantudou" title="全１３集">鬥破蒼穹<series>三年之約</series></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/doupocangqiongnianfanguoyu-tiancantudou" title="全１５７集">鬥破蒼穹<series>年番</series><ep>124</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/shenyinwangzuoguoyu-tangjiasanshao" title="全１５６集">神印王座<ep>106</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/bailianchengshenguoyu-zhangshuai" title="全１０４集">百鍊成神<ep>82</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/dadaochaotian-zhongyingniannian" title="全１６集">大道朝天<ep>12</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/shenwutianzunguoyu-wanshuidedashu" title="全２４集">神武天尊<ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/wujinshenyuguoyu-yiguanshengxue" title="">無盡神域<ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/lingwudaluguoyu-piaomiao" title="">靈武大陸<ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/wuliandianfengguoyu-zhongyingniannian" title="全４８集">武煉巔峯<ep>－</ep></a>
      <a href="https://tw.xgcartoon.com/detail/yishizhizunguoyu-hanwenyong" title="全１６集">一世之尊</a>
      <a href="https://tw.xgcartoon.com/detail/diyixulieguoyu-huishuohuadezhouzi" title="全１６集">第一序列</a>
      <a class="ep" href="javascript:" title="全？？集">大周鎮魂人<ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/shanhaifumoluguoyu-youku" title="全２６集">山海伏魔錄<ep>06</ep></a>
      <a class="ep" href="https://bowang.su/vod/143760.html" title="全９１集">師兄啊師兄<ep>53</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/fanrenxiuxianchuanzhongzhibanguoyu-wangyu" title="全１２４集">凡人修仙傳<ep>－</ep></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/fanrenxiuxianchuan_tebiepianguoyu-kelamayijinsetianshengchuanmeiyouxiangongsizhizuo" title="全４集">凡人修仙傳<series>燕家堡之戰</series><ep>－</ep></a>
      <a href="https://tw.xgcartoon.com/detail/taiyijianxianchuanguoyu-youku" title="全２０集">太一劍仙傳</a>
      <a href="https://tw.xgcartoon.com/detail/aoshijiuzhongtianguoyu-fenglingtianxia" title="全１２集">傲世九重天</a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/tudigegeshidalaoguoyu-zhangxiaoliang" title="全１５集">徒弟個個是大佬<ep>16</ep></a>
      <a href="https://tw.xgcartoon.com/detail/zhanshenzhifanchenshenyuwozaijingshenbingyuanxuezhanshenguoyu-sanjiuyinyu" title="全１５集">斬神之凡塵神域</a>
      <a href="https://tw.xgcartoon.com/detail/fengqiluoyangzhishenjishaonianguoyu-xiedan" title="全１６集">風起洛陽之神機少年</a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/zongmenlichulewodoushiwodiguoyu-yizhituzia" title="全４８集">宗門裡除了我都是臥底<ep>20</ep></a>
    </section>
  </article>
  <article class="pop-rowBox">
    <section>
      <p>國語動畫<tips>2D</tips></p>
      <a class="ep" href="https://tw.xgcartoon.com/detail/tianyingguoyu-xiaoding" title="全２６集">天影<ep>－</ep></a>
      <a href="https://tw.xgcartoon.com/detail/longzuguoyu-jiangnan" title="全１７集（含第０話）">龍族<series></series></a>
      <a href="https://tw.xgcartoon.com/detail/jinzhanfashiguoyu-hudielan" title="全２０集">近戰法師</a>
      <a href="https://tw.xgcartoon.com/detail/quanzhigaoshoudadianying_quanzhigaoshouzhidianfengrongyaoguoyu-shijuansheng" title="全１集">全職高手<series>巔峯榮耀</series><type>劇場版</type></a>
      <a href="https://tw.xgcartoon.com/detail/quanzhigaoshoutebiepianguoyu-shijuansheng" title="全３集">全職高手<type>特別篇</type></a>
      <a href="https://tw.xgcartoon.com/detail/quanzhigaoshou_di12jiguoyu-shijuansheng" title="第１季 全１２集\n第２季 全１２集\n第３季 全１７集">全職高手<series>第１~３季</series></a>
      <a href="https://tw.xgcartoon.com/detail/yirenzhixia_yirendi1jiguoyu-mier" title="全１２集">一人之下<series>第１季</series></a>
      <a href="https://tw.xgcartoon.com/detail/yirenzhixia_di2jiguoyu-mier" title="全２４集">一人之下<series>第２季</series></a>
      <a href="https://tw.xgcartoon.com/detail/yirenzhixia_di3jiguoyu-mier" title="全８集">一人之下<series>第３季</series></a>
      <a href="https://tw.xgcartoon.com/detail/yirenzhixia_di4jiguoyu-mier" title="全１２集">一人之下<series>第４季</series></a>
      <a href="https://tw.xgcartoon.com/detail/yirenzhixiayiren_di5jiguoyu-mier" title="全１２集">一人之下<series>第５季</series></a>
      <a href="https://www.youtube.com/watch?v=vn0NcYAjE34" title="全１集">一人之下<series>鏽鐵重現</series><type>劇場版</type></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/zantingzhixuzhongzuguoyu-liusiwen" title="全？？集">暫停！智序重組<ep>－</ep></a>
    </section>
  </article>
</div>

<div id="pop-AnimeJP" class="pop-Box pop-AnimeJP" popover>
	<article class="pop-colBox">
    <p>日語動畫</p>
    <section>
      <a href="https://www.biddbidd.com/bangumi/media/md28234126" title="全２３集">86<tab>不存在的戰區</tab></a>
      <a href="https://myself-bbs.com/thread-44680-1-1.html" title="全１２集">B<tab>The Beginning</tab></a>
      <a href="https://myself-bbs.com/thread-47178-1-1.html" title="全６集">B<tab>The Beginning</tab><series>Succession</series></a>
      <a href="https://www.youtube.com/playddst?ddst=PL12UaAf_xzfrnnUYmObwge_p5mIwIJbBG" title="全１２集">IS<tab>Infinite Stratos</tab><series>第１季</series></a>
      <a href="https://myself-bbs.com/thread-43794-1-1.html" title="第２季 全１２集\nＯＶＡ 全１集">IS<tab>Infinite Stratos</tab><series>第２季</series></a>
      <a href="https://myself-bbs.com/thread-41043-1-1.html" title="全１３集">ReLIFE<tab>重返17歲</tab></a>
      <a href="https://myself-bbs.com/thread-43542-1-1.html" title="全４集">ReLIFE<tab>重返17歲</tab><type>完結篇</type></a>
      <a href="https://tw.xgcartoon.com/detail/weiwei_-yingshiyanzhige-vivy_-fluorite_eyes_song-riyu-jiangqishenping" title="全１３集">Vivy<tab>Fluorite Eye's Song</tab></a>
      <a href="https://www.biddbidd.com/bangumi/media/md9192" title="全２４集">DARLING in the FRANXX</a>
      <a href="https://myself-bbs.com/thread-44147-1-1.html" title="全２５集">Fate<tab>Zero</tab></a>
      <a href="https://myself-bbs.com/thread-44148-1-1.html" title="全２６集（含第０話）">Fate<tab>Stay Night</tab><series>Unlimited Blade Works</series></a>
      <a href="https://myself-bbs.com/thread-44206-1-1.html" title="全１集">Fate<tab>Stay Night</tab><series>Unlimited Blade Works</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-44231-1-1.html" title="全１集">Fate<tab>Stay Night</tab><series>HF Ⅰ.預示之花</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-45198-1-1.html" title="全１集">Fate<tab>Stay Night</tab><series>HF Ⅱ.迷途之蝶</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-47209-1-1.html" title="全１集">Fate<tab>Stay Night</tab><series>HF Ⅲ.春櫻之歌</series><type>劇場版</type></a>
      <a href="https://www.biddbidd.com/bangumi/play/ep98574" title="全１集">Fate<tab>Grand Order</tab><series>First Order</series></a>
      <a href="https://myself-bbs.com/thread-47347-1-1.html" title="全１集">Fate<tab>Grand Order</tab><series>神聖圓桌領域 卡美洛</series><type>劇場版</type></a>
      <a href="https://www.biddbidd.com/bangumi/media/md28222851" title="全２５集">Fate<tab>Grand Order</tab><series>絕對魔獸戰線 巴比倫尼亞</series></a>
      <a href="https://bowang.su/vod/107300.html" title="全１集">Fate<tab>Grand Order</tab><series>終局特異點 冠位時間神殿所羅門</series><type>劇場版</type></a>
      <a href="https://tw.xgcartoon.com/detail/mingyunqiyiyanpin_ddmingdiyufatestrange_fake_whispers_of_dawnriyu-type-moonchengtianddangwu" title="全１集">Fate<tab>strange Fake</tab></a>
      <a href="https://tw.xgcartoon.com/detail/longzuriyu-jiangnan" title="全１７集（含第０話）">龍族<tab>The Blazing Dawn</tab></a>
      <a href="https://myself-bbs.com/thread-47279-1-1.html" title="全５２集">通靈王</a>
      <a href="https://myself-bbs.com/thread-48872-1-1.html" title="全１２集">鏈鋸人</a>
      <a href="https://myself-bbs.com/thread-51583-1-1.html" title="全１２集">異修羅</a>
      <a href="https://myself-bbs.com/thread-44347-1-1.html" title="第１季 全１２集\nＯＡＤ 全２集">野良神<series>第１季</series><type>+ OAD</type></a>
      <a href="https://myself-bbs.com/thread-44348-1-1.html" title="第２季 全１３集\nＯＡＤ 全２集">野良神<series>第２季</series><type>+ OAD</type></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/longzhu_damolongzhu_daimariyu-niaoshanming" title="全？？集"><ep>－</ep>七龍珠<series>DAIMA</series></a>
      <a href="https://tw.xgcartoon.com/detail/guaishou8haoriyu-songbenzhiye" title="全１２集">怪獸８號</a>
      <a href="https://myself-bbs.com/thread-43653-1-1.html" title="全２３集">罪惡王冠</a>
      <a href="https://myself-bbs.com/thread-48476-1-1.html" title="全２５集">夏日重現</a>
      <a href="https://tw.xgcartoon.com/detail/yimeishenghuodays_with_my_stepsisterriyu-shangyezhuangda" title="全１２集">義妹生活</a>
      <a href="https://myself-bbs.com/thread-44958-1-1.html" title="全１２集">家有女友</a>
      <a href="https://www.biddbidd.com/bangumi/media/md28339740" title="全２４集">藍色監獄<series>第１季</series></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/lansejianyuriyu-jinchengzongxing" title="全？？集"><ep>26</ep>藍色監獄<series>第２季 VS. U-20 日本代表隊</series></a>
      <a href="https://tw.xgcartoon.com/detail/lansejianyujuchangbanriyu-shichuanjunjie" title="全１集">藍色監獄<series>EPISODE 凪</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-44385-1-1.html"  title="傷物語\n貓物語 黑\n化物語\n僞物語\n傾物語\n貓物語 白\n鬼物語\n終物語 上\n囮物語\n戀物語\n憑物語\n歷物語\n終物語 下\n續・終物語\n花物語">物語系列<series>傷物語</series></a>
      <a href="https://myself-bbs.com/thread-44369-1-1.html">物語系列<series>貓物語 (黑)</series></a>
      <a href="https://myself-bbs.com/thread-44367-1-1.html">物語系列<series>化物語</series></a>
      <a href="https://myself-bbs.com/thread-44368-1-1.html">物語系列<series>僞物語</series></a>
      <a href="https://myself-bbs.com/thread-44370-1-1.html">物語系列<series>貓物語 (白),傾,囮,鬼,戀,花</series></a>
      <a href="https://myself-bbs.com/thread-44056-1-1.html">物語系列<series>終物語 (上)</series></a>
      <a href="https://myself-bbs.com/thread-44371-1-1.html">物語系列<series>憑物語</series></a>
      <a href="https://myself-bbs.com/thread-44372-1-1.html">物語系列<series>歷物語</series></a>
      <a href="https://myself-bbs.com/thread-42925-1-1.html">物語系列<series>終物語 (下)</series></a>
      <a href="https://myself-bbs.com/thread-44992-1-1.html">物語系列<series>續・終物語</series></a>
      <a href="https://myself-bbs.com/thread-44834-1-1.html" title="全２６集">頭文字Ｄ<series>1st Stage</series></a>
      <a href="https://myself-bbs.com/thread-44835-1-1.html" title="全１３集">頭文字Ｄ<series>2nd Stage</series></a>
      <a href="https://myself-bbs.com/thread-44836-1-1.html" title="全１集">頭文字Ｄ<series>3rd Stage</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-44837-1-1.html" title="全２４集">頭文字Ｄ<series>4th Stage</series></a>
      <a href="https://myself-bbs.com/thread-44839-1-1.html" title="全１４集">頭文字Ｄ<series>5th Stage</series></a>
      <a href="https://myself-bbs.com/thread-44841-1-1.html" title="全４集">頭文字Ｄ<series>Final Stage</series></a>
      <a href="https://myself-bbs.com/thread-44843-1-1.html" title="全２集">頭文字Ｄ<series>Extra Stage</series><type>OVA</type></a>
      <a href="https://myself-bbs.com/thread-44842-1-1.html" title="全３集">頭文字Ｄ<series>覺醒・闘走・夢現</series><type>劇場版</type></a>
      <a class="ep" href="https://www.biddbidd.com/bangumi/media/md25832466"><ep>－</ep>鬼滅之刃</a>
      <a class="ep" href="https://www.biddbidd.com/bangumi/media/md28235287"><ep>－</ep>鬼滅之刃<series>無限列車篇</series></a>
      <a class="ep" href="https://myself-bbs.com/thread-47425-1-1.html"><ep>－</ep>鬼滅之刃<series>無限列車篇</series><type>劇場版</type></a>
      <a class="ep" href="https://www.biddbidd.com/bangumi/media/md28235787"><ep>－</ep>鬼滅之刃<series>遊郭篇</series></a>
      <a class="ep" href="https://www.biddbidd.com/bangumi/media/md20161245"><ep>－</ep>鬼滅之刃<series>遊郭潛入篇</series></a>
      <a class="ep" href="https://www.biddbidd.com/bangumi/media/md20203323"><ep>－</ep>鬼滅之刃<series>遊郭決戰篇</series></a>
      <a class="ep" href="https://www.xgcartoon.com/detail/guimiezhirenmieguizhirendemon_slayerdi3ji_duandaocunpianriyu-waiqichunxiong"><ep>－</ep>鬼滅之刃<series>刀匠村篇</series></a>
      <a class="ep" href="javascript:"><ep>－</ep>鬼滅之刃<series>柱訓練篇</series></a>
      <a href="https://myself-bbs.com/thread-43663-1-1.html" title="全２５集">刀劍神域<series>第１季</series></a>
      <a href="https://myself-bbs.com/thread-34406-1-1.html" title="全２４集">刀劍神域<series>第２季</series></a>
      <a href="https://myself-bbs.com/thread-44659-1-1.html" title="全２４集">刀劍神域<series>第３季</series><tab>Alicization</tab></a>
      <a href="https://www.biddbidd.com/bangumi/media/md28222854" title="全１２集">刀劍神域<series>第３季</series><tab>Alicization</tab><series>War of Underworld (上)</series></a>
      <a href="https://www.biddbidd.com/bangumi/media/md28228510" title="全１２集">刀劍神域<series>第３季</series><tab>Alicization</tab><series>War of Underworld (下)</series></a>
      <a href="https://tw.xgcartoon.com/detail/daojianshenyujinjipianwuxingzhiyedeyongtandiaoriyu-chuanyuandd" title="全１集">刀劍神域<tab>Progressive</tab><series>無星夜的詠嘆調</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-49728-1-1.html" title="全１集">刀劍神域<tab>Progressive</tab><series>陰沉薄暮的詼諧曲</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-43018-1-1.html" title="全１集">刀劍神域<series>序列爭戰</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-43661-1-1.html" title="全１集">刀劍神域<series>Extra Edition</series><type>OVA</type></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/daojianshenyuwaichuan_gun_gale_onlineriyu-chuanyuanli" title="第１季 全１２集\n第２季 全１２集"><ep>－</ep>刀劍神域<tab>Alternative</tab><series>Gun Gale Online 第１~２季</series></a>
      <a href="https://tw.xgcartoon.com/detail/kuyugongcunkusangyugongcunjunriyu-andahaojie" title="第１季 全１３集\n第２季 全１３集">堀與宮村<series>第１~２季</series></a>
      <a href="https://myself-bbs.com/thread-48647-1-1.html" title="全１３集">莉可麗絲<tab>Lycoris Recoil</tab></a>
      <a href="https://www.biddbidd.com/bangumi/media/md5052/" title="全１２集">心靈代碼<tab>Qualidea Code</tab></a>
      <a href="https://tw.xgcartoon.com/detail/wind_breakerfangfengshaonianwind_breaker_fangfengddngriyu-" title="全１３集">防風少年<tab>WIND BREAKER</tab></a>
      <a href="https://tw.xgcartoon.com/detail/monvyuyeshouriyu-zuozhuxingdian" title="全１２集">魔女與野獸</a>
      <a href="https://tw.xgcartoon.com/detail/woduzishengjiriyu-chugong" title="全１２集">我獨自升級</a>
      <a href="https://tw.xgcartoon.com/detail/daimengkunanhairiyu-jinqianqiu" title="全２４集">呆萌酷男孩</a>
      <a href="https://www.biddbidd.com/bangumi/media/md3811" title="全５集">閃電霹靂車</a>
      <a href="https://tw.xgcartoon.com/detail/wotuidehaiziwodantuidehaiziriyu-chibanminghengqiangmengguo" title="第１季 全１１集\n第２季 全１３集">我推的孩子<series>第１~２季</series></a>
      <a class="ep" href="https://tw.xgcartoon.com/detail/mf_ghostranyouchedouhunmf_ghostjisuchehunriyu-zhongyexiuyi" title="第１季 全１２集\n第２季 全？？集"><ep>－</ep>燃油車鬥魂<tab>MF Ghost</tab><series>第１~２季</series></a>
      <a href="https://myself-bbs.com/thread-43974-1-1.html" title="第１季 全２５集\nＯＶＡ 全１集">黑子的籃球<series>第１季</series></a>
      <a href="https://myself-bbs.com/thread-43975-1-1.html" title="第２季 全２５集\nＯＶＡ 全２集">黑子的籃球<series>第２季</series></a>
      <a href="https://myself-bbs.com/thread-43976-1-1.html" title="第３季 全２５集\nＯＶＡ 全１集">黑子的籃球<series>第３季</series></a>
      <a href="https://tw.xgcartoon.com/detail/heizidelanqiujuchangbanlast_gameriyu-tengjuanzhongjun" title="全１集">黑子的籃球<series>Last Game</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-43932-1-1.html" title="ＴＶ　 全１２集\nＯＶＡ 全１集\nSP 全１集">境界的彼方<series>TV + OVA + SP</series></a>
      <a href="https://myself-bbs.com/thread-43933-1-1.html" title="全１集">境界的彼方<series>I'LL BE HERE 過去篇</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-43934-1-1.html" title="全１集">境界的彼方<series>I'LL BE HERE 未來篇</series><type>劇場版</type></a>
      <a href="https://www.youtube.com/watch?v=M5kTYKlRxBs" title="全１２集">間諜家家酒<tab>SPY×FAMILY</tab><series>第１季 Part.1</series></a>
      <a href="https://www.youtube.com/watch?v=Qlz_GMeLSZQ" title="全１３集">間諜家家酒<tab>SPY×FAMILY</tab><series>第１季 Part.2</series></a>
      <a href="https://www.youtube.com/watch?v=u9OenXDRGrM" title="全１２集">間諜家家酒<tab>SPY×FAMILY</tab><series>第２季</series></a>
      <a href="https://tw.xgcartoon.com/detail/jiandieguojiajiajuchangbandaihao_baijiandiejiajiajiu_codewhiteriyu-piantongchong" title="全１集">間諜家家酒<tab>SPY×FAMILY</tab><series>CODE：White</series><type>劇場版</type></a>
      <a href="https://www.biddbidd.com/bangumi/media/md28236374" title="全１２集">戀上換裝娃娃</a>
      <a href="https://www.youtube.com/playddst?ddst=PL12UaAf_xzfohbJcGiIG-qGNWW5wu45-w" title="全２４集">絕園的暴風雨</a>
      <a href="https://www.youtube.com/playddst?ddst=PL12UaAf_xzfpHddkQd-mHKo6pBQYEPDV-" title="全２８集">葬送的芙莉蓮</a>
      <a href="https://www.biddbidd.com/bangumi/media/md6438" title="全２４集">魔法使的新娘<series>第１季</series></a>
      <a href="https://www.biddbidd.com/bangumi/media/md20197734" title="全２４集">魔法使的新娘<series>第２季</series></a>
      <a href="https://www.xgcartoon.com/detail/wuwuyuwuzhiguwuqitanriyu-guijuncao" title="第１季 全１２集\n第２季 全１２集">物之古物奇譚<series>第１~２季</series></a>
      <a href="https://www.youtube.com/watch?v=BkA6DfEROlw" title="全１２集">偵探已經，死了</a>
      <a href="https://tw.xgcartoon.com/detail/yaoshishaonvdeduyuyaowushaonvdeninanriyu-rixiangxia" title="全２４集">藥師少女的獨語</a>
      <a href="https://tw.xgcartoon.com/detail/zhangyujiandemojiantanzhangyujiandeweisiteddyariyu-dasentengye" title="全１２集">杖與劍的魔劍譚</a>
      <a href="https://tw.xgcartoon.com/detail/luodiqishiyingxiongtanriyu-haikonglu" title="全１２集">落第騎士英雄譚</a>
      <a href="https://tw.xgcartoon.com/detail/nier_zidongrenxingnier_jixiejiyuanver11ariyu-yishanddangsi" title="全１２集">尼爾：自動人形<tab>Ver1.1a</tab><series>第１季</series></a>
      <a class="ep" href="https://www.cnys1.tv/voddetai-359880.html" title="全２４集"><ep>02</ep>尼爾：自動人形<tab>Ver1.1a</tab><series>第２季</series></a>
      <a href="https://myself-bbs.com/thread-44671-1-1.html" title="全２６集">新世紀福音戰士<tab>TV</tab></a>
      <a href="https://myself-bbs.com/thread-44671-1-1.html" title="全３集">新世紀福音戰士<series>Air、死與新生、真心為你</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-44671-1-1.html" title="全４集">新世紀福音戰士<series>序、破、Q、終</series><type>劇場版</type></a>
      <a href="https://myself-bbs.com/thread-44671-1-1.html" title="全２５集">無頭騎士異聞錄<tab>DuRaRaRa!!</tab></a>
      <a href="https://myself-bbs.com/thread-44670-1-1.html" title="全１２集">無頭騎士異聞錄<tab>DuRaRaRa!!</tab><series>×2 承</series></a>
      <a href="https://myself-bbs.com/thread-44663-1-1.html" title="全１２集">無頭騎士異聞錄<tab>DuRaRaRa!!</tab><series>×2 轉</series></a>
      <a href="https://myself-bbs.com/thread-44664-1-1.html" title="全１２集">無頭騎士異聞錄<tab>DuRaRaRa!!</tab><series>×2 結</series></a>
      <a href="https://www.yhmgo.com/showp/14177.html" title="全１２集">目隱都市的演繹者</a>
      <a href="https://tw.xgcartoon.com/detail/yishijiezishatujiduiyishijiezishaxiaoduiriyu-huana" title="全１０集">異世界自殺突擊隊</a>
      <a href="https://www.youtube.com/watch?v=wexSWaoYlXY&ddst=PL12UaAf_xzfq2B5WRNG8d_kAryXVW10X7&index=13" title="全１２集">甲鐵城的卡巴內里</a>
      <a href="https://myself-bbs.com/thread-45090-1-1.html" title="全１集">甲鐵城的卡巴內里<series>海門決戰</series><type>劇場版</type></a>
      <a href="https://www.youtube.com/watch?v=ZcEgySBz1_E&ddst=PLC18xlbCdwtSNZy7MvRHRKKNO5oYLDFJE&index=13" title="全１２集">宿命迴響：命運節拍</a>
      <a href="https://myself-bbs.com/thread-49538-1-1.html" title="全２４集">屍體如山的死亡遊戲</a>
      <a href="https://www.biddbidd.com/bangumi/media/md28339747" title="全２０集">我想成為影之強者！<series>第１季</series></a>
      <a href="https://www.youtube.com/playddst?ddst=PLC18xlbCdwtQGlyMs9SVOYp2lP-myamDL" title="全１２集">我想成為影之強者！<series>第２季</series></a>
      <a href="https://myself-bbs.com/thread-34352-1-1.html" title="全２６集">魔法科高中的劣等生<series>第１季</series></a>
      <a href="https://myself-bbs.com/thread-46149-1-1.html" title="全１３集">魔法科高中的劣等生<series>第２季</series></a>
      <a href="https://myself-bbs.com/thread-52155-1-1.html" title="全１３集">魔法科高中的劣等生<series>第３季</series></a>
      <a href="https://myself-bbs.com/thread-43517-1-1.html" title="全１集">魔法科高中的劣等生<series>呼喚星辰的少女</series><type>劇場版</type></a>
      <a href="https://tw.xgcartoon.com/detail/weihewodeshijiebeiyiwangleweihewurenjidewodeshijieriyu-xiyinqi" title="全１２集">為何我的世界被遺忘了？</a>
      <a href="https://www.youtube.com/watch?v=mZPsFixurX4&ddst=PL12UaAf_xzfppuE2khlptuGEyf-8a4BY9&index=14" title="全１３集">治癒魔法的錯誤使用方法</a>
      <a href="https://www.youtube.com/watch?v=UE82di1e43Y" title="全２６集">Re：從零開始的異世界生活<series>第１季</series></a>
      <a href="https://www.youtube.com/watch?v=yXYjT32mq8E" title="全２５集">Re：從零開始的異世界生活<series>第２季</series></a>
      <a class="ep" href="https://www.youtube.com/playddst?ddst=PL12UaAf_xzfoDmI3ul0zC2QHmxgQANaQA" title="全？？集"><ep>－</ep>Re：從零開始的異世界生活<series>第３季</series></a>
      <a href="https://www.youtube.com/watch?v=tUdr5Xto6WM&ddst=PL12UaAf_xzfrOerp2F6smUAstMelSuveV&index=6" title="全１２集">歡迎來到實力至上主義的教室<series>第１季</series></a>
      <a href="https://www.biddbidd.com/bangumi/media/md28338550" title="全１３集">歡迎來到實力至上主義的教室<series>第２季</series></a>
      <a href="https://www.youtube.com/playddst?ddst=PL12UaAf_xzfoiDVWr3r5r49y6ouw0Wr5E" title="全１３集">歡迎來到實力至上主義的教室<series>第３季</series></a>
      <a href="https://www.biddbidd.com/bangumi/media/md28340513" title="全２４集">關於我轉生變成史萊姆這檔事<series>第１季</series></a>
      <a href="https://www.biddbidd.com/bangumi/media/md28233475" title="全２４集">關於我轉生變成史萊姆這檔事<series>第２季</series></a>
      <a href="https://www.youtube.com/playddst?ddst=PL12UaAf_xzfrcbVCNLpZFQz43Tbd6EaSK" title="全２４集">關於我轉生變成史萊姆這檔事<series>第３季</series></a>
      <a href="https://www.youtube.com/watch?v=9qtcz23JClQ" title="全３集">關於我轉生變成史萊姆這檔事<series>柯里烏斯之夢</series><type>OVA</type></a>
      <a href="https://www.youtube.com/watch?v=AbAG_iaZK60" title="全１集">關於我轉生變成史萊姆這檔事<series>紅蓮之絆</series><type>劇場版</type></a>
      <a href="https://tw.xgcartoon.com/detail/wuzhizhuanshengdaoleyishijiejiunachuzhenbenshiriyu-gangbenxue" title="第１季 全２４集\n第２季 全２５集">無職轉生<tab>到了異世界就拿出真本事</tab><series>第１~２季</series></a>
      <a href="https://www.youtube.com/watch?v=e5KihdQiihE&ddst=PL12UaAf_xzfpv_EIuCk3K-WwFSDdYvJiE&index=27" title="全２５集">香格里拉．開拓異境<tab>糞作獵手挑戰神作</tab><series>第１季</series></a>
      <a href="https://www.youtube.com/playddst?ddst=PL12UaAf_xzfriLqlWYt_6FgqLm7LSCcom" title="全？？集">香格里拉．開拓異境<tab>糞作獵手挑戰神作</tab><series>第２季</series></a>
      <a href="https://www.cnys1.tv/voddetai-349022.html" title="全１２集">靠廢材技能【狀態異常】成為最強的我將蹂躪一切</a>
    </section>
    <span>　</span>
  </article>
  <article class="pop-rowBox">
    <section>
    	<p>日語動畫電影<tips>劇場版 ／ 特別篇</tips></p>
      <a href="https://myself-bbs.com/thread-42439-1-1.html" title="2017.03.24 ／ ２小時９分鐘">聲之形</a>
      <a href="https://tw.xgcartoon.com/detail/haizeiwangjuchangban2019kuangrexingdonghanghaiwangjuchangban_duobaozhengbazhan-weitianrongyilang" title="2019.08.21 ／ １小時４１分鐘">海賊王<series>奪寶爭霸戰</series></a>
      <a href="https://tw.xgcartoon.com/detail/guanlangaoshoujuchangban2022the_firstlanqiufeiren2022juchangbanriyu-jingshangxiongyan" title="2022.12.03 ／ ２小時４分鐘">灌籃高手<series>THE FIRST</series></a>
      <a href="https://myself-bbs.com/thread-43789-1-1.html" title="2013.05.31 ／ ４６分鐘">言葉之庭<type>新海誠</type></a>
      <a href="https://www.cnys1.tv/vodplay-364114-sid-1-nid-1.html" title="2016.10.21 ／ １小時５０分鐘">你的名字<type>新海誠</type></a>
      <a href="https://myself-bbs.com/thread-44717-1-1.html" title="2020.01.10 ／ １小時４８分鐘">我想吃掉你的胰臟</a>
      <a>名偵探柯南</a>
      <a href="https://bowang.su/vod/78986.html" title="2009.03.27 　105分鐘\n慶祝《日本電視台》55週年\n慶祝《讀賣電視台》50週年\n《魯邦三世》與《名偵探柯南》共同製作的特別篇"><series>魯邦三世 VS 名偵探柯南</series><type>特別篇</type></a>
      <a href="https://bowang.su/vod/100532.html" title="2013.12.07 　140分鐘\n慶祝《日本電視台》60周年\n慶祝《讀賣電視台》55周年\n紀念《TMS Entertainment》動畫製作50周年\n紀念《魯邦三世》連載45週年\n紀念《名偵探柯南》連載20週年\n《魯邦三世》與《名偵探柯南》共同製作的電影"><series>魯邦三世 VS 名偵探柯南</series><tab>THE MOVIE</tab><type>劇場版</type></a>
      <a href="https://bowang.su/vod/125014.html" title="2014.12.26 　 91分鐘\n紀念《名偵探柯南》漫畫連載20周年"><series>江戶川柯南失蹤事件</series><tab>〜史上最糟糕的兩天〜</tab><type>特別篇</type></a>
      <a href="https://gimy.ai/eps/178340-2-1.html" title="2016.12.09 　 96分鐘\n紀念《名偵探柯南》電視動畫播放20周年"><series>Episode "ONE"</series><tab>變小的名偵探</tab><type>特別篇</type></a>
      <a href="https://www.cnys1.tv/voddetai-215842.html" title="2019.01.05 　 93分鐘\n紀念《名偵探柯南》漫畫連載1000話\n倉木麻衣在動畫中客串登場，並為自己的角色配音"><series>紅之校外旅行</series><type>特別篇</type></a>
      <a href="https://bowang.su/vod/115847.html" title="2020.01.04 　 82分鐘\n紀念《讀賣電視台》新總部大樓啟用的紀念企劃\n劇場版 M21《唐紅的戀歌》相關劇情的後傳"><series>大怪獸哥梅拉 VS 假面超人</series><type>特別篇</type></a>
      <a href="https://bowang.su/vod/10885.html" title="2021.02.26 　 93分鐘\nM24　《名偵探柯南：緋色的彈丸》 劇場版相關劇情的總集篇"><series>緋色的不在場證明</series><type>總集篇</type></a>
      <a href="https://bowang.su/vod/128306.html" title="2022.04.15 　 94分鐘\n紀念《名偵探柯南：萬聖節的新娘》M25 劇場版上映"><series>總局刑警戀愛物語</series><tab>～結婚前夜～</tab><type>聯動總集篇</type></a>
      <a href="https://bowang.su/vod/175936.html" title="2023.01.06 　 89分鐘\nM26　《名偵探柯南：黑鐵的魚影》 劇場版相關劇情的總集篇"><series>灰原哀物語</series><tab>〜黑鐵的神祕列車〜</tab><type>總集篇</type></a>
      <a href="https://www.cnys.tv/voddetai-3199.html" title="2024.01.05 　 80分鐘\n對於《怪盜基德》相關劇情改編的總集篇"><series>名偵探柯南 VS 怪盜基德</series><type>特別總集篇</type></a>
      <a href="https://tw.xgcartoon.com/detail/mingzhentankenanjuchangbanhejiriyu-qingshangangchang" title="１９９７ ４/１９　　９５分鐘 　　M１　《名偵探柯南：引爆摩天樓》\n１９９８ ４/１８　　９９分鐘 　　M２　《名偵探柯南：第１４號獵物》\n１９９９ ４/１７　　９９分鐘 　　M３　《名偵探柯南：世紀末的魔術師》\n２０００ ４/２２　１００分鐘 　　M４　《名偵探柯南：瞳孔中的暗殺者》\n２００１ ４/２１　１００分鐘 　　M５　《名偵探柯南：往天國的倒數計時》\n２００２ ４/２０　１０７分鐘 　　M６　《名偵探柯南：貝克街的亡靈》\n２００３ ４/１９　１０８分鐘 　　M７　《名偵探柯南：迷宮的十字路》\n２００４ ４/１７　１０８分鐘 　　M８　《名偵探柯南：銀翼的奇術師》\n２００５ ４/０９　１０８分鐘 　　M９　《名偵探柯南：水平線上的陰謀》\n２００６ ４/１５　１１１分鐘 　M１０　《名偵探柯南：偵探們的鎮魂歌》\n２００７ ４/２１　１０７分鐘 　M１１　《名偵探柯南：紺碧之棺》\n２００８ ４/１９　１１５分鐘 　M１２　《名偵探柯南：戰慄的樂譜》\n２００９ ４/１８　１１１分鐘 　M１３　《名偵探柯南：漆黑的追蹟者》\n２０１０ ４/１７　１０３分鐘 　M１４　《名偵探柯南：天空的劫難船》\n２０１１ ４/１６　１０９分鐘 　M１５　《名偵探柯南：沉默的１５分鐘 》\n２０１２ ４/１４　１１０分鐘 　M１６　《名偵探柯南：第１１位前鋒》\n２０１３ ４/２０　１１０分鐘 　M１７　《名偵探柯南：絕海的偵探》\n２０１４ ４/１９　１１０分鐘 　M１８　《名偵探柯南：異次元的狙擊手》\n２０１５ ４/１８　１１２分鐘 　M１９　《名偵探柯南：業火的向日葵》\n２０１６ ４/１６　１１２分鐘 　M２０　《名偵探柯南：純黑的惡夢》\n２０１７ ４/１５　１１２分鐘 　M２１　《名偵探柯南：唐紅的戀歌》\n２０１８ ４/１３　１１０分鐘 　M２２　《名偵探柯南：零的執行人》\n２０１９ ４/１２　１０９分鐘 　M２３　《名偵探柯南：紺青之拳》\n２０２１ ４/１６　１１０分鐘 　M２４　《名偵探柯南：緋色的彈丸》\n２０２２ ４/１５　１１１分鐘 　M２５　《名偵探柯南：萬聖節的新娘》\n２０２３ ４/１４　１０９分鐘 　M２６　《名偵探柯南：黑鐵的魚影》\n２０２４ ４/１２　１１１分鐘 　M２７　《名偵探柯南：１００萬美元的五稜星》"><series>《引爆摩天樓》 ~ 《100萬美元的五稜星》</series><type>劇場版</type></a>
    </section>
  </article>
</div>



<div id="pop-popover" class="pop-popover pop-Box" popover>
</div>

`);

//  ===================================================================================================================================================

  // 插入 HTML & CSS
  if (window.self == window.top) {
    if (document.querySelector('body')) { document.body.appendChild(navHtml); document.body.appendChild(navCss) }
    else { document.documentElement.appendChild(navHtml); document.documentElement.appendChild(navCss) } };

//  ===================================================================================================================================================

	// a => 開新視窗
  var setTarget = navHtml.querySelectorAll('a[href]');
  for ( let i = 0; i < setTarget.length; i++ ) { setTarget[i].setAttribute('target','_blank'); setTarget[i].setAttribute('rel','noreferrer noopener') }

	// nav-Body => 顯示切換
  var btnNav = navHtml.querySelector('.btn-Nav'),navBody = navHtml.querySelector('.nav-Body');
  btnNav.addEventListener('mouseenter',() => { navBody.classList.add('switch') },false);
  navBody.addEventListener('mouseleave',() => { navBody.classList.remove('switch') },false);

  // nav-Menu => 手風琴式下拉選單
  var navMenu = navHtml.querySelectorAll('.nav-Menu'),navList = navHtml.querySelectorAll('.nav-List'),boxHeight = null;
  if ( boxHeight == null ) {
    navMenu.forEach((arr) => { arr.dataset.boxHeight = arr.scrollHeight; arr.style.height = '0' });
    navList.forEach((arr) => { Array.from(arr.children).forEach((button) => { button.style.display = 'flex' }); arr.dataset.boxHeight = arr.scrollHeight; arr.style.height = '0' });
    boxHeight = 0 };
  navBody.addEventListener('click',(e) => {
    if    ( e.target.className === 'nav-Label' ) { navMenu.forEach((pickBox) => { if ( pickBox === e.target.nextElementSibling && !pickBox.classList.contains('active') ) { pickBox.classList.toggle('active'); pickBox.setAttribute('style',`height:${pickBox.dataset.boxHeight}px;`); return } else { pickBox.classList.remove('active'); pickBox.style.height = '0' } }) }
  else if ( e.target.className === 'nav-Music' ) { navList.forEach((pickBox) => { if ( pickBox === e.target.nextElementSibling && !pickBox.classList.contains('active') ) { var pickMenu = e.target.parentElement; pickMenu.classList.add('active'); pickMenu.setAttribute('style',`height:fit-content;`); pickBox.classList.toggle('active'); pickBox.setAttribute('style',`height:${pickBox.dataset.boxHeight}px;`); return } else { pickBox.classList.remove('active'); pickBox.style.height = '0' } }) } });

  // pop-colBox => 彈窗 column 佈局
  var popAnimeCH = navHtml.querySelector('.pop-AnimeCH'),popAnimeJP = navHtml.querySelector('.pop-AnimeJP');
  function setPopSection(pop,e) { var pickBox = pop.querySelector('.pop-colBox'),pickSection = pickBox.getElementsByTagName('section');
    Array.from(pickSection).forEach((arr) => { var aH = arr.firstElementChild.offsetHeight,aW = Math.trunc(100/e),sectionRows = Math.ceil(arr.childElementCount / e),sectionH = sectionRows * aH; arr.style.height = `${sectionH}px`; Array.from(arr.children).forEach((pickA) => { pickA.style.width = `${aW}%` }) }) }
    setPopSection(popAnimeCH,3); setPopSection(popAnimeJP,2);

  // findVideo => 建立影片搜尋連結
  var findVideoBox = navHtml.querySelector('.findVideo-Box'),findVideoBar = navHtml.querySelector('.findVideo-Bar'),findVideoBtn = findVideoBox.querySelectorAll('span');
  function setVideoLink(e) { var videoLink = e.target.getAttribute('alt') + findVideoBar.value; top.window.open(videoLink) }
  Array.from(findVideoBtn).forEach(btn => { btn.addEventListener('click',setVideoLink) });

  // btn-Delete => 刪除按鈕 removeChild
  var btnDelete = navHtml.querySelectorAll('.btn-Delete');
  function deleteItem() { var removeItem = this.parentNode; removeItem.classList.add('deleting'); setTimeout(() => { removeItem.parentNode.removeChild(removeItem) },500) }
  Array.from(btnDelete).forEach(btn => { btn.addEventListener('click',deleteItem) });

// ============================================================================================================================================================

})();

// ============================================================================================================================================================
