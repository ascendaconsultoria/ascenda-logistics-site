(() => {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [
    ...context.querySelectorAll(selector),
  ];

  // Header and reading progress
  const header = $(".site-header");
  const progress = $(".scroll-progress span");
  let scrollFrame = 0;
  const updateScrollState = () => {
    scrollFrame = 0;
    const y = scrollY;
    header?.classList.toggle("scrolled", y > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width =
        max > 0 ? `${Math.min(100, (y / max) * 100)}%` : "0%";
    }
  };
  const onScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("load", onScroll, { once: true });

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
    const trackingParameters = new Set([
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "msclkid",
    ]);
    const conversionUrl = new URL(formUrl);
    const currentParameters = new URLSearchParams(location.search);
    currentParameters.forEach((value, key) => {
      if (trackingParameters.has(key.toLowerCase()) && value) {
        conversionUrl.searchParams.set(key.toLowerCase(), value);
      }
    });

    $$(
      '[data-form-link], a[href="#formulario"], a[href="/#formulario"]',
    ).forEach((link) => {
      link.href = conversionUrl.toString();
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  // Keep the same social destinations in every duplicated static footer.
  const footerBrand = $(".footer-brand");
  if (footerBrand && !$(".footer-socials", footerBrand)) {
    const socials = document.createElement("nav");
    socials.className = "footer-socials";
    socials.setAttribute("aria-label", "Redes sociais do Ascenda");
    socials.innerHTML = `
      <a href="https://www.instagram.com/marketing.ascenda/" target="_blank" rel="noopener" aria-label="Instagram do Ascenda">
        <svg class="social-icon--instagram" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>
      </a>
      <a href="https://www.linkedin.com/company/ascenda-logistics" target="_blank" rel="noopener" aria-label="LinkedIn do Ascenda">
        <svg class="social-icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.53 7.33a2.02 2.02 0 1 0 0-4.04 2.02 2.02 0 0 0 0 4.04ZM4.82 20.5h3.42V9.51H4.82V20.5ZM10.38 9.51h3.28v1.5h.05c.46-.87 1.57-1.79 3.24-1.79 3.46 0 4.1 2.28 4.1 5.24v6.04h-3.42v-5.36c0-1.28-.03-2.93-1.79-2.93-1.79 0-2.06 1.4-2.06 2.83v5.46h-3.4V9.51Z"/></svg>
      </a>
      <a href="https://www.facebook.com/ascendalogistics" target="_blank" rel="noopener" aria-label="Facebook do Ascenda">
        <svg class="social-icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.6 21v-8.2h2.75l.41-3.2H13.6V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.14A22.8 22.8 0 0 0 14.42 3c-2.46 0-4.12 1.5-4.12 4.28V9.6H7.53v3.2h2.77V21h3.3Z"/></svg>
      </a>`;
    footerBrand.appendChild(socials);
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
    const flow = $("[data-fit-flow]", section);
    const nextButton = $("[data-fit-next]", section);
    section.classList.add("is-enhanced");

    if (flow && nextButton) {
      const syncNextButton = () => {
        const isScrollable = flow.scrollWidth > flow.clientWidth + 4;
        const isAtEnd =
          flow.scrollLeft + flow.clientWidth >= flow.scrollWidth - 4;
        nextButton.hidden = !isScrollable || isAtEnd;
      };

      nextButton.addEventListener("click", () => {
        const firstStep = $("[data-fit-step]", flow);
        const gap = Number.parseFloat(getComputedStyle(flow).columnGap) || 0;
        const distance = firstStep
          ? firstStep.getBoundingClientRect().width + gap
          : flow.clientWidth * 0.85;
        flow.scrollBy({
          left: distance,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      });
      flow.addEventListener("scroll", syncNextButton, { passive: true });
      addEventListener("resize", syncNextButton);
      requestAnimationFrame(syncNextButton);
    }

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
