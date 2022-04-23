import React, { useState, useEffect } from 'react';
// import Card1 from './components/Card/Card1';
// import CardDetail from './components/Card/CardDetail';
import { getPokemon, getAllPokemon } from './services/pokemon';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom"
import List from './List';
import './components/Card/style.css';
import axios from 'axios';
import typeColors from './helpers/typeColors';
import pokemonColors from './helpers/bgcolor';
import Loader from './components/Loader';

function Home(){
  return <h2>Hallo</h2>
}

function App() {
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const initialURL = 'https://pokeapi.co/api/v2/pokemon'

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL)
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, [])

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon)
      return pokemonRecord
    }))
    setPokemonData(_pokemonData);
  }

  return (
    <Router>
    <>
      <div>
        {loading ? <h1 style={{ textAlign: 'center' }}>Loading...</h1> : (
          <>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
            <div className="grid-container">
              {pokemonData.map((pokemon, i) => {
                return <Cards key={i} pokemon={pokemon} />
              })}
            </div>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
          </>
        )}
      </div>
    <Routes>
    <Route exact path="/" component={List} />
    <Route path="/pokemon/:id" component={DetailPokemon}/>
    </Routes>
    </>
    </Router>
  );
}


function Cards({ pokemon }) {
  // const Card = ({ pokemon }) => {
  const pokemonColor = pokemonColors[pokemon.type];
  const bgStyles = { backgroundColor: pokemonColor};
  
      return (
        
      
          <Link to={`/pokemon/${pokemon.id}`}>
          <div className="Card" style={{ bgStyles }}>
              <div className="Card__img">
              <div className="number"><small>No.{pokemon.id}</small></div>
                  <img className='a' src={pokemon.sprites.front_default} alt="" />
              </div>
              <div className="Card__name">
                  {pokemon.name}
              </div>
              <div className="Card__types">
                  {
                      pokemon.types.map(type => {
                          return (
                              <div className="Card__type" style={{ backgroundColor: typeColors[type.type.name] }}>
                                  {type.type.name}
                              </div>
                          )
                      })
                  }
              </div>
          </div>
          </Link>
          
      )
  }

  // const DetailPokemon = ({ match }) => {
  function DetailPokemon({ match }){
    const [pokemonDetails, setPokemonDetails] = useState();
    const [loading, setLoading] = useState(true);

    const id = match.params.id;

    const getPokemon = async (id) => {
        const details = await getPokemonData(id);
        setPokemonDetails(details.data);
        console.log(details.data)
        setLoading(false);
    }

    const getPokemonData = async (id) => {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return res;
    }

    useEffect(() => {
        getPokemon(id);
    }, [])

    return (
        <>
         {loading ? (
                <Loader/>
            ) : (
             <div className="Card__info">
                  <div className="Card__data Card__data--weight">
                      <p className="title">Weight</p>
                      <p>{pokemonDetails.weight}</p>
                  </div>
                  <div className="Card__data Card__data--weight">
                      <p className="title">Height</p>
                      <p>{pokemonDetails.height}</p>
                  </div>
                  <div className="Card__data Card__data--ability">
                      <p className="title">Ability</p>
                      <p>{pokemonDetails.abilities[0].ability.name}</p>
                  </div>
              </div> 
            )}
        </>
    )
}

export default App;
