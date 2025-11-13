const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navButtons = document.querySelector('.nav-buttons');
const backToTop = document.createElement('button');
backToTop.id = 'backToTop'; backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

// Navbar shadow
window.addEventListener('scroll', () => {
  if(window.scrollY > 50){
    navbar.classList.add('scrolled'); backToTop.style.display='block';
  } else {
    navbar.classList.remove('scrolled'); backToTop.style.display='none';
  }
});
backToTop.addEventListener('click',()=>window.scrollTo({top:0, behavior:'smooth'}));

// Hamburger toggle
menuToggle.addEventListener('click', ()=>{
  navLinks.classList.toggle('active');
  navButtons.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

// Login Overlay
const overlay = document.getElementById('overlay');
const openLogin = document.querySelector('.login-btn');
const btn = document.getElementById('login-btn');
const uname = document.getElementById('uname');
const pass = document.getElementById('pass');
const msg = document.getElementById('msg');
btn.disabled = true;

openLogin.addEventListener('click', e=>{
  e.preventDefault();
  overlay.classList.add('active');
});

overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.classList.remove('active'); });

// Input validation
function showMsg(){
  const isEmpty = uname.value===''||pass.value==='';
  btn.disabled=isEmpty;
  if(isEmpty){ msg.innerText='Please fill the input fields before proceeding~'; msg.style.color='rgb(218,49,49)'; }
  else{ msg.innerText='Great! Now you can proceed~'; msg.style.color='#ffb457'; }
}
document.getElementById('loginForm').addEventListener('input', showMsg);
document.getElementById('loginForm').addEventListener('submit', e=>{
  e.preventDefault();
  if(uname.value && pass.value){
    const fakeUser = { name: uname.value.split('@')[0], email: uname.value, picture:'images/login/default-avatar.png' };
    localStorage.setItem('starkit_user', JSON.stringify(fakeUser));
    const navAvatar = document.getElementById('nav-avatar');
    navAvatar.src = fakeUser.picture;
    navAvatar.style.display = 'inline-block';
    overlay.classList.remove('active');
    console.log('✅ 手动登录成功:', fakeUser);
  }
});

// Load user from localStorage
window.addEventListener('DOMContentLoaded', ()=>{
  const user = JSON.parse(localStorage.getItem('starkit_user'));
  if(user){ const navAvatar = document.getElementById('nav-avatar'); navAvatar.src=user.picture; navAvatar.style.display='inline-block'; }
});

// Google Sign-In
const googleLoginBtn = document.getElementById('googleLogin');
googleLoginBtn.addEventListener('click', e=>{
  e.preventDefault();
  google.accounts.id.prompt();
});

function decodeJwtResponse(token){
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g,'+').replace(/_/g,'/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response){
  const payload = decodeJwtResponse(response.credential);
  localStorage.setItem('starkit_user', JSON.stringify(payload));
  const navAvatar = document.getElementById('nav-avatar');
  navAvatar.src = payload.picture;
  navAvatar.style.display='inline-block';
  overlay.classList.remove('active');
  console.log('✅ Google 登录成功:', payload);
}
