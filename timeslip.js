// timeslip.js

function triggerTimeSlip(windowId) {
    // 1. Close the welcome window
    if (windowId) closeWindow(windowId);
    
    // 2. Get the desktop and overlay
    var desktop = document.getElementById('desktop');
    var overlay = document.getElementById('time-slip-overlay');
    var textEl = document.getElementById('slip-text');
    
    // 3. Add random time-slipping quotes
    var phrases = ["TIME SLIPPING...", "SACRED TIMELINE", "TVA ACCESS GRANTED", "JETSKI DETECTED"];
    textEl.innerText = phrases[Math.floor(Math.random() * phrases.length)];
    
    // 4. Add shake to desktop and activate overlay
    desktop.classList.add('shaking');
    overlay.classList.add('active');
    
    // 5. Play the sci-fi sound effect (No download required!)
    playSlipSound();
    
    // 6. After 2 seconds, stop the animation and return to normal
    setTimeout(function() {
        desktop.classList.remove('shaking');
        overlay.classList.remove('active');
        
        // Optional: You can trigger another app to open right here!
        // openWindow('dailybugle');
        
    }, 2000);
}

// A pure code sound generator for that "time travel" whirring sound
function playSlipSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = ctx.createOscillator();
        var gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 1.5);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1.5);
    } catch(e) {
        console.log("Web Audio API not supported on this browser.");
    }
}
