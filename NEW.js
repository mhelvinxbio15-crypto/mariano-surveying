// ================= REALISTIC LIGHTNING GENERATOR ================= 
class RealisticLightningGenerator {
  constructor() {
    this.container = null;
    this.isActive = true;
    this.lightningCount = 0;
    this.generationInterval = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'lightning-container';
    document.body.appendChild(this.container);

    this.startLightningGeneration();

    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;
      if (!this.isActive) {
        this.clearAllLightning();
      }
    });

    window.addEventListener('resize', () => {
      // Lightning adapts to viewport
    });
  }

  createRealisticLightning() {
    if (!this.isActive) return;

    const glow = document.createElement('div');
    glow.className = 'lightning-glow';
    const randomX = Math.random() * window.innerWidth;
    glow.style.left = randomX + 'px';
    this.container.appendChild(glow);

    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    lightning.style.left = randomX + 'px';

    if (Math.random() > 0.5) {
      lightning.classList.add(Math.random() > 0.5 ? 'zag-left' : 'zag-right');
    }

    if (Math.random() > 0.8) {
      lightning.classList.add('double');
    }

    this.container.appendChild(lightning);
    this.lightningCount++;

    setTimeout(() => {
      if (lightning.parentElement) lightning.remove();
      if (glow.parentElement) glow.remove();
      this.lightningCount--;
    }, 400);

    if (Math.random() > 0.7) {
      setTimeout(() => this.createRealisticLightning(), 50);
      setTimeout(() => this.createRealisticLightning(), 100);
      setTimeout(() => this.createRealisticLightning(), 150);
    }

    if (this.lightningCount > 30) {
      const firstChild = this.container.firstChild;
      if (firstChild) firstChild.remove();
      this.lightningCount--;
    }
  }

  startLightningGeneration() {
    this.generationInterval = setInterval(() => {
      if (this.isActive) {
        if (Math.random() > 0.3) {
          this.createRealisticLightning();
        }
      }
    }, 500 + Math.random() * 1500);
  }

  clearAllLightning() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.lightningCount = 0;
  }

  stopGeneration() {
    if (this.generationInterval) {
      clearInterval(this.generationInterval);
    }
  }
}

let lightningGenerator;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lightningGenerator = new RealisticLightningGenerator();
  });
} else {
  lightningGenerator = new RealisticLightningGenerator();
}

// ================= FEATURE POPUP ================= 
const popup = document.getElementById("featurePopup");
const pTitle = document.getElementById("popupTitle");
const pText = document.getElementById("popupText");

if (popup) {
  document.querySelectorAll(".feature").forEach(f => {
    f.onclick = () => {
      pTitle.innerText = f.dataset.title;
      pText.innerText = f.dataset.info;
      popup.style.display = "block";
      popup.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  });

  const closePopup = document.querySelector(".close-popup");
  if (closePopup) {
    closePopup.onclick = () => {
      popup.style.display = "none";
    };
  }
}

// ================= SMOOTH DARK MODE - FIXED ================= 
const darkToggle = document.getElementById("darkToggle");

if (darkToggle) {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    darkToggle.textContent = "Light Mode";
  }

  darkToggle.addEventListener("click", (e) => {
    e.preventDefault();
    
    const isDark = document.body.classList.contains("dark");
    
    if (isDark) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
      darkToggle.textContent = "Dark Mode";
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      darkToggle.textContent = "Light Mode";
    }
  });
}

// ================= ROTATING TITLE TEXT ================= 
const rotatingTitle = document.querySelector(".rotating-title");
if (rotatingTitle) {
  const titles = ["Engineer", "CEO", "President"];
  let titleIndex = 0;

  setInterval(() => {
    rotatingTitle.style.opacity = "0";
    rotatingTitle.style.transform = "translateY(-10px)";
    
    setTimeout(() => {
      titleIndex = (titleIndex + 1) % titles.length;
      rotatingTitle.textContent = titles[titleIndex];
      rotatingTitle.style.opacity = "1";
      rotatingTitle.style.transform = "translateY(0)";
    }, 200);
  }, Math.random() * 2000 + 3000);
}

// ================= MOBILE MENU ================= 
const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");

if (burger) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navMenu.classList.toggle("show");
  });

  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => {
      burger.classList.remove("active");
      navMenu.classList.remove("show");
    });
  });
}

// ================= SMOOTH NAV SCROLL ================= 
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    if (link.id !== "darkToggle") {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

// ================= SCROLL REVEAL ================= 
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 120) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ================= IMAGE CURSOR FOLLOW ================= 
const containers = document.querySelectorAll('.about-image');

