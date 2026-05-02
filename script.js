/* =============================================
   Art Made Easy, script.js
   Vanilla JavaScript, no frameworks
   ============================================= */


/* -----------------------------------------------
   1. NAV SCROLL EFFECT
   The nav starts transparent (over the hero image)
   and becomes dark + solid once the user scrolls.
----------------------------------------------- */
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  // Run once on load (in case page is already scrolled)
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
})();


/* -----------------------------------------------
   2. MOBILE NAVIGATION TOGGLE
----------------------------------------------- */
(function () {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.site-nav__links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    // Unicode hamburger / close
    toggleBtn.textContent = isOpen ? '\u2715' : '\u2630';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '\u2630';
    });
  });
})();


/* -----------------------------------------------
   3. INTERACTIVE Q&A BOX
   Clicking a question button reveals the answer
   stored in its data-answer attribute.
----------------------------------------------- */
(function () {
  document.querySelectorAll('.qa-box').forEach(function (box) {
    const buttons    = box.querySelectorAll('.qa-btn');
    const answerArea = box.querySelector('.qa-box__answer-text');
    if (!buttons.length || !answerArea) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {

        // Remove active state from all, add to clicked
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Display the answer with a fade
        const answer = btn.getAttribute('data-answer');
        if (answer) {
          answerArea.classList.remove('qa-box__placeholder');
          answerArea.textContent = answer;
          // Re-trigger CSS animation
          answerArea.style.animation = 'none';
          void answerArea.offsetHeight;
          answerArea.style.animation = '';
        }
      });
    });
  });
})();


/* -----------------------------------------------
   4. ACTIVE NAV LINK
   Marks the current page in the nav using
   aria-current="page" based on the URL.
----------------------------------------------- */
(function () {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav__links a').forEach(function (link) {
    if (link.getAttribute('href').split('/').pop() === currentFile) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();