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
// เก็บสถานะและเวลาสแกนของแต่ละบาร์โค้ด
const barcodeStatus = {}; // { barcode: { status: 'active'|'inactive', inTime: Date, outTime: Date } }

function calculateParkingFee(inTime, outTime) {
    let durationMs = outTime - inTime;
    if (durationMs < 0) durationMs = 0;

    const durationSeconds = Math.ceil(durationMs / 1000); // ปัดขึ้นเป็นวินาที

    return durationSeconds; // 1 วินาที = 1 บาท
}


barcodeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const code = barcodeInput.value.trim();
        if (!code) return;
        const now = new Date();
        let user = users[code];
        if (!user) {
            // สร้างข้อมูลผู้ใช้ชั่วคราวสำหรับบาร์โค้ดใหม่
            user = { name: `Guest (${code})`, online: false, lastScan: null };
            users[code] = user;
        }
        // ตรวจสอบสถานะ
        if (!barcodeStatus[code] || barcodeStatus[code].status === 'inactive') {
            // สแกนครั้งแรก
            barcodeStatus[code] = { status: 'active', inTime: now, outTime: null };
            user.online = true;
            user.lastScan = now;
            userInfo.style.display = 'block';
            userName.textContent = `ชื่อ: ${user.name}`;
            userTime.textContent = `เวลาเข้า: ${formatTime(now)}`;
            statusDiv.style.display = 'block';
            statusDiv.textContent = 'สถานะ: ถูกใช้งาน';
            addHistory(`เข้า: ${user.name} (${code}) เวลา ${formatTime(now)}`);
        } else if (barcodeStatus[code].status === 'active') {
            // สแกนครั้งที่สอง
            barcodeStatus[code].status = 'inactive';
            barcodeStatus[code].outTime = now;
            user.online = false;
            user.lastScan = now;
            const inTime = barcodeStatus[code].inTime;
            const outTime = now;
            const fee = calculateParkingFee(inTime, outTime);
            const durationMs = outTime - inTime;
            const durationMin = Math.ceil(durationMs / (60 * 1000));
            userInfo.style.display = 'block';
            userName.textContent = `ชื่อ: ${user.name}`;
            userTime.textContent = `เวลาออก: ${formatTime(now)}`;
            statusDiv.style.display = 'block';
            statusDiv.textContent = `สถานะ: ปิดการใช้งาน | เวลาจอด ${durationMin} นาที | ค่าจอด ${fee} บาท`;
            addHistory(`ออก: ${user.name} (${code}) เวลา ${formatTime(now)} | เวลาจอด ${durationMin} นาที | ค่าจอด ${fee} บาท`);
        }
        barcodeInput.value = '';
    }
});

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

document.addEventListener('DOMContentLoaded', () => {
    const barcodeInput = document.getElementById('barcode');
    barcodeInput.focus();
});

