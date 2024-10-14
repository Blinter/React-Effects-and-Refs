// Deck.test.jsx

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Card from './Card';

jest.mock('axios');
describe('Card component', () => {
    const mockCardObject = {
        png: 'mock-image-url',
        image: 'mock-image-url',
        value: 'ACE',
        suit: 'SPADES',
        shown: true,
    };

    const mockRotation = 'rotateY(180deg)';

    beforeEach(() => {
        render(<Card
            cardObject={mockCardObject}
            rotation={mockRotation}
        />);
    });

    test('renders card container', () => {
        expect(screen.getByTestId('card-container')).toBeInTheDocument();
    });

    test('matches snapshot', () => {
        const { container } = render(<Card
            cardObject={mockCardObject}
            rotation={mockRotation}
        />);
        expect(container).toMatchSnapshot();
    });

    test('applies rotation style', () => {
        const cardFlipElement = document.querySelector('.card-flip');
        expect(cardFlipElement).toHaveStyle(`transform: ${mockRotation}`);
    });
});