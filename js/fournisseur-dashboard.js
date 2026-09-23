document.addEventListener('DOMContentLoaded', () => {
  const notificationBtn = document.querySelector('.icon-button');
  const profileBtn = document.querySelector('.avatar-button');
  const quickLinks = document.querySelectorAll('.quick-action');

  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      notificationBtn.classList.toggle('active');
      const dot = notificationBtn.querySelector('.notification-dot');
      if (dot) {
        dot.style.display = dot.style.display === 'none' ? 'block' : 'none';
      }
      console.log('Notification cliquée');
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      profileBtn.classList.toggle('active');
      console.log('Profil cliqué');
    });
  }

  quickLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.getAttribute('href');
      if (target && target.startsWith('#')) {
        event.preventDefault();
        console.log(`Action rapide: ${target}`);
      }
    });
  });

  console.log('Dashboard fournisseur chargé');
});
