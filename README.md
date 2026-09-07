# PokeGen

A Next.js web app that generates a random Pokémon, lets you reveal its name, and shows a personality quote.

> Can be viewed at https://pokegen-rho.vercel.app

## Features

- Fetches a random Pokémon from IDs 1–1000
- Displays the Pokémon's sprite
- Hides the Pokémon's name until you choose to reveal it
- Shows an AI personality quote (falls back to Pokédex flavor text if no API key is set)
- Styled with the Press Start 2P font for a retro Pokémon feel

## Built With

- [Next.js](https://nextjs.org/) (App Router)
- React
- JavaScript
- [PokéAPI](https://pokeapi.co/) — free Pokémon data API
- Optional [OpenAI](https://platform.openai.com/) for AI quotes
- background image from Pinterest

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pokegen.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

To enable AI-generated quotes, copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. Without that key, quotes use English Pokédex flavor text from PokéAPI.

## License

This project is open source and available under the [MIT License](LICENSE).
