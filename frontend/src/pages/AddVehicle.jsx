import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const STATUS_OPTIONS = ['Received', 'Diagnosis', 'Repairing', 'Quality Check', 'Completed']

export default function AddVehicle() {
  const navigate = useNavigate()
  const { token } = useApp()

  const [form, setForm] = useState({
    id: '',
    model: '',
    plate: '',
    status: 'Received',
    customerName: '',
    customerAddress: '',
    phone: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!token) {
        throw new Error('Please log in again.')
      }

      const response = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add vehicle')
      }

      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="main-panel">
      <div className="form-page-center">
        <div className="table-card form-card">
          <div className="form-card-heading">
            <h1>Add Vehicle</h1>
            <p className="subtitle-dash">
              <i>Register a new vehicle for service tracking</i>
            </p>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <form className="vehicle-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id">Vehicle ID</label>
                <input
                  id="id"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="008"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="model">Vehicle Model</label>
                <input
                  id="model"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Toyota Aqua"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="plate">Number Plate</label>
                <input
                  id="plate"
                  name="plate"
                  value={form.plate}
                  onChange={handleChange}
                  placeholder="ABC-1234"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Vehicle Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Customer Name</label>
                <input
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Nimal Perera"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telephone No.</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="077-1234567"
                  required
                />
              </div>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="customerAddress">Customer Address</label>
              <input
                id="customerAddress"
                name="customerAddress"
                value={form.customerAddress}
                onChange={handleChange}
                placeholder="12 Lake Road, Colombo 05"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost-outline"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}