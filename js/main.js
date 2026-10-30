/* =========================================================
   변리사 2차 대비 예시 사이트 - 공통 스크립트 (vanilla JS)
   - 모바일 내비 토글
   - 현재 페이지 내비 활성화
   - 모범답안 / 쟁점 토글
   ========================================================= */
(function () {
  "use strict";

  // 모바일 내비게이션 토글
  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 현재 페이지에 해당하는 내비 링크 강조
  function initActiveNav() {
    var current = document.body.getAttribute("data-page");
    if (!current) return;
    var link = document.querySelector('.nav-links a[data-nav="' + current + '"]');
    if (link) link.setAttribute("aria-current", "page");
  }

  // data-toggle-target 버튼으로 패널 접고 펼치기 (모범답안 / 쟁점)
  function initToggles() {
    var buttons = document.querySelectorAll("[data-toggle-target]");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var sel = btn.getAttribute("data-toggle-target");
        var panel = document.querySelector(sel);
        if (!panel) return;
        var hidden = panel.hasAttribute("hidden");
        if (hidden) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
        btn.setAttribute("aria-expanded", String(hidden));
        var showText = btn.getAttribute("data-show-text");
        var hideText = btn.getAttribute("data-hide-text");
        if (showText && hideText) {
          btn.textContent = hidden ? hideText : showText;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initActiveNav();
    initToggles();
  });
})();
