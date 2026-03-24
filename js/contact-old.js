(() => {
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formAlert");
  const submitBtn = document.getElementById("submitBtn");

  if (!form || !alertBox || !submitBtn) return;

  const EMAILJS_PUBLIC_KEY = "KhOVDMM3mUhFA1N2o";
  const EMAILJS_SERVICE_ID = "service_gtbkfrr";
  const EMAILJS_TEMPLATE_ID = "template_259jqrq";

  const SUCCESS_ALERT_DURATION = 20000;
  let alertTimer = null;
  let currentAlertType = null;

  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    phone: form.querySelector("#phone"),
    lineId: form.querySelector("#lineId"),
    subject: form.querySelector("#subject"),
    message: form.querySelector("#message"),
    agree: form.querySelector("#agree"),
  };

  const getErrorEl = (name) =>
    form.querySelector(`[data-error-for="${name}"]`);

  const getNavbarOffset = () => {
    const nav = document.querySelector(".site-header");
    const h = nav ? Math.ceil(nav.getBoundingClientRect().height) : 80;
    return h + 26;
  };

  const scrollToAlert = () => {
    const offset = getNavbarOffset();

    // 先取得 alertBox 的位置
    const rect = alertBox.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - offset;

    setTimeout(() => {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }, 50);
  };

  const showAlert = (type, msg) => {
    if (alertTimer) {
      clearTimeout(alertTimer);
      alertTimer = null;
    }

    currentAlertType = type;
    alertBox.style.display = "block";
    alertBox.className = `form-alert form-alert-${type}`;
    alertBox.textContent = msg;

    scrollToAlert();

    if (type === "success") {
      alertTimer = setTimeout(hideAlert, SUCCESS_ALERT_DURATION);
    }
  };

  const hideAlert = () => {
    if (alertTimer) clearTimeout(alertTimer);
    alertTimer = null;
    currentAlertType = null;
    alertBox.style.display = "none";
    alertBox.className = "form-alert";
    alertBox.textContent = "";
  };

  const setFieldError = (name, msg) => {
    const el = fields[name];
    if (!el) return;
    const wrap = el.closest(".field");
    const e = getErrorEl(name);
    if (wrap) wrap.classList.add("is-invalid");
    if (e) {
      e.hidden = false;
      e.textContent = msg;
    }
  };

  const clearFieldError = (name) => {
    const el = fields[name];
    if (!el) return;
    const wrap = el.closest(".field");
    const e = getErrorEl(name);
    if (wrap) wrap.classList.remove("is-invalid");
    if (e) {
      e.hidden = true;
      e.textContent = "";
    }
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isTaiwanPhone = (v) => /^09\d{8}$/.test(v);
  const isLineId = (v) => /^[a-zA-Z0-9._-]{4,}$/.test(v);

  const validateOne = (name) => {
    const el = fields[name];
    if (!el) return true;

    if (name === "agree") {
      if (!el.checked) {
        setFieldError("agree", "請勾選同意，才能送出。");
        return false;
      }
      clearFieldError("agree");
      return true;
    }

    const value = (el.value || "").trim();

    if (name === "lineId" && value === "") {
      clearFieldError("lineId");
      return true;
    }

    const required = ["name", "email", "phone", "subject", "message"];
    if (required.includes(name) && !value) {
      setFieldError(name, "此欄位為必填");
      return false;
    }

    if (name === "email" && !isEmail(value)) {
      setFieldError("email", "Email 格式不正確");
      return false;
    }

    if (name === "phone" && !isTaiwanPhone(value)) {
      setFieldError("phone", "手機格式錯誤");
      return false;
    }

    if (name === "lineId" && !isLineId(value)) {
      setFieldError("lineId", "LINE ID 格式錯誤");
      return false;
    }

    if (name === "subject" && value.length < 3) {
      setFieldError("subject", "主旨至少 3 個字");
      return false;
    }

    if (name === "message" && value.length < 10) {
      setFieldError("message", "需求描述至少 10 個字");
      return false;
    }

    clearFieldError(name);
    return true;
  };

  const validateAll = () => {
    let ok = true;
    Object.keys(fields).forEach((k) => {
      if (!validateOne(k)) ok = false;
    });
    return ok;
  };

  let emailjsInited = false;
  const initEmailJS = () => {
    if (emailjsInited) return true;
    if (!window.emailjs) return false;
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailjsInited = true;
    return true;
  };

  Object.keys(fields).forEach((name) => {
    const el = fields[name];
    if (!el) return;

    el.addEventListener("input", () => {
      // ✅ 輸入時重新驗證該欄位（解決紅框問題）
      validateOne(name);

      if (currentAlertType === "error") hideAlert();
    });

    el.addEventListener("blur", () => {
      validateOne(name);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();

    if (!validateAll()) {
      showAlert("error", "欄位尚未填完整或格式錯誤");
      return;
    }

    if (!initEmailJS()) {
      showAlert("error", "EmailJS 尚未載入");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");

    try {
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: fields.name.value.trim(),
          email: fields.email.value.trim(),
          phone: fields.phone.value.trim(),
          lineId: fields.lineId.value.trim(),
          subject: fields.subject.value.trim(),
          message: fields.message.value.trim(),
        }
      );

      showAlert("success", "✅ 已送出！我已收到你的訊息，會盡快回覆你。");

      setTimeout(() => {
        form.reset();
        Object.keys(fields).forEach(clearFieldError);
      }, 500);
    } catch (err) {
      showAlert("error", "送出失敗，請稍後再試");
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
    }
  });
})();