containers.forEach(container => {
  const img = container.querySelector('img');
  if (!img) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const moveX = ((x / rect.width) - 1) * 20;
    const moveY = ((y / rect.height) - 1) * 20;

    img.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
  });

  container.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1)';
  });
});

// ================= STAR BURST ANIMATION ================= 
const starElement = document.querySelector('.star');
if (starElement) {
  starElement.addEventListener('click', function(e) {
    for (let i = 0; i < 6; i++) {
      const miniStar = document.createElement('div');
      miniStar.textContent = '⭐';
      miniStar.className = 'burst-star';
      
      const angle = Math.random() * 2 * Math.PI;
      const distance = 50 + Math.random() * 30;
      const x = Math.cos(angle) * distance + 'px';
      const y = Math.sin(angle) * distance + 'px';
      
      miniStar.style.setProperty('--x', x);
      miniStar.style.setProperty('--y', y);
      miniStar.style.left = e.clientX + 'px';
      miniStar.style.top = e.clientY + 'px';
      
      document.body.appendChild(miniStar);
      
      setTimeout(() => miniStar.remove(), 800);
    }
  });
}

// ================= GSAP ANIMATIONS ================= 
if (typeof gsap !== 'undefined') {
  const tl = gsap.timeline();
  tl.from("nav", {
    y: -100,
    duration: 0.0,
    opacity: 0,
    ease: "power2.out"
  });

  tl.from(".logo-main, .nav-links a", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.2,
    ease: "back.out(1.7)"
  });
}

// ================= HEADER SCROLL EFFECT ================= 
const header = document.querySelector(".top-header");
const hero = document.querySelector(".hero-section");

if (header && hero) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        header.classList.add("nav-solid");
      } else {
        header.classList.remove("nav-solid");
      }
    },
    { rootMargin: "-80px 0px 0px 0px" }
  );

  observer.observe(hero);
}

// ================= SCROLL INDICATOR ================= 
const indicator = document.querySelector(".hero_scrollIndicator");

if (indicator) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      indicator.classList.add("hidden");
    } else {
      indicator.classList.remove("hidden");
    }
  });
}

// ================= PROCESS STEPS ================= 
const steps = document.querySelectorAll('.step');
const contents = document.querySelectorAll('.content');

steps.forEach(step => {
  step.addEventListener('click', () => {
    steps.forEach(s => s.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    step.classList.add('active');
    const contentElement = document.querySelector(`.content[data-step="${step.dataset.step}"]`);
    if (contentElement) {
      contentElement.classList.add('active');
    }
  });
});

// ================= USER PROFILE MODAL ================= 
const userProfileModal = document.getElementById("userProfileModal");
const profileCloseBtn = document.getElementById("profileCloseBtn");
const userProfileBtn = document.getElementById("userProfileBtn");
const logoutFromProfileBtn = document.getElementById("logoutFromProfileBtn");

if (userProfileBtn) {
  userProfileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (userAuth.isLoggedIn) {
      showUserProfile();
    }
  });
}

if (profileCloseBtn) {
  profileCloseBtn.addEventListener("click", () => {
    if (userProfileModal) {
      userProfileModal.classList.remove("active");
    }
  });
}

function showUserProfile() {
  if (!userProfileModal) return;
  
  document.getElementById("profileUserName").textContent = userAuth.userName || "User";
  document.getElementById("profileUserPhone").textContent = userAuth.userPhone || "N/A";
  document.getElementById("profileLoginType").textContent = userAuth.loginType || "Phone";
  document.getElementById("profileLoginDate").textContent = userAuth.loginDate || new Date().toLocaleDateString();
  
  userProfileModal.classList.add("active");
}

if (logoutFromProfileBtn) {
  logoutFromProfileBtn.addEventListener("click", () => {
    logoutUser();
  });
}

// ================= LOGIN SYSTEM - FIXED ================= 
const loginModal = document.getElementById("loginModal");
const loginOverlay = document.getElementById("loginOverlay");
const loginClose = document.getElementById("loginClose");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

let userAuth = {
  isLoggedIn: false,
  userPhone: null,
  userName: null,
  loginType: null,
  loginDate: null
};

// Check if user was previously logged in
function checkPreviousLogin() {
  const savedAuth = JSON.parse(localStorage.getItem('userAuth'));
  if (savedAuth && savedAuth.isLoggedIn) {
    userAuth = savedAuth;
    updateNavbarForLoggedIn();
  }
}

