import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ColumnFilter from '../components/ColumnFilter.jsx'
import { STATUS_STYLES } from '../data.js'

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

  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(null)
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)

        const response = await fetch('http://localhost:5000/api/vehicles')

        if (!response.ok) {
          throw new Error('Failed to fetch vehicles')
        }

        const data = await response.json()
        setVehicles(data)
      } catch (err) {
        console.error(err)
        setError('Unable to load vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const optionsFor = (key) => [
    ...new Set(vehicles.map((v) => v[key]))
  ]

  const filtered = useMemo(() => {
    let rows = vehicles.filter((v) => {
      const searchValue = search.trim().toLowerCase()

      const matchesSearch =
        !searchValue ||
        [
          v.id,
          v.model,
          v.plate,
          v.status,
          v.customerName,
          v.customerAddress,
          v.phone,
        ].some((field) =>
          String(field).toLowerCase().includes(searchValue)
        )

      const matchesFilters = COLUMNS.every(({ key }) => {
        const sel = filters[key]
        return !sel || sel.has(v[key])
      })

      return matchesSearch && matchesFilters
    })

    if (sort) {
      rows = [...rows].sort((a, b) => {
        const cmp = String(a[sort.key]).localeCompare(
          String(b[sort.key])
        )

        return sort.direction === 'asc' ? cmp : -cmp
      })
    }

    return rows
  }, [vehicles, search, sort, filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSort = (key, direction) => {
    setSort({ key, direction })
  }

  return (
    <main className="main-panel">
      <div className="topbar-dash">
        <div className="topbar-dash-heading">
          <h1>Assigned Vehicles</h1>

          <div className="stat-card">
            <span className="stat-label">
              <center>Total Vehicles</center>
            </span>

            <span className="stat-count">
              <center>{vehicles.length}</center>
            </span>
          </div>
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
          {loading ? (
            <div className="empty-state">
              Loading vehicles...
            </div>
          ) : error ? (
            <div className="empty-state">
              {error}
            </div>
          ) : (
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
                          onChange={(val) =>
                            handleFilterChange(key, val)
                          }
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
                          background:
                            STATUS_STYLES[v.status]?.bg,
                          color:
                            STATUS_STYLES[v.status]?.color,
                        }}
                      >
                        {v.status}
                      </span>
                    </td>

                    <td>{v.customerName}</td>
                    <td>{v.customerAddress}</td>
                    <td>{v.phone}</td>

                    <td>
                      <button
                        className="btn-board"
                        onClick={() =>
                          navigate(`/board/${v.id}`)
                        }
                      >
                        Open Board →
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="empty-state"
                    >
                      No vehicles match your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}
