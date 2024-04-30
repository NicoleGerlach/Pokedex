function returnPokemonHtml(i, pokemon) {
    return `
        <div id="pokemon-${i}" class="pokemonCardSmall" onclick="openPokemonCard(${i})">
            <img class="pokemon-img" src="${pokemon.sprites.other.dream_world.front_default}">
            <h2 id="pokemonName" class="pokemon-name f-l">${pokemon.forms[0].name}</h2>
            <div class="type f-l">${pokemon.types[0].type.name}</div>
        </div>
    `;
}

function returnPokemonCardHtml(i, currentPokemon) {
    return `
    <div id="pokemonCard" onclick="dontClose(event)">
        <h1 class="f-l">${currentPokemon.name}</h1><div
        <div class="info-container">
            <img class="pokemon-img mt" src="${currentPokemon.sprites.other.dream_world.front_default}">
            <div class="arrow">
                <img onclick="previousPokemonCard(${i})" src="./img/linker-pfeil.png">
                <img onclick="nextPokemonCard(${i})" src="./img/rechter-pfeil.png">
            </div>
            <div class="d-f sp-a f-l card-style">${currentPokemon.types[0].type.name}</div>
            <div class="d-f sp-a m24">
                <div id="aboutFolder" onclick="toggleInfos('about')" class="ul-a active">About</div>
                <div id="baseStatsFolder" onclick="toggleInfos('baseStats')" class="ul-a">Base Stats</div>
            </div>
            <div id="about" class="d-f sp-a fd-c mlr24">
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
                        <td>
                            ${capitalizeName(currentPokemon.abilities[0].ability.name)}, 
                            ${capitalizeName(currentPokemon.abilities[1].ability.name)}
                        </td>
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