let pokemons = [];
let currentIndex;
let currentNames = [];
let isFirstPokemon = false;
let isLastPokemon = false;

const typeColors = {
    fire: '#FF421C',
    water: '#2C9BE3',
    bug: '#92C12A',
    electric: '#FFDC00',
    steel: '#BBAA66',
    fairy: '#EC8FE6',
    normal: '#BBBBAA',
    grass: '#62BC5A',
    poison: '#9553CD',
    flying: '#96CAFF',
    ground: '#A67439',
    fighting: '#BB5544',
    psychic: '#FF6380',
    rock: '#BBAA66',
    ghost: '#6E4370',
    ice: '#74CFC0',
    dragon: '#5670BE',
    dark: '#222222',
};

async function fetchData(url) {
    try {
        toggleLoadingScreen(true);
        let response = await fetch(url);
        let data = await response.json();
        toggleLoadingScreen(false);
        return data;
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        toggleLoadingScreen(false);
    }
}

async function loadPokemon() {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`;
    currentPokemon = await fetchData(url);
    for (let i = 0; i < currentPokemon.results.length; i++) {
        let urlPokemon = currentPokemon.results[i].url;
        let pokemonData = await fetchData(urlPokemon);
        pokemons.push(pokemonData);
    }
    renderPokemons();
}

function renderPokemons() {
    let pokemonContainer = document.getElementById('content');
    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        pokemonContainer.innerHTML += generatePokemonHtml(i, pokemon);
        renderPokemonTypes(i, `pokemon-type-box${i}`);
        loadBackgroundColor(pokemon, i);
    }
    renderPokemonNames();
}

function renderPokemonNames() {
    for (let n = 0; n < pokemons.length; n++) {
        let currentName = pokemons[n].name.toLowerCase();
        if (!currentNames.includes(currentName)) {
            currentNames.push(currentName);
        }
    }
}

function renderPokemonTypes(i, id) {
    const pokemonTypeBox = document.getElementById(id);
    pokemonTypeBox.innerHTML = '';
    let pokemonTypes = pokemons[i].types;
    pokemonTypes.forEach((oneType, index) => {
        typeNameCapitalized = capitalizeName(oneType.type.name);
        pokemonTypeBox.innerHTML += `<div id="pokemon-${i}${index}" class="type-box">${typeNameCapitalized}</div>`;
    });
    loadColorForTypesSmallCard(i, pokemonTypes);
    loadColorForTypesCard(i, pokemonTypes);
}

function openPokemonCard(i) {
    document.getElementById('dialog').classList.remove('d-none');
    let pokemonContainer = document.getElementById('dialog');
    let currentPokemon = pokemons[i];
    pokemonContainer.innerHTML = generatePokemonCardHtml(i, currentPokemon);
    document.body.style.overflow = 'hidden';
    renderPokemonTypes(i, `pokemon-type-container${i}`)
    addPokemonAbilities(i, currentPokemon);
    loadBackgroundColor(currentPokemon, i);
    loadColorForTypesCard(currentPokemon, i);
    renderChart(currentPokemon);
}

function toggleLoadingScreen(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    let button = document.getElementById('loadButton');
    let content = document.getElementById('content');
    if (show) {
        loadingSpinner.classList.remove('d-none');
        button.classList.add('d-none');
        content.classList.add('d-none');
    } else {
        loadingSpinner.classList.add('d-none');
        button.classList.remove('d-none');
        content.classList.remove('d-none');
    }
}

function dontClose(event) {
    event.stopPropagation();
}

function closePokemonCard() {
    document.getElementById('dialog').classList.add('d-none');
    document.body.style.overflow = 'unset';
}

function addPokemonAbilities(i, currentPokemon) {
    const abilityBox = document.getElementById(`abilities${i}`);
    abilityBox.innerHTML = '';
    currentPokemon.abilities.forEach((ability, index) => {
        let skill = capitalizeName(ability.ability.name);
        abilityBox.innerHTML += skill;
        if (index < currentPokemon.abilities.length - 1) {
            abilityBox.innerHTML += ', ';
        }
    });
}

function loadBackgroundColor(pokemon, i) {
    let type = pokemon.types[0].type.name;
    let color = typeColors[type];
    let pokemonCards = document.getElementsByClassName('pokemon-card-small');
    if (pokemonCards[i]) {
        pokemonCards[i].style.backgroundColor = color;
    }
    let pokemonCard = document.getElementById('pokemonCard');
    if (pokemonCard) {
        pokemonCard.style.backgroundColor = color;
    }
}

function loadColorForTypesSmallCard(i, types) {
    const pokemonTypeBox = document.getElementById(`pokemon-type-box${i}`);
    if (pokemonTypeBox) {
        types.forEach((type, index) => {
            const typeName = type.type.name;
            const boxColor = typeColors[typeName];
            const pokemonTypeBoxes = pokemonTypeBox.querySelectorAll('.type-box');
            pokemonTypeBoxes[index].style.backgroundColor = boxColor;
        });
    }
}

function loadColorForTypesCard(i, types) {
const pokemonTypeBoxCard = document.getElementById(`pokemon-type-container${i}`);
    if (pokemonTypeBoxCard) {
        types.forEach((type, index) => {
            const typeName = type.type.name;
            const boxColor = typeColors[typeName];
            const pokemonTypeBoxesCard = pokemonTypeBoxCard.querySelectorAll('.type-box');
            pokemonTypeBoxesCard[index].style.backgroundColor = boxColor;
        });
    }
}

function loadTypColorForChart(pokemon, i) {
    let type = pokemon.types[i].type.name;
    if (typeColors[type]) {
        let color = typeColors[type];
        let chartElement = document.getElementById('chartElement' + i);
        if (chartElement) {
            chartElement.style.backgroundColor = color;
        }
    }
}
async function loadMorePokemon() {
    toggleLoadingScreen(true);
    let offset = pokemons.length;
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
    let response = await fetch(url);
    let newPokemons = await response.json();
    for (let j = 0; j < newPokemons.results.length; j++) {
      await processPokemon(newPokemons.results[j], offset + j);
    }
    toggleLoadingScreen(false);
  }
  
  async function processPokemon(pokemon, newIndex) {
    let urlPokemon = pokemon.url;
    let responsePokemon = await fetch(urlPokemon);
    let pokemonData = await responsePokemon.json();
    pokemons.push(pokemonData);
    renderNewPokemon(newIndex, newIndex);
    loadBackgroundColor(pokemons[newIndex], pokemonData);
  }

async function renderNewPokemon(index) {
    let pokemonContainer = document.getElementById('content');
    let pokemon = pokemons[index];
    pokemonContainer.innerHTML += generatePokemonHtml(index, pokemon);
    renderPokemonNames();
    renderPokemonTypes(index, `pokemon-type-box${index}`);
    loadBackgroundColor(pokemon, index);
    loadColorForTypesCard(pokemon, index)
}

function toggleInfos(section) {
    let about = document.getElementById('about');
    let baseStats = document.getElementById('baseStats');
    let aboutFolder = document.getElementById('aboutFolder');
    let baseStatsFolder = document.getElementById('baseStatsFolder');
    if (section === 'about') {
        showSectionAbout(about, baseStats, aboutFolder, baseStatsFolder);
    } else if (section === 'baseStats') {
        showSectionBasestats(about, baseStats, aboutFolder, baseStatsFolder);
    }
}

function showSectionAbout(about, baseStats, aboutFolder, baseStatsFolder) {
    about.classList.remove('d-none');
    baseStats.classList.add('d-none');
    aboutFolder.classList.add('active');
    baseStatsFolder.classList.remove('active');
}

function showSectionBasestats(about, baseStats, aboutFolder, baseStatsFolder) {
    about.classList.add('d-none');
    baseStats.classList.remove('d-none');
    aboutFolder.classList.remove('active');
    baseStatsFolder.classList.add('active');
}

function nextPokemonCard(i) {
    currentIndex = (i + 1 + pokemons.length) % pokemons.length;
    openPokemonCard(currentIndex);
    if (isLastPokemon && currentIndex === 0) {
        closePokemonCard();
    }
    isLastPokemon = currentIndex === pokemons.length - 1;
}

function previousPokemonCard(i) {
    currentIndex = (i - 1 + pokemons.length) % pokemons.length;
    openPokemonCard(currentIndex);
    if (currentIndex === pokemons.length - 1) {
        closePokemonCard();
    }
}

function capitalizeName(name) {
    return name.split('-').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('-');
}

function handleSearch() {
    let filterWord = document.getElementById('searchInput').value.trim();
    if (filterWord.length > 0 && filterWord.length < 3) {
        pokemons.forEach((index, i) => {
            document.getElementById(`pokemonCardSmall${i}`).style.displax = 'flex';
        });
    } else {
        searchForPokemon(filterWord.toLowerCase());
    };
}

function searchForPokemon(filterWord) {
    let searchNames = currentNames.filter(function (name) {
        return name.includes(filterWord);
    });
    pokemons.forEach((pokemon, i) => {
        document.getElementById(`pokemonCardSmall${i}`).classList.add('d-none');
    });
    searchNames.forEach((name, i) => {
        let index = currentNames.indexOf(name);
        document.getElementById(`pokemonCardSmall${index}`).classList.remove('d-none');
    });
}

function deleteCharactersOfInput(i) {
    document.getElementById('searchInput').value = '';
    handleSearch();
}
