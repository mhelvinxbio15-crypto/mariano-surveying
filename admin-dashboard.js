// ================= LOCAL STORAGE DATABASE ================= 
class LocalDatabase {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('mariano_users')) || [];
    this.inquiries = JSON.parse(localStorage.getItem('mariano_inquiries')) || [];
    this.settings = JSON.parse(localStorage.getItem('mariano_settings')) || this.defaultSettings();
  }

  defaultSettings() {
    return {
      businessName: "Mariano Land Surveying & Realty Services",
      businessPhone: "+639272104446",
      businessEmail: "contact@mariano.com"
    };
  }

  addUser(user) {
    user.id = Date.now();
    user.joinDate = new Date().toLocaleDateString();
    this.users.push(user);
    this.saveUsers();
    return user;
  }

  addInquiry(inquiry) {
    inquiry.id = Date.now();
    inquiry.date = new Date().toLocaleDateString();
    inquiry.status = "pending";
    this.inquiries.push(inquiry);
    this.saveInquiries();
    return inquiry;
  }

  updateInquiry(id, updates) {
    const inquiry = this.inquiries.find(i => i.id === id);
    if (inquiry) {
      Object.assign(inquiry, updates);
      this.saveInquiries();
    }
    return inquiry;
  }

  getInquiries() {
    return this.inquiries;
  }

  getUsers() {
    return this.users;
  }

  saveUsers() {
    localStorage.setItem('mariano_users', JSON.stringify(this.users));
  }

  saveInquiries() {
    localStorage.setItem('mariano_inquiries', JSON.stringify(this.inquiries));
  }

  saveSettings(settings) {
    this.settings = settings;
    localStorage.setItem('mariano_settings', JSON.stringify(settings));
  }

  getSettings() {
    return this.settings;
  }
}

// ================= ADMIN DASHBOARD ================= 
const db = new LocalDatabase();

// Navigation
const navBtns = document.querySelectorAll('.nav-btn');
const pageSections = document.querySelectorAll('.page-section');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    pageSections.forEach(s => s.classList.remove('active'));

    btn.classList.add('active');
    const pageName = btn.dataset.page;
    document.getElementById(pageName).classList.add('active');

    if (pageName === 'inquiries') loadInquiries();
    if (pageName === 'users') loadUsers();
    if (pageName === 'settings') loadSettings();
  });
});

// ================= DASHBOARD OVERVIEW ================= 
function updateOverview() {
  document.getElementById('totalUsers').textContent = db.getUsers().length;
  document.getElementById('totalInquiries').textContent = db.getInquiries().length;
  document.getElementById('completedInquiries').textContent = db.getInquiries().filter(i => i.status === 'completed').length;
  document.getElementById('pendingInquiries').textContent = db.getInquiries().filter(i => i.status === 'pending').length;

  loadRecentInquiries();
}

function loadRecentInquiries() {
  const tbody = document.getElementById('recentInquiriesTable');
  const inquiries = db.getInquiries().slice(-5).reverse();

  if (inquiries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No inquiries yet</td></tr>';
    return;
  }

  tbody.innerHTML = inquiries.map(inq => `
    <tr>
      <td>${inq.name}</td>
      <td>${inq.email}</td>
      <td>${inq.phone || 'N/A'}</td>
      <td><span class="status-badge status-${inq.status}">${inq.status}</span></td>
      <td><button class="btn-secondary" onclick="openInquiryModal(${inq.id})">Edit</button></td>
    </tr>
  `).join('');
}

// ================= INQUIRIES PAGE ================= 
function loadInquiries() {
  const tbody = document.getElementById('inquiriesTable');
  const inquiries = db.getInquiries();

  if (inquiries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No inquiries yet</td></tr>';
    return;
  }

  tbody.innerHTML = inquiries.map(inq => `
    <tr>
      <td>#${inq.id}</td>
      <td>${inq.name}</td>
      <td>${inq.email}</td>
      <td>${inq.phone || 'N/A'}</td>
      <td>${inq.message ? inq.message.substring(0, 30) + '...' : 'N/A'}</td>
      <td>${inq.date}</td>
      <td><span class="status-badge status-${inq.status}">${inq.status}</span></td>
      <td>
        <button class="btn-secondary" onclick="openInquiryModal(${inq.id})">Edit</button>
        <button class="btn-warning" onclick="deleteInquiry(${inq.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ================= USERS PAGE ================= 
function loadUsers() {
  const tbody = document.getElementById('usersTable');
  const users = db.getUsers();

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No users yet</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>#${user.id}</td>
      <td>${user.userName || 'N/A'}</td>
      <td>${user.userPhone || 'N/A'}</td>
      <td>${user.email || 'N/A'}</td>
      <td>${user.loginType || 'Phone'}</td>
      <td>${user.joinDate}</td>
      <td><span class="status-badge status-completed">Active</span></td>
      <td>
        <button class="btn-warning" onclick="deleteUser(${user.id})">Remove</button>
      </td>
    </tr>
  `).join('');
}

