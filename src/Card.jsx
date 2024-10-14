// Card.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Deck.css';

function Card({ cardObject, rotation }) {
    const { value, suit, shown } = cardObject;

    return (
        <div
            className="card-container" data-testid="card-container"
        >
            <div className={`card-flip ${shown ? 'flipped' : ''}`} style={{ transform: rotation }}>
                <div className="card-face card-back">
                    {/* Back of the card */}
                </div>
                <div className="card-face card-front">
                    {shown && (
                        <img
                            className="card-image"
                            src={cardObject.png}
                            style={{
                                color: "transparent"
                            }}
                            aria-label={`${value} of ${suit}`}
                            alt={`${value} of ${suit}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

Card.propTypes = {
    cardObject: PropTypes.shape({
        png: PropTypes.string,
        image: PropTypes.string,
        value: PropTypes.string.isRequired,
        suit: PropTypes.string.isRequired,
        shown: PropTypes.bool.isRequired,
    }).isRequired,
    rotation: PropTypes.string.isRequired,
};

export default Card;