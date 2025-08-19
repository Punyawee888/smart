// Mock user database
const users = {
    '123456': { name: 'สมชาย', online: false, lastScan: null },
    '88519523501611': { name: 'สุภาพร', online: false, lastScan: null },
    '111222': { name: 'John Doe', online: false, lastScan: null },
    '8851952350161': { name: 'ผู้ใช้ใหม่', online: false, lastScan: null }
};

const barcodeInput = document.getElementById('barcode');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const userTime = document.getElementById('userTime');
const statusDiv = document.getElementById('status');
const newCardBtn = document.getElementById('newCardBtn');
const historyList = document.getElementById('historyList');
let history = [];

function formatTime(date) {
    return date.toLocaleString('th-TH', { hour12: false });
}

function addHistory(text) {
    history.unshift(text);
    if (history.length > 5) history = history.slice(0, 5);
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li>ยังไม่มีรายการ</li>';
        return;
    }
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

barcodeInput.addEventListener('change', function() {
    const code = barcodeInput.value.trim();
    if (!code) return;
    if (users[code]) {
        const user = users[code];
        userInfo.style.display = 'block';
        userName.textContent = 'User: ' + user.name;
        const now = new Date();
        if (!user.online) {
            user.online = true;
            user.lastScan = now;
            userTime.textContent = 'เวลาเข้าใช้งาน: ' + formatTime(now);
            statusDiv.textContent = 'สถานะ: ออนไลน์ (บัตรถูกใช้งาน)';
            statusDiv.className = 'status online';
            addHistory(`เข้าใช้งาน: ${user.name} (${code}) เวลา ${formatTime(now)}`);
        } else {
            user.online = false;
            userTime.textContent = 'เวลาออก: ' + formatTime(now);
            statusDiv.textContent = 'สถานะ: ออฟไลน์ (บัตรว่าง)';
            statusDiv.className = 'status offline';
            addHistory(`ออก: ${user.name} (${code}) เวลา ${formatTime(now)}`);
        }
        statusDiv.style.display = 'block';
    } else {
        userInfo.style.display = 'none';
        statusDiv.textContent = 'ไม่พบผู้ใช้งานในระบบ';
        statusDiv.className = 'status offline';
        statusDiv.style.display = 'block';
        addHistory(`ไม่พบผู้ใช้งาน: ${code} เวลา ${formatTime(new Date())}`);
    }
    barcodeInput.value = '';
});

newCardBtn.addEventListener('click', function() {
    userInfo.style.display = 'none';
    statusDiv.style.display = 'none';
    barcodeInput.value = '';
    barcodeInput.focus();
});

renderHistory();
