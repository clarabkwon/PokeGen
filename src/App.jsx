import { useEffect, useState } from 'react'
import heartLogo from './assets/heart_info.png'
import signInfo from './assets/sign_info.png'
import correctBox from './assets/correct_box.png'
import incorrectBox from './assets/incorrect_box.png'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [nameVisible, setNameVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [guessRecorded, setGuessRecorded] = useState(false)

  async function fetchPokemon() {
    const pokemonId = Math.floor(Math.random() * 1000) + 1
    setLoading(true)
    setError(null)
    setNameVisible(false)
    setGuessRecorded(false)

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
      )
      if (!response.ok) {
        throw new Error('Pokemon not found')
      }

      const data = await response.json()
      setPokemon({
        name: data.name,
        sprite: data.sprites.front_default,
      })
    } catch (err) {
      console.error(err)
      setPokemon(null)
      setError('Could not fetch a Pokemon. Try again!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!infoOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setInfoOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [infoOpen])

  const canRecordGuess = Boolean(pokemon && nameVisible && !guessRecorded)

  function recordGuess(isCorrect) {
    if (!canRecordGuess) return

    if (isCorrect) {
      setCorrectCount((count) => count + 1)
    } else {
      setIncorrectCount((count) => count + 1)
    }
    setGuessRecorded(true)
  }

  function restartScore() {
    setCorrectCount(0)
    setIncorrectCount(0)
  }

  return (
    <main className="app">
      <button
        type="button"
        className="heartLogoButton"
        aria-label="About PokeGen"
        aria-expanded={infoOpen}
        onClick={() => setInfoOpen((open) => !open)}
      >
        <img src={heartLogo} alt="" className="heartLogo" />
      </button>

      <h1 className="title">PokeGen</h1>

      <div className="fetchButton">
        <button id="fetchText" onClick={fetchPokemon} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Pokemon'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {pokemon?.sprite && (
        <div className="pokemonImg">
          <img src={pokemon.sprite} alt={pokemon.name} id="pokemonSprite" />
        </div>
      )}

      {pokemon && (
        <div className="pokemonNameClass">
          {!nameVisible ? (
            <button
              id="pokemonNameButton"
              onClick={() => setNameVisible(true)}
            >
              Show Pokemon Name
            </button>
          ) : (
            <p id="pokemonName" className="show">
              The name of the pokemon is: {pokemon.name}
            </p>
          )}
        </div>
      )}

      {pokemon && (
        <section className="scoreboard" aria-label="Guess score">
          <button
            type="button"
            className="scoreBox"
            onClick={() => recordGuess(true)}
            disabled={!canRecordGuess}
            aria-label="Mark guess as correct"
          >
            <img src={correctBox} alt="" className="scoreBoxImage" />
            <span className="scoreCount">{correctCount}</span>
          </button>
          <button
            type="button"
            className="scoreBox"
            onClick={() => recordGuess(false)}
            disabled={!canRecordGuess}
            aria-label="Mark guess as incorrect"
          >
            <img src={incorrectBox} alt="" className="scoreBoxImage" />
            <span className="scoreCount">{incorrectCount}</span>
          </button>
          <button type="button" className="restartButton" onClick={restartScore}>
            Restart
          </button>
        </section>
      )}

      {infoOpen && (
        <div
          className="infoOverlay"
          onClick={() => setInfoOpen(false)}
        >
          <div
            className="infoBox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="infoTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={signInfo} alt="" className="infoSign" />
            <div className="infoSignText">
              <h2 id="infoTitle">What is PokeGen?</h2>
              <p>
                A random Pokemon generator. Fetch one, then reveal its name!
              </p>
            </div>
            <button
              type="button"
              className="infoClose"
              onClick={() => setInfoOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
