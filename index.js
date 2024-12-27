const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const resultContainer = document.getElementById('result');
const countryName = document.getElementById('country-name');
const flag = document.getElementById('flag');
const capital = document.getElementById('capital');
const population = document.getElementById('population');
const region = document.getElementById('region');
const regionFilter = document.getElementById('region-filter');
const favoriteButton = document.getElementById('favorite-btn');
const favoriteList = document.getElementById('favorite-list');
const favoritesSection = document.getElementById('favorites');
const suggestions = document.getElementById('suggestions');

let favoriteCountries = [];

async function fetchCountryInfo(country) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!response.ok) {
      throw new Error('Country not found');
    }
    const data = await response.json();
    displayCountryInfo(data[0]);
  } catch (error) {
    alert(error.message);
    resultContainer.classList.add('hidden');
  }
}

async function fetchCountriesByRegion(region) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    if (!response.ok) {
      throw new Error('Region not found');
    }
    const data = await response.json();
    populateSuggestions(data);
  } catch (error) {
    alert(error.message);
  }
}

function populateSuggestions(data) {
  suggestions.innerHTML = '';
  data.forEach(country => {
    const option = document.createElement('option');
    option.value = country.name.common;
    suggestions.appendChild(option);
  });
}

function displayCountryInfo(data) {
  countryName.textContent = data.name.common;
  flag.src = data.flags.png;
  flag.alt = `${data.name.common} flag`;
  capital.textContent = data.capital ? data.capital[0] : 'N/A';
  population.textContent = data.population.toLocaleString();
  region.textContent = data.region;
  resultContainer.classList.remove('hidden');
}

function addFavorite() {
  const country = countryName.textContent;
  if (country && !favoriteCountries.includes(country)) {
    favoriteCountries.push(country);
    updateFavoritesList();
  }
}

function updateFavoritesList() {
  favoriteList.innerHTML = '';
  favoriteCountries.forEach(country => {
    const li = document.createElement('li');
    li.textContent = country;
    favoriteList.appendChild(li);
  });
  favoritesSection.classList.remove('hidden');
}

function toggleFavorites() {
  if (favoritesSection.classList.contains('hidden')) {
    favoritesSection.classList.remove('hidden');
  } else {
    favoritesSection.classList.add('hidden');
  }
}

searchButton.addEventListener('click', () => {
  const country = searchInput.value.trim();
  if (country) {
    fetchCountryInfo(country);
  } else {
    alert('Please enter a country name');
  }
});

regionFilter.addEventListener('change', () => {
  const region = regionFilter.value;
  if (region) {
    fetchCountriesByRegion(region);
  }
});

favoriteButton.addEventListener('click', addFavorite);

// Autocomplete suggestions on input
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (query.length > 1) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
      if (response.ok) {
        const data = await response.json();
        populateSuggestions(data);
      }
    } catch {
      // Handle errors silently for autocomplete
    }
  }
});

// Add event listener for toggling the favorites section visibility
document.getElementById('toggle-favorites-btn').addEventListener('click', toggleFavorites);

