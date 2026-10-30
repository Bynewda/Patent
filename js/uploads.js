/* =========================================================
   변리사 2차 대비 예시 사이트 - 문제·답안 업로드 (로컬 데모)
   - 사용자가 입력(또는 .txt 파일 선택)한 문제/답안을 qa-card로 추가
   - localStorage에 보관하여 새로고침 후에도 유지 (서버 전송 없음)
   - 기존 toggle-panel / data-toggle-target 패턴을 재사용
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "lidam.userProblems.v1";

  var form = document.getElementById("upload-form");
  var list = document.getElementById("user-uploads");
  if (!form || !list) return;

  var fileInput = document.getElementById("up-file");
  var fileName = document.getElementById("up-file-name");
  var answerField = document.getElementById("up-answer");
  var clearBtn = document.getElementById("upload-clear");

  // 간단한 HTML 이스케이프 (XSS 방지)
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // 줄바꿈을 <br>로 (이스케이프 이후에 적용)
  function nl2br(escaped) {
    return escaped.replace(/\r\n|\r|\n/g, "<br />");
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* localStorage 불가(파일 프로토콜 제한 등) 시 세션 내 표시만 유지 */
    }
  }

  function render(item) {
    var article = document.createElement("article");
    article.className = "qa-card user-added";
    article.setAttribute("data-id", item.id);

    var answerId = "user-answer-" + item.id;
    var hasAnswer = item.answer && item.answer.trim().length > 0;

    var answerHtml = hasAnswer
      ? '<div class="toggle-row">' +
          '<button class="btn btn-primary" type="button" ' +
          'data-toggle-target="#' + answerId + '" ' +
          'data-show-text="내 답안 보기" data-hide-text="내 답안 접기" ' +
          'aria-expanded="false">내 답안 보기</button>' +
        '</div>' +
        '<div class="toggle-panel" id="' + answerId + '" hidden>' +
          '<h4>내 답안 <span class="pill-example">내가 업로드</span></h4>' +
          '<p>' + nl2br(esc(item.answer)) + '</p>' +
        '</div>'
      : '<p class="form-note">답안은 등록되지 않았습니다.</p>';

    article.innerHTML =
      '<div class="q-head">' +
        '<span class="type-tag">' + esc(item.type) + '</span>' +
        '<span class="subject-tag">' + esc(item.subject) + '</span>' +
        '<span class="user-tag">내가 업로드</span>' +
        '<button class="remove-upload" type="button" aria-label="이 문제 삭제">삭제</button>' +
      '</div>' +
      '<div class="q-body">' +
        '<p><strong>' + esc(item.title) + '</strong></p>' +
        '<blockquote>' + nl2br(esc(item.body)) + '</blockquote>' +
      '</div>' +
      answerHtml;

    // 삭제 버튼
    var removeBtn = article.querySelector(".remove-upload");
    removeBtn.addEventListener("click", function () {
      remove(item.id);
      article.parentNode && article.parentNode.removeChild(article);
    });

    list.appendChild(article);

    // 새 카드의 토글 버튼을 main.js의 토글 로직과 연결
    if (window.LidamToggles && typeof window.LidamToggles.bind === "function") {
      window.LidamToggles.bind(article);
    }
  }

  function renderAll() {
    list.innerHTML = "";
    load().forEach(render);
  }

  function remove(id) {
    var items = load().filter(function (it) { return it.id !== id; });
    save(items);
  }

  // 파일 선택 시 이름 표시 + 텍스트면 답안 칸 채우기
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) {
        if (fileName) { fileName.hidden = true; fileName.textContent = ""; }
        return;
      }
      if (fileName) {
        fileName.hidden = false;
        fileName.textContent = "선택한 파일: " + file.name;
      }
      // 텍스트 파일이면 내용을 답안 칸에 미리 채움
      var isText = file.type === "text/plain" || /\.txt$/i.test(file.name);
      if (isText && answerField && window.FileReader) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if (!answerField.value.trim()) {
            answerField.value = e.target.result;
          }
        };
        reader.readAsText(file);
      }
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var title = document.getElementById("up-title").value.trim();
    var subject = document.getElementById("up-subject").value;
    var type = document.getElementById("up-type").value;
    var body = document.getElementById("up-body").value.trim();
    var answer = answerField ? answerField.value.trim() : "";

    if (!title || !body) {
      window.alert("문제 제목과 문제 내용을 입력해 주세요.");
      return;
    }

    var item = {
      id: String(Date.now()) + Math.floor(Math.random() * 1000),
      title: title,
      subject: subject,
      type: type,
      body: body,
      answer: answer
    };

    var items = load();
    items.push(item);
    save(items);
    render(item);

    form.reset();
    if (fileName) { fileName.hidden = true; fileName.textContent = ""; }

    // 방금 추가된 카드로 스크롤
    var added = list.lastElementChild;
    if (added && added.scrollIntoView) {
      added.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!window.confirm("업로드한 문제를 모두 삭제할까요? (되돌릴 수 없습니다)")) return;
      save([]);
      renderAll();
    });
  }

  renderAll();
})();
