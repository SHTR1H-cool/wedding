(() => {
  "use strict";

  const content = window.WEDDING_CONTENT;

  if (!content) {
    console.error("Файл js/content.js не загрузился.");
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const coupleNames = `${content.couple.groom}${content.couple.separator}${content.couple.bride}`;

  document.addEventListener("DOMContentLoaded", initialize);

  function initialize() {
    fillContent();
    initializeCover();
    initializeRevealAnimations();
    initializeCountdown();
    initializeMap();
    initializePersonalization();
    initializeForm();
  }

  function fillContent() {
    document.title = `${coupleNames} — Свадебное приглашение`;

    $("#coverNames").textContent = coupleNames;
    $("#footerNames").textContent = coupleNames;
    $("#coverLabel").textContent = content.cover.label;
    $("#openInvitation").textContent = content.cover.buttonText;
    $("#coverDate").textContent = content.wedding.coverDate;

    $("#invitationEyebrow").textContent = content.invitation.eyebrow;
    $("#invitationTitle").textContent = content.invitation.title;
    $("#invitationText").textContent = content.invitation.text;

    $("#weddingDay").textContent = content.wedding.day;
    $("#weddingMonthYear").textContent = content.wedding.monthYear;

    $("#locationName").textContent = content.location.name;
    $("#locationAddress").textContent = content.location.address;
    $("#routeButton").href = content.location.routeUrl;

    $("#rsvpDescription").textContent = content.form.description;
    $("#formNote").textContent = content.form.note;
    $("#footerText").textContent = content.footer.text;

    const scheduleList = $("#scheduleList");
    scheduleList.innerHTML = content.schedule.map((item, index) => `
      <article class="timeline-event reveal ${index % 2 === 0 ? "reveal-left" : "reveal-right"}">
        <div class="timeline-time">${escapeHtml(item.time)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </article>
    `).join("");
  }

  function initializeCover() {
    const cover = $("#cover");
    const mainContent = $("#mainContent");
    const openButton = $("#openInvitation");

    openButton.addEventListener("click", () => {
      cover.classList.add("is-closed");
      mainContent.classList.add("is-open");
      mainContent.setAttribute("aria-hidden", "false");
      document.body.classList.remove("page-locked");

      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 120);
    });
  }

  function initializeRevealAnimations() {
    const elements = $$(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach(element => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
      observer.observe(element);
    });
  }

  function initializeCountdown() {
    const weddingDate = new Date(content.wedding.dateTime);

    const elements = {
      days: $("#days"),
      hours: $("#hours"),
      minutes: $("#minutes"),
      seconds: $("#seconds")
    };

    const update = () => {
      const difference = weddingDate.getTime() - Date.now();

      if (Number.isNaN(weddingDate.getTime()) || difference <= 0) {
        Object.values(elements).forEach(element => element.textContent = "00");
        return;
      }

      const values = {
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };

      Object.entries(values).forEach(([key, value]) => {
        elements[key].textContent = String(value).padStart(2, "0");
      });
    };

    update();
    window.setInterval(update, 1000);
  }

  function initializeMap() {
    const mapElement = $("#map");
    const errorElement = $("#mapError");

    const latitude = Number(content.location.latitude);
    const longitude = Number(content.location.longitude);

    if (!window.L || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      mapElement.classList.add("is-hidden");
      errorElement.classList.remove("is-hidden");
      return;
    }

    try {
      const map = L.map(mapElement, {
        scrollWheelZoom: false,
        zoomControl: true
      }).setView([latitude, longitude], content.location.zoom || 16);

      const refreshMap = () => {
        window.setTimeout(() => {
          map.invalidateSize(true);
        }, 300);
      };

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: "custom-map-marker",
        html: "",
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -22]
      });

      L.marker([latitude, longitude], { icon: markerIcon })
        .addTo(map)
        .bindPopup(content.location.popupText)
        .openPopup();

      refreshMap();

      window.addEventListener("resize", refreshMap);

      document.getElementById("openInvitation")
        ?.addEventListener("click", () => {
          window.setTimeout(() => {
            map.invalidateSize(true);
          }, 500);
        });

      const mapResizeObserver = new ResizeObserver(() => {
        map.invalidateSize(false);
      });

      mapResizeObserver.observe(mapElement);

        window.setTimeout(() => {
          map.invalidateSize();
        }, 1000);

        document.getElementById("openInvitation").addEventListener("click", () => {
          window.setTimeout(() => {
            map.invalidateSize();
          }, 1000);
        });
    } catch (error) {
      console.error("Ошибка инициализации карты:", error);
      mapElement.classList.add("is-hidden");
      errorElement.classList.remove("is-hidden");
    }
  }

  function initializePersonalization() {
    const parameterName = content.personalization.queryParameter || "guest";
    const params = new URLSearchParams(window.location.search);
    const guest = (params.get(parameterName) || "").trim();

    if (!guest) return;

    const greeting = $("#guestGreeting");
    const nameInput = $("#guestName");
    const guestQueryValue = $("#guestQueryValue");

    greeting.textContent = `${content.invitation.personalizedPrefix} ${guest}!`;
    greeting.classList.remove("is-hidden");

    nameInput.value = guest;
    guestQueryValue.value = guest;
  }

  function initializeForm() {
    const form = $("#guestForm");
    const submitButton = $("#submitButton");
    const formStatus = $("#formStatus");
    const attendanceInputs = $$('input[name="attendance"]');
    const guestSideField = $("#guestSideField");
    const guestSideInputs = $$('input[name="guestSide"]');

    attendanceInputs.forEach(input => {
      input.addEventListener("change", () => {
        const willAttend = input.value === "Да" && input.checked;
    
        guestSideField.classList.toggle("is-hidden", !willAttend);
    
        guestSideInputs.forEach(sideInput => {
          sideInput.required = willAttend;
    
          if (!willAttend) {
            sideInput.checked = false;
          }
        });
    
        if (!willAttend) {
          setFieldError("guestSide", "");
        }
      });
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      clearErrors();
      hideStatus();

      if (!validateForm(form)) return;

      const formData = new FormData(form);

      if (formData.get("website")) {
        return;
      }

      formData.set("submittedAt", new Date().toISOString());

      const scriptUrl = content.form.googleScriptUrl.trim();

      if (!scriptUrl) {
        showStatus(content.form.demoMessage, "error");
        return;
      }

      setLoading(true);

      try {
        const payload = Object.fromEntries(formData.entries());

        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        showStatus(content.form.successMessage, "success");
        form.reset();

        guestSideField.classList.add("is-hidden");

        guestSideInputs.forEach(input => {
          input.required = false;
        });

        const guest = $("#guestQueryValue").value;
        if (guest) {
          $("#guestName").value = guest;
        }
        
      } catch (error) {
        console.error("Ошибка отправки формы:", error);
        showStatus(content.form.errorMessage, "error");
      } finally {
        setLoading(false);
      }
    });

    function validateForm(currentForm) {
      let valid = true;
      const name = $("#guestName");
      const attendance = $('input[name="attendance"]:checked');
      const guestSide = $('input[name="guestSide"]:checked');

      if (!name.value.trim()) {
        setFieldError("name", "Введите имя и фамилию.");
        name.classList.add("is-invalid");
        valid = false;
      }

      if (!attendance) {
        setFieldError("attendance", "Выберите вариант ответа.");
        valid = false;
      }

      if (attendance?.value === "Да" && !guestSide) {
        setFieldError("guestSide", "Укажите, с какой стороны вы приглашены.");
        valid = false;
      }

      if (!valid) {
        const firstError = $(".field-error:not(:empty)");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return valid;
    }

    function clearErrors() {
      $$(".field-error").forEach(element => element.textContent = "");
      $$(".is-invalid").forEach(element => element.classList.remove("is-invalid"));
    }

    function setFieldError(fieldName, message) {
      const element = $(`[data-error-for="${fieldName}"]`);
      if (element) element.textContent = message;
    }

    function setLoading(loading) {
      submitButton.disabled = loading;
      submitButton.classList.toggle("is-loading", loading);
    }

    function showStatus(message, type) {
      formStatus.textContent = message;
      formStatus.className = `form-status ${type}`;
      formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideStatus() {
      formStatus.textContent = "";
      formStatus.className = "form-status is-hidden";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
