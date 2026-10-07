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

  /* ---- Det vågiga bandet: texten rullar längs vågen ---- */
  var bandText = document.getElementById("bandText");
  var mindreRorelse = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startaBand() {
    if (!bandText) return;

    /* Upprepa frasen så att den alltid täcker den synliga delen av vågen.
       Texten får aldrig sticka utanför banan, då ritar webbläsaren
       överblivna tecken i ett hörn. */
    var fras = bandText.textContent;
    bandText.textContent = fras;
    var frasBredd = bandText.getComputedTextLength();
    var banLangd = document.getElementById("bandBana").getTotalLength();
    if (!frasBredd) return;
    /* Banan går från x -1440 till 4320, så den synliga delen (x 0–1440)
       börjar en fjärdedel in och slutar halvvägs. */
    var synligStart = banLangd / 4;
    var antal = Math.ceil(synligStart / frasBredd) + 1;
    bandText.textContent = new Array(antal + 1).join(fras);

    /* Texten börjar precis vid bildkanten och rullar en frasbredd åt
       vänster innan den hoppar tillbaka, utan att det syns. */
    if (mindreRorelse) {
      bandText.setAttribute("startOffset", synligStart);
      return;
    }

    var hastighet = 0.05; /* enheter per millisekund */
    var forsta = null;
    function steg(tid) {
      if (forsta === null) forsta = tid;
      var forskjutning = ((tid - forsta) * hastighet) % frasBredd;
      bandText.setAttribute("startOffset", synligStart - forskjutning);
      requestAnimationFrame(steg);
    }
    requestAnimationFrame(steg);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startaBand);
  } else {
    window.addEventListener("load", startaBand);
  }
})();
