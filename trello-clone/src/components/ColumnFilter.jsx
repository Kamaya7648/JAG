import { useState } from 'react'

export default function ColumnFilter({ label, columnKey, options, selected, onChange, sort, onSort }) {
  const [open, setOpen] = useState(false)

  const allSelected = selected === null || selected.size === options.length
  const isChecked = (val) => selected === null || selected.has(val)

  const toggleValue = (val) => {
    const base = selected === null ? new Set(options) : new Set(selected)
    if (base.has(val)) base.delete(val)
    else base.add(val)
    onChange(base.size === options.length ? null : base)
  }

  const toggleAll = () => {
    onChange(allSelected ? new Set() : null)
  }

  const isFiltered = selected !== null && selected.size < options.length

  return (
    <span className="col-filter">
      <button
        className={`col-filter-btn ${isFiltered ? 'col-filter-active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Filter ${label}`}
      >
        ▾
      </button>

      {open && (
        <>
          <div className="col-filter-backdrop" onClick={() => setOpen(false)} />
          <div className="col-filter-menu">
            <div className="col-filter-sort">
              <button
                className={sort?.key === columnKey && sort.direction === 'asc' ? 'active' : ''}
                onClick={() => { onSort(columnKey, 'asc'); setOpen(false) }}
              >
                ↑ Sort A to Z
              </button>
              <button
                className={sort?.key === columnKey && sort.direction === 'desc' ? 'active' : ''}
                onClick={() => { onSort(columnKey, 'desc'); setOpen(false) }}
              >
                ↓ Sort Z to A
              </button>
            </div>
            <div className="col-filter-divider" />
            <label className="col-filter-option col-filter-all">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              Select All
            </label>
            <div className="col-filter-options">
              {options.map((val) => (
                <label key={val} className="col-filter-option">
                  <input type="checkbox" checked={isChecked(val)} onChange={() => toggleValue(val)} />
                  {val}
                </label>
              ))}
            </div>
            <div className="col-filter-actions">
              <button className="btn-mini" onClick={() => setOpen(false)}>OK</button>
              <button
                className="btn-mini btn-ghost"
                onClick={() => { onChange(null); }}
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </span>
  )
}
