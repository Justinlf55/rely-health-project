import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with role="status" for screen readers', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has accessible name via aria-label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status', { name: /Loading mission data/i })).toBeInTheDocument();
  });

  it('spinner element is aria-hidden', () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole('status');
    const hiddenEl = status.querySelector('[aria-hidden="true"]');
    expect(hiddenEl).toBeInTheDocument();
  });
});
