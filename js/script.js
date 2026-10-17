// Watch Story plays inside the header; the navbar stays available.
const header = document.querySelector(".site-header");
const storyVideo = document.querySelector("#hero-video");
const heroContent = document.querySelector("#hero-content");
const watchButton = document.querySelector("[data-hero-play]");
const closeButton = document.querySelector("[data-hero-close]");
const storyStatus = document.querySelector("[data-story-status]");
const navbar = document.querySelector(".navbar");

if (header && storyVideo && heroContent && watchButton && closeButton && storyStatus) {
  let playbackAttempt = 0;
  let restoreTimer;

  function restoreHero(restoreFocus = true) {
    const attempt = ++playbackAttempt;
    window.clearTimeout(restoreTimer);
    const wasOpen = header.classList.contains("site-header--story-open");

    // Keep the final frame visible while it fades back to the hero image.
    storyVideo.pause();
    storyVideo.controls = false;
    closeButton.hidden = true;
    heroContent.inert = false;
    header.classList.remove("site-header--story-open");
    watchButton.setAttribute("aria-expanded", "false");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    restoreTimer = window.setTimeout(() => {
      // A new play request must not be interrupted by an old closing timer.
      if (attempt !== playbackAttempt) return;
      storyVideo.hidden = true;
      if (storyVideo.readyState > 0) storyVideo.currentTime = 0;
      storyVideo.controls = true;

      // Restore focus after the fade, without stealing it from navbar links.
      if (restoreFocus && wasOpen &&
          (document.activeElement === document.body || document.activeElement === storyVideo)) {
        watchButton.focus({ preventScroll: true });
      }
    }, reducedMotion ? 0 : 700);
  }

  async function playStory() {
    if (header.classList.contains("site-header--story-open")) return;
    window.clearTimeout(restoreTimer);
    const attempt = ++playbackAttempt;
    storyStatus.textContent = "";
    storyVideo.controls = true;
    if (storyVideo.readyState > 0) storyVideo.currentTime = 0;

    storyVideo.hidden = false;
    closeButton.hidden = false;
    header.classList.add("site-header--story-open");
    watchButton.setAttribute("aria-expanded", "true");
    closeButton.focus({ preventScroll: true });
    heroContent.inert = true;

    try {
      // Called directly from the click so the browser can play sound.
      await storyVideo.play();
    } catch (error) {
      // Closing while the video is loading is a normal cancellation.
      if (attempt !== playbackAttempt) return;
      restoreHero();
      storyStatus.textContent = "The story could not play. Please try again.";
    }
  }

  watchButton.addEventListener("click", playStory);
  closeButton.addEventListener("click", () => restoreHero());
  storyVideo.addEventListener("ended", () => restoreHero());

  storyVideo.addEventListener("error", () => {
    if (!header.classList.contains("site-header--story-open")) return;
    restoreHero();
    storyStatus.textContent = "The story could not load. Please try again.";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("site-header--story-open")) {
      event.preventDefault();
      restoreHero();
    }
  });

  navbar?.addEventListener("click", (event) => {
    if (event.target.closest("a") && header.classList.contains("site-header--story-open")) {
      restoreHero(false);
    }
  });

  // Stop the story if the user scrolls completely past the header.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && header.classList.contains("site-header--story-open")) {
        restoreHero(false);
      }
    });
    observer.observe(header);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) storyVideo.pause();
  });
}

// Scroll Reveal: add data-reveal to any new section item that should fade in.
const revealItems = document.querySelectorAll("[data-reveal]");
const revealMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (revealItems.length && "IntersectionObserver" in window && !revealMotionPreference.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("reveal--pending");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px 0px",
  });

  revealItems.forEach((item) => {
    const delay = Math.min(240, Math.max(0, Number(item.dataset.revealDelay) || 0));
    item.style.setProperty("--reveal-delay", `${delay}ms`);
    item.classList.add("reveal", "reveal--pending");
  });

  // Give the browser an initial frame before revealing anything already in view.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (!revealMotionPreference.matches) {
        revealItems.forEach((item) => revealObserver.observe(item));
      }
    });
  });

  // Keyboard navigation must never land on an invisible link.
  document.addEventListener("focusin", (event) => {
    const item = event.target.closest("[data-reveal]");
    if (!item) return;
    item.style.setProperty("--reveal-delay", "0ms");
    item.classList.remove("reveal--pending");
    revealObserver.unobserve(item);
  });

  revealMotionPreference.addEventListener("change", (event) => {
    if (!event.matches) return;
    revealObserver.disconnect();
    revealItems.forEach((item) => item.classList.remove("reveal--pending"));
  });
}


// A disclosure menu: CSS keeps navigation available when JavaScript is absent.
const menuToggle = document.querySelector(".navbar__toggle");
const navigationMenu = document.querySelector("#navbar-menu");

if (navbar && menuToggle && navigationMenu) {
  const mobileNavigation = window.matchMedia("(max-width: 800px)");
  navbar.classList.add("navbar--enhanced");

  function setNavigationOpen(open, restoreFocus = false) {
    const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
    navbar.classList.toggle("navbar--menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (!open && wasOpen && restoreFocus) menuToggle.focus({ preventScroll: true });
  }

  menuToggle.addEventListener("click", () => {
    setNavigationOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navigationMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setNavigationOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target)) setNavigationOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      setNavigationOpen(false, true);
    }
  });

  document.addEventListener("focusin", (event) => {
    if (!navbar.contains(event.target)) setNavigationOpen(false);
  });

  mobileNavigation.addEventListener("change", () => {
    const focused = document.activeElement;
    setNavigationOpen(false);
    // A resize must not leave keyboard focus in a newly hidden menu or toggle.
    if (mobileNavigation.matches && navigationMenu.contains(focused)) {
      menuToggle.focus({ preventScroll: true });
    } else if (!mobileNavigation.matches && focused === menuToggle) {
      navbar.querySelector(".navbar__logo").focus({ preventScroll: true });
    }
  });
}


// Keep native anchor navigation and history, with smooth section scrolling.
const scrollMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateScrollBehavior() {
  document.documentElement.style.scrollBehavior = scrollMotionPreference.matches
    ? "auto"
    : "smooth";
}

updateScrollBehavior();
scrollMotionPreference.addEventListener("change", updateScrollBehavior);
