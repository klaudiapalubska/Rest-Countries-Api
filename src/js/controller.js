import { API_URL, defaultRegion } from "./config.js";

function numberWithCommas(number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
const createCountryObject = function (data) {
  const result = data.map((country) => ({
    name: country.name.common, // Assuming the API returns 'name.common' for the country name
    population: country.population,
    region: country.region,
    capital: country.capital ? country.capital[0] : "N/A", // Handling cases where capital might be an array or undefined
    flag: country.flags.png,
  }));
  return result;
};

const search = async function (field, fieldType) {
  try {
    const res = await fetch(API_URL + field + fieldType);
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

    const data = await res.json();
    console.log(data); // Log the entire response to understand its structure

    const countries = createCountryObject(data);
    console.log(countries[0].name);

    countries.forEach((countries) => {
      const card = document.querySelector(".card");
      const cardCountry = document.createElement("div");
      cardCountry.classList.add("card__country");
      cardCountry.innerHTML = `
        
           
            <img src="${countries.flag}" alt="flag" class="card__country__img">
            <div class="card__country__info">
              <h2 class="header--2">${countries.name}</h2>
              <span class="card__country__span">
                <p class="paragraph paragraph--1">Population:</p>
                <p class="paragraph paragraph--3">${numberWithCommas(
                  countries.population
                )}</p>
              </span>
              <span class="card__country__span">
                <p class="paragraph paragraph--1">Region:</p>
                <p class="paragraph paragraph--3">${countries.region}</p>
              </span>
              <span class="card__country__span">
                <p class="paragraph paragraph--1">Capital:</p>
                <p class="paragraph paragraph--3">${countries.capital}</p>
              </span>
            </div>
      `;
      card.appendChild(cardCountry);
    });
  } catch (err) {
    console.error(err.message);
  }
};

search("all?fields=", "name,population,region,capital,flags");
