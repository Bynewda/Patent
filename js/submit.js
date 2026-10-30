/* =========================================================
   답안 작성 → 첨삭 신청 폼 처리 (클라이언트 전용, 백엔드 없음)
   - 글자 수 카운터
   - 제출 시 확인 메시지 표시 (실제 전송 아님: 예시)
   ========================================================= */
(function () {
  "use strict";

  function initCounter() {
    var textarea = document.getElementById("answer");
    var counter = document.getElementById("answer-counter");
    if (!textarea || !counter) return;
    function update() {
      var len = textarea.value.length;
      counter.textContent = len.toLocaleString() + "자 작성";
    }
    textarea.addEventListener("input", update);
    update();
  }

  function initForm() {
    var form = document.getElementById("submit-form");
    var success = document.getElementById("submit-success");
    if (!form || !success) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // 백엔드가 없으므로 실제 전송하지 않음 (예시)

      var name = (document.getElementById("name") || {}).value || "응시생";
      var subject = (document.getElementById("subject") || {}).value || "선택 과목";
      var answer = (document.getElementById("answer") || {}).value || "";
      var chars = answer.length;

      var detail = document.getElementById("submit-detail");
      if (detail) {
        detail.textContent =
          name + " 님의 「" + subject + "」 답안(" +
          chars.toLocaleString() + "자)이 첨삭 대기열에 등록되었습니다. " +
          "실제 서비스에서는 강사 첨삭 후 결과를 안내합니다.";
      }

      success.removeAttribute("hidden");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
      form.reset();

      var counter = document.getElementById("answer-counter");
      if (counter) counter.textContent = "0자 작성";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCounter();
    initForm();
  });
})();
