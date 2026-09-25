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
    
    if (!win.querySelector('.resize-handle')) {
        var handle = document.createElement('div');
        handle.className = 'resize-handle';
        handle.style.position = 'absolute';
        handle.style.bottom = '0';
        handle.style.right = '0';
        handle.style.width = '15px';
        handle.style.height = '15px';
        handle.style.cursor = 'nwse-resize';
        handle.style.background = 'linear-gradient(135deg, transparent 50%, #888 50%)';
        handle.style.zIndex = '10';
        win.appendChild(handle);
        
        handle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            isResizing = true;
            currentWin = win;
            initialWidth = parseInt(win.style.width) || win.offsetWidth;
            initialHeight = parseInt(win.style.height) || win.offsetHeight;
            initialX = e.clientX;
            initialY = e.clientY;
        });
    }
    
    bringToFront(win);
}

function closeWindow(id) { document.getElementById(id).style.display = 'none'; }
function bringToFront(el) { zCounter++; el.style.zIndex = zCounter; }

document.querySelectorAll('.window').forEach(function(win) {
    win.addEventListener('mousedown', function() { bringToFront(win); });
});

var cWin = null, oX = 0, oY = 0;
var isResizing = false, initialWidth = 0, initialHeight = 0, initialX = 0, initialY = 0;

function dragWindow(e, id) {
    cWin = document.getElementById(id);
    oX = e.clientX - cWin.offsetLeft;
    oY = e.clientY - cWin.offsetTop;
    isResizing = false;
}

document.addEventListener('mousemove', function(e) {
    if (isResizing && cWin) {
        var newWidth = Math.max(250, initialWidth + (e.clientX - initialX));
        var newHeight = Math.max(150, initialHeight + (e.clientY - initialY));
        cWin.style.width = newWidth + 'px';
        cWin.style.height = newHeight + 'px';
    } else if (cWin && !isResizing) {
        cWin.style.left = (e.clientX - oX) + 'px';
        cWin.style.top = (e.clientY - oY) + 'px';
    }
});

document.addEventListener('mouseup', function() { 
    cWin = null; 
    isResizing = false;
});

function loadGame(gameName, gameId, type) {
    var iframe = document.getElementById('game-iframe');
    var title = document.getElementById('game-title');
    var url = "";
    
    if (type === 'scratch') {
        url = "https://scratch.mit.edu/projects/" + gameId + "/embed";
    } else if (type === 'youtube') {
        url = "https://www.youtube.com/embed/" + gameId + "?autoplay=1";
    }
    
    iframe.src = url;
    title.innerText = "Now Playing: " + gameName;
    
    var btns = document.getElementsByClassName('game-btn');
    for (var i = 0; i < btns.length; i++) { btns[i].classList.remove('active'); }
    event.currentTarget.classList.add('active');
}

const OR_KEY = "YOUR_OPENROUTER_API_KEY";
var jarvisModels = ['openai/gpt-oss-120b:free', 'openai/gpt-oss-20b:free', 'google/gemma-3-27b-it:free', 'meta-llama/llama-3.3-8b-instruct:free'];
var jarvisSys = "You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), an AI assistant created by Tony Stark for the user (Koushik Tummepalli, who you call 'sir'). You are integrated into a Marvel-themed WebOS. You help with tasks, answer questions about the MCU, Spider-Man, tech, and general knowledge. You are polite, sophisticated, and concise. You sometimes connect things to God of War, Minecraft, and/or MARVEL. ALWAYS BE PG_13!";

async function callJarvisAI(messages, cb) {
    var lastErr = 'Request failed';
    for (var i = 0; i < jarvisModels.length; i++) {
        var model = jarvisModels[i];
        var res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OR_KEY, 'HTTP-Referer': window.location.href, 'X-Title': 'JARVIS WebOS' },
            body: JSON.stringify({ model: model, messages: messages })
        });
        var data = await res.json().catch(function(){ return {}; });
        if (res.ok && data.choices && data.choices[0] && data.choices[0].message) {
            cb(data.choices[0].message.content, null); return;
        }
        lastErr = (data && data.error && (data.error.message || data.error.code)) || res.statusText || lastErr;
    }
    cb(null, lastErr);
}

var jarvisHistory = [];
function scrollJarvis() { var m = document.getElementById('jarvis-messages'); m.scrollTop = m.scrollHeight; }
function addJarvisBubble(role, text) {
    var mDiv = document.getElementById('jarvis-messages');
    var row = document.createElement('div');
    row.className = 'jarvis-msg-row ' + role;
    var label = document.createElement('div');
    label.className = 'jarvis-msg-label';
    label.innerText = role === 'user' ? 'You' : 'J.A.R.V.I.S.';
    var bubble = document.createElement('div');
    bubble.className = 'jarvis-msg-bubble';
    bubble.innerText = text;
    row.appendChild(label); row.appendChild(bubble);
    mDiv.appendChild(row);
    scrollJarvis();
}
function setJarvisTyping(on) {
    var mDiv = document.getElementById('jarvis-messages');
    var existing = document.getElementById('jarvis-typing');
    if (on && !existing) {
        var typing = document.createElement('div');
        typing.id = 'jarvis-typing'; typing.className = 'jarvis-typing';
        typing.innerText = 'J.A.R.V.I.S. is processing...';
        mDiv.appendChild(typing); scrollJarvis();
    } else if (!on && existing) { existing.remove(); }
}

async function sendJarvisMsg() {
    var inp = document.getElementById('jarvis-input');
    var btn = document.getElementById('jarvis-send-btn');
    var text = inp.value.trim();
    if (!text) return;
    inp.value = ''; inp.disabled = true; btn.disabled = true;
    addJarvisBubble('user', text);

    var messages = [{role: 'system', content: jarvisSys}];
    for (var i = 0; i < jarvisHistory.length; i++) {
        messages.push({role: jarvisHistory[i].role, content: jarvisHistory[i].content});
    }
    messages.push({role: 'user', content: text});
    
    setJarvisTyping(true);

    if (!OR_KEY || OR_KEY === "YOUR_OPENROUTER_API_KEY") {
        setJarvisTyping(false);
        addJarvisBubble('assistant', 'I require an OpenRouter API key to connect to the mainframe, sir.');
        inp.disabled = false; btn.disabled = false; inp.focus();
        return;
    }

    callJarvisAI(messages, function(reply, err) {
        setJarvisTyping(false);
        if (err) {
            addJarvisBubble('assistant', 'My apologies, sir. The network seems to be experiencing some interference.');
        } else {
            addJarvisBubble('assistant', reply);
            jarvisHistory.push({role: 'user', content: text});
            jarvisHistory.push({role: 'assistant', content: reply});
        }
        inp.disabled = false; btn.disabled = false; inp.focus();
    });
}
document.getElementById('jarvis-input').addEventListener('keydown', function(e){ if(e.key === 'Enter') sendJarvisMsg(); });
