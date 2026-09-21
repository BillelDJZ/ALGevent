(function () {
  const isReady = () => document.readyState !== 'loading';

  function safeText(value) {
    return value == null ? '' : String(value);
  }

  function getStars(note) {
    const full = Math.floor(note);
    const half = (note - full) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function formatPrice(value) {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function initCitySelection(selectId = 'ville', indicatorId = 'villeIndicator') {
    const select = document.getElementById(selectId);
    const indicator = document.getElementById(indicatorId);
    if (!select || !indicator) return;

    const update = () => {
      if (!select.value) {
        indicator.textContent = '📍 Aucune wilaya sélectionnée';
        indicator.className = 'selection-indicator';
        return;
      }

      indicator.textContent = `📍 Wilaya : ${select.value}`;
      indicator.className = 'selection-indicator active';
    };

    select.addEventListener('change', update);
    update();
  }

  function initPasswordHint(inputId = 'password', hintId = 'passwordHint') {
    const input = document.getElementById(inputId);
    const hint = document.getElementById(hintId);
    if (!input || !hint) return;

    const update = () => {
      const value = input.value;
      if (value.length >= 8) {
        hint.innerHTML = '<i class="fas fa-check-circle"></i> Mot de passe valide';
        hint.className = 'password-hint valid';
      } else {
        const remaining = Math.max(0, 8 - value.length);
        hint.innerHTML = `<i class="fas fa-info-circle"></i> ${remaining} caractère${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`;
        hint.className = 'password-hint';
      }
    };

    input.addEventListener('input', update);
    update();
  }

  function initResetPasswordValidation() {
    const password = document.getElementById('newPassword');
    const confirm = document.getElementById('confirmPassword');
    const hint = document.getElementById('newPasswordHint');
    const confirmHint = document.getElementById('confirmPasswordHint');
    if (!password || !confirm || !hint || !confirmHint) return;

    const sync = () => {
      if (password.value.length >= 8) {
        hint.innerHTML = '<i class="fas fa-check-circle"></i> Mot de passe valide';
        hint.className = 'password-hint valid';
      } else {
        const remaining = Math.max(0, 8 - password.value.length);
        hint.innerHTML = `<i class="fas fa-info-circle"></i> ${remaining} caractère${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`;
        hint.className = 'password-hint';
      }

      if (!confirm.value) {
        confirmHint.innerHTML = '<i class="fas fa-info-circle"></i> Confirmez votre mot de passe';
        confirmHint.className = 'password-hint';
        return;
      }

      if (password.value === confirm.value) {
        confirmHint.innerHTML = '<i class="fas fa-check-circle"></i> Les mots de passe correspondent';
        confirmHint.className = 'password-hint valid';
      } else {
        confirmHint.innerHTML = '<i class="fas fa-times-circle"></i> Les mots de passe ne correspondent pas';
        confirmHint.className = 'password-hint invalid';
      }
    };

    password.addEventListener('input', sync);
    confirm.addEventListener('input', sync);
    sync();
  }

  function initServiceSelector() {
    const checks = document.querySelectorAll('.service-check input[type="checkbox"]');
    const indicator = document.getElementById('servicesIndicator');
    if (!checks.length || !indicator) return;

    const update = () => {
      const checked = Array.from(checks).filter((box) => box.checked);
      const names = checked.map((box) => {
        const map = {
          traiteur: 'Traiteur',
          decoration: 'Décoration',
          sonorisation: 'Sonorisation',
          photographie: 'Photographie',
          animation: 'Animation',
          location: 'Location'
        };
        return map[box.value] || box.value;
      });

      if (names.length > 0) {
        indicator.textContent = `✅ ${names.join(', ')}`;
        indicator.className = 'selection-indicator active';
      } else {
        indicator.textContent = '❌ Aucun service sélectionné';
        indicator.className = 'selection-indicator';
      }

      checks.forEach((box) => {
        const label = box.closest('.service-check');
        if (label) label.classList.toggle('selected', box.checked);
      });
    };

    checks.forEach((box) => box.addEventListener('change', update));
    update();
  }

  function initAuthLogin() {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('loginBtn');

    if (!form || !errorMessage || !errorText) return;

    const validate = () => {
      const email = (emailInput && emailInput.value.trim()) || '';
      const password = (passwordInput && passwordInput.value.trim()) || '';

      if (!email || !password) {
        errorText.textContent = 'Veuillez remplir tous les champs.';
        errorMessage.classList.add('visible');
        return false;
      }

      if (password.length < 8) {
        errorText.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
        errorMessage.classList.add('visible');
        return false;
      }

      errorMessage.classList.remove('visible');
      return true;
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validate()) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';
      }

      setTimeout(() => {
        window.location.href = 'tableau-de-bord-client.html';
      }, 1500);
    });

    if (emailInput) {
      emailInput.addEventListener('input', () => errorMessage.classList.remove('visible'));
    }
    if (passwordInput) {
      passwordInput.addEventListener('input', () => errorMessage.classList.remove('visible'));
    }
  }

  function initRegistrationForm() {
    const form = document.getElementById('registerForm');
    const successArea = document.getElementById('successArea');
    const successMessage = document.getElementById('successMessage');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const nom = document.getElementById('nom')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const password = document.getElementById('password')?.value.trim() || '';
      const ville = document.getElementById('ville')?.value || '';

      if (!nom || !email || !password || !ville) {
        alert('⚠️ Veuillez remplir tous les champs.');
        return;
      }

      if (password.length < 8) {
        alert('⚠️ Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }

      if (successMessage) {
        successMessage.innerHTML = `
          <strong>${nom}</strong>, votre compte a été créé avec succès !<br>
          <span style="font-size:13px;color:#6b7280;">Email : ${email} · Wilaya : ${ville}</span>
        `;
      }

      if (successArea) {
        successArea.classList.add('visible');
        successArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => successArea.classList.remove('visible'), 6000);
      }
    });
  }

  function initSupplierRegisterForm() {
    const form = document.getElementById('registerForm');
    const successArea = document.getElementById('successArea');
    const successMessage = document.getElementById('successMessage');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const entreprise = document.getElementById('entreprise')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const password = document.getElementById('password')?.value.trim() || '';
      const ville = document.getElementById('ville')?.value || '';
      const description = document.getElementById('description')?.value.trim() || '';
      const selectedServices = Array.from(document.querySelectorAll('.service-check input:checked'));
      const servicesList = selectedServices.map((box) => box.value);

      if (!entreprise || !email || !password || !ville) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires (*).');
        return;
      }

      if (password.length < 8) {
        alert('⚠️ Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }

      const servicesText = servicesList.length > 0
        ? servicesList.map((service) => ({
            traiteur: 'Traiteur',
            decoration: 'Décoration',
            sonorisation: 'Sonorisation',
            photographie: 'Photographie',
            animation: 'Animation',
            location: 'Location'
          }[service] || service)).join(', ')
        : 'Aucun service';

      if (successMessage) {
        successMessage.innerHTML = `
          <strong>${entreprise}</strong>, votre compte fournisseur a été créé avec succès !<br>
          <span style="font-size:13px;color:#6b7280;">
            Email : ${email} · Wilaya : ${ville}<br>
            Services : ${servicesText}
            ${description ? `· Description : "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"` : ''}
          </span>
        `;
      }

      if (successArea) {
        successArea.classList.add('visible');
        successArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => successArea.classList.remove('visible'), 6000);
      }
    });
  }

  function initForgotPasswordForm() {
    const form = document.getElementById('reset-form');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const confirmBox = document.getElementById('confirm-msg');
    const sentEmail = document.getElementById('sent-email');
    const resendBtn = document.getElementById('resend-btn');
    const resendTimer = document.getElementById('resend-timer');
    if (!form || !emailInput) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = (value) => emailRegex.test(value.trim());

    emailInput.addEventListener('input', function () {
      if (this.value && !validateEmail(this.value)) {
        this.classList.add('error');
        if (emailError) emailError.classList.add('visible');
      } else {
        this.classList.remove('error');
        if (emailError) emailError.classList.remove('visible');
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = emailInput.value.trim();

      if (!email || !validateEmail(email)) {
        emailInput.classList.add('error');
        if (emailError) emailError.classList.add('visible');
        emailInput.focus();
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Envoi en cours...';
      if (submitBtn && submitBtn.querySelector('i')) {
        submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
      }

      setTimeout(() => {
        form.style.display = 'none';
        if (confirmBox) confirmBox.classList.add('visible');
        if (sentEmail) sentEmail.textContent = email;
        if (resendBtn) {
          resendBtn.disabled = true;
          resendBtn.innerHTML = '<i class="fas fa-redo"></i> Renvoyer dans <span id="resend-timer">45</span>s';
        }
        startResendTimer();
      }, 1200);
    });

    let resendInterval = null;
    const startResendTimer = () => {
      let remaining = 45;
      if (resendBtn) resendBtn.disabled = true;

      clearInterval(resendInterval);
      resendInterval = setInterval(() => {
        remaining -= 1;
        if (resendTimer) resendTimer.textContent = remaining;

        if (remaining <= 0) {
          clearInterval(resendInterval);
          if (resendBtn) {
            resendBtn.disabled = false;
            resendBtn.innerHTML = "<i class=\"fas fa-redo\"></i> Renvoyer l'email";
          }
        }
      }, 1000);
    };

    if (resendBtn) {
      resendBtn.addEventListener('click', function () {
        if (this.disabled) return;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        this.disabled = true;

        setTimeout(() => {
          startResendTimer();
        }, 800);
      });
    }
  }

  function initOtpFlow() {
    const form = document.getElementById('otp-form');
    const inputs = Array.from(document.querySelectorAll('#otp-row input'));
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const otpRow = document.getElementById('otp-row');
    const successBox = document.getElementById('success-box');
    const countdownEl = document.getElementById('countdown');
    const resendLink = document.getElementById('resend-link');
    if (!form || !inputs.length) return;

    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
        input.classList.toggle('filled', input.value !== '');
        if (otpRow) otpRow.classList.remove('error');

        if (input.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }

        if (index === inputs.length - 1 && input.value && inputs.every((item) => item.value)) {
          setTimeout(() => form.requestSubmit(), 200);
        }
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && !input.value && index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].value = '';
          inputs[index - 1].classList.remove('filled');
        }
      });

      input.addEventListener('paste', (event) => {
        event.preventDefault();
        const pasted = (event.clipboardData || window.clipboardData).getData('text');
        const digits = pasted.replace(/[^0-9]/g, '').slice(0, 6).split('');

        digits.forEach((digit, digitIndex) => {
          if (inputs[digitIndex]) {
            inputs[digitIndex].value = digit;
            inputs[digitIndex].classList.add('filled');
          }
        });

        const nextIndex = Math.min(digits.length, inputs.length - 1);
        inputs[nextIndex].focus();

        if (digits.length === 6) {
          setTimeout(() => form.requestSubmit(), 200);
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const code = inputs.map((input) => input.value).join('');

      if (code.length !== 6) {
        if (otpRow) otpRow.classList.add('error');
        const firstEmpty = inputs.find((input) => !input.value);
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Vérification...';
      if (submitBtn && submitBtn.querySelector('i')) {
        submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
      }

      setTimeout(() => {
        form.style.display = 'none';
        if (successBox) successBox.classList.add('visible');

        setTimeout(() => {
          window.location.href = 'accueil-client.html';
        }, 1500);
      }, 1200);
    });

    let seconds = 45;
    const timer = setInterval(() => {
      seconds -= 1;
      if (countdownEl) {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        countdownEl.textContent = `${mm}:${ss}`;
      }
      if (seconds <= 0) {
        clearInterval(timer);
        if (resendLink) {
          resendLink.textContent = 'Renvoyer le code';
          resendLink.classList.remove('disabled');
        }
      }
    }, 1000);

    if (resendLink) {
      resendLink.addEventListener('click', function (event) {
        event.preventDefault();
        if (this.classList.contains('disabled')) return;

        this.classList.add('disabled');
        this.innerHTML = 'Renvoyer dans <span id="countdown">00:45</span>';
        inputs.forEach((input) => {
          input.value = '';
          input.classList.remove('filled');
        });
        inputs[0]?.focus();

        let resendSeconds = 45;
        const update = () => {
          const mm = String(Math.floor(resendSeconds / 60)).padStart(2, '0');
          const ss = String(resendSeconds % 60).padStart(2, '0');
          const current = document.getElementById('countdown');
          if (current) current.textContent = `${mm}:${ss}`;

          if (resendSeconds <= 0) {
            clearInterval(resendTimer);
            this.innerHTML = 'Renvoyer le code';
            this.classList.remove('disabled');
          }
          resendSeconds -= 1;
        };

        const resendTimer = setInterval(update, 1000);
      });
    }
  }

  function initCategoryBrowse() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const grid = document.getElementById('cardGrid');
    const resultsCount = document.getElementById('countDisplay');
    const categoryDisplay = document.getElementById('categoryDisplay');

    if (!categoryButtons.length || !grid) return;

    const categoryData = {
      'chef-traiteur': 'Chef & Traiteur',
      'serveurs-service': 'Serveurs & Service',
      'dj-artiste': 'DJ & Artiste',
      decoration: 'Décoration',
      audiovisuel: 'Matériel Audiovisuel',
      'location-voiture': 'Location de voiture'
    };

    const fournisseurs = [
      { id: 1, nom: 'Chef Mohamed Amine', categorie: 'chef-traiteur', wilaya: 'Alger', note: 4.9, avis: 156, emoji: '👨‍🍳', prix: 'À partir de 25 000 DA', tags: ['Cuisine orientale', 'Fusion', 'Menu dégustation'] },
      { id: 2, nom: 'Traiteur El Djazair', categorie: 'chef-traiteur', wilaya: 'Alger', note: 4.8, avis: 132, emoji: '🍽️', prix: 'À partir de 20 000 DA', tags: ['Cuisine algérienne', 'Pâtisserie', 'Service à table'] },
      { id: 3, nom: 'Chef Samir', categorie: 'chef-traiteur', wilaya: 'Oran', note: 4.7, avis: 98, emoji: '👨‍🍳', prix: 'À partir de 22 000 DA', tags: ['Cuisine méditerranéenne', 'Poissons', 'Plancha'] },
      { id: 4, nom: 'Traiteur Le Gourmet', categorie: 'chef-traiteur', wilaya: 'Constantine', note: 4.6, avis: 87, emoji: '🍷', prix: 'À partir de 28 000 DA', tags: ['Cuisine française', 'Vins', 'Fromages'] },
      { id: 5, nom: 'Service Prestige', categorie: 'serveurs-service', wilaya: 'Alger', note: 4.7, avis: 112, emoji: '🤵', prix: 'À partir de 15 000 DA', tags: ['Service à table', 'Majordome', 'Tenue de cérémonie'] },
      { id: 6, nom: 'Équipe El Bahia', categorie: 'serveurs-service', wilaya: 'Oran', note: 4.6, avis: 76, emoji: '👔', prix: 'À partir de 12 000 DA', tags: ['Personnel qualifié', 'Service buffet', 'Dressage'] },
      { id: 7, nom: 'DJ Kader Mix', categorie: 'dj-artiste', wilaya: 'Alger', note: 4.9, avis: 203, emoji: '🎧', prix: 'À partir de 30 000 DA', tags: ['House', 'Tech', 'Mariage', 'Anniversaire'] },
      { id: 8, nom: 'DJ Chawki', categorie: 'dj-artiste', wilaya: 'Oran', note: 4.8, avis: 167, emoji: '🎵', prix: 'À partir de 25 000 DA', tags: ['Raï', 'Oriental', 'Mix'] },
      { id: 9, nom: 'Groupe El Anka', categorie: 'dj-artiste', wilaya: 'Constantine', note: 4.7, avis: 89, emoji: '🎶', prix: 'À partir de 35 000 DA', tags: ['Musique andalouse', 'Groupe', 'Traditionnel'] },
      { id: 10, nom: 'Décoration Elégance', categorie: 'decoration', wilaya: 'Alger', note: 4.9, avis: 178, emoji: '💐', prix: 'À partir de 18 000 DA', tags: ['Fleurs', 'Lumière', 'Mobilier'] },
      { id: 11, nom: 'Décoration Oran', categorie: 'decoration', wilaya: 'Oran', note: 4.6, avis: 94, emoji: '🎨', prix: 'À partir de 15 000 DA', tags: ['Scénographie', 'Ballons', 'Rideaux'] },
      { id: 12, nom: 'Dream Déco', categorie: 'decoration', wilaya: 'Blida', note: 4.5, avis: 67, emoji: '✨', prix: 'À partir de 20 000 DA', tags: ['Thème personnalisé', 'Mariage', 'Anniversaire'] },
      { id: 13, nom: 'AV PRO', categorie: 'audiovisuel', wilaya: 'Alger', note: 4.8, avis: 145, emoji: '📹', prix: 'À partir de 22 000 DA', tags: ['Sonorisation', 'Éclairage', 'Écrans LED'] },
      { id: 14, nom: 'Studio Lumière', categorie: 'audiovisuel', wilaya: 'Constantine', note: 4.7, avis: 88, emoji: '💡', prix: 'À partir de 20 000 DA', tags: ['Projection', 'Photographie', 'Vidéo'] },
      { id: 15, nom: 'Sound System', categorie: 'audiovisuel', wilaya: 'Oran', note: 4.6, avis: 73, emoji: '🔊', prix: 'À partir de 18 000 DA', tags: ['Sonorisation', 'Micros', 'Enceintes'] },
      { id: 16, nom: 'Elite Cars', categorie: 'location-voiture', wilaya: 'Alger', note: 4.7, avis: 156, emoji: '🚗', prix: 'À partir de 30 000 DA', tags: ['Berlines', 'SUV', 'Chauffeur'] },
      { id: 17, nom: 'Prestige Auto', categorie: 'location-voiture', wilaya: 'Oran', note: 4.6, avis: 89, emoji: '🚙', prix: 'À partir de 25 000 DA', tags: ['Sportives', 'Cérémonie', 'Cortège'] },
      { id: 18, nom: 'Dream Drive', categorie: 'location-voiture', wilaya: 'Annaba', note: 4.5, avis: 56, emoji: '🚘', prix: 'À partir de 22 000 DA', tags: ['Voitures de luxe', 'Chauffeur privé'] }
    ];

    function renderCards(category = 'all') {
      const filtered = category === 'all' ? [...fournisseurs] : fournisseurs.filter((item) => item.categorie === category);
      filtered.sort((a, b) => b.note - a.note);

      if (resultsCount) resultsCount.textContent = filtered.length;
      if (categoryDisplay) {
        const name = category === 'all' ? '' : ` · ${categoryData[category] || category}`;
        categoryDisplay.textContent = name;
      }

      if (!filtered.length) {
        grid.innerHTML = `
          <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>Aucun fournisseur trouvé</h3>
            <p>Essayez une autre catégorie ou revenez plus tard.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map((item, index) => `
        <div class="card" style="animation-delay: ${index * 0.05}s" onclick="window.location.href='fiche-fournisseur.html?id=${item.id}'">
          <div class="card-image"><span class="emoji">${item.emoji}</span></div>
          <div class="card-category"><i class="fas fa-tag"></i> ${categoryData[item.categorie] || item.categorie}</div>
          <div class="card-title">${item.nom}</div>
          <div class="card-location"><i class="fas fa-location-dot"></i> ${item.wilaya}</div>
          <div style="color: #fbbf24; font-size: 14px; margin-bottom: 6px;">
            <span class="stars">${getStars(item.note)}</span>
            <span style="color: #0f172a; font-weight: 700;">${item.note.toFixed(1)}</span>
            <span style="color: #94a3b8;">(${item.avis} avis)</span>
          </div>
          <div class="card-tags">${item.tags.map((tag) => `<span>#${tag}</span>`).join('')}</div>
          <div class="card-price">💰 ${item.prix}</div>
        </div>
      `).join('');
    }

    categoryButtons.forEach((button) => {
      button.addEventListener('click', function () {
        categoryButtons.forEach((btn) => btn.classList.remove('active'));
        this.classList.add('active');
        renderCards(this.dataset.category || 'all');
      });
    });

    renderCards('all');
  }

  function initSalleFilters() {
    const wilayaSelect = document.getElementById('filterWilaya');
    const prixSelect = document.getElementById('filterPrix');
    const capaciteSelect = document.getElementById('filterCapacite');
    const noteSelect = document.getElementById('filterNote');
    const resetButton = document.getElementById('resetFilters');
    const grid = document.getElementById('cardGrid');
    const countNum = document.getElementById('countNum');
    const countLabel = document.getElementById('countLabel');

    if (!wilayaSelect || !prixSelect || !capaciteSelect || !noteSelect || !grid) return;

    const salles = [
      { id: 1, nom: 'Le Palace', wilaya: 'Alger', note: 4.9, avis: 124, image: '🏰', prix: 50000, capacite: 500 },
      { id: 2, nom: 'Espace El Djazair', wilaya: 'Alger', note: 4.8, avis: 98, image: '🏛️', prix: 45000, capacite: 350 },
      { id: 3, nom: 'Salle des Fêtes', wilaya: 'Alger', note: 4.7, avis: 76, image: '🎪', prix: 40000, capacite: 200 },
      { id: 4, nom: 'Le Méridien', wilaya: 'Oran', note: 4.8, avis: 112, image: '🏨', prix: 55000, capacite: 600 },
      { id: 5, nom: 'Espace Ahlam', wilaya: 'Oran', note: 4.6, avis: 89, image: '✨', prix: 42000, capacite: 180 },
      { id: 6, nom: 'Palais des Congrès', wilaya: 'Constantine', note: 4.8, avis: 134, image: '🏰', prix: 60000, capacite: 800 },
      { id: 7, nom: 'Salle El Amane', wilaya: 'Constantine', note: 4.7, avis: 65, image: '🎭', prix: 48000, capacite: 250 },
      { id: 8, nom: 'Le Majestic', wilaya: 'Annaba', note: 4.6, avis: 72, image: '👑', prix: 50000, capacite: 400 },
      { id: 9, nom: 'Salle Royale', wilaya: 'Blida', note: 4.7, avis: 43, image: '👸', prix: 44000, capacite: 300 },
      { id: 10, nom: 'Le Jardin', wilaya: 'Blida', note: 4.5, avis: 201, image: '🌹', prix: 38000, capacite: 120 }
    ];

    function renderCards() {
      const wilaya = wilayaSelect.value;
      const prix = prixSelect.value;
      const capacite = capaciteSelect.value;
      const noteMin = Number(noteSelect.value || 0);

      const filtered = salles.filter((salle) => {
        if (wilaya !== 'all' && salle.wilaya !== wilaya) return false;

        if (prix !== 'all') {
          const [min, max] = prix.split('-').map(Number);
          if (salle.prix < min || salle.prix > max) return false;
        }

        if (capacite !== 'all') {
          const [minC, maxC] = capacite.split('-').map(Number);
          if (salle.capacite < minC || salle.capacite > maxC) return false;
        }

        if (salle.note < noteMin) return false;
        return true;
      }).sort((a, b) => b.note - a.note);

      if (countNum) countNum.textContent = filtered.length;
      if (countLabel) countLabel.textContent = filtered.length > 1 ? 'salles trouvées' : 'salle trouvée';

      if (!filtered.length) {
        grid.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <h3>Aucune salle ne correspond à vos critères</h3>
            <p>Essayez d'élargir vos filtres.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map((salle) => `
        <div class="card">
          <div class="card-image">${salle.image}</div>
          <div class="card-title">${salle.nom}</div>
          <div class="card-location">📍 ${salle.wilaya}</div>
          <div class="card-capacity"><i class="fas fa-users"></i> ${salle.capacite} personnes</div>
          <div style="color: #fbbf24; font-size: 14px; margin-bottom: 6px;">
            <span class="stars">${getStars(salle.note)}</span>
            <span style="color: #0f172a; font-weight: 700;">${salle.note.toFixed(1)}</span>
            <span style="color: #94a3b8;">(${salle.avis} avis)</span>
          </div>
          <div class="card-price">${salle.prix.toLocaleString('fr-FR')} DA/jour</div>
        </div>
      `).join('');
    }

    [wilayaSelect, prixSelect, capaciteSelect, noteSelect].forEach((select) => {
      select.addEventListener('change', renderCards);
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        wilayaSelect.value = 'all';
        prixSelect.value = 'all';
        capaciteSelect.value = 'all';
        noteSelect.value = '0';
        renderCards();
      });
    }

    renderCards();
  }

  function initSearchExplorer() {
    const searchBtn = document.getElementById('searchBtn');
    const select = document.getElementById('wilayaSelect');
    const cards = document.querySelectorAll('.explore-card');
    const resultMessage = document.getElementById('resultMessage');
    const resultsArea = document.getElementById('resultsArea');
    const indicator = document.getElementById('selectionIndicator');

    if (!searchBtn || !select || !cards.length) return;

    let selectedOption = null;

    cards.forEach((card) => {
      card.addEventListener('click', function () {
        cards.forEach((item) => item.classList.remove('selected'));

        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          selectedOption = null;
        } else {
          this.classList.add('selected');
          selectedOption = this.dataset.value;
        }

        if (indicator) {
          if (selectedOption === 'salles') {
            indicator.textContent = '📍 Salles sélectionnées';
            indicator.className = 'selection-indicator active';
          } else if (selectedOption === 'fournisseurs') {
            indicator.textContent = '🤝 Fournisseurs sélectionnés';
            indicator.className = 'selection-indicator active';
          } else {
            indicator.textContent = 'Aucune sélection';
            indicator.className = 'selection-indicator';
          }
        }
      });
    });

    const data = {
      salles: {
        Alger: ['Le Palace', 'Espace El Djazair', 'Salle des Fêtes Bab Ezzouar'],
        Oran: ['Le Méridien', 'Espace Ahlam', 'Salle El Bahia'],
        Constantine: ['Palais des Congrès', 'Salle El Amane', 'Espace Cirta'],
        Annaba: ['Le Majestic', 'Salle Les Palmiers', 'Espace El Bouni'],
        Blida: ['Le Jardin', 'Salle El Wiam', 'Espace Chréa'],
        Batna: ['Le Tassili', 'Salle El Aouras', 'Espace Lambèse'],
        Sétif: ['Palais de la Culture', 'Salle El Izdihar', 'Espace El Hidhab'],
        'Tizi Ouzou': ['Le Yemma', 'Salle El Ksar', 'Espace Thénia']
      },
      fournisseurs: {
        Alger: ['Traiteur Prestige', 'DJ Power Sound', 'Décoration Elégance', 'Photographe Studio'],
        Oran: ['Chef Bahia', 'DJ Oran Mix', 'Décoration Andalouse', 'Photo Light'],
        Constantine: ['Traiteur El Bey', 'DJ Constantine', 'Décoration Soumam', 'Photographe Cirta'],
        Annaba: ['Chef Annabi', 'DJ Hibiscus', 'Décoration El Bouni', 'Photo Marine'],
        Blida: ['Traiteur Chréa', 'DJ Blida', 'Décoration Jardin', 'Photographe Atlas'],
        Batna: ['Chef Tassili', 'DJ Batna', 'Décoration El Aouras', 'Photo Aurès'],
        Sétif: ['Traiteur El Hidhab', 'DJ Setif', 'Décoration Izdihar', 'Photographe Sétifien'],
        'Tizi Ouzou': ['Chef Kabyle', 'DJ Thénia', 'Décoration Yemma', 'Photo Kabylie']
      }
    };

    searchBtn.addEventListener('click', function () {
      const wilaya = select.value;
      if (!wilaya) {
        alert('⚠️ Veuillez sélectionner une wilaya.');
        return;
      }
      if (!selectedOption) {
        alert('⚠️ Veuillez choisir "Salles" ou "Fournisseurs".');
        return;
      }

      const list = data[selectedOption]?.[wilaya] || [];
      let message = '';

      if (list.length) {
        const displayList = list.slice(0, 3);
        const items = displayList.map((item) => `• ${item}`).join('<br>');
        const categoryLabel = selectedOption === 'salles' ? 'salles' : 'prestataires';
        message = `
          <strong>${displayList.length} ${categoryLabel}</strong> trouvées à <span class="highlight">${wilaya}</span> :<br><br>
          ${items}
          ${list.length > 3 ? `<br><span style="font-size:13px;color:#6b7280;">+ ${list.length - 3} autres résultats</span>` : ''}
        `;
      } else {
        message = `Aucun résultat trouvé pour <span class="highlight">${wilaya}</span>. Essayez une autre wilaya.`;
      }

      if (resultMessage) resultMessage.innerHTML = message;
      if (resultsArea) resultsArea.classList.add('visible');
    });
  }

  function initPasswordResetWizard() {
    const form1 = document.getElementById('step1Form');
    const form2 = document.getElementById('step2Form');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const backButton = document.getElementById('backToStep1');
    const successArea = document.getElementById('successArea');
    const successMessage = document.getElementById('successMessage');

    if (!form1 || !form2 || !step1 || !step2 || !step3) return;

    const updateSteps = (step) => {
      [step1, step2, step3].forEach((item) => item.className = 'step');
      [line1, line2].forEach((item) => {
        if (item) item.className = 'step-line';
      });

      if (step === 1) {
        step1.className = 'step active';
      } else if (step === 2) {
        step1.className = 'step done';
        if (line1) line1.className = 'step-line done';
        step2.className = 'step active';
      } else if (step === 3) {
        step1.className = 'step done';
        if (line1) line1.className = 'step-line done';
        step2.className = 'step done';
        if (line2) line2.className = 'step-line done';
        step3.className = 'step active';
      }
    };

    form1.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = document.getElementById('email')?.value.trim() || '';
      if (!email) {
        alert('⚠️ Veuillez entrer votre adresse e-mail.');
        return;
      }

      alert(`📧 Un lien de réinitialisation a été envoyé à : ${email}`);
      form1.style.display = 'none';
      form2.style.display = 'block';
      updateSteps(2);
      document.querySelector('.app-container')?.scrollIntoView({ behavior: 'smooth' });
    });

    if (backButton) {
      backButton.addEventListener('click', () => {
        form2.style.display = 'none';
        form1.style.display = 'block';
        updateSteps(1);
      });
    }

    form2.addEventListener('submit', function (event) {
      event.preventDefault();
      const pwd = document.getElementById('newPassword')?.value.trim() || '';
      const confirm = document.getElementById('confirmPassword')?.value.trim() || '';

      if (pwd.length < 8) {
        alert('⚠️ Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }

      if (pwd !== confirm) {
        alert('⚠️ Les mots de passe ne correspondent pas.');
        return;
      }

      if (successMessage) {
        successMessage.innerHTML = `
          ✅ Votre mot de passe a été réinitialisé avec succès !<br>
          <span style="font-size:13px;color:#6b7280;">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</span>
        `;
      }

      if (successArea) {
        successArea.classList.add('visible');
        successArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      form2.style.display = 'none';
      updateSteps(3);

      const submitButton = form2.querySelector('.btn-reset[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      setTimeout(() => {
        window.location.href = 'connexion-client.html';
      }, 5000);
    });
  }

  function initSharedHelpers() {
    const elements = document.querySelectorAll('[data-role="toggle"]');
    elements.forEach((element) => {
      element.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    });
  }

  function initApp() {
    initCitySelection();
    initPasswordHint();
    initResetPasswordValidation();
    initServiceSelector();
    initAuthLogin();
    initRegistrationForm();
    initSupplierRegisterForm();
    initForgotPasswordForm();
    initOtpFlow();
    initCategoryBrowse();
    initSalleFilters();
    initSearchExplorer();
    initPasswordResetWizard();
    initSharedHelpers();
  }

  if (isReady()) {
    initApp();
  } else {
    document.addEventListener('DOMContentLoaded', initApp);
  }
})();

console.log('ALGevent - Application chargée');