function updateNavbarForLoggedIn() {
  const requestBtn = document.getElementById("requestSurveyBtn");
  const navLinks = document.querySelector(".nav-links");
  
  if (userAuth.isLoggedIn && navLinks) {
    // Add user profile button to navbar
    if (!document.getElementById("userProfileBtn")) {
      const profileBtn = document.createElement("a");
      profileBtn.href = "#";
      profileBtn.id = "userProfileBtn";
      profileBtn.className = "nav-profile-link";
      profileBtn.textContent = `👤 ${userAuth.userName}`;
      profileBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showUserProfile();
      });
      navLinks.appendChild(profileBtn);
    }
  }
}

// ================= OPEN LOGIN MODAL ================= 
const requestSurveyBtn = document.getElementById("requestSurveyBtn");
const contactForm = document.getElementById("contactForm");

if (requestSurveyBtn) {
  requestSurveyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (userAuth.isLoggedIn) {
      // User already logged in, just scroll to contact form
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    } else {
      // Show login modal
      if (loginModal) {
        loginModal.classList.add("active");
      }
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!userAuth.isLoggedIn) {
      alert("Please login to submit the form");
      if (loginModal) {
        loginModal.classList.add("active");
      }
      return;
    }
    
    // Get form data
    const formData = new FormData(contactForm);
    const inquiry = {
      name: formData.get('name') || userAuth.userName,
      email: formData.get('email'),
      phone: formData.get('phone') || userAuth.userPhone,
      message: formData.get('message')
    };

    // Save to localStorage for admin dashboard
    const db = JSON.parse(localStorage.getItem('mariano_inquiries')) || [];
    inquiry.id = Date.now();
    inquiry.date = new Date().toLocaleDateString();
    inquiry.status = "pending";
    db.push(inquiry);
    localStorage.setItem('mariano_inquiries', JSON.stringify(db));

    alert(`✅ Inquiry submitted successfully!\n\nOur team will contact you soon at ${inquiry.phone}`);
    contactForm.reset();
  });
}

// Close login modal
if (loginClose) {
  loginClose.addEventListener("click", () => {
    if (loginModal) {
      loginModal.classList.remove("active");
    }
  });
}

if (loginOverlay) {
  loginOverlay.addEventListener("click", () => {
    if (loginModal) {
      loginModal.classList.remove("active");
    }
  });
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (loginModal && loginModal.classList.contains("active")) {
      loginModal.classList.remove("active");
    }
    if (userProfileModal && userProfileModal.classList.contains("active")) {
      userProfileModal.classList.remove("active");
    }
  }
});

// Tab switching
if (tabBtns) {
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      const tabElement = document.getElementById(`${tabName}-tab`);
      if (tabElement) {
        tabElement.classList.add("active");
      }
    });
  });
}

// ================= PHONE OTP AUTHENTICATION ================= 
const sendOtpBtn = document.getElementById("sendOtpBtn");
const phoneInput = document.getElementById("phoneNumber");
const otpSection = document.getElementById("otpSection");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const otpInput = document.getElementById("otpCode");
const resendOtpBtn = document.getElementById("resendOtpBtn");

let otpAttempts = 0;
const MAX_ATTEMPTS = 3;

if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", () => {
    const phone = phoneInput.value.trim();
    
    if (!phone) {
      alert("Please enter a valid phone number");
      return;
    }

    if (!phone.startsWith("+63")) {
      alert("Please use format: +63 XXX XXX XXXX");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("otp", otp);
    sessionStorage.setItem("phone", phone);
    otpAttempts = 0;
    
    alert(`✅ OTP sent!\n\nTest OTP: ${otp}\n\n(Valid for 5 minutes)`);
    
    otpSection.style.display = "block";
    phoneInput.disabled = true;
    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = "OTP Sent";
  });
}

if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", () => {
    const enteredOtp = otpInput.value.trim();
    const correctOtp = sessionStorage.getItem("otp");
    const phone = sessionStorage.getItem("phone");

    if (enteredOtp === correctOtp) {
      userAuth.isLoggedIn = true;
      userAuth.userPhone = phone;
      userAuth.userName = "User " + phone.slice(-4);
      userAuth.loginType = "Phone OTP";
      userAuth.loginDate = new Date().toLocaleDateString();
      
      // Save to localStorage
      localStorage.setItem('userAuth', JSON.stringify(userAuth));

      // Save user to database
      const users = JSON.parse(localStorage.getItem('mariano_users')) || [];
      users.push({
        id: Date.now(),
        userName: userAuth.userName,
        userPhone: userAuth.userPhone,
        loginType: userAuth.loginType,
        joinDate: userAuth.loginDate
      });
      localStorage.setItem('mariano_users', JSON.stringify(users));
      
      alert("✅ Login successful!");
      if (loginModal) {
        loginModal.classList.remove("active");
      }
      updateNavbarForLoggedIn();
      resetLoginForm();
    } else {
      otpAttempts++;
      if (otpAttempts >= MAX_ATTEMPTS) {
        alert("❌ Too many attempts. Please try again later.");
        otpInput.disabled = true;
        verifyOtpBtn.disabled = true;
      } else {
        alert(`❌ Invalid OTP. Attempts remaining: ${MAX_ATTEMPTS - otpAttempts}`);
        otpInput.value = "";
      }
    }
  });
}

