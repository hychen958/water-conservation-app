import React, { useState } from 'react';
import './styles.css';

const characters = [
  { id: 1, name: 'Adam', imgSrc: './images/char1.jpg' },
  { id: 2, name: 'Alex', imgSrc: '/images/char2.jpg' },
  { id: 3, name: 'Amelia', imgSrc: '/images/char3.jpg' },
  { id: 4, name: 'Bob', imgSrc: '/images/char4.jpg' },
];

const CharacterSelection = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const selectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  const completeSelection = () => {
    if (selectedCharacter) {
      alert(`You selected: ${selectedCharacter.name}`);
    } else {
      alert('Please select a character before proceeding!');
    }
  };

  return (
    <div>
      <h1>Select Your Character</h1>
      <div className="container">
        <div className="character-grid">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
              onClick={() => selectCharacter(character)}
            >
              <img src={character.imgSrc} alt={character.name} />
              <p>{character.name}</p>
            </div>
          ))}
        </div>
        <button className="complete-button" onClick={completeSelection}>
          Complete
        </button>
      </div>
    </div>
  );
};

export default CharacterSelection;
