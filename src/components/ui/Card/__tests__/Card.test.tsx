import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    render(<Card>Content</Card>);
    const el = screen.getByText('Content');
    expect(el.tagName).toBe('DIV');
  });

  it('renders as specified element via as prop', () => {
    render(<Card as="article">Content</Card>);
    const el = screen.getByText('Content');
    expect(el.tagName).toBe('ARTICLE');
  });

  it('merges className with card styles', () => {
    render(<Card className="extra">Content</Card>);
    const el = screen.getByText('Content');
    expect(el.className).toContain('extra');
  });

  it('passes through additional props', () => {
    render(<Card aria-label="my card">Content</Card>);
    expect(screen.getByLabelText('my card')).toBeInTheDocument();
  });
});
