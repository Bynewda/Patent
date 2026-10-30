/* =========================================================
   변리사 2차 대비 예시 사이트 - 공통 스크립트 (vanilla JS)
   - 모바일 내비 토글
   - 현재 페이지 내비 활성화
   - 내비 드롭다운(호버/탭) 메뉴
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

  // 내비 드롭다운: 데스크톱은 CSS :hover, 모바일/키보드는 탭(클릭)으로 열기
  function initDropdowns() {
    var items = document.querySelectorAll(".has-dropdown");
    Array.prototype.forEach.call(items, function (item) {
      var trigger = item.querySelector(".nav-top");
      if (!trigger) return;
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");

      // 상단 항목이 링크라면, 모바일(좁은 화면)에서는 첫 탭에 메뉴만 펼침
      trigger.addEventListener("click", function (e) {
        var isMobile = window.matchMedia("(max-width: 760px)").matches;
        if (!isMobile) return; // 데스크톱은 링크 기본 동작 유지(호버로 열림)
        if (!item.classList.contains("open")) {
          e.preventDefault();
          // 다른 열린 메뉴 닫기
          Array.prototype.forEach.call(items, function (other) {
            if (other !== item) {
              other.classList.remove("open");
              var t = other.querySelector(".nav-top");
              if (t) t.setAttribute("aria-expanded", "false");
            }
          });
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    // 바깥 클릭 시 열린 드롭다운 닫기
    document.addEventListener("click", function (e) {
      Array.prototype.forEach.call(items, function (item) {
        if (!item.contains(e.target)) {
          item.classList.remove("open");
          var t = item.querySelector(".nav-top");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // 단일 토글 버튼 배선 (newly-added 카드 재사용 가능하도록 분리)
  function bindToggle(btn) {
    if (btn.getAttribute("data-toggle-bound") === "true") return;
    btn.setAttribute("data-toggle-bound", "true");
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
  }

  // 외부(업로드 스크립트 등)에서 새 카드의 토글을 배선할 수 있도록 노출
  window.LidamToggles = {
    bind: function (root) {
      var scope = root || document;
      var buttons = scope.querySelectorAll("[data-toggle-target]");
      Array.prototype.forEach.call(buttons, bindToggle);
    }
  };

  // data-toggle-target 버튼으로 패널 접고 펼치기 (모범답안 / 쟁점)
  function initToggles() {
    var buttons = document.querySelectorAll("[data-toggle-target]");
    Array.prototype.forEach.call(buttons, function (btn) {
      bindToggle(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initActiveNav();
    initDropdowns();
    initToggles();
  });
})();
