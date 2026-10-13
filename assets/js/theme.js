// Automatic time-based theme (6:00 - 18:00 Light, 18:00 - 6:00 Dark) with manual override.
function getTimeBasedTheme() {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? 'light' : 'dark';
}

function getNextPeriodExpiry() {
  const now = new Date();
  const target = new Date(now);
  const hour = now.getHours();
  if (hour >= 6 && hour < 18) {
    target.setHours(18, 0, 0, 0);
  } else if (hour >= 18) {
    target.setDate(target.getDate() + 1);
    target.setHours(6, 0, 0, 0);
  } else {
    target.setHours(6, 0, 0, 0);
  }
  return target.getTime();
}

let initialUrlTheme = null;
try {
  const p = new URLSearchParams(window.location.search).get('theme');
  if (p === 'dark' || p === 'light') initialUrlTheme = p;
} catch (e) {}

function getEffectiveTheme() {
  if (initialUrlTheme) return initialUrlTheme;
  try {
    const urlParam = new URLSearchParams(window.location.search).get('theme');
    if (urlParam === 'dark' || urlParam === 'light') return urlParam;
  } catch (e) {}
  const manual = localStorage.getItem('hsk_theme_manual');
  const expiry = parseInt(localStorage.getItem('hsk_theme_manual_expiry') || '0', 10);
  if (manual && Date.now() < expiry) {
    return manual;
  }
  return getTimeBasedTheme();
}

let themeTransitionTimer = null;

function applyTheme(theme, animate) {
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (themeTransitionTimer) {
      clearTimeout(themeTransitionTimer);
      themeTransitionTimer = null;
    }
    document.documentElement.classList.add('theme-transition');
    themeTransitionTimer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
      themeTransitionTimer = null;
    }, 280);
  }
  document.documentElement.dataset.theme = theme;
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('title', theme === 'dark' ? 'Chế độ tối (Bấm để chuyển sáng)' : 'Chế độ sáng (Bấm để chuyển tối)');
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  }
  const studyToggleBtns = document.querySelectorAll('.study-theme-toggle-btn');
  studyToggleBtns.forEach(btn => {
    btn.setAttribute('title', theme === 'dark' ? 'Chế độ tối (Bấm để chuyển sáng)' : 'Chế độ sáng (Bấm để chuyển tối)');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  });
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || getEffectiveTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('hsk_theme_manual', next);
  localStorage.setItem('hsk_theme_manual_expiry', String(getNextPeriodExpiry()));
  localStorage.setItem('hsk_theme', next);
  applyTheme(next, true);
}

function checkScheduledTheme() {
  const expected = getEffectiveTheme();
  if (document.documentElement.dataset.theme !== expected) {
    applyTheme(expected, true);
  }
}

(function () {
  const effective = getEffectiveTheme();
  applyTheme(effective, false);
  setInterval(checkScheduledTheme, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkScheduledTheme();
  });
})();
