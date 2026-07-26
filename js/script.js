// ========================================
// ALGevent - Fichier JavaScript Principal
// ========================================

// ========================================
// FONCTIONS POUR LES PAGES EXPLORER
// ========================================

/**
 * Génère les étoiles en fonction d'une note
 * @param {number} note - La note sur 5
 * @returns {string} - Chaîne de caractères avec les étoiles
 */
function getStars(note) {
    const full = Math.floor(note);
    const half = (note - full) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/**
 * Initialise les filtres par catégorie
 * @param {string} selector - Sélecteur CSS des boutons de filtre
 * @param {Function} callback - Fonction appelée lors du filtrage
 */
function initFilters(selector, callback) {
    const buttons = document.querySelectorAll(selector);
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Désactiver tous les boutons
            buttons.forEach(b => b.classList.remove('active'));
            // Activer celui cliqué
            this.classList.add('active');
            // Appeler la fonction de callback
            if (typeof callback === 'function') {
                callback(this.dataset.filter || this.dataset.category);
            }
        });
    });
}

/**
 * Filtre un tableau d'éléments par catégorie
 * @param {Array} data - Tableau d'objets
 * @param {string} category - Catégorie à filtrer
 * @param {string} key - Clé de l'objet à filtrer (ex: 'categorie')
 * @returns {Array} - Tableau filtré
 */
function filterByCategory(data, category, key = 'categorie') {
    if (category === 'all' || !category) {
        return data;
    }
    return data.filter(item => item[key] === category);
}

/**
 * Trie un tableau d'éléments par note
 * @param {Array} data - Tableau d'objets
 * @param {string} key - Clé de la note (ex: 'note')
 * @returns {Array} - Tableau trié
 */
function sortByRating(data, key = 'note') {
    return [...data].sort((a, b) => b[key] - a[key]);
}

/**
 * Met à jour le compteur de résultats
 * @param {number} count - Nombre de résultats
 * @param {string} elementId - ID de l'élément à mettre à jour
 */
function updateResultCount(count, elementId = 'countDisplay') {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = count;
    }
}

/**
 * Affiche un message "aucun résultat"
 * @param {string} gridId - ID de la grille
 */