// ================= SETTINGS PAGE ================= 
function loadSettings() {
  const settings = db.getSettings();
  document.getElementById('businessName').value = settings.businessName;
  document.getElementById('businessPhone').value = settings.businessPhone;
  document.getElementById('businessEmail').value = settings.businessEmail;
}

document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
  const settings = {
    businessName: document.getElementById('businessName').value,
    businessPhone: document.getElementById('businessPhone').value,
    businessEmail: document.getElementById('businessEmail').value
  };
  db.saveSettings(settings);
  alert('✅ Settings saved successfully!');
});

// ================= EXPORT DATA ================= 
function exportToCSV(data, filename) {
  const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

document.getElementById('exportUsersBtn')?.addEventListener('click', () => {
  if (db.getUsers().length === 0) {
    alert('No users to export');
    return;
  }
  exportToCSV(db.getUsers(), 'users.csv');
});

document.getElementById('exportInquiriesBtn')?.addEventListener('click', () => {
  if (db.getInquiries().length === 0) {
    alert('No inquiries to export');
    return;
  }
  exportToCSV(db.getInquiries(), 'inquiries.csv');
});

document.getElementById('exportAllBtn')?.addEventListener('click', () => {
  const allData = {
    users: db.getUsers(),
    inquiries: db.getInquiries(),
    settings: db.getSettings(),
    exportDate: new Date().toLocaleDateString()
  };
  const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mariano-backup.json';
  a.click();
});

// ================= MODAL ================= 
const modal = document.getElementById('inquiryModal');
const modalClose = document.querySelector('.modal-close');

let currentInquiryId = null;

function openInquiryModal(id) {
  const inquiry = db.getInquiries().find(i => i.id === id);
  if (!inquiry) return;

  currentInquiryId = id;
  document.getElementById('modalName').textContent = inquiry.name;
  document.getElementById('modalEmail').textContent = inquiry.email;
  document.getElementById('modalPhone').textContent = inquiry.phone || 'N/A';
  document.getElementById('modalMessage').textContent = inquiry.message || 'N/A';
  document.getElementById('modalStatus').value = inquiry.status;

  modal.classList.add('active');
}

modalClose?.addEventListener('click', () => {
  modal.classList.remove('active');
});

document.getElementById('saveInquiryBtn')?.addEventListener('click', () => {
  const status = document.getElementById('modalStatus').value;
  db.updateInquiry(currentInquiryId, { status });
  alert('✅ Inquiry updated!');
  modal.classList.remove('active');
  loadInquiries();
  updateOverview();
});

// ================= DELETE FUNCTIONS ================= 
function deleteInquiry(id) {
  if (confirm('Are you sure?')) {
    db.inquiries = db.inquiries.filter(i => i.id !== id);
    db.saveInquiries();
    loadInquiries();
    updateOverview();
  }
}

function deleteUser(id) {
  if (confirm('Are you sure?')) {
    db.users = db.users.filter(u => u.id !== id);
    db.saveUsers();
    loadUsers();
    updateOverview();
  }
}

// ================= LOGOUT ================= 
document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
  if (confirm('Logout?')) {
    window.location.href = 'index.html';
  }
});

// ================= SEARCH ================= 
document.getElementById('inquirySearch')?.addEventListener('input', (e) => {
  const search = e.target.value.toLowerCase();
  const tbody = document.getElementById('inquiriesTable');
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? '' : 'none';
  });
});

document.getElementById('userSearch')?.addEventListener('input', (e) => {
  const search = e.target.value.toLowerCase();
  const tbody = document.getElementById('usersTable');
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? '' : 'none';
  });
});

// Initialize
updateOverview();