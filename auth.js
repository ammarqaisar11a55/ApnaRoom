const API_BASE = 'http://localhost:3000/api';

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ===== ROLE TABS =====
const tabs = document.querySelectorAll('.auth-tab');
const studentFields = document.querySelectorAll('.student-field');
const ownerFields = document.querySelectorAll('.owner-field');
let currentRole = 'student';

// Check URL params for pre-selected role
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('role') === 'owner') {
  switchRole('owner');
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchRole(tab.dataset.role));
});

function switchRole(role) {
  currentRole = role;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.role === role));
  studentFields.forEach(f => f.classList.toggle('hidden', role !== 'student'));
  ownerFields.forEach(f => f.classList.toggle('hidden', role !== 'owner'));
}

// ===== TOGGLE PASSWORD VISIBILITY =====
const togglePass = document.getElementById('togglePass');
if (togglePass) {
  togglePass.addEventListener('click', () => {
    const inputs = document.querySelectorAll('input[type="password"], input[data-toggled="true"]');
    inputs.forEach(input => {
      if (input.type === 'password') {
        input.type = 'text';
        input.dataset.toggled = 'true';
        togglePass.textContent = '🙈';
      } else {
        input.type = 'password';
        delete input.dataset.toggled;
        togglePass.textContent = '👁';
      }
    });
  });
}

// ===== PASSWORD STRENGTH (Signup only) =====
const passInput = document.getElementById('signupPassword');
const strengthBar = document.getElementById('strengthBar');
if (passInput && strengthBar) {
  passInput.addEventListener('input', () => {
    const val = passInput.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const colors = ['#ef4444', '#f59e0b', '#eab308', '#10b981'];
    const widths = ['25%', '50%', '75%', '100%'];

    strengthBar.style.width = score > 0 ? widths[score - 1] : '0';
    strengthBar.style.background = score > 0 ? colors[score - 1] : 'transparent';
  });
}

// ===== VALIDATION HELPERS =====
function shakeField(el) {
  const wrapper = el.closest('.input-wrapper');
  if (wrapper) {
    wrapper.classList.add('input-error', 'shake');
    setTimeout(() => wrapper.classList.remove('shake'), 400);
  }
}
function clearErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const btn = document.getElementById('loginBtn');
    let valid = true;

    if (!email.value || !email.value.includes('@')) { shakeField(email); valid = false; }
    if (!password.value || password.value.length < 6) { shakeField(password); valid = false; }

    if (!valid) return;

    // Send to API
    btn.textContent = 'Logging in...';
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value, role: currentRole })
      });
      const data = await res.json();

      if (res.ok) {
        btn.textContent = '✓ Success!';
        btn.classList.add('btn-success');
        showToast(`Welcome back, ${data.user.name}! 🎉`, 'success');
        // Store user info
        localStorage.setItem('apnaroom_user', JSON.stringify(data.user));
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
      } else {
        showToast(data.error, 'error');
        btn.textContent = 'Login →';
        btn.disabled = false;
      }
    } catch (err) {
      showToast('Cannot connect to server. Make sure server is running.', 'error');
      btn.textContent = 'Login →';
      btn.disabled = false;
    }
  });
}

// ===== SIGNUP FORM =====
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const phone = document.getElementById('signupPhone');
    const password = document.getElementById('signupPassword');
    const agree = document.getElementById('agreeTerms');
    const btn = document.getElementById('signupBtn');
    let valid = true;

    if (!name.value.trim()) { shakeField(name); valid = false; }
    if (!email.value || !email.value.includes('@')) { shakeField(email); valid = false; }
    if (!phone.value.trim()) { shakeField(phone); valid = false; }
    if (!password.value || password.value.length < 8) { shakeField(password); valid = false; }
    if (!agree.checked) {
      agree.closest('.checkbox-label').classList.add('shake');
      setTimeout(() => agree.closest('.checkbox-label').classList.remove('shake'), 400);
      valid = false;
    }

    if (!valid) return;

    // Build payload
    const payload = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      role: currentRole
    };

    if (currentRole === 'student') {
      const uni = document.getElementById('signupUni');
      if (uni) payload.university = uni.value;
    } else {
      const hostel = document.getElementById('signupHostel');
      const city = document.getElementById('signupCity');
      if (hostel) payload.hostelName = hostel.value;
      if (city) payload.city = city.value;
    }

    // Send to API
    btn.textContent = 'Creating account...';
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        btn.textContent = '✓ Account Created!';
        btn.classList.add('btn-success');
        showToast(`Welcome to ApnaRoom, ${data.user.name}! 🎉`, 'success');
        localStorage.setItem('apnaroom_user', JSON.stringify(data.user));
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
      } else {
        showToast(data.error, 'error');
        btn.textContent = 'Create Account →';
        btn.disabled = false;
      }
    } catch (err) {
      showToast('Cannot connect to server. Make sure server is running.', 'error');
      btn.textContent = 'Create Account →';
      btn.disabled = false;
    }
  });
}

// ===== SOCIAL BUTTONS =====
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('Social login coming soon!', 'error');
  });
});
