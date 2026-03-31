// Generate a random Pokemon ID between 1 and 1000 
document.getElementById("fetchText").addEventListener("click", () => {
  const rand = Math.floor(Math.random() * 1000) + 1;
  fetchData(rand);
});
document.getElementById("pokemonNameButton").style.display = "none";
// Toggle the visibility of the Pokemon name when the button is clicked
document.getElementById("pokemonNameButton").addEventListener("click", () => {
    const button = document.getElementById("pokemonNameButton");
        // When button is clicked, hide the button and show the Pokemon name
        button.style.display = "none";
        document.getElementById("pokemonName").classList.toggle("show");
    });

async function fetchData(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }
    // Pokemon sprite 
    const data = await response.json();
    const pokemonSprite = data.sprites.front_default;
    const imgElement = document.getElementById("pokemonSprite");
    imgElement.src = pokemonSprite;
    imgElement.style.display = "block";

    // Pokemon name
    const pokemonName = data.name;
    document.getElementById("pokemonName").textContent = `The name of the pokemon is: ${pokemonName}`;
    // Resets the visibility of the Pokemon name when a new Pokemon is fetched
    document.getElementById("pokemonName").className = "hide";
    // Resets the visibility of the button when a new Pokemon is fetched
    document.getElementById("pokemonNameButton").style.display = "block";
  } 
  catch (error) {
    console.error(error);
  }

}