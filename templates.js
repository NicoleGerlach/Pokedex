function generatePokemonHtml(i, pokemon) {
    return `
        <div id="pokemon-${i}" class="pokemonCardSmall shrink" onclick="openPokemonCard(${i})">
            <img class="pokemon-img" src="${pokemon.sprites.other.dream_world.front_default}">
            <h2 id="pokemonName" class="pokemon-name first-letter">${pokemon.forms[0].name}</h2>
            <div id="pokemon-type-box${i}" class="type"></div>
        </div>
    `;
}

function generatePokemonCardHtml(i, currentPokemon) {
    return `
    <div id="pokemonCard" onclick="dontClose(event)">
        <h1 class="first-letter">${currentPokemon.name}</h1><div
        <div class="info-container">
            <img class="pokemon-img margin-top" src="${currentPokemon.sprites.other.dream_world.front_default}">
            <div class="arrow">
                <img onclick="previousPokemonCard(${i})" src="./img/linker-pfeil.png">
                <img onclick="nextPokemonCard(${i})" src="./img/rechter-pfeil.png">
            </div>
            <div id="pokemon-type-container${i}" class="card-style">${currentPokemon.types[0].type.name}</div>
            <div class="type-area">
                <div id="aboutFolder" onclick="toggleInfos('about')" class="underline active">About</div>
                <div id="baseStatsFolder" onclick="toggleInfos('baseStats')" class="underline">Base Stats</div>
            </div>
            <div id="about" class="about">
                <table>
                    <tr>
                        <td>Height</td>
                        <td>${currentPokemon.height/10} m</td>
                    </tr>
                    <tr>
                        <td>Weight</td>
                        <td>${currentPokemon.weight/10} kg</td>
                    </tr>
                    <tr>
                        <td>Base Experience</td>
                        <td>${currentPokemon.base_experience}</td>
                    </tr>
                    <tr>
                        <td>Ability</td>
                        <td id="abilities${i}"></td>
                    </tr>
                </table>
            </div>
            <div id="baseStats" class="d-none">
                <canvas id="myChart">
            </canvas></div>
        </div>
    </div>
    `;
}