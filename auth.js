
// TST Academy Auth System
// Handles Supabase authentication separately from members.html

(function() {

  var SUPABASE_URL = 'https://jjecwvcxbocogvwsjwmr.supabase.co';
  var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZWN3dmN4Ym9jb2d2d3Nqd21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzMxMjcsImV4cCI6MjA5NDAwOTEyN30.Eb2DuAqv1D9d4IoWpyXLSGZGUS4QLS116xEYUgDyYNY';

  // Load Supabase SDK then initialize
  function loadSDK(callback) {
    if (window.supabase && window.supabase.createClient) {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function() {
      window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      callback();
    };
    script.onerror = function() {
      console.warn('Supabase SDK failed to load');
    };
    document.head.appendChild(script);
  }

  function getClient() {
    return window._supabaseClient || null;
  }

  // Check for existing session on page load
  function checkSession() {
    var client = getClient();
    if (!client) return;
    client.auth.getSession().then(function(result) {
      var session = result.data ? result.data.session : null;
      if (session && session.user) {
        var displayName = session.user.email.split('@')[0];
        var loginScreen = document.getElementById('login-screen');
        var sname = document.getElementById('sname');
        if (loginScreen) loginScreen.style.display = 'none';
        if (sname) sname.textContent = displayName;
        if (window.buildSidebar) window.buildSidebar();
        if (window.loadLesson) window.loadLesson('beginner');
      }
    }).catch(function(e) {
      console.log('Session check failed:', e);
    });
  }

  // Override doLogin
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

    // Always check hardcoded demo account first
    if (e === 'student@topstocktrading.com' && p === 'tst2024') {
      var loginScreen = document.getElementById('login-screen');
      var sname = document.getElementById('sname');
      if (loginScreen) loginScreen.style.display = 'none';
      if (sname) sname.textContent = 'Trader';
      if (window.buildSidebar) window.buildSidebar();
      if (window.loadLesson) window.loadLesson('beginner');
      return;
    }

    // Fallback to hardcoded if Supabase not loaded
    if (!client) {
      if (false) {
        var loginScreen = document.getElementById('login-screen');
        var sname = document.getElementById('sname');
        if (loginScreen) loginScreen.style.display = 'none';
        if (sname) sname.textContent = 'Trader';
        if (window.buildSidebar) window.buildSidebar();
        if (window.loadLesson) window.loadLesson('beginner');
      } else {
        if (errEl) { errEl.textContent = 'Incorrect email or password.'; errEl.style.display = 'block'; }
      }
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
      var user = result.data.user;
      window._currentUser = user;
      var displayName = user.email.split('@')[0];
      var loginScreen = document.getElementById('login-screen');
      var sname = document.getElementById('sname');
      if (loginScreen) loginScreen.style.display = 'none';
      if (sname) sname.textContent = displayName;
      if (window.buildSidebar) window.buildSidebar();
      if (window.loadLesson) window.loadLesson('beginner');
    }).catch(function(err) {
      if (errEl) { errEl.textContent = 'Login error. Please try again.'; errEl.style.display = 'block'; }
      if (btn) { btn.textContent = 'Access My Course'; btn.disabled = false; }
    });
  };

  // Override doLogout
  window.doLogout = function() {
    var client = getClient();
    var loginScreen = document.getElementById('login-screen');
    var leEl = document.getElementById('le');
    var lpEl = document.getElementById('lp');
    if (loginScreen) loginScreen.style.display = 'flex';
    if (leEl) leEl.value = '';
    if (lpEl) lpEl.value = '';
    window._currentUser = null;
    if (client) {
      client.auth.signOut().catch(function(e) { console.log('Signout:', e); });
    }
  };

  // Make client accessible to profile.js and quiz.js
  window.getSupabaseClient = function() {
    return getClient();
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadSDK(checkSession);
    });
  } else {
    loadSDK(checkSession);
  }

})();
