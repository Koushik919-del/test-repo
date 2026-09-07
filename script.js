function updateClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes().toString().padStart(2, '0');
    var ampm = h >= 12 ? 'PM' : 'AM';
    var hour12 = h % 12 || 12;
    document.getElementById('clock-taskbar').innerText = hour12 + ':' + m + ' ' + ampm;
    
    var timeEl = document.getElementById('clock-time');
    var dateEl = document.getElementById('clock-date');
    if(timeEl) timeEl.innerText = hour12 + ':' + m + ' ' + ampm;
    if(dateEl) dateEl.innerText = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    var sec = now.getSeconds();
    var min = now.getMinutes();
    var hr = now.getHours();
    
    var secDeg = sec * 6;
    var minDeg = min * 6 + (sec * 0.1);
    var hrDeg = (hr % 12) * 30 + (min * 0.5);

    var secHand = document.getElementById('hand-second');
    var minHand = document.getElementById('hand-minute');
    var hrHand = document.getElementById('hand-hour');

    if(secHand) secHand.style.transform = 'rotate(' + secDeg + 'deg)';
    if(minHand) minHand.style.transform = 'rotate(' + minDeg + 'deg)';
    if(hrHand) hrHand.style.transform = 'rotate(' + hrDeg + 'deg)';
}
setInterval(updateClock, 1000); updateClock();

var zCounter = 100;
function openWindow(id) {
    var win = document.getElementById(id);
    win.style.display = 'flex';
    if (win.style.left === '') {
        win.style.left = (window.innerWidth / 2 - parseInt(win.style.width) / 2) + 'px';
        win.style.top = (window.innerHeight / 2 - parseInt(win.style.height) / 2) + 'px';
    }
    bringToFront(win);
}
function closeWindow(id) { document.getElementById(id).style.display = 'none'; }
function bringToFront(el) { zCounter++; el.style.zIndex = zCounter; }

document.querySelectorAll('.window').forEach(function(win) {
    win.addEventListener('mousedown', function() { bringToFront(win); });
});

var cWin = null, oX = 0, oY = 0;
function dragWindow(e, id) {
    cWin = document.getElementById(id);
    oX = e.clientX - cWin.offsetLeft;
    oY = e.clientY - cWin.offsetTop;
}
document.addEventListener('mousemove', function(e) {
    if (cWin) {
        cWin.style.left = (e.clientX - oX) + 'px';
        cWin.style.top = (e.clientY - oY) + 'px';
    }
});
document.addEventListener('mouseup', function() { cWin = null; });

var OR_KEY = "YOUR_OPENROUTER_API_KEY";
var AI_MODELS = ['openai/gpt-oss-120b:free', 'openai/gpt-oss-20b:free', 'google/gemma-3-27b-it:free', 'meta-llama/llama-3.3-8b-instruct:free'];

function callAI(messages, cb) {
    var lastErr = 'Request failed';
    var modelIndex = 0;
    function tryNext() {
        if (modelIndex >= AI_MODELS.length) { cb(null, lastErr); return; }
        var model = AI_MODELS[modelIndex]; modelIndex++;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "https://openrouter.ai/api/v1/chat/completions", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + OR_KEY);
        xhr.setRequestHeader('HTTP-Referer', window.location.href);
        xhr.setRequestHeader('X-Title', 'WebOS');
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    if (data.choices && data.choices[0] && data.choices[0].message) { cb(data.choices[0].message.content, null); return; }
                } catch (e) {}
            }
            tryNext();
        };
        xhr.onerror = function() { tryNext(); };
        xhr.send(JSON.stringify({ model: model, messages: messages }));
    }
    tryNext();
}

var jHistory = [];
var jSys = "You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), an AI assistant created by Tony Stark for the user (Koushik Tummepalli, who you call 'sir'). You are integrated into a Marvel-themed WebOS. You help with tasks, answer questions about the MCU, Spider-Man, tech, and general knowledge. You are polite, sophisticated, and concise. You sometimes connect things to God of War, Minecraft, and/or MARVEL. ALWAYS BE PG_13!";

