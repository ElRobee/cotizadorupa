import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('shows login form initially', () => {
    render(<App />);
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });
});