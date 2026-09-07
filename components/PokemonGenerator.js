"use client";

import { useState } from "react";

export default function PokemonGenerator() {
  const [pokemon, setPokemon] = useState(null);
  const [revealedId, setRevealedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchPokemon() {
    const pokemonId = Math.floor(Math.random() * 1000) + 1;
    setLoading(true);
    setError("");
    setRevealedId(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
      );
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }

      const data = await response.json();
      setPokemon({
        id: data.id,
        name: data.name,
        sprite: data.sprites.front_default,
      });
    } catch (fetchError) {
      console.error(fetchError);
      setError("Could not fetch a Pokémon. Try again.");
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="fetchButton">
        <button id="fetchText" onClick={fetchPokemon} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Pokemon"}
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {pokemon?.sprite ? (
        <div className="pokemonImg">
          {/* PokéAPI sprites are remote URLs; keep a plain img for the original layout */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pokemon.sprite} alt="Pokemon Sprite" />
        </div>
      ) : null}

      <div className="pokemonNameClass">
        {pokemon && revealedId !== pokemon.id ? (
          <button id="pokemonNameButton" onClick={() => setRevealedId(pokemon.id)}>
            Show Pokemon Name
          </button>
        ) : null}

        {pokemon && revealedId === pokemon.id ? (
          <p id="pokemonName" className="show">
            The name of the pokemon is: {pokemon.name}
          </p>
        ) : null}
      </div>
    </main>
  );
}
