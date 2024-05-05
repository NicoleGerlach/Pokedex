let pokemons = [];
let currentIndex;
let currentNames = [];

const typColors = {
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
        loadTypColor(pokemon, i);
        renderPokemonTypes(i, `pokemon-type-box${i}`);
        loadTypeColorForDetailView(pokemon);
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
    pokemonTypes.forEach((oneType) => {
        typeNameCapitalized = capitalizeName(oneType.type.name);
        pokemonTypeBox.innerHTML += `<div class="type-box">${typeNameCapitalized}</div>`;
    });
}

function openPokemonCard(i) {
    document.getElementById('dialog').classList.remove('d-none');
    let pokemonContainer = document.getElementById('dialog');
    let currentPokemon = pokemons[i];
    pokemonContainer.innerHTML = generatePokemonCardHtml(i, currentPokemon);
    renderPokemonTypes(i, `pokemon-type-container${i}`)
    addPokemonAbilities(i, currentPokemon);
    // loadTypColor(currentPokemon);
    loadTypeColorForDetailView(currentPokemon);
    renderChart(currentPokemon);
}

function toggleLoadingScreen(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    let button = document.getElementById('loadButton');
    if (show) {
        loadingSpinner.classList.remove('d-none');
        button.classList.add('d-none');
    } else {
        loadingSpinner.classList.add('d-none');
        button.classList.remove('d-none');
    }
}

function dontClose(event) {
    event.stopPropagation();
}

function closePokemonCard() {
    document.getElementById('dialog').classList.add('d-none');
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

function loadTypColor(pokemon, i) {
    let type = pokemon.types[0].type.name;
    let color = typColors[type];
    let pokemonCards = document.getElementsByClassName('pokemonCardSmall');
    if (pokemonCards[i]) {
        pokemonCards[i].style.backgroundColor = color;
    }
   let pokemonCard = document.getElementById('pokemonCard');
    if (pokemonCard) {
        pokemonCard.style.backgroundColor = color;
    }
}

function loadTypeColorForDetailView(pokemon) {
    const allCurrentTypes = pokemon.types;
    const firstType = allCurrentTypes[0].type.name;
    const firstTypeColor = typColors[firstType];
    const pokemonCard = document.getElementById('pokemonCard');
    if (pokemonCard) {
        pokemonCard.style.backgroundColor = firstTypeColor;
        const pokemonTypeBoxes = pokemonCard.querySelectorAll('.type-box');
        pokemonTypeBoxes.forEach((box, index) => {
            const typeName = allCurrentTypes[index].type.name;
            const boxColor = typColors[typeName];
            box.style.backgroundColor = boxColor;
        });
    }
}

function loadTypColorForChart(pokemon, i) {
    let type = pokemon.types[i].type.name;
    if (typColors[type]) {
        let color = typColors[type];
        let chartElement = document.getElementById('chartElement' + i);
        if (chartElement) {
            chartElement.style.backgroundColor = color;
        }
    }
}

async function loadMorePokemon() {
    let offset = pokemons.length;
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
    let response = await fetch(url);
    let newPokemons = await response.json();
    for (let j = 0; j < newPokemons.results.length; j++) {
        let urlPokemon = newPokemons.results[j].url;
        let responsePokemon = await fetch(urlPokemon);
        let pokemonData = await responsePokemon.json();
        pokemons.push(pokemonData);
        let newIndex = offset + j;
        renderNewPokemon(newIndex);
        loadTypColor(pokemonData, newIndex);
        // renderPokemonTypes(newIndex);
    }
}

async function renderNewPokemon(index) {
    let pokemonContainer = document.getElementById('content');
    let pokemon = pokemons[index];
    pokemonContainer.innerHTML += generatePokemonHtml(index, pokemon);
    renderPokemonNames();
    renderPokemonTypes(index, `pokemon-type-box${index}`);
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
}

function previousPokemonCard(i) {
    currentIndex = (i - 1 + pokemons.length) % pokemons.length;
    openPokemonCard(currentIndex);
}

function capitalizeName(name) {
    return name.split('-').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('-');
}

function handleSearch() {
    let filterWord = document.getElementById('searchInput').value.trim();
    if (filterWord.length > 0 &&  filterWord.length < 3) {
        pokemons.forEach((pokemon, i) => {
            document.getElementById(`pokemon-${i}`).style.displax = 'flex';
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
        document.getElementById(`pokemon-${i}`).classList.add('d-none');
    });
    searchNames.forEach((name) => {
        let index = currentNames.indexOf(name);
        document.getElementById(`pokemon-${index}`).classList.remove('d-none');
    });
}

function deleteCharactersOfInput(i) {
    document.getElementById('searchInput').value = '';
    handleSearch();
}
