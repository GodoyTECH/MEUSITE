document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (!icon) return;
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }

  document.querySelectorAll('.page-transition a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.querySelector('.page-transition');
      if (!main) return window.location.href = href;
      main.style.opacity = '0';
      main.style.transform = 'translateY(10px) scale(.995)';
      setTimeout(() => { window.location.href = href; }, 140);
    });
  });
});
