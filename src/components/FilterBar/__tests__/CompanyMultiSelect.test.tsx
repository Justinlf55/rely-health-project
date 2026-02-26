import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import CompanyMultiSelect from '../CompanyMultiSelect';

const COMPANIES = ['Alpha Corp', 'Beta Inc', 'Gamma LLC'];

describe('CompanyMultiSelect', () => {
  it('renders trigger button with aria-label', () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter by company' })).toBeInTheDocument();
  });

  it('shows "All Companies" when nothing selected', () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    expect(screen.getByText('All Companies')).toBeInTheDocument();
  });

  it('shows selected count when companies are selected', () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={['Alpha Corp']} onChange={vi.fn()} />);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('opens dropdown on button click', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('trigger has aria-haspopup="listbox"', () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter by company' })).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('trigger aria-expanded is false initially', () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filter by company' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on Enter key', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Filter by company' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('search input has aria-label', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    expect(screen.getByLabelText('Search companies')).toBeInTheDocument();
  });

  it('each company option has role="option"', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(COMPANIES.length);
  });

  it('selected company has aria-selected="true"', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={['Alpha Corp']} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    const selectedOption = screen.getByRole('option', { name: /Alpha Corp/ });
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onChange when an option is clicked', async () => {
    const onChange = vi.fn();
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    await userEvent.click(screen.getByRole('option', { name: /Alpha Corp/ }));
    expect(onChange).toHaveBeenCalledWith(['Alpha Corp']);
  });

  it('ArrowDown key focuses next option', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    const listbox = screen.getByRole('listbox');
    // Dispatch ArrowDown directly on the listbox which holds the onKeyDown handler
    fireEvent.keyDown(listbox, { key: 'ArrowDown', code: 'ArrowDown' });
    // First option should become focused (focusedIndex moves to 0)
    const options = screen.getAllByRole('option');
    expect(options[0].tabIndex).toBe(0);
  });

  it('Escape closes the dropdown', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    // Dispatch Escape directly on the listbox which holds the onKeyDown handler
    fireEvent.keyDown(listbox, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Select All calls onChange with all companies', async () => {
    const onChange = vi.fn();
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    await userEvent.click(screen.getByRole('button', { name: 'Select All' }));
    expect(onChange).toHaveBeenCalledWith(COMPANIES);
  });

  it('Clear calls onChange with empty array', async () => {
    const onChange = vi.fn();
    render(<CompanyMultiSelect companies={COMPANIES} selected={COMPANIES} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('Done button closes the dropdown', async () => {
    render(<CompanyMultiSelect companies={COMPANIES} selected={[]} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by company' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
