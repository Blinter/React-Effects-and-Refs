// Deck.test.jsx

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Deck from './Deck';

jest.mock('axios');

describe('Deck component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('fetches new deck on mount', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        render(<Deck />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        });
    });

    test('displays remaining cards count', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        render(<Deck />);

        await waitFor(() => {
            const remainingCount = screen.getByText(/Remaining: \d+/);
            expect(remainingCount).toBeInTheDocument();
            expect(remainingCount).toHaveTextContent('Remaining: 52');
        });
    });

    test('draws a card when Draw button is clicked', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{
                    png: 'image_url',
                    image: 'image_url',
                    value: 'ACE',
                    suit: 'SPADES',
                    code: 'AS'
                }],
                remaining: 51
            }
        });

        render(<Deck />);

        await waitFor(() => {
            expect(screen.getByText('Remaining: 52')).toBeInTheDocument();
        });

        const drawButton = screen.getByRole('button', { name: 'Draw a card' });
        expect(drawButton).toHaveAttribute('aria-label', 'Draw a card');
        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('https://deckofcardsapi.com/api/deck/test_deck_id/draw/?count=1');
            expect(screen.getByText('Remaining: 51')).toBeInTheDocument();
        });
    });

    test('clears the deck when Clear button is clicked', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        render(<Deck />);

        await waitFor(() => {
            expect(screen.getByText('Remaining: 52')).toBeInTheDocument();
        });

        const clearButton = screen.getByRole('button', { name: /clear/i });
        expect(clearButton).toHaveAttribute('aria-label', 'Clear the deck');
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(screen.getByText('Remaining: -1')).toBeInTheDocument();
        });
    });

    test('enables and disables auto-draw', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        render(<Deck />);

        await waitFor(() => {
            expect(screen.getByText('Remaining: 52')).toBeInTheDocument();
        });

        const autoDrawButton = screen.getByRole('button', { name: /auto draw/i });
        expect(autoDrawButton).toHaveAttribute('aria-label', 'Start Auto Draw');
        expect(autoDrawButton).toHaveTextContent('Start Auto Draw');

        fireEvent.click(autoDrawButton);
        expect(autoDrawButton).toHaveTextContent('Stop Auto Draw');

        fireEvent.click(autoDrawButton);
        expect(autoDrawButton).toHaveTextContent('Start Auto Draw');
    });

    test('alerts when out of cards', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 0 }
        });

        window.alert = jest.fn();

        render(<Deck />);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('You are out of cards!');
        });
    });

    test('matches initial snapshot', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        const { container } = render(<Deck />);
        await waitFor(() => {
            expect(container).toMatchSnapshot();
        });
    });

    test('matches snapshot after drawing a card', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        axios.get.mockResolvedValueOnce({
            data: {
                cards: [{
                    png: 'image_url',
                    image: 'image_url',
                    value: 'ACE',
                    suit: 'SPADES',
                    code: 'AS'
                }],
                remaining: 51
            }
        });

        const { container } = render(<Deck />);
        await waitFor(() => {
            expect(screen.getByText('Remaining: 52')).toBeInTheDocument();
        });

        const drawButton = screen.getByRole('button', { name: 'Draw a card' });
        fireEvent.click(drawButton);

        await waitFor(() => {
            expect(container).toMatchSnapshot();
        });
    });

    test('matches snapshot after clearing the deck', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 52 }
        });

        const { container } = render(<Deck />);
        await waitFor(() => {
            expect(screen.getByText('Remaining: 52')).toBeInTheDocument();
        });

        const clearButton = screen.getByRole('button', { name: /clear/i });
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(container).toMatchSnapshot();
        });
    });

    test('matches snapshot when out of cards', async () => {
        axios.get.mockResolvedValueOnce({
            data: { deck_id: 'test_deck_id', remaining: 0 }
        });

        const { container } = render(<Deck />);
        await waitFor(() => {
            expect(container).toMatchSnapshot();
        });
    });

});
