import { useEffect, useRef, useState } from 'react';
import styles from './CompanyMultiSelect.module.css';

interface Props {
  companies: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

const CompanyMultiSelect = ({ companies, selected, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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

  const toggleCompany = (company: string) => {
    const next = selected.includes(company)
      ? selected.filter((c) => c !== company)
      : [...selected, company];
    onChange(next);
  };

  const buttonLabel =
    selected.length === 0
      ? 'All Companies'
      : `${selected.length} selected`;

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        <span>{buttonLabel}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <input
            type="text"
            className={styles.search}
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className={styles.list}>
            {filtered.map((company) => (
              <label key={company} className={styles.item}>
                <input
                  type="checkbox"
                  checked={selected.includes(company)}
                  onChange={() => toggleCompany(company)}
                />
                {company}
              </label>
            ))}
            {filtered.length === 0 && (
              <span className={styles.empty}>No companies found</span>
            )}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => onChange(companies)}
            >
              Select All
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => onChange([])}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyMultiSelect;
