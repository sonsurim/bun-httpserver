import express from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import { PokemonResponse } from './types/PokemonResponse';
import { PokemonsResponse } from './types/PokemonsResponse';
import { Readable } from 'stream';

import Pokemon from './components/Pokemon';
import PokemonList from './components/PokemonList';

const app = express();

app.get('/pokemon', async (req, res) => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    const { results } = (await response.json()) as PokemonsResponse;

    const pokemonListHtml = renderToStaticMarkup(<PokemonList pokemon={results} />);

    const stream = new Readable();
    stream.push(pokemonListHtml);
    stream.push(null);

    res.set('Content-Type', 'text/html');
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/pokemon/:name', async (req, res) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.params.name}`);

    if (response.status === 404) {
      return res.status(404).send('Not Found');
    }

    const {
      height,
      name,
      weight,
      sprites: { front_default },
    } = (await response.json()) as PokemonResponse;

    const pokemonHtml = renderToStaticMarkup(
      <Pokemon name={name} height={height} weight={weight} img={front_default} />
    );

    const stream = new Readable();
    stream.push(pokemonHtml);
    stream.push(null);

    res.set('Content-Type', 'text/html');
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
