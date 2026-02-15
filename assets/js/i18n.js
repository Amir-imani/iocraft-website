// assets/js/i18n.js
// i18n loader with safer fallback, missing-key warnings and "loading" class removal
(function () {
  const SUPPORTED = ['en', 'fa'];
  const translations = {};
  let current = 'en';
  let _loaded = false;

  // add a class to hide UI until translations applied (avoid mixed text)
  document.documentElement.classList.add('i18n-loading');

  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o && k in o ? o[k] : undefined), obj);
  }

  async function loadAll() {
    const base = 'assets/i18n/';
    await Promise.all(SUPPORTED.map(async lang => {
      try {
        const res = await fetch(`${base}${lang}.json`);
        if (!res.ok) {
          translations[lang] = {};
          console.warn(`i18n: failed to load ${lang}.json (status ${res.status})`);
          return;
        }
        translations[lang] = await res.json();
      } catch (err) {
        translations[lang] = {};
        console.warn(`i18n: error loading ${lang}.json`, err);
      }
    }));
  }

  // t returns fallback (english) if not present in requested lang; returns undefined only if missing entirely
  function t(key, lang = current) {
    const v = getPath(translations[lang] || {}, key);
    if (v !== undefined) return v;
    const fallback = getPath(translations['en'] || {}, key);
    if (fallback !== undefined) return fallback;
    return undefined;
  }

  function applyTranslations(lang) {
    current = lang;
    const missingKeys = new Set();

    // elements with data-i18n (text content)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const html = el.dataset.i18nHtml === 'true';
      const langVal = getPath(translations[lang] || {}, key);
      if (langVal !== undefined) {
        if (html) el.innerHTML = langVal; else el.textContent = langVal;
      } else {
        const enVal = getPath(translations['en'] || {}, key);
        if (enVal !== undefined) {
          if (html) el.innerHTML = enVal; else el.textContent = enVal;
          console.warn(`i18n: missing "${key}" for "${lang}", using English fallback`);
        } else {
          console.warn(`i18n: missing "${key}" entirely`);
          if (!html) el.textContent = '';
        }
        missingKeys.add(key);
      }
    });

    // elements with data-i18n-attr: "placeholder:auth.login.usernamePlaceholder;title:nav.home"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const map = el.dataset.i18nAttr.split(';').map(s => s.trim()).filter(Boolean);
      map.forEach(pair => {
        const [attr, path] = pair.split(':').map(s => s && s.trim());
        if (!attr || !path) return;
        const langVal = getPath(translations[lang] || {}, path);
        if (langVal !== undefined) el.setAttribute(attr, langVal);
        else {
          const enVal = getPath(translations['en'] || {}, path);
          if (enVal !== undefined) {
            el.setAttribute(attr, enVal);
            console.warn(`i18n: missing "${path}" for "${lang}", using English fallback (attr:${attr})`);
          } else {
            el.removeAttribute(attr);
            console.warn(`i18n: missing "${path}" entirely (attr:${attr})`);
          }
          missingKeys.add(path);
        }
      });
    });

    // lang + dir + body class
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';
    if (lang === 'fa') document.body.classList.add('lang-fa'); else document.body.classList.remove('lang-fa');

    // update lang buttons
    document.querySelectorAll('[data-lang-btn]').forEach(btn => btn.classList.toggle('active', btn.dataset.langBtn === lang));

    localStorage.setItem('iocraft_lang', lang);

    // remove loading class now that we applied translations
    document.documentElement.classList.remove('i18n-loading');

    document.dispatchEvent(new CustomEvent('iocraft:langChanged', { detail: { lang, missingKeys: Array.from(missingKeys) } }));
  }

  async function init() {
    if (_loaded) return current;
    await loadAll();
    const saved = localStorage.getItem('iocraft_lang') || (navigator.language && navigator.language.startsWith('fa') ? 'fa' : 'en');
    applyTranslations(saved);
    _loaded = true;
    return saved;
  }

  // expose
  window.I18n = { init, applyTranslations, t, current: () => current };

  // auto init on DOMContentLoaded (safe) — other scripts (e.g. auth.js) may also call I18n.init() and will get immediate return
  document.addEventListener('DOMContentLoaded', () => {
    I18n.init().catch(e => console.warn('i18n init error', e));

    // delegate language switch clicks
    document.body.addEventListener('click', e => {
      const btn = e.target.closest('[data-lang-btn]');
      if (!btn) return;
      I18n.applyTranslations(btn.dataset.langBtn);
    });
  });
})();
