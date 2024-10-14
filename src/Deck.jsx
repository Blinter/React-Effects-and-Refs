import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Deck.css';
import { v4 as uuidv4 } from 'uuid';
import DeckControls from './DeckControls';
import Card from './Card';
import useInterval from './useInterval';

function Deck() {
    const [deck, setDeck] = useState([]);
    const [deckId, setDeckId] = useState(null);
    const [cardsLeft, setCardsLeft] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [rotations, setRotations] = useState([]);
    const [autoDrawEnabled, setAutoDrawEnabled] = useState(false);

    const toggleAutoDraw = () => {
        setAutoDrawEnabled(prevEnable => !prevEnable);
    };

    useInterval(
        () => {
            if (cardsLeft > 0)
                if (deckId == null)
                    showCard();
                else
                    addCard();
            else
                setAutoDrawEnabled(false);
        },
        autoDrawEnabled ? 500 : null
    );

    const generateRotation = () => {
        return `rotate(${Math.floor(Math.random() * 360)}deg)`;
    };

    const addCard = async () => {
        if (deckId === null) {
            console.error("deckId is null!");
            return;
        }

        try {
            const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            if (!response ||
                !response.data) {
                throw new Error('Invalid API response');
            }
            if (response == null)
                return;
            const deckData = response.data;
            if (!deckData ||
                !deckData.cards ||
                deckData.cards.length === 0) {
                throw new Error('No cards in API response');
            }
            setCardsLeft(response.data.remaining);

            const fetchedCard = deckData.cards[0];
            const { images, code, value, suit } = fetchedCard;

            const newCard = {
                png: images?.png || fetchedCard.image || '',
                code,
                value,
                suit,
                remaining: deckData.remaining,
                shown: true,
                rotationIndex: deck.length
            };

            setRotations([...rotations, generateRotation()]);
            setDeck(previousDeck => [...previousDeck, newCard]);
        } catch (error) {
            console.error('Error fetching card:', error);
        }
    };

    const showCard = () => {
        // console.log(deck);
        if (cardsLeft >= 0 &&
            cardsLeft <= deck.length) {
            deck[deck.length - cardsLeft].shown = true;
            setDeck([...deck]);
            setCardsLeft(prev => prev - 1);
        } else {
            console.warn("Invalid cardsLeft index:", cardsLeft);
        }
    };

    const getRemaining = () => cardsLeft;

    const remainingCards = getRemaining();

    const shuffledArray = prevDeck => {
        const uniqueCards = new Set(prevDeck);
        const shuffledDeck = Array.from(uniqueCards);
        for (let i = shuffledDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledDeck[i], shuffledDeck[j]] =
                [shuffledDeck[j], shuffledDeck[i]];
        }
        shuffledDeck.forEach((card, index) => {
            card.shown = false;
            card.remaining = shuffledDeck.length - index - 1;
            card.rotationIndex = index;
        });
        setRotations(Array.from({ length: 52 }, () =>
            generateRotation()));
        setCardsLeft(52);
        return shuffledDeck;
    };

    const fetchNewDeck = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');

            if (!response ||
                !response.data) {
                throw new Error('Invalid API response');
            }

            const deckData = response.data;

            if (!deckData ||
                !deckData.deck_id ||
                !deckData.remaining) {
                throw new Error('Unexpected API response format');
            }

            if (deckData.deck_id != null) {
                setDeckId(deckData.deck_id);
                setDeck([]);
                setCardsLeft(deckData.remaining);
            }
        } catch (error) {
            console.error('Error fetching new deck:', error.message);
            setDeckId(null);
            setDeck([]);
            setCardsLeft(-1);
        } finally {
            setIsLoading(false);
        }
    };

    const clearDeck = () => {
        setDeck([]);
        setDeckId(null);
        setCardsLeft(-1);
        setRotations([]);
    };

    const clearAndFetchNewDeck = () => {
        setDeck([]);
        setDeckId(null);
        setCardsLeft(-1);
        setRotations([]);
        fetchNewDeck();
    };

    const shuffleDeck = () => {
        if (deck.length === 0) {
            fetchNewDeck();
        } else {
            setDeckId(null);
            setDeck(prevDeck => shuffledArray(prevDeck));
        }
    }


    useEffect(() => {
        if (cardsLeft === 0) {
            alert("You are out of cards!");
        }
    }, [cardsLeft]);

    useEffect(() => {
        let isMounted = true;
        const fetchNewDeck = async () => {
            if (!isMounted) return;
            setIsLoading(true);
            clearDeck();

            try {
                const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                const deckData = response.data;

                if (isMounted && deckData.deck_id != null) {
                    setDeckId(deckData.deck_id);
                    setDeck([]);
                    setCardsLeft(deckData.remaining);
                }
            } catch (error) {
                console.error('Error fetching new deck:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchNewDeck();

        return () => {
            isMounted = false;
        };
    }, []);
    return (
        <>
            <h1>
                Card Flipper
            </h1>
            {isLoading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <DeckControls
                        deckId={deckId}
                        deckState={deck}
                        shuffle={shuffleDeck}
                        clear={clearAndFetchNewDeck}
                        add={addCard}
                        show={showCard}
                        remaining={remainingCards}
                        toggleAutoDraw={toggleAutoDraw}
                        autoDrawEnabled={autoDrawEnabled}
                    />
                    <div className="cards">
                        {deck.map(currentCard => (
                            <Card
                                key={uuidv4()}
                                cardObject={currentCard}
                                rotation={rotations[currentCard.rotationIndex] || 'rotate(0deg)'}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default Deck;