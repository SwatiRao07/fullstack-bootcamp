import { api } from './api.js';

/**
 * Handle authentication on login.html
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const toggleLink = document.getElementById('toggleAuth');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const submitBtn = document.getElementById('submitBtn');
  const themeToggle = document.getElementById('themeToggle');
  
  let isLogin = true;

  // Initialize Theme
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Theme Toggle Handler
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  // Toggle between Login and Register
  if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      
      if (isLogin) {
        formTitle.textContent = 'Welcome back';
        formSubtitle.textContent = 'Please enter your details to sign in.';
        submitBtn.textContent = 'Sign in';
        toggleLink.textContent = "Sign up";
        document.getElementById('nameGroup').style.display = 'none';
        toggleLink.parentElement.firstChild.textContent = "Don't have an account? ";
      } else {
        formTitle.textContent = 'Create an account';
        formSubtitle.textContent = 'Get started today for free.';
        submitBtn.textContent = 'Create account';
        toggleLink.textContent = "Sign in";
        document.getElementById('nameGroup').style.display = 'flex';
        toggleLink.parentElement.firstChild.textContent = "Already have an account? ";
      }
    });
  }

  // Auth Handling
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const name = !isLogin ? document.getElementById('name').value : '';
      
      // Basic validation
      if (!email || !password || (!isLogin && !name)) {
        showError('Please fill in all fields.');
        return;
      }

      setLoading(true);
      
      try {
        let result;
        if (isLogin) {
          result = await api.auth.login(email, password);
        } else {
          result = await api.auth.register(name, email, password);
        }
        
        if (result.success) {
          window.location.href = 'index.html';
        }
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.textContent = isLogin ? 'Signing in...' : 'Creating account...';
    } else {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = isLogin ? 'Sign in' : 'Create account';
    }
  }

  function showError(msg) {
    const errorDiv = document.getElementById('formError');
    if (errorDiv) {
      errorDiv.textContent = msg;
      errorDiv.style.display = 'block';
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    } else {
      alert(msg);
    }
  }
});
