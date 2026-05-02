// Inlined as a <script> in <head> to prevent FOUC.
// Reads stored theme or falls back to prefers-color-scheme.
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('hm-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'leaf-5' : 'leaf-4');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'leaf-4');
  }
})();
`.trim();
