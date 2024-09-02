import { API_URL, defaultRegion } from "./config.js";
const backButton = document.querySelector(".button--back");
const backContainer = document.querySelector(".main__country__back");
const card = document.querySelector(".card");
const countryInfo = document.querySelector(".main__country");
const main = document.querySelector(".main__start");
const loader = document.querySelector(".loader");
const loadingSpin = function () {
  loader.classList.remove("none-display");
};
const loadingSpinEnd = function () {
  loader.classList.add("none-display");
};

const fieldsToFetch = [
  "name",
  "population",
  "region",
  "capital",
  "flags",
  "subregion",
  "tld",
  "currencies",
  "languages",
  "borders",
  "region",
].join(",");

const numberWithCommas = function (number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

const createCountryObject = function (data) {
  const result = data.map((country) => {
    const nativeNameObj = country.name.nativeName;
    const firstLangKey = nativeNameObj ? Object.keys(nativeNameObj)[0] : null;
    const nativeName = firstLangKey
      ? nativeNameObj[firstLangKey].official
      : "N/A";

    return {
      name: country.name.common, // Zmiana na pobranie `common` nazwy kraju
      nativeName: nativeName,
      population: country.population,
      region: country.region,
      subRegion: country.subregion,
      capital: country.capital ? country.capital[0] : "N/A",
      flag: country.flags.png,
      tld: country.tld ? country.tld.join(", ") : "N/A",
      currencies: country.currencies
        ? Object.values(country.currencies)
            .map((currency) => `${currency.name} (${currency.symbol})`)
            .join(", ")
        : "N/A",
      languages: country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A",
      borders: country.borders ? country.borders.join(", ") : "N/A",
      region: country.region,
    };
  });
  return result.sort((a, b) => a.name.localeCompare(b.name));
};

const apiRequest = async function (fields) {
  try {
    const res = await fetch(`${API_URL}${fields}`);
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("⚡Some data has not arrived");
    return []; // Return empty array or handle error as appropriate
  }
};

const searchNeighbour = async function (codes) {
  try {
    // Upewnij się, że kody są przekazywane jako ciąg znaków oddzielony przecinkami
    const codeString = codes
      .split(",")
      .map((code) => code.trim())
      .join(",");

    // Zbuduj odpowiedni URL z wieloma kodami
    const data = await apiRequest(`alpha?codes=${codeString}`);

    // Przetwarzanie danych - zwracanie tylko nazw krajów
    const countryNames = data.map((country) => country.name.common);

    return countryNames;
  } catch (err) {
    console.error(err.message);
    return []; // Zwraca pustą tablicę w przypadku błędu
  }
};

const menuView = async function (search = "") {
  try {
    loadingSpin(); // Show spinner before starting the request
    backContainer.classList.add("none-display");
    const data = await apiRequest(`all?fields=${fieldsToFetch}`);
    console.log(data);

    const countries = createCountryObject(data).filter(
      (country) =>
        country.region.toLowerCase() === search.toLowerCase() ||
        search === "" ||
        country.name.toLowerCase().trim() === search.toLowerCase().trim()
    );
    countries.forEach((country) => {
      const cardCountry = document.createElement("div");
      cardCountry.classList.add("card__country");

      cardCountry.innerHTML = `
        <img src="${country.flag}" alt="flag" class="card__country__img">
        <div class="card__country__info" id="${country.name
          .replace(/\s+/g, "-")
          .toLowerCase()}">
          <h2 class="header--2">${country.name}</h2>
          <span class="card__country__span">
            <p class="paragraph paragraph--1">Population:</p>
            <p class="paragraph paragraph--3">${numberWithCommas(
              country.population
            )}</p>
          </span>
          <span class="card__country__span">
            <p class="paragraph paragraph--1">Region:</p>
            <p class="paragraph paragraph--3">${country.region}</p>
          </span>
          <span class="card__country__span">
            <p class="paragraph paragraph--1">Capital:</p>
            <p class="paragraph paragraph--3">${country.capital}</p>
          </span>
        </div>`;
      card.appendChild(cardCountry);
    });
  } catch (err) {
    console.error(err.message);
  } finally {
    loadingSpinEnd(); // Ensure spinner hides even if an error occurs
  }
};

menuView("");

const countryInfoView = function () {
  card.addEventListener("click", async function (event) {
    try {
      const targetCountry = event.target.closest(".card__country");
      if (targetCountry) {
        loadingSpin(); // Show spinner before processing
        backContainer.classList.remove("none-display");
        const countryId = targetCountry
          .querySelector(".card__country__info")
          .id.replace(/-/g, " ")
          .toLowerCase();

        const data = await apiRequest(`name/${countryId}`);
        const country = createCountryObject(data);
        console.log("Clicked on:", country);
        main.classList.toggle("none-display");
        countryInfo.classList.toggle("none-display");

        country.forEach(async (country) => {
          const cardInfo = document.createElement("div");
          cardInfo.classList.add("information");
          const neighbours = country.borders.toLowerCase();

          cardInfo.innerHTML = `
            <img class="information__img" src="${country.flag}" alt="flag">
            <div class="information__data">
              <h2 class="header--2">${country.name}</h2>
              <div class="information__container">
                <div class="information__section">
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Native Name:</p>
                    <p class="paragraph paragraph--3">${country.nativeName}</p>
                  </span>
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Population:</p>
                    <p class="paragraph paragraph--3">${numberWithCommas(
                      country.population
                    )}</p>
                  </span>
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Region:</p>
                    <p class="paragraph paragraph--3">${country.region}</p>
                  </span>
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Sub Region:</p>
                    <p class="paragraph paragraph--3">${country.subRegion}</p>
                  </span>
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Capital:</p>
                    <p class="paragraph paragraph--3">${country.capital}</p>
                  </span>
                </div>
                <div class="information__section">
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Top Level Domain:</p>
                    <p class="paragraph paragraph--3">${country.tld}</p>
                  </span>
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Currencies:</p>
                    <p class="paragraph paragraph--3">${country.currencies}</p>
                  </span>
                  <span class="card__country__span">
                    <p class="paragraph paragraph--1">Languages:</p>
                    <p class="paragraph paragraph--3">${country.languages}</p>
                  </span>
                </div>
              </div>
              <div class="information__neighbours">
                <p class="information__neighbours__p paragraph paragraph--3">
                  Border Countries:
                </p>
                <div class="information__neighbours__box"></div>
              </div>
            </div>`;

          countryInfo.appendChild(cardInfo);

          const neighboursBox = document.querySelector(
            ".information__neighbours__box"
          );
          if (neighbours != "") {
            const neighbourNames = await searchNeighbour(neighbours);
            neighboursBox.innerHTML = "";
            neighbourNames.forEach((name) => {
              const neighbourElement = document.createElement("div");
              neighbourElement.classList.add("field-style");
              neighbourElement.innerHTML = `<p class="paragraph paragraph--2">${name}</p>`;
              neighboursBox.appendChild(neighbourElement);
            });
          }
        });
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      loadingSpinEnd(); // Ensure spinner hides even if an error occurs
    }
  });
};

//reset strony glownej

//obsluga przyciskow
const searchContainer = document.querySelector(".search");
const regionSearchList = document.querySelector(".search__filter-field");
const searchField = document.querySelector(".search__field__input");

const reloadMainPage = function () {
  document.querySelector(".card").innerHTML = "";
};

backButton.addEventListener("click", function () {
  // Ukryj widok szczegółów kraju i pokaż stronę główną
  countryInfo.classList.add("none-display");
  main.classList.remove("none-display");

  // Ukryj przycisk "Back"
  backContainer.classList.add("none-display");

  // Wyczyść zawartość widoku szczegółów kraju
  countryInfo.innerHTML = "";
});
// Funkcja do obsługi wyszukiwania
function handleSearch() {
  const value = searchField.value.trim();

  reloadMainPage();
  menuView(value);
  loadingSpinEnd();
}

// Obsługa kliknięcia w ikonę lupy lub zakończenia focusu
searchContainer.addEventListener("click", function (event) {
  if (event.target.closest(".search__field__icon")) {
    loadingSpin();
    handleSearch();
  } else if (event.target.closest(".search__field--2")) {
    regionSearchList.classList.toggle("none-display");
  }
});

// Obsługa naciśnięcia klawisza Enter w polu wyszukiwania
searchField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    loadingSpin();
    handleSearch();
    event.preventDefault(); // Zapobiega domyślnemu działaniu, np. przesłaniu formularza
  }
});
// Obsługa dotyku na urządzeniach mobilnych (Touch Events)
searchField.addEventListener("touchend", function () {
  loadingSpin();
  handleSearch();
});

searchContainer.addEventListener("change", function (event) {
  if (event.target.closest(".filter-field__select")) {
    let selectedValue = event.target.value.toLowerCase();
    if (selectedValue == "america") selectedValue = "americas";

    reloadMainPage();
    menuView(selectedValue);

    regionSearchList.classList.toggle("none-display");
  }
});

countryInfoView();

//dark mode

//optymalizacja kodu + posprzątanie bałaganu xd
//dokumentacja

//apiRequest("all");
//szukanie po kodzie przykład: alpha/co
