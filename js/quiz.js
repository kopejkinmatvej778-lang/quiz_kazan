/* =========================================
   QUIZ LANDING — JavaScript
   Казань Септик Сервис
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ========================
  // QUIZ ENGINE
  // ========================
  const quizData = {
    currentStep: 0,
    answers: {},
    steps: [
      {
        id: 'residence',
        question: 'Как вы планируете проживать в доме?',
        layout: 'image-cards',
        options: [
          { value: 'permanent', label: 'Круглогодично', image: 'img/quiz/residence-permanent.jpg' },
          { value: 'summer', label: 'Летом', image: 'img/quiz/residence-summer.jpg' },
          { value: 'periodic', label: 'Периодически', image: 'img/quiz/residence-periodic.jpg' }
        ]
      },
      {
        id: 'people',
        question: 'Сколько человек будет проживать в доме?',
        layout: 'list',
        options: [
          { value: '1-3', label: '1–3 человека' },
          { value: '4-6', label: '4–6 человек' },
          { value: '6-10', label: '6–10 человек' },
          { value: '10+', label: 'Более 10 человек' }
        ]
      },
      {
        id: 'drainage',
        question: 'Куда будете отводить воду из септика?',
        layout: 'list',
        options: [
          { value: 'ditch', label: 'Канава' },
          { value: 'well', label: 'Колодец' },
          { value: 'ground', label: 'Грунт' },
          { value: 'unknown', label: 'Точно не знаю' }
        ]
      },
      {
        id: 'additional',
        question: 'Требуются ли услуги по водоснабжению, отоплению, водоочистке?',
        layout: 'list',
        options: [
          { value: 'yes', label: 'Да' },
          { value: 'no', label: 'Нет' },
          { value: 'consult', label: 'Нужна консультация', highlight: true }
        ]
      },
      {
        id: 'timeline',
        question: 'Когда планируете установку септика?',
        layout: 'list',
        options: [
          { value: 'asap', label: 'Как можно скорее', highlight: true },
          { value: 'month', label: 'Ближайший месяц', highlight: true },
          { value: '2-3months', label: 'В течение 2–3 месяцев', highlight: true },
          { value: '6months', label: 'В течение 6 месяцев', highlight: true },
          { value: 'browsing', label: 'Пока просто прицениваюсь', highlight: true }
        ]
      }
    ]
  };

  const quizContainer = document.getElementById('quiz-container');
  const progressStep = document.getElementById('progress-step');
  const quizNavBack = document.getElementById('quiz-nav-back');
  const quizNavNext = document.getElementById('quiz-nav-next');

  function renderStep(stepIndex) {
    const step = quizData.steps[stepIndex];
    const totalSteps = quizData.steps.length;

    // Update header counter
    progressStep.textContent = `${stepIndex + 1}/${totalSteps}`;

    // Update progress bar
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) progressBar.style.width = `${((stepIndex + 1) / totalSteps) * 100}%`;

    // Back button
    quizNavBack.classList.toggle('hidden', stepIndex === 0);

    // Next button text
    quizNavNext.textContent = stepIndex === totalSteps - 1 ? 'Последний вопрос' : 'Дальше →';

    // Build options
    const isMulti = step.type === 'multi';
    const selectedValues = quizData.answers[step.id] || (isMulti ? [] : null);
    const layout = step.layout || 'list';

    let optionsHTML = '';
    step.options.forEach(opt => {
      const isSelected = isMulti
        ? selectedValues.includes(opt.value)
        : selectedValues === opt.value;

      if (layout === 'image-cards') {
        optionsHTML += `
          <div class="quiz__option--image ${isSelected ? 'selected' : ''}"
               data-value="${opt.value}">
            <div class="quiz__option-img-wrap">
              <img src="${opt.image}" alt="${opt.label}">
            </div>
            <span class="quiz__option-text">${opt.label}</span>
          </div>`;
      } else if (layout === 'grid-2') {
        optionsHTML += `
          <div class="quiz__option--card ${isMulti ? 'quiz__option--checkbox' : ''} ${isSelected ? 'selected' : ''}"
               data-value="${opt.value}">
            <span class="quiz__option-icon">${opt.icon}</span>
            <span class="quiz__option-text">${opt.label}</span>
            <div class="quiz__option-radio"></div>
          </div>`;
      } else {
        optionsHTML += `
          <div class="quiz__option ${isMulti ? 'quiz__option--checkbox' : ''} ${isSelected ? 'selected' : ''}"
               data-value="${opt.value}">
            <div class="quiz__option-radio"></div>
            ${opt.icon ? `<span class="quiz__option-icon">${opt.icon}</span>` : ''}
            <span class="quiz__option-text ${opt.highlight ? 'quiz__option-text--link' : ''}">${opt.label}</span>
          </div>`;
      }
    });

    let gridClass = 'quiz__options';
    if (layout === 'image-cards') gridClass = 'quiz__options--images';
    else if (layout === 'grid-2') gridClass = 'quiz__options--grid';

    quizContainer.innerHTML = `
      <h3 class="quiz__question-title">${step.question}</h3>
      <div class="${gridClass}">${optionsHTML}</div>
    `;

    // Click handlers
    quizContainer.querySelectorAll('[data-value]').forEach(el => {
      el.addEventListener('click', () => handleClick(el, step, isMulti));
    });

    updateNextBtn(step, isMulti);
  }

  function handleClick(el, step, isMulti) {
    const val = el.dataset.value;

    if (isMulti) {
      if (!quizData.answers[step.id]) quizData.answers[step.id] = [];

      if (val === 'none') {
        quizData.answers[step.id] = ['none'];
        quizContainer.querySelectorAll('[data-value]').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
      } else {
        quizData.answers[step.id] = quizData.answers[step.id].filter(v => v !== 'none');
        quizContainer.querySelector('[data-value="none"]')?.classList.remove('selected');

        const idx = quizData.answers[step.id].indexOf(val);
        if (idx > -1) {
          quizData.answers[step.id].splice(idx, 1);
          el.classList.remove('selected');
        } else {
          quizData.answers[step.id].push(val);
          el.classList.add('selected');
        }
      }
    } else {
      quizData.answers[step.id] = val;
      quizContainer.querySelectorAll('[data-value]').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');

      // Auto-advance
      setTimeout(() => {
        if (quizData.currentStep < quizData.steps.length - 1) goToStep(quizData.currentStep + 1);
      }, 350);
    }

    updateNextBtn(step, isMulti);
  }

  function updateNextBtn(step, isMulti) {
    const has = isMulti
      ? quizData.answers[step.id]?.length > 0
      : !!quizData.answers[step.id];
    quizNavNext.style.opacity = has ? '1' : '0.5';
    quizNavNext.style.pointerEvents = has ? 'auto' : 'none';
  }

  function goToStep(i) {
    quizData.currentStep = i;
    if (i >= quizData.steps.length) { showLeadForm(); return; }
    renderStep(i);
  }

  function showLeadForm() {
    // Меняем шапку квиза на финальную (крупнее)
    const quizHeader = document.querySelector('.quiz__header');
    if (quizHeader) quizHeader.classList.add('quiz__header--final');
    const headerTitle = document.querySelector('.quiz__header-title');
    if (headerTitle) headerTitle.innerHTML = 'Для отправки предложения и расчета скидки нужен ваш телефон';
    progressStep.style.display = 'none';

    // Прогресс-бар на 100%
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) progressBar.style.width = '100%';

    // Форма в теле квиза
    quizContainer.innerHTML = `
      <div class="lead-form">
        <div class="lead-form__fields">
          <input type="text" class="lead-form__input" id="lead-name" placeholder="Как к вам обращаться?" autocomplete="name">
          <div class="lead-form__phone-wrap">
            <div class="lead-form__phone-prefix">
              <span class="lead-form__ru-flag"></span>
              <span class="lead-form__prefix-text">+7</span>
            </div>
            <input type="tel" class="lead-form__input lead-form__input--phone" id="lead-phone" placeholder="(000) 000-00-00" autocomplete="tel">
          </div>
        </div>
      </div>
    `;

    // Навигация: Назад + кнопка отправки
    const nav = document.getElementById('quiz-nav');
    nav.style.display = 'flex';
    quizNavBack.classList.remove('hidden');
    quizNavNext.textContent = 'Получить выгоду до 52 650 руб.';
    quizNavNext.style.opacity = '1';
    quizNavNext.style.pointerEvents = 'auto';

    // Подпись под кнопкой
    if (!document.getElementById('quiz-nav-note')) {
      const note = document.createElement('div');
      note.id = 'quiz-nav-note';
      note.className = 'quiz__nav-note';
      note.textContent = 'Это бесплатно и ни к чему не обязывает';
      nav.insertAdjacentElement('afterend', note);
    }

    // Маска телефона
    const phoneInput = document.getElementById('lead-phone');
    phoneInput.addEventListener('input', phoneMask);
    phoneInput.addEventListener('focus', () => { if (!phoneInput.value) phoneInput.value = '+7 '; });

    // Клик на кнопку "Получить выгоду"
    quizNavNext.onclick = (e) => { e.stopImmediatePropagation(); handleSubmit(); };
  }

  function phoneMask(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (!v.length) { e.target.value = ''; return; }
    if (v[0] === '8') v = '7' + v.slice(1);
    if (v[0] !== '7') v = '7' + v;
    let f = '+7';
    if (v.length > 1) f += ' ' + v.slice(1, 4);
    if (v.length > 4) f += ' ' + v.slice(4, 7);
    if (v.length > 7) f += '-' + v.slice(7, 9);
    if (v.length > 9) f += '-' + v.slice(9, 11);
    e.target.value = f;
  }

  function handleSubmit() {
    const name = document.getElementById('lead-name').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    if (!name) { shake('lead-name'); return; }
    if (phone.replace(/\D/g, '').length < 11) { shake('lead-phone'); return; }

    const btn = document.getElementById('lead-submit');
    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    console.log('Lead:', { name, phone, answers: quizData.answers, ts: new Date().toISOString() });

    setTimeout(() => {
      quizContainer.innerHTML = `
        <div class="lead-form__success">
          <div class="lead-form__success-icon">✅</div>
          <h3 class="lead-form__success-title">Заявка отправлена!</h3>
          <p class="lead-form__success-text">Наш инженер свяжется с вами в течение 15 минут</p>
        </div>`;
      document.querySelector('.quiz__header').style.display = 'none';
    }, 800);
  }

  function shake(id) {
    const el = document.getElementById(id);
    el.style.borderColor = '#ff1744';
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 1000);
  }

  // Nav handlers
  quizNavBack.addEventListener('click', () => {
    if (quizData.currentStep > 0) {
      document.getElementById('quiz-nav').style.display = '';
      goToStep(quizData.currentStep - 1);
    }
  });

  quizNavNext.addEventListener('click', () => goToStep(quizData.currentStep + 1));

  // Init
  renderStep(0);

  // ========================
  // SCROLL TO QUIZ
  // ========================
  document.querySelectorAll('[data-scroll-quiz]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ========================
  // WORKS TABS
  // ========================
  document.querySelectorAll('.works__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.dataset.tab;

      // Переключаем активный таб
      document.querySelectorAll('.works__tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Переключаем активную панель
      document.querySelectorAll('.works__panel').forEach(p => p.classList.remove('active'));
      const panel = document.querySelector(`.works__panel[data-panel="${targetPanel}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // ========================
  // FAQ ACCORDION
  // ========================
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ========================
  // CONTACT POPUP (floating phone btn)
  // ========================
  const cpopup = document.getElementById('contact-popup');
  const popupForm = document.getElementById('popup-form');
  const floatPhoneBtn = document.querySelector('.float-phone');

  const PHONE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

  function openPopup() {
    cpopup?.classList.add('show');
    floatPhoneBtn?.classList.add('is-open');
    if (floatPhoneBtn) floatPhoneBtn.innerHTML = CLOSE_ICON;
  }

  function closePopup() {
    cpopup?.classList.remove('show');
    floatPhoneBtn?.classList.remove('is-open');
    if (floatPhoneBtn) floatPhoneBtn.innerHTML = PHONE_ICON;
  }

  if (cpopup) {
    floatPhoneBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      cpopup.classList.contains('show') ? closePopup() : openPopup();
    });

    popupForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      closePopup();
    });
  }

  // ========================
  // CALLBACK MODAL (кнопка «ВАМ ПЕРЕЗВОНИТЬ?»)
  // ========================
  const cbModal = document.getElementById('callback-modal');
  const cbOpenBtn = document.getElementById('btn-callback-modal');
  const cbCloseBtn = document.getElementById('callback-modal-close');
  const cbForm = document.getElementById('callback-form');

  function openCbModal() {
    if (!cbModal) return;
    cbModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Focus first field
    setTimeout(() => { document.getElementById('cb-name')?.focus(); }, 200);
  }

  function closeCbModal() {
    if (!cbModal) return;
    cbModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  cbOpenBtn?.addEventListener('click', (e) => { e.preventDefault(); openCbModal(); });
  cbCloseBtn?.addEventListener('click', closeCbModal);

  // Закрытие по клику на оверлей
  cbModal?.addEventListener('click', (e) => {
    if (e.target === cbModal) closeCbModal();
  });

  // Маска телефона в модалке
  const cbPhoneInput = document.getElementById('cb-phone');
  function cbPhoneMask(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (!v.length) { e.target.value = ''; return; }
    if (v[0] === '8') v = '7' + v.slice(1);
    if (v[0] !== '7') v = '7' + v;
    let f = '+7';
    if (v.length > 1) f += ' ' + v.slice(1, 4);
    if (v.length > 4) f += ' ' + v.slice(4, 7);
    if (v.length > 7) f += '-' + v.slice(7, 9);
    if (v.length > 9) f += '-' + v.slice(9, 11);
    e.target.value = f;
  }
  cbPhoneInput?.addEventListener('input', cbPhoneMask);
  cbPhoneInput?.addEventListener('focus', () => { if (!cbPhoneInput.value) cbPhoneInput.value = '+7 '; });

  // Отправка формы
  cbForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cb-name')?.value.trim();
    const phone = document.getElementById('cb-phone')?.value.trim();

    if (!name) {
      const nameEl = document.getElementById('cb-name');
      nameEl.style.borderColor = '#ff1744';
      nameEl.style.animation = 'shake 0.4s ease';
      setTimeout(() => { nameEl.style.borderColor = ''; nameEl.style.animation = ''; }, 1000);
      return;
    }
    if (!phone || phone.replace(/\D/g, '').length < 11) {
      const phoneEl = document.getElementById('cb-phone');
      const wrap = phoneEl?.closest('.callback-modal__phone-wrap');
      if (wrap) { wrap.style.borderColor = '#ff1744'; wrap.style.animation = 'shake 0.4s ease'; }
      setTimeout(() => { if (wrap) { wrap.style.borderColor = ''; wrap.style.animation = ''; } }, 1000);
      return;
    }

    const submitBtn = cbForm.querySelector('.callback-modal__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';

    console.log('Callback Lead:', { name, phone, ts: new Date().toISOString() });

    setTimeout(() => {
      const modalContent = cbModal.querySelector('.callback-modal');
      modalContent.innerHTML = `
        <button class="callback-modal__close" onclick="document.getElementById('callback-modal').classList.remove('show');document.body.style.overflow='';">&times;</button>
        <div class="callback-modal__success">
          <div class="callback-modal__success-icon">✅</div>
          <h3 class="callback-modal__success-title">Заявка отправлена!</h3>
          <p class="callback-modal__success-text">Наш специалист свяжется с вами<br>в течение 10 минут</p>
        </div>`;
    }, 800);
  });

  // ========================
  // PRIVACY MODAL
  // ========================
  const modal = document.getElementById('privacy-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal__close')) {
        modal.classList.remove('show');
      }
    });
    document.querySelectorAll('[data-privacy]').forEach(a => {
      a.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('show'); });
    });
  }

});

