document.addEventListener('DOMContentLoaded', () => {
  const safeText = (value) => value == null ? '' : String(value);

  const initCitySelection = (selectSelector = '#ville', indicatorSelector = '#villeIndicator') => {
    const select = document.querySelector(selectSelector);
    const indicator = document.querySelector(indicatorSelector);
    if (!select || !indicator) return;

    const update = () => {
      if (!select.value) {
        indicator.textContent = '📍 Aucune wilaya sélectionnée';
        indicator.classList.remove('active');
        return;
      }
      indicator.textContent = `📍 Wilaya : ${safeText(select.value)}`;
      indicator.classList.add('active');
    };

    select.addEventListener('change', update);
    update();
  };

  const initPasswordHint = (inputSelector = '#password', hintSelector = '#passwordHint') => {
    const input = document.querySelector(inputSelector);
    const hint = document.querySelector(hintSelector);
    if (!input || !hint) return;

    const update = () => {
      const value = input.value.trim();
      if (!value) {
        hint.innerHTML = '<i class="fas fa-info-circle"></i> 8 caractères minimum';
        hint.className = 'password-hint';
        return;
      }

      if (value.length >= 8) {
        hint.innerHTML = '<i class="fas fa-check-circle"></i> Mot de passe valide';
        hint.className = 'password-hint valid';
      } else {
        const remaining = 8 - value.length;
        hint.innerHTML = `<i class="fas fa-info-circle"></i> ${remaining} caractère${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`;
        hint.className = 'password-hint';
      }
    };

    input.addEventListener('input', update);
    update();
  };

  const initServiceSelector = () => {
    const checks = document.querySelectorAll('.service-check input[type="checkbox"]');
    const indicator = document.getElementById('servicesIndicator');
    if (!checks.length || !indicator) return;

    const update = () => {
      const selected = Array.from(checks).filter((c) => c.checked);
      if (!selected.length) {
        indicator.textContent = '❌ Aucun service sélectionné';
        indicator.classList.remove('active');
        return;
      }
      const labels = selected.map((c) => c.value || c.getAttribute('data-label') || 'Service');
      indicator.textContent = `✅ ${labels.join(', ')}`;
      indicator.classList.add('active');
    };

    checks.forEach((check) => check.addEventListener('change', update));
    update();
  };

  const initLogin = () => {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const error = document.getElementById('errorMessage');
      const errorText = document.getElementById('errorText');

      if (!email || !password) return;
      if (!email.value.trim() || !password.value.trim()) {
        if (error && errorText) {
          errorText.textContent = 'Veuillez remplir tous les champs.';
          error.classList.add('visible');
        }
        return;
      }

      if (password.value.trim().length < 8) {
        if (error && errorText) {
          errorText.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
          error.classList.add('visible');
        }
        return;
      }

      if (error) error.classList.remove('visible');
      const btn = document.getElementById('loginBtn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';
      }
      window.setTimeout(() => {
        window.location.href = 'tableau-de-bord-client.html';
      }, 1000);
    });
  };

  initCitySelection();
  initPasswordHint();
  initServiceSelector();
  initLogin();
});
