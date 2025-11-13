const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navButtons = document.querySelector('.nav-buttons');

// Back to Top button
const backToTop = document.createElement('button');
backToTop.id = 'backToTop';
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
    backToTop.style.display = 'block';
  } else {
    navbar.classList.remove('scrolled');
    backToTop.style.display = 'none';
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top:0, behavior:'smooth' });
});

// Highlight nav links
const navItems = document.querySelectorAll('.nav-links li a');
navItems.forEach(link => {
  link.addEventListener('click', () => {
    navItems.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Mobile toggle
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navButtons.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

// ---------------- Login Overlay ----------------
const overlay = document.getElementById('overlay');
const openLogin = document.querySelector('.login-btn');
const btnContainer = document.querySelector('.btn-container');
const btn = document.getElementById('login-btn');
const form = document.getElementById('loginForm');
const uname = document.getElementById('uname');
const pass = document.getElementById('pass');
const msg = document.getElementById('msg');

btn.disabled = true;

// 点击导航栏登录按钮弹出
openLogin.addEventListener('click', (e) => {
  e.preventDefault();
  overlay.classList.add('active');
});

// 点击遮罩关闭
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('active');
});

// 输入检测
function showMsg() {
    const isEmpty = uname.value === '' || pass.value === '';
    btn.classList.toggle('no-shift', !isEmpty);

    if (isEmpty) {
        btn.disabled = true
         msg.style.color = 'rgb(218,49,49)';
         msg.style.fontSize = '14px';
         msg.innerText = 'Please fill the input fields before proceeding~';
    } else {
        msg.innerText = 'Great! Now you can proceed~';
        msg.style.color = '#ffb457';
        btn.disabled = false;
        btn.classList.add('no-shift')
    }
}

// 逃跑按钮逻辑
function shiftButton() {
  showMsg();
  const positions = ['shift-left', 'shift-top', 'shift-right', 'shift-bottom'];
  const current = positions.find(dir => btn.classList.contains(dir)) || '';
  const next = positions[(positions.indexOf(current)+1) % positions.length];
  btn.classList.remove(current);
  btn.classList.add(next);
}

btnContainer.addEventListener('mouseover', shiftButton);
btn.addEventListener('mouseover', shiftButton);
btn.addEventListener('touchstart', shiftButton);
form.addEventListener('input', showMsg);

// ---------------- Google Sign-In ----------------

// 点击 Google 登录按钮时手动触发登录弹窗
const googleLoginBtn = document.getElementById('googleLogin');
googleLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  google.accounts.id.prompt(); // ✅ 触发 Google 登录窗口
});

// 解码 Google 返回的 ID Token
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Google 登录回调函数
function handleCredentialResponse(response) {
  const payload = decodeJwtResponse(response.credential);
  console.log('✅ Google 登录成功:', payload);

  // 显示用户信息
  document.getElementById('avatar').src = payload.picture;
  document.getElementById('name').innerText = payload.name;
  document.getElementById('email').innerText = payload.email;
  document.getElementById('user-info').style.display = 'block';

  // 隐藏登录弹窗
  overlay.classList.remove('active');

  // ✅ 也可以储存用户登录状态
  localStorage.setItem('starkit_user', JSON.stringify(payload));
}


