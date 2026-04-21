/* =============================================
   Art Made Easy – script.js
   Vanilla JavaScript for all pages
   ============================================= */


/* -----------------------------------------------
   1. MOBILE NAVIGATION TOGGLE
   Opens / closes the nav links on small screens
----------------------------------------------- */
(function () {
  // Grab the toggle button and the nav links list
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.site-nav__links');

  // Only run if both elements exist on the page
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', function () {
    // Toggle the "open" class to show/hide links
    const isOpen = navLinks.classList.toggle('open');

    // Update aria-expanded so screen readers know the state
    toggleBtn.setAttribute('aria-expanded', isOpen);

    // Change the button icon to signal state
    toggleBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Close nav when any link inside it is clicked (good for single-page feel)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '☰';
    });
  });
})();


/* -----------------------------------------------
   2. INTERACTIVE Q&A BOX
   Each page has a .qa-box with clickable questions.
   Clicking a button reveals a pre-written answer.
----------------------------------------------- */
(function () {
  // Find every Q&A box on the page (there may be one per page)
  const qaBoxes = document.querySelectorAll('.qa-box');

  qaBoxes.forEach(function (box) {
    const buttons    = box.querySelectorAll('.qa-btn');
    const answerArea = box.querySelector('.qa-box__answer-text');

    // If this box has no buttons or answer area, skip it
    if (!buttons.length || !answerArea) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {

        // ---- Highlight the active button ----
        // Remove "active" from all buttons first
        buttons.forEach(function (b) { b.classList.remove('active'); });
        // Add "active" to the clicked button
        btn.classList.add('active');

        // ---- Show the answer ----
        // The answer is stored in a data-answer attribute on the button
        const answer = btn.getAttribute('data-answer');
        if (answer) {
          // Remove placeholder class if it was showing
          answerArea.classList.remove('qa-box__placeholder');
          // Set the text content (triggers the CSS fadeIn animation)
          answerArea.textContent = answer;

          // Re-trigger the animation by removing and re-adding the class
          answerArea.style.animation = 'none';
          // Force the browser to notice the change before resetting
          void answerArea.offsetHeight;
          answerArea.style.animation = '';
        }
      });
    });
  });
})();


/* -----------------------------------------------
   3. SMOOTH ACTIVE NAV LINK HIGHLIGHTING
   Adds aria-current="page" to the correct nav link
   based on the current page URL.
----------------------------------------------- */
(function () {
  const currentPath = window.location.pathname;

  // Get the file name from the path, e.g. "baroque.html"
  const currentFile = currentPath.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('.site-nav__links a');

  navLinks.forEach(function (link) {
    // Get the href's file name
    const linkFile = link.getAttribute('href').split('/').pop();

    // Mark the matching link as current page
    if (linkFile === currentFile) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
