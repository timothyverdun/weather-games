const form = document.getElementById("guess-form");
const slider = document.getElementById("temperature");
const output = document.getElementById("value");
const submitBtn = document.getElementById("submit");
const cityEl = document.getElementById("city");
const resultEl = document.getElementById("result");

let realTemperature = null;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
}

function verify() {
    const guess = slider.valueAsNumber;
    const diff = Math.abs(guess - realTemperature);
    resultEl.textContent = `Température réelle : ${realTemperature} °C. Ton écart : ${diff.toFixed(1)} °C`;
}

async function init() {
    submitBtn.disabled = true;

    try {
        const cities = await fetchJson("citydata.json");
        const city = cities[getRandomInt(0, cities.length - 1)];
        cityEl.textContent = city.name;

        const weather = await fetchJson(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.long}&current=temperature_2m`
        );
        realTemperature = weather.current.temperature_2m;

        submitBtn.disabled = false;
    } catch (error) {
        console.error(error);
        cityEl.textContent = "Impossible de charger les données.";
    }
}

output.textContent = slider.value;
slider.addEventListener("input", () => {
    output.textContent = slider.value;
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    verify();
});

init();