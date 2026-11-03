/* Долгов. Меню, якоря, форма заявки. */
(function () {
  'use strict';

  const PHONE = '+375293410277';
  const WA = '375293410277';

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const form = document.getElementById('lead-form');
  const success = document.getElementById('form-success');
  const waLink = document.getElementById('wa-link');

  /* ---------- Состояние шапки ---------- */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Меню ---------- */
  const closeMenu = () => {
    if (!menu) return;
    menu.hidden = true;
    document.body.classList.remove('nav-open');
    burger?.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    if (!menu) return;
    menu.hidden = false;
    document.body.classList.add('nav-open');
    burger?.setAttribute('aria-expanded', 'true');
  };

  burger?.addEventListener('click', () => {
    menu?.hidden ? openMenu() : closeMenu();
  });
  menu?.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Активный пункт меню ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Форма ---------- */
  const setError = (field, message) => {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('has-error', Boolean(message));
    const box = wrap.querySelector('.field__error');
    if (box) box.textContent = message || '';
  };

  const validPhone = (value) => (value.replace(/\D/g, '').length >= 9);

  const validate = () => {
    let ok = true;
    const name = form.elements.name;
    const phone = form.elements.phone;
    if (!name.value.trim()) { setError(name, 'Как к вам обращаться?'); ok = false; } else setError(name, '');
    if (!validPhone(phone.value)) { setError(phone, 'Проверьте номер: нужно не меньше 9 цифр'); ok = false; } else setError(phone, '');
    return ok;
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      form.querySelector('.has-error input')?.focus();
      return;
    }
    const data = new FormData(form);
    const text = [
      'Заявка с сайта: утепление квартир',
      'Имя: ' + data.get('name'),
      'Телефон: ' + data.get('phone'),
      data.get('work') ? 'Работа: ' + data.get('work') : '',
      data.get('place') ? 'Объект: ' + data.get('place') : ''
    ].filter(Boolean).join('\n');

    if (waLink) waLink.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    success.hidden = false;
    [...form.elements].forEach((el) => { if (el.tagName !== 'A') el.disabled = true; });
    success.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  form?.addEventListener('input', (e) => {
    if (e.target.closest('.field')) setError(e.target, '');
  });

  /* ---------- Год ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Якоря с учётом шапки ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();
