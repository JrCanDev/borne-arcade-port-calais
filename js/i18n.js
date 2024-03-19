let locale = localStorage.getItem("locale") || "en";
let translations = [];

async function getTranslations(locale) {
  let directory = '';
  for (let i = 0; i <= 5; i++) {
    try {
      const response = await fetch(directory + `languages/${locale}.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Failed to fetch translations: ${error}`);
    }
    directory = "../" + directory;
  }
  throw new Error('Failed to fetch translations after multiple attempts');
}

async function setLocale(newLocale) {
  locale = newLocale;
  localStorage.setItem("locale", locale);
  translations = await getTranslations(locale);
  translatePage();
  onLocaleChange();
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n");
  const field = element.getAttribute("data-i18n-field");
  const translation = translations[key] || translations["translation_not_found_error"];
  if (field) {
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

function onLocaleChange() {
}