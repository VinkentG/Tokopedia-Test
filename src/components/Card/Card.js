import React from 'react';
import typeColors from '../../helpers/typeColors';
import pokemonColors from '../../helpers/bgcolor';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './style.css';

function Card({ pokemon }) {
// const { pokemon } = props;
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

export default Card;

