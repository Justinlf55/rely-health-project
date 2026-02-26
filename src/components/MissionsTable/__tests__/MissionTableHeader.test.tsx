import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import MissionTableHeader from '../MissionTableHeader';
import { SortDirection } from '../../../constants';
import type { SortState } from '../../../types/mission';

const noopSort: SortState = { key: '', direction: SortDirection.Asc };
const dateSortAsc: SortState = { key: 'Date', direction: SortDirection.Asc };
const dateSortDesc: SortState = { key: 'Date', direction: SortDirection.Desc };

const renderHeader = (sortState: SortState, onSort = vi.fn()) =>
  render(
    <table>
      <MissionTableHeader sortState={sortState} onSort={onSort} />
    </table>,
  );

describe('MissionTableHeader', () => {
  it('renders all 7 column headers', () => {
    renderHeader(noopSort);
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
  });

  it('all column headers have tabIndex=0', () => {
    renderHeader(noopSort);
    const headers = screen.getAllByRole('columnheader');
    headers.forEach((h) => expect(h).toHaveAttribute('tabindex', '0'));
  });

  it('column headers have scope="col"', () => {
    renderHeader(noopSort);
    const headers = screen.getAllByRole('columnheader');
    headers.forEach((h) => expect(h).toHaveAttribute('scope', 'col'));
  });

  it('unsorted column has aria-sort="none"', () => {
    renderHeader(noopSort);
    const dateHeader = screen.getByRole('columnheader', { name: /Date/ });
    expect(dateHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('sorted ascending column has aria-sort="ascending"', () => {
    renderHeader(dateSortAsc);
    const dateHeader = screen.getByRole('columnheader', { name: /Date/ });
    expect(dateHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sorted descending column has aria-sort="descending"', () => {
    renderHeader(dateSortDesc);
    const dateHeader = screen.getByRole('columnheader', { name: /Date/ });
    expect(dateHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('clicking a header calls onSort with the column key', async () => {
    const onSort = vi.fn();
    renderHeader(noopSort, onSort);
    await userEvent.click(screen.getByRole('columnheader', { name: /Company/ }));
    expect(onSort).toHaveBeenCalledWith('Company');
  });

  it('pressing Enter on a header calls onSort', () => {
    const onSort = vi.fn();
    renderHeader(noopSort, onSort);
    const missionHeader = screen.getByRole('columnheader', { name: /Mission/ });
    fireEvent.keyDown(missionHeader, { key: 'Enter' });
    expect(onSort).toHaveBeenCalledWith('Mission');
  });

  it('pressing Space on a header calls onSort', () => {
    const onSort = vi.fn();
    renderHeader(noopSort, onSort);
    const rocketHeader = screen.getByRole('columnheader', { name: 'Rocket, activate to sort' });
    fireEvent.keyDown(rocketHeader, { key: ' ' });
    expect(onSort).toHaveBeenCalledWith('Rocket');
  });

  it('pressing other keys does not call onSort', () => {
    const onSort = vi.fn();
    renderHeader(noopSort, onSort);
    const dateHeader = screen.getByRole('columnheader', { name: /Date/ });
    fireEvent.keyDown(dateHeader, { key: 'Tab' });
    expect(onSort).not.toHaveBeenCalled();
  });

  it('sort indicator is aria-hidden', () => {
    renderHeader(dateSortAsc);
    const sortIcons = document.querySelectorAll('[aria-hidden="true"]');
    expect(sortIcons.length).toBeGreaterThan(0);
  });
});
