import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import MissionTablePagination from '../MissionTablePagination';

describe('MissionTablePagination', () => {
  it('renders page info text', () => {
    render(<MissionTablePagination page={0} totalPages={5} onPageChange={vi.fn()} />);
    // There are TWO elements with this text: the visible span and the aria-live div
    expect(screen.getAllByText('Page 1 of 5').length).toBe(2);
  });

  it('has role="navigation" and aria-label', () => {
    render(<MissionTablePagination page={0} totalPages={5} onPageChange={vi.fn()} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Table pagination');
  });

  it('First and Previous buttons are disabled on page 0', () => {
    render(<MissionTablePagination page={0} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('Last and Next buttons are disabled on the last page', () => {
    render(<MissionTablePagination page={4} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('First and Previous buttons are enabled when not on page 0', () => {
    render(<MissionTablePagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'First page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
  });

  it('Last and Next buttons are enabled when not on last page', () => {
    render(<MissionTablePagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Last page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
  });

  it('clicking Next calls onPageChange with page + 1', async () => {
    const onPageChange = vi.fn();
    render(<MissionTablePagination page={2} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('clicking Previous calls onPageChange with page - 1', async () => {
    const onPageChange = vi.fn();
    render(<MissionTablePagination page={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('clicking First calls onPageChange with 0', async () => {
    const onPageChange = vi.fn();
    render(<MissionTablePagination page={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'First page' }));
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('clicking Last calls onPageChange with totalPages - 1', async () => {
    const onPageChange = vi.fn();
    render(<MissionTablePagination page={1} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('has an aria-live region announcing the current page', () => {
    render(<MissionTablePagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion?.textContent).toContain('Page 2 of 5');
  });
});
