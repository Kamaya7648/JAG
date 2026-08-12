import { useState } from 'react'

const ACCENTS = ['#E0563A', '#2F6F62', '#D9A441', '#4C5FD5', '#B5478C']

export default function AddColumn({ onAdd, existingCount }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  const submit = () => {
    const trimmed = title.trim()
    if (trimmed) {
      const accent = ACCENTS[existingCount % ACCENTS.length]
      onAdd(trimmed, accent)
    }
    setTitle('')
    setAdding(false)
  }

  if (!adding) {
    return (
      <button className="add-column-btn" onClick={() => setAdding(true)}>
        + Add another list
      </button>
    )
  }

  return (
    <div className="add-column-form">
      <input
        autoFocus
        placeholder="List name…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') setAdding(false)
        }}
      />
      <div className="card-edit-actions">
        <button className="btn-mini" onClick={submit}>Add list</button>
        <button className="btn-mini btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
      </div>
    </div>
  )
}