if (resendOtpBtn) {
  resendOtpBtn.addEventListener("click", () => {
    const phone = sessionStorage.getItem("phone");
    const otp = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("otp", otp);
    otpAttempts = 0;
    
    alert(`✅ OTP resent!\n\nTest OTP: ${otp}`);
    otpInput.value = "";
    otpInput.disabled = false;
    verifyOtpBtn.disabled = false;
  });
}

// GOOGLE LOGIN (Mock)
const googleLoginBtn = document.getElementById("googleLoginBtn");
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", () => {
    userAuth.isLoggedIn = true;
    userAuth.userName = "Google User";
    userAuth.loginType = "Google OAuth";
    userAuth.userPhone = "N/A";
    userAuth.loginDate = new Date().toLocaleDateString();
    
    // Save to localStorage
    localStorage.setItem('userAuth', JSON.stringify(userAuth));

    // Save user to database
    const users = JSON.parse(localStorage.getItem('mariano_users')) || [];
    users.push({
      id: Date.now(),
      userName: userAuth.userName,
      userPhone: userAuth.userPhone,
      loginType: userAuth.loginType,
      joinDate: userAuth.loginDate
    });
    localStorage.setItem('mariano_users', JSON.stringify(users));
    
    alert("✅ Google login successful!");
    if (loginModal) {
      loginModal.classList.remove("active");
    }
    updateNavbarForLoggedIn();
    resetLoginForm();
  });
}

// ================= LOGOUT FUNCTION ================= 
function logoutUser() {
  if (confirm("Are you sure you want to logout?")) {
    userAuth = {
      isLoggedIn: false,
      userPhone: null,
      userName: null,
      loginType: null,
      loginDate: null
    };
    localStorage.removeItem('userAuth');

    // Remove profile button from navbar
    const profileBtn = document.getElementById("userProfileBtn");
    if (profileBtn) {
      profileBtn.remove();
    }

    // Close profile modal
    if (userProfileModal) {
      userProfileModal.classList.remove("active");
    }

    alert("✅ Logged out successfully!");
    location.reload();
  }
}

// ================= ADMIN LOGIN ================= 
const adminEmailInput = document.getElementById("adminEmail");
const adminPasswordInput = document.getElementById("adminPassword");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminDashboard = document.getElementById("adminDashboard");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");

const adminCredentials = {
  email: "admin@mariano.com",
  password: "admin123"
};

if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", () => {
    const email = adminEmailInput.value.trim();
    const password = adminPasswordInput.value;

    if (email === adminCredentials.email && password === adminCredentials.password) {
      if (loginModal) {
        loginModal.classList.remove("active");
      }
      if (adminDashboard) {
        adminDashboard.style.display = "block";
      }
      alert("✅ Admin login successful!");
    } else {
      alert("❌ Invalid admin credentials\n\nDemo credentials:\nEmail: admin@mariano.com\nPassword: admin123");
    }
  });
}

if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener("click", () => {
    if (adminDashboard) {
      adminDashboard.style.display = "none";
    }
    adminEmailInput.value = "";
    adminPasswordInput.value = "";
  });
}

// Reset login form
function resetLoginForm() {
  if (phoneInput) phoneInput.value = "";
  if (otpInput) otpInput.value = "";
  if (otpSection) otpSection.style.display = "none";
  if (phoneInput) phoneInput.disabled = false;
  if (sendOtpBtn) {
    sendOtpBtn.disabled = false;
    sendOtpBtn.textContent = "Send OTP";
  }
  if (adminEmailInput) adminEmailInput.value = "";
  if (adminPasswordInput) adminPasswordInput.value = "";
}

// Check previous login on page load
checkPreviousLogin();

// ================= SERVICE WORKER REGISTRATION ================= 
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(err => {
    console.log('Service Worker registration failed:', err);
  });
}