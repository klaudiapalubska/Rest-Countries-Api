import { API_URL, defaultRegion } from "./config.js";
const card = document.querySelector(".card");
const countryInfo = document.querySelector(".main__country");
const main = document.querySelector(".main__start");

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
      name: country.name.common,
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
    console.error(err.message);
    return []; // Return empty array or handle error as appropriate
  }
};

const menuView = async function () {
  try {
    const data = await apiRequest(`all?fields=${fieldsToFetch}`);
    const countries = createCountryObject(data);

    countries.forEach((country) => {
      const cardCountry = document.createElement("div");
      cardCountry.classList.add("card__country");
      cardCountry.innerHTML = `
        <img src="${country.flag}" alt="flag" class="card__country__img">
        <div class="card__country__info" id="${country.name}">
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
  }
};

menuView();

const countryInfoView = function () {
  card.addEventListener("click", async function (event) {
    try {
      const targetCountry = event.target.closest(".card__country");

      if (targetCountry) {
        const countryId = targetCountry
          .querySelector(".card__country__info")
          .id.replace(/\s+/g, "")
          .toLowerCase();

        const data = await apiRequest(`name/${countryId}`);
        const country = createCountryObject(data);
        console.log("Clicked on:", country);
        main.style.display = "none";
        countryInfo.classList.toggle("none-display");

        country.forEach((country) => {
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

              <div class="information__neighbours__box">
              
                <div class="field-style">
                  <p class="paragraph paragraph--2">{Neighbour}</p>
                </div>
              
              </div>
            </div>
          </div>`;
          console.log(country.borders);
          countryInfo.appendChild(cardInfo);
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};

countryInfoView();

//szukanie po kodzie przykład: alpha/co
