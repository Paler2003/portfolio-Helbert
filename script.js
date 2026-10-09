/* ============================================================
   HELBERT A. PALER — PORTFOLIO JAVASCRIPT
   Handles: scroll-reveal, mobile nav, active link tracking,
            contact form, smooth scrolling
   ============================================================ */

(function () {
  "use strict";

  // ── Scroll Reveal (IntersectionObserver) ──────────────────
  // Reveals elements with [data-reveal] as they enter the viewport.
  function initScrollReveal() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = document.querySelectorAll("[data-reveal]");

    if (prefersReduced) {
      // If user prefers reduced motion, show everything immediately
      revealTargets.forEach(function (el) {
        el.classList.add("revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Mobile Navigation Toggle ──────────────────────────────
  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var links = document.getElementById("nav-links");

    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));

      // Swap hamburger ↔ close icon
      if (isOpen) {
        toggle.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
      } else {
        toggle.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
      }
    });

    // Close mobile nav when a link is clicked
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
      });
    });
  }

  // ── Active Navigation Link Tracking ───────────────────────
  // Highlights the nav link corresponding to the currently visible section.
  function initActiveNavTracking() {
    var sections = document.querySelectorAll("section[id], .hero-section[id]");
    var navLinks = document.querySelectorAll(".nav-links a");

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + id
              );
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-80px 0px -40% 0px",
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ── Contact Form Handling ─────────────────────────────────
  function initContactForm() {
    var form = document.getElementById("contact-form");
    var success = document.getElementById("form-success");

    if (!form || !success) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Basic validation
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      var service = form.querySelector('[name="service"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        // Highlight empty fields
        [name, email, message].forEach(function (field) {
          if (!field.value.trim()) {
            field.style.borderColor = "#ff7b7b";
            field.addEventListener(
              "input",
              function () {
                field.style.borderColor = "";
              },
              { once: true }
            );
          }
        });
        return;
      }

      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = "#ff7b7b";
        email.addEventListener(
          "input",
          function () {
            email.style.borderColor = "";
          },
          { once: true }
        );
        return;
      }

      // Build mailto link as fallback (no backend)
      var subject = encodeURIComponent("Project Inquiry: " + service.value);
      var body = encodeURIComponent(
        "Hi Helbert,\n\nMy name is " +
          name.value +
          ".\n\nService needed: " +
          service.value +
          "\n\n" +
          message.value +
          "\n\nReply to: " +
          email.value
      );

      // Open mailto
      window.location.href =
        "mailto:helbertpaler@email.com?subject=" + subject + "&body=" + body;

      // Show success state
      form.style.display = "none";
      success.style.display = "block";

      // Reset after 5s
      setTimeout(function () {
        form.reset();
        form.style.display = "";
        success.style.display = "none";
      }, 5000);
    });
  }

  // ── Header Scroll Shadow ──────────────────────────────────
  // Adds a subtle shadow to the header after scrolling past the hero.
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var scrolled = false;

    window.addEventListener(
      "scroll",
      function () {
        var shouldHaveShadow = window.scrollY > 60;
        if (shouldHaveShadow !== scrolled) {
          scrolled = shouldHaveShadow;
          header.style.boxShadow = scrolled
            ? "0 4px 30px rgba(0, 0, 0, 0.3)"
            : "none";
          header.style.borderBottomColor = scrolled
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.06)";
        }
      },
      { passive: true }
    );
  }

  // ── Smooth Scroll for Anchor Links ────────────────────────
  // Ensures smooth scrolling on all internal anchor links.
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href");
        if (targetId === "#") return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          // Update URL without jump
          history.pushState(null, "", targetId);
        }
      });
    });
  }

  // ── Initialize Everything on DOM Ready ────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveal();
    initMobileNav();
    initActiveNavTracking();
    initContactForm();
    initHeaderScroll();
    initSmoothScroll();
  });
})();
