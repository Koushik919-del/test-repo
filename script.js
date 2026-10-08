// Clock Logic
function updateClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes().toString().padStart(2, '0');
    var ampm = h >= 12 ? 'PM' : 'AM';
    var hour12 = h % 12 || 12;
    
    // Update Taskbar
    var bartimeEl = document.getElementById('bartime');
    if(bartimeEl) bartimeEl.innerText = hour12 + ':' + m + ' ' + ampm;
    
    // Update Clock App
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
setInterval(updateClock, 1000); 
updateClock();

// Window Management
var zCounter = 100;
function openWindow(id) {
    var win = document.getElementById(id);
    if (!win) return;
    win.style.display = 'flex';
    
    // Center the window if it hasn't been moved yet
    if (win.style.left === '') {
        win.style.left = (window.innerWidth / 2 - parseInt(win.style.width) / 2) + 'px';
        win.style.top = (window.innerHeight / 2 - parseInt(win.style.height) / 2) + 'px';
    }
    bringToFront(win);
}

function closeWindow(id) { 
    var win = document.getElementById(id);
    if(win) win.style.display = 'none'; 
}

function bringToFront(el) { 
    zCounter++; 
    el.style.zIndex = zCounter; 
}

document.querySelectorAll('.window').forEach(function(win) {
    win.addEventListener('mousedown', function() { bringToFront(win); });
});

// Draging Logic
var cWin = null, oX = 0, oY = 0;

function dragWIndow(e, id) { // Note: capital 'I' matches your HTML
    cWin = document.getElementById(id);
    if(!cWin) return;
    oX = e.clientX - cWin.offsetLeft;
    oY = e.clientY - cWin.offsetTop;
}

document.addEventListener('mousemove', function(e) {
    if (cWin) {
        cWin.style.left = (e.clientX - oX) + 'px';
        cWin.style.top = (e.clientY - oY) + 'px';
    }
});

document.addEventListener('mouseup', function() { 
    cWin = null; 
});

// Games Logic
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
}

// F.R.I.D.A.Y. Logic (Basic auto-responses since no API key)
function sendJarvisMsg() {
    var inp = document.getElementById('jarvis-input');
    var btn = document.getElementById('jarvis-send-btn');
    var text = inp.value.trim();
    if (!text) return;
    
    // Add user message
    var mDiv = document.getElementById('jarvis-messages');
    var userRow = document.createElement('div');
    userRow.className = 'jarvis-msg-row user';
    userRow.innerHTML = '<div class="jarvis-msg-label">You</div><div class="jarvis-msg-bubble">' + text + '</div>';
    mDiv.appendChild(userRow);
    
    inp.value = ''; inp.disabled = true; btn.disabled = true;
    mDiv.scrollTop = mDiv.scrollHeight;

    // Simulate thinking
    setTimeout(function() {
        var reply = "Processing request, sir. The TVA sensors are currently blocking my mainframe access, but I am logging your query: '" + text + "'.";
        var aiRow = document.createElement('div');
        aiRow.className = 'jarvis-msg-row assistant';
        aiRow.innerHTML = '<div class="jarvis-msg-label">F.R.I.D.A.Y.</div><div class="jarvis-msg-bubble">' + reply + '</div>';
        mDiv.appendChild(aiRow);
        mDiv.scrollTop = mDiv.scrollHeight;
        inp.disabled = false; btn.disabled = false; inp.focus();
    }, 1000);
}

document.getElementById('jarvis-input').addEventListener('keydown', function(e){ if(e.key === 'Enter') sendJarvisMsg(); });

// S.H.I.E.L.D. Database Logic
function searchShield() {
    var inp = document.getElementById('shield-search');
    var res = document.getElementById('shield-result');
    var query = inp.value.trim().toLowerCase();
    
    if (!query) return;
    
    res.innerHTML = "<p>> SEARCHING MAINFRAME FOR: " + query.toUpperCase() + "...</p>";
    
    setTimeout(function() {
        var data = "";
        if (query.includes("thanos")) {
            data = "<h3>THANOS</h3><p>STATUS: DECEASED</p><p>THREAT LEVEL: APPREHENDED (2018-2023)</p><p>ORIGIN: TITAN</p>";
        } else if (query.includes("spider-man") || query.includes("spiderman")) {
            data = "<h3>SPIDER-MAN</h3><p>STATUS: ACTIVE</p><p>THREAT LEVEL: LOW (PUBLIC MENACE)</p><p>ORIGIN: EARTH, QUEENS</p>";
        } else {
            data = "<p>> NO RECORDS FOUND FOR '" + query.toUpperCase() + "'.</p><p>> CLEARANCE LEVEL INSUFFICIENT OR SUBJECT DOES NOT EXIST IN SACRED TIMELINE.</p>";
        }
        res.innerHTML = data;
    }, 800);
}
