// App.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
    test('renders Deck component', () => {
        render(<App />);
    });
    test('matches snapshot', () => {
        const { container } = render(<App />);
        expect(container).toMatchSnapshot();
    });
});