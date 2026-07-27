// TST Academy Auth

(function() {

  var SUPABASE_URL = 'https://jjecwvcxbocogvwsjwmr.supabase.co';
  var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWN3dmN4Ym9jb2d2d3Nqd21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzMxMjcsImV4cCI6MjA5NDAwOTEyN30.Eb2DuAqv1D9d4IoWpyXLSGZGUS4QLS116xEYUgDyYNY';

  function loadSDK(callback) {
    if (window.supabase && window.supabase.createClient) { callback(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = function() {
      window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      checkForPasswordRecovery();
      callback();
    };
    s.onerror = function() { console.warn('Supabase SDK failed to load'); };
    document.head.appendChild(s);
  }

  function getClient() { return window._supabaseClient || null; }

  function showCourse(user) {
    window._currentUser = user;
    var loginScreen = document.getElementById('login-screen');
    var sname = document.getElementById('sname');
    if (loginScreen) loginScreen.style.display = 'none';
    if (sname) sname.textContent = user.email.split('@')[0];
    if (window.buildSidebar) window.buildSidebar();
    if (window.loadLesson) window.loadLesson('beginner');
  }

  function checkForPasswordRecovery() {
    var hash = window.location.hash;
    if (!hash || hash.indexOf('type=recovery') === -1) return;
    var client = getClient();
    if (!client) return;
    client.auth.onAuthStateChange(function(event, session) {
      if (event === 'PASSWORD_RECOVERY') { showPasswordResetForm(); }
    });
  }

  function showPasswordResetForm() {
    var overlay = document.createElement('div');
    overlay.id = 'password-reset-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#0a0f0a;z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML =
      '<div style="max-width:400px;width:90%;background:#111712;border:1px solid #1e2820;border-radius:16px;padding:40px 32px;">' +
        '<div style="font-family:Rajdhani,sans-serif;font-size:24px;font-weight:700;color:#f0f4f1;margin-bottom:8px;">Set New Password</div>' +
        '<input type="password" id="new-password-input" placeholder="New password (min 8 characters)" style="width:100%;background:#0a0f0a;border:1.5px solid #1e2820;border-radius:8px;padding:12px 16px;color:#f0f4f1;font-size:14px;margin-bottom:12px;box-sizing:border-box;outline:none;"/>' +
        '<input type="password" id="confirm-password-input" placeholder="Confirm new password" style="width:100%;background:#0a0f0a;border:1.5px solid #1e2820;border-radius:8px;padding:12px 16px;color:#f0f4f1;font-size:14px;margin-bottom:16px;box-sizing:border-box;outline:none;"/>' +
        '<div id="password-reset-error" style="color:#ef4444;font-size:12px;margin-bottom:12px;display:none;"></div>' +
        '<button id="submit-new-password" style="width:100%;background:#22c55e;color:#000;border:none;border-radius:8px;padding:14px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:15px;cursor:pointer;">Update Password</button>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('submit-new-password').onclick = async function() {
      var pw = document.getElementById('new-password-input').value;
      var confirm = document.getElementById('confirm-password-input').value;
      var errEl = document.getElementById('password-reset-error');
      if (!pw || pw.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; errEl.style.display = 'block'; return; }
      if (pw !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
      var result = await getClient().auth.updateUser({ password: pw });
      if (result.error) { errEl.textContent = result.error.message; errEl.style.display = 'block'; return; }
      overlay.innerHTML = '<div style="max-width:400px;width:90%;background:#111712;border:1px solid #1e2820;border-radius:16px;padding:40px 32px;text-align:center;"><div style="font-size:40px;margin-bottom:16px;">✓</div><div style="font-family:Rajdhani,sans-serif;font-size:22px;font-weight:700;color:#f0f4f1;margin-bottom:8px;">Password Updated</div><div style="font-size:13px;color:#6b7c6e;">You can now log in with your new password.</div></div>';
      setTimeout(function() { overlay.remove(); window.location.hash = ''; window.location.reload(); }, 2000);
    };
  }

  function checkSession() {
    var client = getClient();
    if (!client) return;
    client.auth.getSession().then(function(result) {
      var session = result.data ? result.data.session : null;
      if (session && session.user) { showCourse(session.user); }
    }).catch(function(e) { console.log('Session check failed:', e); });
  }

  window.doLogin = function() {
    var eEl = document.getElementById('le');
    var pEl = document.getElementById('lp');
    var errEl = document.getElementById('lerr');
    var btn = document.querySelector('.login-btn');
    if (!eEl || !pEl) return;
    var e = eEl.value.trim();
    var p = pEl.value.trim();
    if (!e || !p) {
      if (errEl) { errEl.textContent = 'Please enter your email and password.'; errEl.style.display = 'block'; }
      return;
    }
    var client = getClient();
    if (!client) {
      if (errEl) { errEl.textContent = 'Auth not loaded. Please refresh.'; errEl.style.display = 'block'; }
      return;
    }
    if (btn) { btn.textContent = 'Signing in...'; btn.disabled = true; }
    if (errEl) errEl.style.display = 'none';
    client.auth.signInWithPassword({ email: e, password: p }).then(function(result) {
      if (result.error) {
        if (errEl) { errEl.textContent = result.error.message || 'Incorrect email or password.'; errEl.style.display = 'block'; }
        if (btn) { btn.textContent = 'Access My Course'; btn.disabled = false; }
        return;
      }
      showCourse(result.data.user);
    }).catch(function(err) {
      if (errEl) { errEl.textContent = 'Login error. Please try again.'; errEl.style.display = 'block'; }
      if (btn) { btn.textContent = 'Access My Course'; btn.disabled = false; }
    });
  };

  window.doLogout = function() {
    var client = getClient();
    window._currentUser = null;
    var loginScreen = document.getElementById('login-screen');
    var leEl = document.getElementById('le');
    var lpEl = document.getElementById('lp');
    if (loginScreen) loginScreen.style.display = 'flex';
    if (leEl) leEl.value = '';
    if (lpEl) lpEl.value = '';
    if (client) client.auth.signOut().catch(function(e) {});
  };

  window.getSupabaseClient = function() { return getClient(); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { loadSDK(checkSession); });
  } else {
    loadSDK(checkSession);
  }

})();
