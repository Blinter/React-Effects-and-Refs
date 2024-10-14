// DeckControls.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './DeckControls.css';

function DeckControls({
    deckId,
    deckState,
    shuffle,
    clear,
    add,
    show,
    remaining,
    toggleAutoDraw,
    autoDrawEnabled
}) {
    const newCard = () =>
        deckId !== null ?
            add() :
            show();

    const RemainingCards = () => {
        return (
            <>
                <p>Remaining: {remaining}</p>
            </>
        );
    }

    const findNextAction = () => {
        if (deckState.length === 0 && deckId == null) {
            return (
                <button
                    onClick={clear}
                    aria-label='Clear the deck'
                >
                    Get New Deck
                </button>
            );
        }
        const lastCard = deckState.at(-1);
        if ((deckId != null &&
            lastCard != null &&
            lastCard.remaining === 0) ||
            (deckId == null &&
                remaining === 0)) {
            return (
                <>
                    <button
                        onClick={shuffle}
                        onMouseOver={e =>
                            e.currentTarget.style.backgroundColor = 'lightblue'}
                        onMouseOut={e =>
                            e.currentTarget.style.backgroundColor = ''}
                        aria-label="Shuffle the deck"
                    >Shuffle</button>
                    |
                    <button
                        onClick={clear}
                        onMouseOver={e =>
                            e.currentTarget.style.backgroundColor = 'lightblue'}
                        onMouseOut={e =>
                            e.currentTarget.style.backgroundColor = ''}
                        aria-label='Clear the deck'
                    >Clear</button>
                </>
            );
        }

        return (
            <>
                <button
                    onClick={newCard}
                    onMouseOver={e =>
                        e.currentTarget.style.backgroundColor = 'lightblue'}
                    onMouseOut={e =>
                        e.currentTarget.style.backgroundColor = ''}
                    aria-label="Draw a card"
                >Draw</button>
                |
                <button
                    onClick={clear}
                    onMouseOver={e =>
                        e.currentTarget.style.backgroundColor = 'lightblue'}
                    onMouseOut={e =>
                        e.currentTarget.style.backgroundColor = ''}
                    aria-label='Clear the deck'
                >Clear</button>
                |
                <button
                    onClick={toggleAutoDraw}
                    style={{
                        backgroundColor: autoDrawEnabled ?
                            'lightgreen' :
                            ''
                    }}
                    aria-label={autoDrawEnabled ?
                        'Stop Auto Draw' :
                        'Start Auto Draw'}
                >
                    {autoDrawEnabled ?
                        'Stop Auto Draw' :
                        'Start Auto Draw'}
                </button >
            </>
        );
    }

    return (
        <div className="deck-controls">
            {findNextAction()}
            <p className="remaining-cards">Remaining: {remaining}</p>
        </div>
    );
}

DeckControls.propTypes = {
    deckId: PropTypes.string,
    deckState: PropTypes.array.isRequired,
    shuffle: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    remaining: PropTypes.number.isRequired,
    toggleAutoDraw: PropTypes.func.isRequired,
    autoDrawEnabled: PropTypes.bool.isRequired
};

export default DeckControls;