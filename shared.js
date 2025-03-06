// shared.js - Common functionality for prayer times and exam timetable

// Prayer times functionality
async function getPrayerTimes() {
    try {
        // Get today's date in YYYY-MM-DD format for the API
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        // Include the date in the API request to ensure we get today's times
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Cairo&country=Egypt&method=5`);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store the prayer times in localStorage as a backup
        localStorage.setItem('lastPrayerTimes', JSON.stringify({
            times: data.data.timings,
            date: dateStr
        }));
        
        return data.data.timings;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        
        // Try to use cached prayer times from localStorage if available
        const cachedData = localStorage.getItem('lastPrayerTimes');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            console.log('Using cached prayer times from:', parsedData.date);
            return parsedData.times;
        }
        
        // If no cached data, return fallback times
        return getFallbackPrayerTimes();
    }
}

// Fallback prayer times in case API fails and no cache is available
function getFallbackPrayerTimes() {
    // These are approximate prayer times that can be used as a fallback
    // They won't be accurate but will prevent the app from breaking
    const now = new Date();
    return {
        'Fajr': '05:00',
        'Sunrise': '06:30',
        'Dhuhr': '12:00',
        'Asr': '15:30',
        'Maghrib': '18:00',
        'Isha': '19:30'
    };
}

// Format time remaining
function formatTimeRemaining(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 24 hour to 12 hour format converter
function formatTo12Hour(timeStr) {
    const [hour, minute] = timeStr.split(':');
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${period}`;
}

// Parse time string to Date object
function parseTime(timeStr) {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10), 0);
    return date;
}

// Update progress bar
function updateProgress(startTime, endTime, currentTime) {
    const total = endTime - startTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    document.getElementById('progress').style.width = `${progress}%`;
}

// Function to play Adhan
function playAdhan() {
    try {
        const adhan = new Audio('https://islamcan.com/audio/adhan/azan1.mp3');
        adhan.play().catch(e => console.log('User interaction required to play Adhan'));
        
        // Show notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Prayer Time', {
                body: 'It\'s time to pray',
                icon: 'https://example.com/mosque-icon.png'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    } catch (error) {
        console.error('Error playing Adhan:', error);
    }
}

// Navigation functions
function setupNavigation() {
    document.getElementById('prayer-btn').addEventListener('click', function() {
        showPrayerView();
    });
    
    document.getElementById('exam-btn').addEventListener('click', function() {
        showExamView();
    });
}

function showPrayerView() {
    // Show prayer view and hide exam view
    if (document.getElementById('prayer-view')) {
        document.getElementById('prayer-view').style.display = 'block';
    }
    if (document.getElementById('exam-view')) {
        document.getElementById('exam-view').style.display = 'none';
    }
    
    // Update active button styles
    document.getElementById('prayer-btn').classList.add('active');
    document.getElementById('exam-btn').classList.remove('active');
    
    // Update browser history without reloading
    history.pushState(null, 'Prayer Times', 'index.html');
    
    // Update page title
    document.title = 'Prayer Times Countdown';
}

function showExamView() {
    // Show exam view and hide prayer view
    if (document.getElementById('prayer-view')) {
        document.getElementById('prayer-view').style.display = 'none';
    }
    if (document.getElementById('exam-view')) {
        document.getElementById('exam-view').style.display = 'block';
    }
    
    // Update active button styles
    document.getElementById('prayer-btn').classList.remove('active');
    document.getElementById('exam-btn').classList.add('active');
    
    // Update browser history without reloading
    history.pushState(null, 'Exam Timetable', 'index.html?view=exam');
    
    // Update page title
    document.title = 'Exam Timetable';
    
    // Make sure exam data is loaded
    if (typeof loadExams === 'function') {
        loadExams();
        updateAllDaysLeft();
    }
}

// Initialize navigation based on URL parameters
function initializeView() {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    
    if (view === 'exam') {
        showExamView();
    } else {
        showPrayerView();
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    initializeView();
});

// Export functions for use in other files
window.getPrayerTimes = getPrayerTimes;
window.getFallbackPrayerTimes = getFallbackPrayerTimes;
window.formatTimeRemaining = formatTimeRemaining;
window.formatTo12Hour = formatTo12Hour;
window.parseTime = parseTime;
window.updateProgress = updateProgress;
window.playAdhan = playAdhan;
window.setupNavigation = setupNavigation;
window.showPrayerView = showPrayerView;
window.showExamView = showExamView;
window.initializeView = initializeView;
