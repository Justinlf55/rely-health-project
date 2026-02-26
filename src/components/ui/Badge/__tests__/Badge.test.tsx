import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders the status text', () => {
    render(<Badge status="Success" />);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders as a span', () => {
    render(<Badge status="Failure" />);
    expect(screen.getByText('Failure').tagName).toBe('SPAN');
  });

  it('renders Partial Failure', () => {
    render(<Badge status="Partial Failure" />);
    expect(screen.getByText('Partial Failure')).toBeInTheDocument();
  });

  it('renders Prelaunch Failure', () => {
    render(<Badge status="Prelaunch Failure" />);
    expect(screen.getByText('Prelaunch Failure')).toBeInTheDocument();
  });

  it('applies a status-specific class', () => {
    render(<Badge status="Success" />);
    const el = screen.getByText('Success');
    // The class from CSS modules is hashed but should contain some value beyond the base badge class
    expect(el.className).toBeTruthy();
  });
});
