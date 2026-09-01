(() => {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [
    ...context.querySelectorAll(selector),
  ];

  // Header and reading progress
  const header = $(".site-header");
  const progress = $(".scroll-progress span");
  const onScroll = () => {
    const y = scrollY;
    header?.classList.toggle("scrolled", y > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width =
        max > 0 ? `${Math.min(100, (y / max) * 100)}%` : "0%";
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Keep the muted hero background playing continuously.
  const heroVideo = $(".hero-video");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroVideo) {
    const heroVideoStart = 1;
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    const skipStaticOpening = () => {
      if (heroVideo.currentTime < heroVideoStart) {
        heroVideo.currentTime = heroVideoStart;
      }
    };
    if (heroVideo.readyState >= 1) skipStaticOpening();
    else
      heroVideo.addEventListener("loadedmetadata", skipStaticOpening, {
        once: true,
      });
    heroVideo.addEventListener("timeupdate", () => {
      if (heroVideo.currentTime < 0.25) heroVideo.currentTime = heroVideoStart;
    });
    const startHeroVideo = async () => {
      try {
        skipStaticOpening();
        await heroVideo.play();
      } catch (error) {
        console.warn("Não foi possível iniciar o vídeo da hero.", error);
      }
    };
    void startHeroVideo();
    addEventListener("visibilitychange", () => {
      if (!document.hidden && heroVideo.paused) void startHeroVideo();
    });
  }

  // Mobile menu
  const toggle = $(".menu-toggle");
  const menu = $("#mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
    $$("a", menu).forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("open");
      });
    });
  }

  // Single external conversion destination (Fillout)
  const formUrl = window.ASCENDA_CONFIG?.FORM_URL;
  if (formUrl) {
    $$("[data-form-link]").forEach((link) => {
      link.href = formUrl;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  // Reveal content only when it enters the viewport
  const reduced = reducedMotion;
  const saveData = navigator.connection?.saveData;
  if (reduced || saveData) {
    $$(".reveal").forEach((element) => {
      element.classList.add("revealed");
    });
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );
    $$(".reveal").forEach((element) => {
      observer.observe(element);
    });
  } else {
    $$(".reveal").forEach((element) => {
      element.classList.add("revealed");
    });
  }

  // Difference section: operational criteria converge into a contextualized
  // commercial opportunity.
  const initDifferenceSection = () => {
    const section = $("[data-difference]");
    if (!section) return;

    const visual = $(".difference-visual", section);
    const criteria = $$("[data-criterion]", section);
    section.classList.add("is-enhanced");

    const revealFlow = () => section.classList.add("is-active");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealFlow();
    } else {
      const differenceObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          revealFlow();
          differenceObserver.disconnect();
        },
        { threshold: 0.18, rootMargin: "0px 0px -8%" },
      );
      differenceObserver.observe(section);
    }

    if (visual && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      criteria.forEach((criterion) => {
        criterion.addEventListener("pointerenter", () => {
          visual.dataset.highlight = criterion.dataset.criterion;
        });
        criterion.addEventListener("pointerleave", () => {
          delete visual.dataset.highlight;
        });
      });
    }
  };
  initDifferenceSection();

  // Shipper profiles: reveal the hierarchy from the featured segment to the
  // supporting cards while preserving a complete static fallback.
  const initShippersSection = () => {
    const section = $("[data-shippers]");
    if (!section) return;

    section.classList.add("is-enhanced");
    const revealCards = () => section.classList.add("is-active");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealCards();
      return;
    }

    const shippersObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        revealCards();
        shippersObserver.disconnect();
      },
      { threshold: 0.16, rootMargin: "0px 0px -8%" },
    );
    shippersObserver.observe(section);
  };
  initShippersSection();

  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
})();