function scrollJ() { var m = document.getElementById('jarvis-messages'); m.scrollTop = m.scrollHeight; }
function addJBub(role, text) {
    var mDiv = document.getElementById('jarvis-messages');
    var row = document.createElement('div');
    row.className = role === 'user' ? 'jarvis-msg-row user' : 'jarvis-msg-row assistant';
    var lbl = document.createElement('div');
    lbl.className = 'jarvis-msg-label';
    lbl.innerText = role === 'user' ? 'You' : 'J.A.R.V.I.S.';
    var bub = document.createElement('div');
    bub.className = 'jarvis-msg-bubble';
    bub.innerText = text;
    row.appendChild(lbl); row.appendChild(bub);
    mDiv.appendChild(row);
    scrollJ();
}
function setJTyping(on) {
    var mDiv = document.getElementById('jarvis-messages');
    var ex = document.getElementById('jarvis-typing');
    if (on && !ex) {
        var t = document.createElement('div');
        t.id = 'jarvis-typing'; t.className = 'jarvis-typing';
        t.innerText = 'J.A.R.V.I.S. is processing...';
        mDiv.appendChild(t); scrollJ();
    } else if (!on && ex) { ex.remove(); }
}

function sendJarvisMsg() {
    var inp = document.getElementById('jarvis-input');
    var btn = document.getElementById('jarvis-send-btn');
    var text = inp.value.trim();
    if (!text) return;

    inp.value = ''; inp.disabled = true; btn.disabled = true;
    addJBub('user', text);

    var messages = [{role: 'system', content: jSys}];
    for (var i = 0; i < jHistory.length; i++) {
        messages.push({role: jHistory[i].role, content: jHistory[i].content});
    }
    messages.push({role: 'user', content: text});

    setJTyping(true);

    if (!OR_KEY || OR_KEY === "YOUR_OPENROUTER_API_KEY") {
        setJTyping(false);
        addJBub('assistant', 'I require an OpenRouter API key to connect to the mainframe, sir.');
        inp.disabled = false; btn.disabled = false; inp.focus();
        return;
    }

    callAI(messages, function(reply, err) {
        setJTyping(false);
        if (err) {
            addJBub('assistant', 'My apologies, sir. The network seems to be experiencing some interference.');
        } else {
            addJBub('assistant', reply);
            jHistory.push({role: 'user', content: text});
            jHistory.push({role: 'assistant', content: reply});
        }
        inp.disabled = false; btn.disabled = false; inp.focus();
    });
}
document.getElementById('jarvis-input').addEventListener('keydown', function(e){ if(e.key === 'Enter') sendJarvisMsg(); });

function searchShield() {
    var query = document.getElementById('shield-search').value.trim();
    var resDiv = document.getElementById('shield-result');
    var btn = document.getElementById('shield-btn');
    var inp = document.getElementById('shield-search');
    if (!query) return;

    btn.disabled = true; inp.disabled = true;
    resDiv.innerHTML = '<p class="shield-loading">> CONNECTING TO MAINFRAME...</p><p class="shield-loading">> QUERYING ARCHIVES FOR: ' + query + '...</p><p class="shield-loading">> GENERATING LEVEL 7 FILE...</p>';

    var sysPrompt = "You are the S.H.I.E.L.D. AI System. The user is an agent with Level 7 clearance. Generate a highly detailed, classified S.H.I.E.L.D. file for the requested Marvel character. Format the response EXACTLY like this:\n\n> FILE FOUND. ACCESS GRANTED.\n\n<h3>Subject Name (Alias)</h3>\n<strong>Threat Level:</strong> [Low/Medium/High/Extreme/Apocalyptic]\n<strong>Last Known Location:</strong> [Location]\n<strong>Abilities:</strong> [Brief list of powers/gear]\n<strong>Note:</strong> [A 2-3 sentence in-universe note from Nick Fury or Maria Hill].\n\nKeep it strictly in the MCU Sacred Timeline canon.";

    var msgs = [ { role: 'system', content: sysPrompt }, { role: 'user', content: 'Fetch file for: ' + query } ];

    callAI(msgs, function(reply, err) {
        if (err) {
            resDiv.innerHTML = '> ERROR: MAINFRAME OFFLINE.';
        } else {
            resDiv.innerHTML = reply;
        }
        btn.disabled = false; inp.disabled = false;
    });
}
document.getElementById('shield-search').addEventListener('keydown', function(e){ if(e.key === 'Enter') searchShield(); });