function showNoResults(gridId = 'cardGrid') {
    const grid = document.getElementById(gridId);
    if (grid) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez une autre catégorie ou revenez plus tard.</p>
            </div>
        `;
    }
}

/**
 * Rendu des cartes dans la grille
 * @param {Array} data - Tableau d'objets à afficher
 * @param {string} gridId - ID de la grille
 * @param {Function} templateFn - Fonction qui génère le HTML d'une carte
 */
function renderCards(data, gridId = 'cardGrid', templateFn) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (data.length === 0) {
        showNoResults(gridId);
        return;
    }

    let html = '';
    data.forEach(item => {
        if (typeof templateFn === 'function') {
            html += templateFn(item);
        }
    });
    grid.innerHTML = html;
}

// ========================================
// FONCTIONS POUR L'INSCRIPTION
// ========================================

/**
 * Valide un mot de passe (min 8 caractères)
 * @param {string} password - Le mot de passe à valider
 * @returns {boolean} - True si valide
 */
function isValidPassword(password) {
    return password && password.length >= 8;
}

/**
 * Vérifie si deux mots de passe correspondent
 * @param {string} password1 - Premier mot de passe
 * @param {string} password2 - Deuxième mot de passe
 * @returns {boolean} - True s'ils correspondent
 */
function passwordsMatch(password1, password2) {
    return password1 === password2;
}

/**
 * Affiche un message de succès
 * @param {string} message - Message à afficher
 * @param {string} elementId - ID de l'élément
 */
function showSuccessMessage(message, elementId = 'successMessage') {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        const area = el.closest('.results-area');
        if (area) {
            area.classList.add('visible');
        }
    }
}

/**
 * Masque un message de succès
 * @param {string} elementId - ID de l'élément
 */
function hideSuccessMessage(elementId = 'successMessage') {
    const el = document.getElementById(elementId);
    if (el) {
        const area = el.closest('.results-area');
        if (area) {
            area.classList.remove('visible');
        }
    }
}

/**
 * Valide un formulaire d'inscription
 * @param {Object} fields - Objet contenant les champs à valider
 * @returns {Object} - { valid: boolean, errors: Array }
 */
function validateRegistrationForm(fields) {
    const errors = [];
    
    // Vérifier les champs obligatoires
    for (const [key, value] of Object.entries(fields)) {
        if (value.required && !value.value.trim()) {
            errors.push(`Le champ "${key}" est obligatoire`);
        }
    }
    
    // Vérifier l'email
    if (fields.email && fields.email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fields.email.value)) {
            errors.push('L\'adresse email n\'est pas valide');
        }
    }
    
    // Vérifier le mot de passe
    if (fields.password && fields.password.value) {
        if (!isValidPassword(fields.password.value)) {
            errors.push('Le mot de passe doit contenir au moins 8 caractères');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// ========================================
// FONCTIONS POUR LA RÉINITIALISATION
// ========================================

/**
 * Vérifie la force d'un mot de passe
 * @param {string} password - Le mot de passe
 * @returns {number} - Score de force (0-5)
 */
function checkPasswordStrength(password) {
    let score = 0;
    
    // Longueur
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexité
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    // Score sur 5
    return score;
}

/**
 * Met à jour les barres de force du mot de passe
 * @param {string} password - Le mot de passe
 * @param {string} bar1Id - ID de la première barre
 * @param {string} bar2Id - ID de la deuxième barre
 * @param {string} bar3Id - ID de la troisième barre
 */
function updateStrengthBars(password, bar1Id = 'bar1', bar2Id = 'bar2', bar3Id = 'bar3') {
    const score = checkPasswordStrength(password);
    const bar1 = document.getElementById(bar1Id);
    const bar2 = document.getElementById(bar2Id);
    const bar3 = document.getElementById(bar3Id);
    
    if (!bar1 || !bar2 || !bar3) return;
    
    // Réinitialiser
    [bar1, bar2, bar3].forEach(bar => {
        bar.className = 'bar';
    });
    
    if (password.length === 0) return;
    
    if (score <= 2) {
        bar1.className = 'bar active weak';
    } else if (score <= 3) {
        bar1.className = 'bar active weak';
        bar2.className = 'bar active medium';
    } else {
        bar1.className = 'bar active weak';
        bar2.className = 'bar active medium';
        bar3.className = 'bar active strong';
    }
}

/**
 * Retourne le texte de force d'un mot de passe
 * @param {string} password - Le mot de passe
 * @returns {string} - 'Faible', 'Moyen' ou 'Fort'
 */
function getPasswordStrengthText(password) {
    const score = checkPasswordStrength(password);
    if (score <= 2) return 'Faible';
    if (score <= 3) return 'Moyen';
    return 'Fort';
}

// ========================================
// FONCTIONS UTILITAIRES GÉNÉRALES
// ========================================

/**
 * Formate un prix en DA
 * @param {number} price - Le prix
 * @returns {string} - Prix formaté
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD',
        maximumFractionDigits: 0
    }).format(price);
}

/**
 * Crée un élément HTML avec des classes
 * @param {string} tag - Tag HTML
 * @param {string} className - Classes CSS
 * @param {string} content - Contenu HTML
 * @returns {HTMLElement} - Élément créé
 */
function createElement(tag, className, content = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
}

/**
 * Récupère un paramètre dans l'URL
 * @param {string} param - Nom du paramètre
 * @returns {string|null} - Valeur du paramètre
 */
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Redirige vers une page après un délai
 * @param {string} url - URL de destination
 * @param {number} delay - Délai en millisecondes
 */
function redirectAfterDelay(url, delay = 3000) {
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}

/**
 * Affiche une alerte personnalisée
 * @param {string} message - Message à afficher
 * @param {string} type - Type de message (success, error, warning, info)
 */
function showAlert(message, type = 'info') {
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#1877f2'
    };
    
    const icon = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    // Créer l'alerte
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        padding: 16px 24px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 20, 40, 0.2);
        border-left: 5px solid ${colors[type]};
        z-index: 9999;
        max-width: 400px;
        width: 90%;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Inter', -apple-system, sans-serif;
        animation: slideDown 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <i class="fas ${icon[type]}" style="color: ${colors[type]}; font-size: 24px;"></i>
        <span style="color: #1a1a2e; font-size: 14px; font-weight: 500;">${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 18px;
            margin-left: auto;
        ">✕</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Ajouter l'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

/**
 * Valide une adresse email
 * @param {string} email - L'email à valider
 * @returns {boolean} - True si valide
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone algérien
 * @param {string} phone - Le numéro à valider
 * @returns {boolean} - True si valide
 */
function isValidAlgerianPhone(phone) {
    const phoneRegex = /^(0|00213|\+213)(5|6|7)[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Met en majuscule la première lettre de chaque mot
 * @param {string} str - La chaîne à formater
 * @returns {string} - Chaîne formatée
 */
function capitalizeWords(str) {
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

/**
 * Tronque un texte à une longueur donnée
 * @param {string} text - Le texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - Texte tronqué
 */
function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ========================================
// GESTION DES ÉTAPES (pour réinitialisation)
// ========================================

/**
 * Gère les étapes d'un formulaire multipart
 * @param {Object} config - Configuration des étapes
 */
function setupSteps(config) {
    const {
        stepElements,
        lineElements,
        forms,
        onStepChange
    } = config;
    
    let currentStep = 1;
    
    function updateSteps(step) {
        // Réinitialiser
        stepElements.forEach(s => s.className = 'step');
        lineElements.forEach(l => l.className = 'step-line');
        
        if (step === 1) {
            stepElements[0].className = 'step active';
            stepElements[1].className = 'step';
            stepElements[2].className = 'step';
        } else if (step === 2) {
            stepElements[0].className = 'step done';
            lineElements[0].className = 'step-line done';
            stepElements[1].className = 'step active';
            stepElements[2].className = 'step';
        } else if (step === 3) {
            stepElements[0].className = 'step done';
            lineElements[0].className = 'step-line done';
            stepElements[1].className = 'step done';
            lineElements[1].className = 'step-line done';
            stepElements[2].className = 'step active';
        }
        
        if (typeof onStepChange === 'function') {
            onStepChange(step);
        }
    }
    
    function goToStep(step) {
        currentStep = step;
        updateSteps(step);
        
        // Afficher/masquer les formulaires
        forms.forEach((form, index) => {
            form.style.display = (index === step - 1) ? 'block' : 'none';
        });
    }
    
    return {
        goToStep,
        currentStep: () => currentStep
    };
}

// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ALGevent - Scripts chargés avec succès');
    console.log('📱 Design system : Bleu #1877f2 | Vert #31a24c | Or #f7b731');
    
    // ---- Initialisation des indicateurs de sélection ----
    const villeSelect = document.getElementById('ville');
    const villeIndicator = document.getElementById('villeIndicator');
    
    if (villeSelect && villeIndicator) {
        villeSelect.addEventListener('change', function() {
            if (this.value) {
                villeIndicator.textContent = `📍 Wilaya : ${this.value}`;
                villeIndicator.className = 'selection-indicator active';
            } else {
                villeIndicator.textContent = '📍 Aucune wilaya sélectionnée';
                villeIndicator.className = 'selection-indicator';
            }
        });
    }
    
    // ---- Initialisation des services (checkboxes) ----
    const serviceChecks = document.querySelectorAll('.service-check input[type="checkbox"]');
    const servicesIndicator = document.getElementById('servicesIndicator');
    
    if (serviceChecks.length > 0 && servicesIndicator) {
        serviceChecks.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                this.closest('.service-check').classList.toggle('selected', this.checked);
                updateServicesIndicator();
            });
        });
    }
    
    function updateServicesIndicator() {
        const checked = document.querySelectorAll('.service-check input:checked');
        const servicesIndicator = document.getElementById('servicesIndicator');
        if (!servicesIndicator) return;
        
        if (checked.length > 0) {
            const names = Array.from(checked).map(cb => {
                const map = {
                    'traiteur': 'Traiteur',
                    'decoration': 'Décoration',
                    'sonorisation': 'Sonorisation',
                    'photographie': 'Photographie',
                    'animation': 'Animation',
                    'location': 'Location'
                };
                return map[cb.value] || cb.value;
            });
            servicesIndicator.textContent = `✅ ${names.join(', ')}`;
            servicesIndicator.className = 'selection-indicator active';
        } else {
            servicesIndicator.textContent = '❌ Aucun service sélectionné';
            servicesIndicator.className = 'selection-indicator';
        }
    }
    
    // ---- Validation du mot de passe en temps réel ----
    const passwordInput = document.getElementById('password');
    const passwordHint = document.getElementById('passwordHint');
    
    if (passwordInput && passwordHint) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length >= 8) {
                passwordHint.innerHTML = '<i class="fas fa-check-circle"></i> Mot de passe valide';
                passwordHint.className = 'password-hint valid';
            } else {
                const remaining = 8 - this.value.length;
                passwordHint.innerHTML = `<i class="fas fa-info-circle"></i> ${remaining} caractère${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`;
                passwordHint.className = 'password-hint';
            }
        });
    }
    
    console.log('✅ Initialisation terminée');
});

// ========================================
// EXPORT DES FONCTIONS (si utilisé avec des modules)
// ========================================

// Pour une utilisation avec des modules ES6
// export {
//     getStars,
//     initFilters,
//     filterByCategory,
//     sortByRating,
//     updateResultCount,
//     showNoResults,
//     renderCards,
//     isValidPassword,
//     passwordsMatch,
//     showSuccessMessage,
//     hideSuccessMessage,
//     validateRegistrationForm,
//     checkPasswordStrength,
//     updateStrengthBars,
//     getPasswordStrengthText,
//     formatPrice,
//     createElement,
//     getUrlParam,
//     redirectAfterDelay,
//     showAlert,
//     isValidEmail,
//     isValidAlgerianPhone,
//     capitalizeWords,
//     truncateText,
//     setupSteps
// };
// Code JavaScript partagé pour ALGevent
// Fonctions communes et utilitaires

console.log('ALGevent - Application chargée');
