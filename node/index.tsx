import express from 'express';
import { PokemonResponse } from './types/PokemonResponse';
import { PokemonsResponse } from './types/PokemonsResponse';
import { renderToPipeableStream } from 'react-dom/server';
import Pokemon from './components/Pokemon';
import PokemonList from './components/PokemonList';

const app = express();

app.get('/pokemon', async (_, res) => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    const { results } = (await response.json()) as PokemonsResponse;

    const stream = await renderToPipeableStream(<PokemonList pokemon={results} />);

    res.set('Content-Type', 'text/html');
    stream.pipe(res)
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

    const stream = await renderToPipeableStream(
      <Pokemon name={name} height={height} weight={weight} img={front_default} />
    );

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
