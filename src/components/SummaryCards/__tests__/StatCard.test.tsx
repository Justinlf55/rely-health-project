import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Missions" value="1,234" icon="🚀" />);
    expect(screen.getByText('Total Missions')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('has aria-label combining label and value', () => {
    render(<StatCard label="Success Rate" value="87.5%" icon="✅" />);
    expect(screen.getByRole('article', { name: 'Success Rate: 87.5%' })).toBeInTheDocument();
  });

  it('renders icon with aria-hidden', () => {
    render(<StatCard label="Total" value="10" icon="🚀" />);
    const icon = screen.getByText('🚀');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
