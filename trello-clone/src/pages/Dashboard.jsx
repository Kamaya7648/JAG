import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import ColumnFilter from '../components/ColumnFilter.jsx'
import { VEHICLES, STATUS_STYLES } from '../data.js'

const COLUMNS = [
  { key: 'id', label: 'Vehicle ID' },
  { key: 'model', label: 'Vehicle Model' },
  { key: 'plate', label: 'Number Plate' },
  { key: 'status', label: 'Vehicle Status' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'customerAddress', label: 'Customer Address' },
  { key: 'phone', label: 'Telephone No.' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(null)
  const [filters, setFilters] = useState({})

  const optionsFor = (key) => [...new Set(VEHICLES.map((v) => v[key]))]

  const filtered = useMemo(() => {
    let rows = VEHICLES.filter((v) => {
      const matchesSearch =
        !search.trim() ||
        [v.id, v.model, v.plate, v.status, v.customerName, v.customerAddress, v.phone].some((field) =>
          field.toLowerCase().includes(search.trim().toLowerCase())
        )
      const matchesFilters = COLUMNS.every(({ key }) => {
        const sel = filters[key]
        return !sel || sel.has(v[key])
      })
      return matchesSearch && matchesFilters
    })

    if (sort) {
      rows = [...rows].sort((a, b) => {
        const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]))
        return sort.direction === 'asc' ? cmp : -cmp
      })
    }
    return rows
  }, [search, sort, filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSort = (key, direction) => {
    setSort({ key, direction })
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="topbar-dash">
          <div>
            <h1>Assigned Vehicles</h1>
          </div>
          <div className="topbar-dash-actions">
            <label className="search-input">
              <input
                placeholder="Search vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="table-card">
          <div className="table-scroll">
            <table className="vehicle-table">
              <thead>
                <tr>
                  {COLUMNS.map(({ key, label }) => (
                    <th key={key}>
                      <span className="th-label">
                        {label}
                        <ColumnFilter
                          label={label}
                          columnKey={key}
                          options={optionsFor(key)}
                          selected={filters[key] ?? null}
                          onChange={(val) => handleFilterChange(key, val)}
                          sort={sort}
                          onSort={handleSort}
                        />
                      </span>
                    </th>
                  ))}
                  <th>Service Board</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.model}</td>
                    <td>{v.plate}</td>
                    <td>
                      <span
                        className="status-pill"
                        style={{
                          background: STATUS_STYLES[v.status]?.bg,
                          color: STATUS_STYLES[v.status]?.color,
                        }}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td>{v.customerName}</td>
                    <td>{v.customerAddress}</td>
                    <td>{v.phone}</td>
                    <td>
                      <button className="btn-board" onClick={() => navigate(`/board/${v.id}`)}>
                        Open Board →
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No vehicles match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