var gCanvas = document.getElementById('game-canvas');
var gCtx = gCanvas.getContext('2d');
var gW = 380, gH = 420;
gCanvas.width = gW; gCanvas.height = gH;
var player = { x: gW/2, y: gH-30, w: 20, h: 20, speed: 4 };
var bullets = [], bombs = [], keys = {}, score = 0;

window.addEventListener('keydown', function(e) {
    if (document.getElementById('win-game').style.display === 'flex') {
        keys[e.key.toLowerCase()] = true;
        if (e.key === ' ') { e.preventDefault(); bullets.push({ x: player.x + 10, y: player.y, w: 2, h: 10 }); }
    }
});
window.addEventListener('keyup', function(e) { keys[e.key.toLowerCase()] = false; });

function spawnBomb() { bombs.push({ x: Math.random() * (gW - 20), y: 0, w: 15, h: 15, speed: Math.random() * 2 + 1 }); }
setInterval(spawnBomb, 1500);

function gameLoop() {
    if (document.getElementById('win-game').style.display !== 'flex') { requestAnimationFrame(gameLoop); return; }
    
    gCtx.clearRect(0, 0, gW, gH);
    if (keys['a'] && player.x > 0) player.x -= player.speed;
    if (keys['d'] && player.x < gW - player.w) player.x += player.speed;
    
    gCtx.fillStyle = '#ff0000';
    gCtx.fillRect(player.x, player.y, player.w, player.h);
    gCtx.fillStyle = '#fff';
    gCtx.fillRect(player.x + 5, player.y + 5, 10, 10);
    
    gCtx.fillStyle = '#fff';
    for (var i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 6;
        gCtx.fillRect(bullets[i].x, bullets[i].y, bullets[i].w, bullets[i].h);
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }
    
    gCtx.fillStyle = '#00ff00';
    for (var j = bombs.length - 1; j >= 0; j--) {
        bombs[j].y += bombs[j].speed;
        gCtx.beginPath(); gCtx.arc(bombs[j].x + 7.5, bombs[j].y + 7.5, 7.5, 0, Math.PI*2); gCtx.fill();
        
        if (bombs[j].x < player.x + player.w && bombs[j].x + bombs[j].w > player.x && bombs[j].y < player.y + player.h && bombs[j].y + bombs[j].h > player.y) {
            score = 0; bombs = []; document.getElementById('game-score').innerText = score;
        }
        
        for (var k = bullets.length - 1; k >= 0; k--) {
            if (bullets[k].x < bombs[j].x + bombs[j].w && bullets[k].x + bullets[k].w > bombs[j].x && bullets[k].y < bombs[j].y + bombs[j].h && bullets[k].y + bullets[k].h > bombs[j].y) {
                bombs.splice(j, 1); bullets.splice(k, 1); score += 10; document.getElementById('game-score').innerText = score; break;
            }
        }
        if (bombs[j] && bombs[j].y > gH) bombs.splice(j, 1);
    }
    requestAnimationFrame(gameLoop);
}
gameLoop();

window.onload = function() {
    openWindow('win-welcome');
};
