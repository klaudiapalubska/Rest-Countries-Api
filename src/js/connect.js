import { async } from "regenerator-runtime";
import { API_URL, defaultRegion } from "./config.js";

const search = async function (country) {
  const res = await fetch(API_URL + country);
  console.log(res);
  const data = await res.json();
  console.log(data);
  console.log(data[0].region);
};

search("region/europe");
