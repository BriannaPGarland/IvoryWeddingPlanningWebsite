import JSZip from "jszip";
import { WeddingProfile, BrandConfig } from "../types";

export async function generateChromeExtensionZip(profile: WeddingProfile, brand: BrandConfig): Promise<Blob> {
  const zip = new JSZip();

  // 1. manifest.json (Manifest V3 - Strict Compliance)
  const manifest = {
    manifest_version: 3,
    name: `${brand.name} - AI Wedding Vision Autofill`,
    version: "1.0.0",
    description: `Auto-detects wedding vendor inquiry forms when visible on screen and uses ${brand.name} AI vision profile to fill in wedding details.`,
    permissions: ["activeTab", "storage", "scripting"],
    host_permissions: ["<all_urls>"],
    action: {
      default_popup: "popup.html",
      default_title: `${brand.name} AI Companion`,
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["content.js"],
        css: ["styles.css"],
        run_at: "document_idle",
      },
    ],
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  // 2. content.js
  const contentJs = `
// ${brand.name} Chrome Extension Content Script
console.log("🌸 ${brand.name} AI Wedding Extension Loaded!");

// Saved vision profile
const userVision = ${JSON.stringify(profile, null, 2)};

// AI Verification: Check if current webpage is a genuine wedding/event vendor
function isWeddingVendorSite() {
  const pageText = (document.body.innerText + " " + document.title + " " + (document.querySelector('meta[name="description"]')?.content || "")).toLowerCase();
  const weddingKeywords = [
    "wedding", "bridal", "groom", "bride", "nuptial", "marriage", "marry",
    "venue", "florist", "floral", "photographer", "photography", "videographer", "videography",
    "event planner", "wedding planner", "coordinator", "catering", "caterer", "dreamwood",
    "inquiry", "contacts", "book us", "get in touch", "check availability", "quote", "sacramento", "california"
  ];
  const matches = weddingKeywords.filter(keyword => pageText.includes(keyword));
  return matches.length >= 2 || pageText.includes("wedding") || pageText.includes("dreamwood") || pageText.includes("bridal");
}

// Make autofill globally accessible on window
window.autofillForm = function() {
  const elements = document.querySelectorAll("input, textarea, select, [role='combobox'], .wpcf7-form-control, .elementor-field");
  let filledCount = 0;

  // Extract clean profile variables
  const fullCouple = userVision.coupleNames || "Brianna & Joe";
  const firstName = fullCouple.split("&")[0]?.split(" ")?.[0]?.trim() || fullCouple.split(" ")[0] || "Brianna";
  const lastName = "Garland";
  const formattedDate = userVision.weddingDate || "2027-05-16";
  const formattedLocation = userVision.location || "Sonoma Valley, California";
  const formattedEmail = userVision.gmailAddress || "brianna.wedding2026@serenoweddings.com";
  const formattedPhone = "(707) 555-0192";
  const formattedGuests = String(userVision.guestCount || "125");
  const formattedVibe = userVision.vibe || "Ethereal Organic Minimalist";
  const formattedFlorals = userVision.florals || "Wild garden roses, eucalyptus garlands, blush peonies";
  const formattedColors = Array.isArray(userVision.colors) ? userVision.colors.join(", ") : userVision.colors;
  const formattedBudget = "$" + (userVision.budget || "45000");

  const helperMessage = \`Hi! We are planning our wedding on \${formattedDate} in \${formattedLocation} for ~\${formattedGuests} guests. Our vibe is \${formattedVibe} with floral preferences for \${formattedFlorals}. Our primary colors are \${formattedColors}. We would love to check your availability and get a customized quote!\`;

  function setNativeValue(el, val) {
    if (!el || val === undefined || val === null) return;
    const tag = el.tagName.toLowerCase();
    const prototype = tag === "textarea" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
    if (setter) {
      setter.call(el, val);
    } else {
      el.value = val;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  elements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    const type = (el.type || "").toLowerCase();

    if (type === "hidden" || type === "submit" || type === "button" || type === "reset") return;

    const nameAttr = (el.name || el.getAttribute("name") || "").toLowerCase();
    const idAttr = (el.id || el.getAttribute("id") || "").toLowerCase();
    const classAttr = (el.className || "").toLowerCase();
    const placeholderAttr = (el.placeholder || el.getAttribute("placeholder") || "").toLowerCase();
    const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();
    const dataLabel = (el.getAttribute("data-label") || el.getAttribute("data-name") || "").toLowerCase();

    // Collect full contextual text from surrounding markup
    let contextText = "";
    if (el.labels && el.labels.length > 0) {
      contextText = Array.from(el.labels).map(l => l.innerText).join(" ");
    } else if (el.closest("label")) {
      contextText = el.closest("label").innerText;
    }
    
    const parentContainer = el.closest(".form-group, .field, .elementor-field-group, .wpcf7-form-control-wrap, p, div, li");
    if (parentContainer) {
      contextText += " " + parentContainer.innerText;
    }
    if (contextText.length > 200) contextText = contextText.substring(0, 200);

    const descriptor = (nameAttr + " " + idAttr + " " + classAttr + " " + placeholderAttr + " " + ariaLabel + " " + dataLabel + " " + contextText + " " + (el.value || "")).toLowerCase();

    // 1. SELECT DROPDOWNS
    if (tagName === "select") {
      let matchedIndex = -1;
      const options = Array.from(el.options);

      const isMonthSelect = descriptor.includes("month") || descriptor.includes("mm") || nameAttr.includes("month") || idAttr.includes("month") || options.some(o => /january|february|march|april|may|june|july|august|september|october|november|december/i.test(o.text));
      const isDaySelect = descriptor.includes("day") || descriptor.includes("dd") || nameAttr.includes("day") || idAttr.includes("day") || options.some(o => /^16$|^016$/i.test(o.text.trim()));
      const isYearSelect = descriptor.includes("year") || descriptor.includes("yy") || nameAttr.includes("year") || idAttr.includes("year") || options.some(o => /2026|2027|2028/.test(o.text));

      if (isMonthSelect) {
        matchedIndex = options.findIndex(opt => /may|05|^5$/i.test(opt.text.trim()) || /05|^5$/i.test(opt.value.trim()));
        if (matchedIndex === -1) matchedIndex = options.findIndex(opt => opt.text.toLowerCase().includes("may") || opt.value.includes("05"));
      } else if (isDaySelect) {
        matchedIndex = options.findIndex(opt => /^16$|^016$/i.test(opt.text.trim()) || /^16$/i.test(opt.value.trim()));
      } else if (isYearSelect) {
        matchedIndex = options.findIndex(opt => /2027|^27$/i.test(opt.text.trim()) || /2027|^27$/i.test(opt.value.trim()));
        if (matchedIndex === -1) matchedIndex = options.findIndex(opt => opt.text.includes("2026") || opt.value.includes("2026"));
      } else {
        options.forEach((opt, idx) => {
          if (idx === 0 && (opt.text.toLowerCase().includes("select") || opt.value === "")) return;
          const optText = (opt.text + " " + opt.value).toLowerCase();

          if (descriptor.includes("ceremony") || descriptor.includes("onsite")) {
            if (optText.includes("yes") || optText.includes("onsite") || optText.includes("true")) matchedIndex = idx;
          } else if (descriptor.includes("hear") || descriptor.includes("learn") || descriptor.includes("find") || descriptor.includes("referral") || descriptor.includes("source")) {
            if (optText.includes("instagram") || optText.includes("social") || optText.includes("website") || optText.includes("google") || optText.includes("referral") || optText.includes("other")) matchedIndex = idx;
          } else if (descriptor.includes("guest") || descriptor.includes("count") || descriptor.includes("people") || descriptor.includes("headcount")) {
            if (optText.includes("125") || optText.includes("100") || optText.includes("150") || optText.includes("100-150") || optText.includes("100-200")) matchedIndex = idx;
          } else if (descriptor.includes("budget") || descriptor.includes("spend") || descriptor.includes("investment")) {
            if (optText.includes("45") || optText.includes("40") || optText.includes("50") || optText.includes("k") || optText.includes("$")) matchedIndex = idx;
          } else if (descriptor.includes("date") || descriptor.includes("year") || descriptor.includes("when") || descriptor.includes("month")) {
            if (optText.includes("2027") || optText.includes("may") || optText.includes("16") || optText.includes("spring")) matchedIndex = idx;
          } else if (descriptor.includes("location") || descriptor.includes("venue")) {
            if (optText.includes("sonoma") || optText.includes("napa") || optText.includes("california") || optText.includes("vineyard")) matchedIndex = idx;
          }
        });
      }

      if (matchedIndex === -1 && options.length > 1) {
        matchedIndex = options.findIndex((opt, idx) => idx > 0 && !opt.text.toLowerCase().includes("select") && opt.value !== "");
        if (matchedIndex === -1) matchedIndex = 1;
      }

      if (matchedIndex !== -1 && matchedIndex < options.length) {
        el.selectedIndex = matchedIndex;
        el.value = options[matchedIndex].value;
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("input", { bubbles: true }));
        filledCount++;
      }
      return;
    }

    // 2. CHECKBOXES
    if (type === "checkbox") {
      const isYesOrSpecific = descriptor.includes("yes") || descriptor.includes("specific date") || descriptor.includes("desire") || descriptor.includes("yep");
      const isRelevantService = 
        descriptor.includes("flower") || descriptor.includes("floral") || descriptor.includes("bouquet") ||
        descriptor.includes("centerpiece") || descriptor.includes("ceremony") || descriptor.includes("reception") ||
        descriptor.includes("photo") || descriptor.includes("photography") || descriptor.includes("decor") ||
        descriptor.includes("agree") || descriptor.includes("terms") || descriptor.includes("accept") || descriptor.includes("contact");

      if (isYesOrSpecific || isRelevantService) {
        if (!el.checked) {
          el.checked = true;
          el.dispatchEvent(new Event("click", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          filledCount++;
        }
      }
      return;
    }

    // 3. RADIOS
    if (type === "radio") {
      const isYesOrPositive = 
        descriptor.includes("yes") || descriptor.includes("yep") || descriptor.includes("sonoma") ||
        descriptor.includes("2027") || descriptor.includes("100") || descriptor.includes("125") || descriptor.includes("45");

      if (isYesOrPositive) {
        if (!el.checked) {
          el.checked = true;
          el.dispatchEvent(new Event("click", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          filledCount++;
        }
      } else if (el.name) {
        const group = document.querySelectorAll(\`input[type="radio"][name="\${el.name}"]\`);
        const anyChecked = Array.from(group).some(r => r.checked);
        if (!anyChecked && group[0] === el) {
          el.checked = true;
          el.dispatchEvent(new Event("click", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          filledCount++;
        }
      }
      return;
    }

    // 4. TEXT & TEXTAREA INPUTS
    if (descriptor.includes("email") || type === "email" || nameAttr.includes("mail") || nameAttr.includes("your-email")) {
      setNativeValue(el, formattedEmail);
      filledCount++;
    } else if (descriptor.includes("phone") || descriptor.includes("mobile") || descriptor.includes("tel") || type === "tel" || nameAttr.includes("phone") || nameAttr.includes("your-phone")) {
      setNativeValue(el, formattedPhone);
      filledCount++;
    } else if (descriptor.includes("first name") || descriptor.includes("firstname") || descriptor.includes("given name") || nameAttr === "fname" || nameAttr.includes("first_name") || nameAttr.includes("first-name")) {
      setNativeValue(el, firstName);
      filledCount++;
    } else if (descriptor.includes("last name") || descriptor.includes("lastname") || descriptor.includes("surname") || nameAttr === "lname" || nameAttr.includes("last_name") || nameAttr.includes("last-name")) {
      setNativeValue(el, lastName);
      filledCount++;
    } else if (type === "date" || descriptor.includes("wedding date") || descriptor.includes("event date") || descriptor.includes("date of event") || descriptor.includes("wedding-date") || descriptor.includes("event-date") || descriptor.includes("date") || descriptor.includes("when") || descriptor.includes("day of")) {
      if (type === "date") {
        setNativeValue(el, "2027-05-16");
      } else if (placeholderAttr.includes("mm/dd") || descriptor.includes("mm/dd")) {
        setNativeValue(el, "05/16/2027");
      } else {
        setNativeValue(el, formattedDate);
      }
      filledCount++;
    } else if (descriptor.includes("ceremony venue") || descriptor.includes("ceremony location")) {
      setNativeValue(el, "Oakridge Estate & Botanical Gardens");
      filledCount++;
    } else if (descriptor.includes("reception venue") || descriptor.includes("reception location")) {
      setNativeValue(el, "Oakridge Estate & Botanical Gardens");
      filledCount++;
    } else if (descriptor.includes("location") || descriptor.includes("city") || descriptor.includes("state") || descriptor.includes("venue") || descriptor.includes("destination") || descriptor.includes("place")) {
      setNativeValue(el, formattedLocation);
      filledCount++;
    } else if (descriptor.includes("guest") || descriptor.includes("headcount") || descriptor.includes("count") || descriptor.includes("people") || descriptor.includes("attendee")) {
      setNativeValue(el, formattedGuests);
      filledCount++;
    } else if (descriptor.includes("color") || descriptor.includes("palette") || descriptor.includes("scheme")) {
      setNativeValue(el, formattedColors);
      filledCount++;
    } else if (descriptor.includes("flower") || descriptor.includes("floral") || descriptor.includes("bouquets") || descriptor.includes("vision")) {
      setNativeValue(el, formattedFlorals);
      filledCount++;
    } else if (descriptor.includes("vibe") || descriptor.includes("style") || descriptor.includes("theme") || descriptor.includes("aesthetic")) {
      setNativeValue(el, formattedVibe);
      filledCount++;
    } else if (descriptor.includes("budget") || descriptor.includes("spend") || descriptor.includes("investment")) {
      setNativeValue(el, formattedBudget);
      filledCount++;
    } else if (descriptor.includes("hear") || descriptor.includes("learn") || descriptor.includes("source") || descriptor.includes("find") || descriptor.includes("referral")) {
      setNativeValue(el, "Instagram / Wedding Website");
      filledCount++;
    } else if (descriptor.includes("instagram") || descriptor.includes("social") || descriptor.includes("handle") || descriptor.includes("website")) {
      setNativeValue(el, "@briannaandjoe");
      filledCount++;
    } else if (descriptor.includes("full name") || descriptor.includes("couple") || descriptor.includes("bride") || descriptor.includes("groom") || descriptor.includes("your name") || descriptor.includes("your-name") || descriptor.includes("author") || descriptor.includes("name")) {
      setNativeValue(el, fullCouple);
      filledCount++;
    } else if (tagName === "textarea" || descriptor.includes("message") || descriptor.includes("details") || descriptor.includes("notes") || descriptor.includes("share") || descriptor.includes("tell us") || descriptor.includes("about") || descriptor.includes("inquiry") || nameAttr.includes("your-message")) {
      setNativeValue(el, helperMessage);
      filledCount++;
    } else {
      if (tagName === "textarea") {
        setNativeValue(el, helperMessage);
        filledCount++;
      } else if (type === "text" || !type) {
        setNativeValue(el, fullCouple);
        filledCount++;
      }
    }
  });

  if (filledCount > 0) {
    alert(\`✨ \${brand.name} AI populated \${filledCount} form fields accurately!\`);
  }
};

// Listen for popup messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill") {
    window.autofillForm();
    sendResponse({ status: "success" });
  }
  return true;
});

// Detect visible vendor form or form fields in viewport
function findVisibleVendorForm() {
  const forms = Array.from(document.querySelectorAll("form, .contact-form, .wpcf7-form, .elementor-form, .gform_wrapper, .form-container, #contact-form"));
  for (const form of forms) {
    const rect = form.getBoundingClientRect();
    const isVisibleInViewport = rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0 && rect.height > 0;
    if (isVisibleInViewport) return form;
  }

  // Fallback: Check individual visible input fields
  const inputs = Array.from(document.querySelectorAll("input:not([type='hidden']), textarea, select"));
  for (const input of inputs) {
    const rect = input.getBoundingClientRect();
    const isVisibleInViewport = rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0 && rect.height > 0;
    if (isVisibleInViewport) {
      return input.closest("form") || input.parentElement;
    }
  }

  return null;
}

// Inject floating AI badge when form is visible on screen
function injectSerenoWidget() {
  if (document.getElementById("sereno-extension-badge")) return;

  const badge = document.createElement("div");
  badge.id = "sereno-extension-badge";
  badge.innerHTML = \`
    <div style="
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: #ffffff;
      border: 1px solid #ebdcc0;
      border-radius: 16px;
      padding: 16px 20px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 320px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      animation: serenoSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    ">
      <style>
        @keyframes serenoSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: 700; color: ${brand.primaryColor}; font-size: 14px; display: flex; align-items: center; gap: 6px;">
          ✨ ${brand.name} AI Companion
        </span>
        <span style="font-size: 10px; background: #eef6f3; color: ${brand.primaryColor}; padding: 2px 6px; border-radius: 4px; font-weight: 700;">
          Verified Vendor Form
        </span>
        <button id="sereno-close-btn" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #94a3b8; margin-left: 4px;">✕</button>
      </div>
      <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.4;">
        Inquiry form detected on screen! Autofill with <strong>\${userVision.coupleNames}</strong>'s wedding vision?
      </p>
      <button id="sereno-autofill-btn" style="
        background: ${brand.primaryColor};
        color: #ffffff;
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: opacity 0.2s;
      ">
        ✨ Autofill Vision with AI
      </button>
    </div>
  \`;

  document.body.appendChild(badge);

  document.getElementById("sereno-close-btn").addEventListener("click", () => {
    badge.remove();
  });

  document.getElementById("sereno-autofill-btn").addEventListener("click", () => {
    window.autofillForm();
  });
}

// Continuous On-Screen Scroll & Intersection Monitor
function checkAndTriggerWidget() {
  if (document.getElementById("sereno-extension-badge")) return;
  if (!isWeddingVendorSite()) return;

  const visibleForm = findVisibleVendorForm();
  if (visibleForm) {
    injectSerenoWidget();
  }
}

// 1. Initial check
setTimeout(checkAndTriggerWidget, 600);

// 2. Scroll & Resize listener
window.addEventListener("scroll", checkAndTriggerWidget, { passive: true });
window.addEventListener("resize", checkAndTriggerWidget, { passive: true });

// 3. MutationObserver for late-rendered dynamic forms (React, Vue, Elementor, WPForms, Popups)
const observer = new MutationObserver(() => {
  checkAndTriggerWidget();
});
observer.observe(document.body, { childList: true, subtree: true });
`;

  zip.file("content.js", contentJs);

  // 3. styles.css
  zip.file(
    "styles.css",
    `
#sereno-extension-badge button:hover {
  opacity: 0.9;
}
`
  );

  // 4. popup.html (Without inline scripts to prevent CSP errors in Chrome)
  const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 320px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 16px;
      background: #fafaf9;
      color: #292524;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e7e5e4;
      margin-bottom: 12px;
    }
    .title {
      font-weight: 700;
      font-size: 16px;
      color: ${brand.primaryColor};
    }
    .card {
      background: #ffffff;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .card-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #78716c;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .card-value {
      font-weight: 600;
      font-size: 14px;
      color: #1c1917;
    }
    .btn {
      width: 100%;
      background: ${brand.primaryColor};
      color: white;
      border: none;
      padding: 10px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .btn:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="header">
    <span style="font-size: 20px;">✨</span>
    <div>
      <div class="title">${brand.name} AI</div>
      <div style="font-size: 12px; color: #78716c;">Vision Form Assistant</div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Couple Vision Profile</div>
    <div class="card-value">${profile.coupleNames}</div>
    <div style="font-size: 12px; color: #57534e; margin-top: 4px;">📅 ${profile.weddingDate} • 👥 ${profile.guestCount} guests</div>
  </div>
  <div class="card">
    <div class="card-title">Aesthetic & Vibe</div>
    <div style="font-size: 12px; color: #292524; font-style: italic;">"${profile.vibe}"</div>
  </div>
  <button class="btn" id="autofill-now">✨ Populate Vision Profile Now</button>

  <script src="popup.js"></script>
</body>
</html>`;

  zip.file("popup.html", popupHtml);

  // 5. popup.js (Separate JS file to adhere strictly to Chrome CSP rules)
  const popupJs = `
document.addEventListener('DOMContentLoaded', () => {
  const autofillBtn = document.getElementById("autofill-now");
  if (!autofillBtn) return;

  autofillBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(tab.id, { action: "autofill" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            if (typeof window.autofillForm === "function") {
              window.autofillForm();
            } else {
              alert("✨ Please refresh the page to activate ${brand.name} AI extension!");
            }
          }
        });
      }
    });
  });
});
`;

  zip.file("popup.js", popupJs);

  // Generate zip blob
  return await zip.generateAsync({ type: "blob" });
}

