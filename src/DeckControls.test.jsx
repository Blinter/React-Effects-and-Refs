import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import DeckControls from './DeckControls';

describe('DeckControls component', () => {
    const mockProps = {
        deckId: 'test-deck-id',
        deckState: [],
        shuffle: jest.fn(),
        clear: jest.fn(),
        add: jest.fn(),
        show: jest.fn(),
        remaining: 52,
        toggleAutoDraw: jest.fn(),
        autoDrawEnabled: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('matches snapshot', () => {
        const { container } =
            render(<DeckControls {...mockProps} />);
        expect(container).toMatchSnapshot();
    });

    test('renders Auto Draw button', () => {
        render(<DeckControls {...mockProps} />);

        const autoDrawButton = screen.getByRole('button', { name: /auto draw/i });
        expect(autoDrawButton).toBeInTheDocument();
    });

    test('displays correct Auto Draw button text when disabled', () => {
        render(<DeckControls {...mockProps} />);

        const autoDrawButton = screen.getByRole('button', { name: /start auto draw/i });
        expect(autoDrawButton).toHaveTextContent('Start Auto Draw');
    });

    test('displays correct Auto Draw button text when enabled', () => {
        mockProps.autoDrawEnabled = true;
        render(<DeckControls {...mockProps} />);

        const autoDrawButton = screen.getByRole('button', { name: /stop auto draw/i });
        expect(autoDrawButton).toHaveTextContent('Stop Auto Draw');
    });

    test('calls toggleAutoDraw when Auto Draw button is clicked', () => {
        render(<DeckControls {...mockProps} />);

        const autoDrawButton = screen.getByRole('button', { name: /auto draw/i });
        fireEvent.click(autoDrawButton);

        expect(mockProps.toggleAutoDraw).toHaveBeenCalledTimes(1);
    });

    test('applies correct style when Auto Draw is enabled', () => {
        mockProps.autoDrawEnabled = true;
        render(<DeckControls {...mockProps} />);

        const autoDrawButton = screen.getByRole('button', { name: /stop auto draw/i });
        expect(autoDrawButton).toHaveStyle('background-color: lightgreen');
    });

    test('renders remaining cards count', () => {
        render(<DeckControls {...mockProps} />);

        const remainingCount = screen.getByText(/Remaining: \d+/);
        expect(remainingCount).toBeInTheDocument();
        expect(remainingCount).toHaveTextContent('Remaining: 52');
    });

    test('updates remaining cards count when prop changes', () => {
        const { rerender } = render(<DeckControls {...mockProps} />);

        rerender(<DeckControls {...mockProps} remaining={30} />);

        const remainingCount = screen.getByText(/Remaining: \d+/);
        expect(remainingCount).toHaveTextContent('Remaining: 30');
    });
});