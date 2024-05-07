function renderChart(currentPokemon) {
  const ctx = document.getElementById('myChart');
  let labels = [];
  let data = [];
  let backgroundColors = [];
  for (let c = 0; c < currentPokemon.stats.length; c++) {
    labels.push(currentPokemon.stats[c].stat.name);
    data.push(currentPokemon.stats[c].base_stat);

    // Farbe der Balken passend zum Typ des Pokemon
    let type = currentPokemon.types[0].type.name; 
    backgroundColors.push(typeColors[type]);
  }
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Points',
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}