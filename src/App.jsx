import { signal } from '@preact/signals';

// Global signal for theme
export const themeSignal = signal(
  localStorage.getItem('hsk_theme_manual') ||
  (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
);

// Apply theme to document
themeSignal.subscribe(theme => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('hsk_theme_manual', theme);
    } catch (_) {}
  }
});

const JLPT_LEVELS = [
  { key: 'jlpt_n5', label: 'JLPT N5', desc: 'Sơ cấp 1', count: 662, icon: '🌱' },
  { key: 'jlpt_n4', label: 'JLPT N4', desc: 'Sơ cấp 2', count: 632, icon: '🌿' },
  { key: 'jlpt_n3', label: 'JLPT N3', desc: 'Trung cấp (Trọng tâm)', count: 688, icon: '🌻', active: true },
  { key: 'jlpt_n2', label: 'JLPT N2', desc: 'Trung cao cấp', count: 1831, icon: '🌾' },
  { key: 'jlpt_n1', label: 'JLPT N1', desc: 'Cao cấp', count: 3463, icon: '🌳' },
];

export const selectedLevelSignal = signal('jlpt_n3');

export function App() {
  const toggleTheme = () => {
    themeSignal.value = themeSignal.value === 'dark' ? 'light' : 'dark';
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 16px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px', color: 'var(--brand-primary)' }}>
          🌻 Himawari <span style={{ fontSize: '18px', fontWeight: '600', opacity: 0.85 }}>(Preact + Vite v2)</span>
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
          Trạm luyện từ vựng &amp; ngữ pháp tiếng Nhật JLPT — Kiến trúc mới siêu nhẹ, module hóa với Preact Signals
        </p>
      </header>

      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 24px',
        maxWidth: '680px',
        margin: '0 auto 32px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-subtle)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
            🚀 Khởi tạo thành công nền tảng Vite + Preact
          </h3>
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            {themeSignal.value === 'dark' ? '🌙 Giao diện tối' : '☀️ Giao diện sáng'}
          </button>
        </div>

        <ul style={{ paddingLeft: '20px', lineHeight: '1.9', color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 24px' }}>
          <li><strong>Bundler:</strong> Vite 8.x với Hot Module Replacement (HMR) tức thì.</li>
          <li><strong>UI Framework:</strong> Preact 10.x (~3KB), hiệu năng DOM vượt trội.</li>
          <li><strong>State Manager:</strong> Preact Signals — reactivity hạt nhân không cần Redux/Zustand.</li>
          <li><strong>An toàn:</strong> Trang chính (<a href="./" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>index.html</a>) trên GitHub Pages vẫn hoạt động 100% song song.</li>
        </ul>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: 'var(--text-primary)' }}>
            🎯 Chọn cấp độ JLPT (Preact Signals Demo):
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
            {JLPT_LEVELS.map(lvl => {
              const isSelected = selectedLevelSignal.value === lvl.key;
              return (
                <button
                  key={lvl.key}
                  onClick={() => { selectedLevelSignal.value = lvl.key; }}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--accent-light)' : 'var(--bg-elevated)',
                    color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{lvl.icon}</div>
                  <strong style={{ display: 'block', fontSize: '14px' }}>{lvl.label}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lvl.count} từ</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Cấp độ đang chọn: <strong style={{ color: 'var(--brand-primary)' }}>{JLPT_LEVELS.find(l => l.key === selectedLevelSignal.value)?.label}</strong> — {JLPT_LEVELS.find(l => l.key === selectedLevelSignal.value)?.desc} ({JLPT_LEVELS.find(l => l.key === selectedLevelSignal.value)?.count} từ vựng)
          </div>
        </div>
      </div>

      <footer style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
        Himawari JLPT • Kiến trúc Module Hóa Vite + Preact Signals
      </footer>
    </div>
  );
}
