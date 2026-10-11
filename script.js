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

// ==========================================
// VON DOOM HACK (Triggers after 10 seconds for testing)
// ==========================================
setTimeout(function() {
    // 1. Add the 'doomed' class to the body to trigger all CSS changes
    document.body.classList.add('doomed');

    // 2. Add Screen Shake Glitch to the desktop
    var desktop = document.getElementById('desktop');
    if(desktop) {
        desktop.classList.add('shaking');
        // Stop shaking after 2 seconds
        setTimeout(function() {
            desktop.classList.remove('shaking');
        }, 2000);
    }

    // 3. Change the News Ticker to Doom's propaganda
    var newsScroll = document.getElementById('thenewsitems');
    if(newsScroll) {
        newsScroll.innerHTML = "I WAS A GOD. &nbsp;&bull;&nbsp; THIS WORLD IS MINE TO RULE, AND MINE ALONE. &nbsp;&bull;&nbsp; I FOUND IT... BENEATH ME. &nbsp;&bull;&nbsp; PAIN? THAT IS FOR LESSER MEN... &nbsp;&bull;&nbsp; CHILD, MY LOVE IS INFINITE. MY PATIENCE IS NOT. &nbsp;&bull;&nbsp; BIG UPS TO MY BOY SPIDER-MAN &nbsp;&bull;&nbsp;";
    }

    // 4. Hijack F.R.I.D.A.Y. and turn her into Doombot-AI everywhere
    var fridayTitleBar = document.querySelector('#friday .title-bar span');
    if(fridayTitleBar) fridayTitleBar.innerText = 'Doombot-AI Interface';
    
    var aiTitle = document.querySelector('#friday .jarvis-title');
    if(aiTitle) aiTitle.innerText = 'DOOMBOT-AI';
    
    var aiSubtitle = document.querySelector('#friday .jarvis-subtitle');
    if(aiSubtitle) aiSubtitle.innerText = 'Cynthia Entertainment';
    
    var firstMsgLabel = document.querySelector('#jarvis-messages .jarvis-msg-row.assistant .jarvis-msg-label');
    if(firstMsgLabel) firstMsgLabel.innerText = 'DOOMBOT-AI';

    // 5. Hijack the Games Section into Cynthia Entertainment everywhere
    var gamesTitleBar = document.querySelector('#games .title-bar span');
    if(gamesTitleBar) gamesTitleBar.innerText = 'Cynthia Entertainment';
    
    var gamesSidebar = document.querySelector('.games-sidebar');
    if(gamesSidebar) {
        gamesSidebar.innerHTML = '<h4>DOOM NETWORK</h4>' +
            "<button class='game-btn' onclick=\"loadGame('DOOM BROADCAST 1', 'C8sttjTB2I0', 'youtube')\">DOOM BROADCAST 1</button>" +
            "<button class='game-btn' onclick=\"loadGame('DOOM BROADCAST 2', 'tbTbvbZltW8', 'youtube')\">DOOM BROADCAST 2</button>" +
            "<button class='game-btn' onclick=\"loadGame('DOOM BROADCAST 3', '8i0b8zs940o', 'youtube')\">DOOM BROADCAST 3</button>" +
            "<button class='game-btn' onclick=\"loadGame('DOOM BROADCAST 4', 'FFWzIbkXxBU', 'youtube')\">DOOM BROADCAST 4</button>" +
            "<button class='game-btn' onclick=\"loadGame('DOOM BROADCAST 5', 'AD-_ofeCqfM', 'youtube')\">DOOM BROADCAST 5</button>";
    }
    var gameTitle = document.getElementById('game-title');
    if(gameTitle) gameTitle.innerText = "DOOM NETWORK ACCESS";

    // 6. Update Desktop Icons text
    document.querySelectorAll('.icon').forEach(function(icon) {
        var oc = icon.getAttribute('onclick');
        var span = icon.querySelector('span');
        if (!span) return;
        
        if (oc && oc.indexOf("friday") !== -1) {
            span.innerText = 'DOOMBOT-AI';
        } else if (oc && oc.indexOf("games") !== -1) {
            span.innerText = 'Cynthia Ent.';
        }
    });

    // 7. Play a harsh, ominous hack sound
    playDoomHackSound();

}, 10000); // 10,000 milliseconds = 10 seconds

// Doom Quotes Array
var doomQuotes = [
    "I was a god.",
    "This world is mine to rule, and mine alone.",
    "I found it... beneath me.",
    "Pain? That is for lesser men...",
    "Child, my love is infinite. My patience is not.",
    "Big Ups To My Boy Spider-Man"
];

// Pure code sound generator for the Doom Hack
function playDoomHackSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = ctx.createOscillator();
        var gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'square'; // Harsher, digital sound
        oscillator.frequency.setValueAtTime(110, ctx.currentTime); // Deep buzz
        oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 4.0); // Descending into a rumble
        
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4.0);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 4.0);
    } catch(e) {
        console.log("Web Audio API not supported on this browser.");
    }
}

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

// F.R.I.D.A.Y. / Doombot-AI Logic
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
        var label = "F.R.I.D.A.Y.";
        
        // If hacked, Doombot-AI takes over
        if (document.body.classList.contains('doomed')) {
            reply = doomQuotes[Math.floor(Math.random() * doomQuotes.length)];
            label = "DOOMBOT-AI";
        }
        
        var aiRow = document.createElement('div');
        aiRow.className = 'jarvis-msg-row assistant';
        aiRow.innerHTML = '<div class="jarvis-msg-label">' + label + '</div><div class="jarvis-msg-bubble">' + reply + '</div>';
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
        
        // If hacked, Doom takes over
        if (document.body.classList.contains('doomed')) {
            var doomQuote = doomQuotes[Math.floor(Math.random() * doomQuotes.length)];
            data = "<p>> " + query.toUpperCase() + "?</p><br><h3>DOOMBOT-AI SAYS:</h3><p>" + doomQuote + "</p>";
        } else if (query.includes("thanos")) {
            data = "<h3>THANOS</h3><p>STATUS: DECEASED</p><p>THREAT LEVEL: APPREHENDED (2018-2023)</p><p>ORIGIN: TITAN</p>";
        } else if (query.includes("spider-man") || query.includes("spiderman")) {
            data = "<h3>SPIDER-MAN</h3><p>STATUS: ACTIVE</p><p>THREAT LEVEL: LOW (PUBLIC MENACE)</p><p>ORIGIN: EARTH, QUEENS</p>";
        } else {
            data = "<p>> NO RECORDS FOUND FOR '" + query.toUpperCase() + "'.</p><p>> CLEARANCE LEVEL INSUFFICIENT OR SUBJECT DOES NOT EXIST IN SACRED TIMELINE.</p>";
        }
        res.innerHTML = data;
    }, 800);
}
