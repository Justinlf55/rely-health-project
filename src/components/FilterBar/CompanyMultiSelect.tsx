import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './CompanyMultiSelect.module.css';
import { Button } from '../ui';

interface CompanyMultiSelectProps {
  companies: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

const CompanyMultiSelect = ({ companies, selected, onChange }: CompanyMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const filtered = companies.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (!isOpen || focusedIndex < 0 || !listRef.current) return;
    const options = listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
    options[focusedIndex]?.focus();
  }, [focusedIndex, isOpen]);

  const toggleCompany = (company: string) => {
    const next = selected.includes(company)
      ? selected.filter((c) => c !== company)
      : [...selected, company];
    onChange(next);
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((o) => !o);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if ((e.key === 'Enter' || e.key === ' ') && focusedIndex >= 0) {
      e.preventDefault();
      toggleCompany(filtered[focusedIndex]);
    }
  };

  const buttonLabel =
    selected.length === 0
      ? 'All Companies'
      : `${selected.length} selected`;

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-controls="company-listbox"
        aria-expanded={isOpen}
        aria-label="Filter by company"
      >
        <span>{buttonLabel}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} aria-hidden="true">▾</span>
      </button>

      <span aria-live="polite" className="sr-only">
        {selected.length > 0 ? `${selected.length} companies selected` : 'All companies selected'}
      </span>

      {isOpen && (
        <div className={styles.panel}>
          <input
            type="text"
            className={styles.search}
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search companies"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === 'Escape') {
                e.preventDefault();
                close();
              }
            }}
          />
          <div
            ref={listRef}
            role="listbox"
            id="company-listbox"
            aria-label="Companies"
            aria-multiselectable="true"
            className={styles.list}
            onKeyDown={handleListKeyDown}
          >
            {filtered.map((company, idx) => (
              <div
                key={company}
                role="option"
                aria-selected={selected.includes(company)}
                tabIndex={focusedIndex === idx ? 0 : -1}
                className={`${styles.item} ${focusedIndex === idx ? styles.focused : ''}`}
                onClick={() => toggleCompany(company)}
                onMouseEnter={() => setFocusedIndex(idx)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(company)}
                  onChange={() => toggleCompany(company)}
                  tabIndex={-1}
                  aria-hidden="true"
                />
                {company}
              </div>
            ))}
            {filtered.length === 0 && (
              <span className={styles.empty}>No companies found</span>
            )}
          </div>
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" className={styles.actionBtn} onClick={() => onChange([...filtered])}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" className={styles.actionBtn} onClick={() => onChange([])}>
              Clear
            </Button>
            <Button variant="ghost" size="sm" className={styles.actionBtn} onClick={close}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyMultiSelect;
