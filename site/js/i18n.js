let locale = "en";
let translations = [];

async function getTranslations(locale) {
  const response = await fetch(`languages/${locale}.json`);
  return await response.json();
}

async function setLocale(locale) {
  translations = await getTranslations(locale);
  translatePage();
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n");
  const field = element.getAttribute("data-i18n-field")
  const translation = translations[key];
  if (field)
  {
    element.setAttribute(field, translation);
  } else {
      element.innerText = translation;
  }
}

function translatePage() {
  document.querySelectorAll("[data-i18n]").forEach(translateElement);
}

document.addEventListener("DOMContentLoaded", () => {
  setLocale(locale);
});
