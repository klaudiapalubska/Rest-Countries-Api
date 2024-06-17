const search = async function (country) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  console.log(res);
  const data = await res.json();

  console.log(data[0].region);
};

search("deutschland");
