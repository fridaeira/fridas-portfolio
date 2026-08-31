/* Fridas Portfolio – liten mängd JS, bara det som behövs */

(function () {
  "use strict";

  /* ---- Mobilmeny ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var oppen = nav.classList.toggle("nav--oppen");
      toggle.setAttribute("aria-expanded", oppen ? "true" : "false");
      toggle.setAttribute("aria-label", oppen ? "Stäng meny" : "Öppna meny");
    });

    /* Stäng menyn när man klickar på en länk i den */
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("nav--oppen");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Öppna meny");
      }
    });

    /* Escape stänger menyn */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("nav--oppen")) {
        nav.classList.remove("nav--oppen");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Logotypbandet: klona logotyperna så rullningen aldrig glappar ---- */
  var band = document.querySelector(".logos");
  var track = document.getElementById("logosTrack");
  var grupp = document.getElementById("logosGrupp");
  var mindreRorelse = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function byggBand() {
    if (!band || !track || !grupp || mindreRorelse) return;

    /* Rensa tidigare kloner */
    Array.prototype.slice.call(track.querySelectorAll("[data-klon]")).forEach(function (el) {
      el.remove();
    });

    var gruppBredd = grupp.getBoundingClientRect().width;
    if (!gruppBredd) return;

    /* Klona tills spåret är minst dubbelt så brett som bandet */
    var mal = band.getBoundingClientRect().width * 2 + gruppBredd;
    var antal = Math.max(1, Math.ceil(mal / gruppBredd) - 1);

    for (var i = 0; i < antal; i++) {
      var klon = grupp.cloneNode(true);
      klon.removeAttribute("id");
      klon.setAttribute("aria-hidden", "true");
      klon.setAttribute("data-klon", "");
      klon.querySelectorAll("img").forEach(function (img) {
        img.setAttribute("alt", "");
      });
      track.appendChild(klon);
    }

    /* Konstant hastighet oavsett hur många logotyper som ligger i bandet */
    track.style.setProperty("--grupp-bredd", gruppBredd + "px");
    track.style.setProperty("--tid", gruppBredd / 55 + "s");
  }

  if (document.readyState === "complete") {
    byggBand();
  } else {
    window.addEventListener("load", byggBand);
  }

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(byggBand, 250);
  });

  /* ---- Headern får bakgrund när man skrollat förbi hero ---- */
  var header = document.getElementById("header");
  var hero = document.querySelector(".hero");

  if (header && hero && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          header.classList.toggle("header--fast", !entry.isIntersecting);
        });
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(hero);
  }
})();
