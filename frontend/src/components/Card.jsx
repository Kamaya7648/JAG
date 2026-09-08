import { useState } from 'react'

export default function Card({ card, columnId, onDragStart, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(card.text)
  const [days, setDays] = useState(card.days ?? 1)

  const save = () => {
    const trimmed = text.trim()
    if (trimmed) onEdit(columnId, card.id, trimmed, Math.max(1, Number(days) || 1))
    setEditing(false)
  }

  return (
    <div
      className="card"
      draggable={!editing}
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
    >
      {editing ? (
        <div className="card-edit">
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                save()
              }
              if (e.key === 'Escape') setEditing(false)
            }}
          />
          <div className="days-input-row">
            <label>Days to complete</label>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>
          <div className="card-edit-actions">
            <button className="btn-mini" onClick={save}>Save</button>
            <button className="btn-mini btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className="card-text">{card.text}</p>
          <div className="card-meta">
            <span className="badge badge-days">🕒 {card.days ?? 1} day{(card.days ?? 1) === 1 ? '' : 's'}</span>
            <div className="card-actions">
              <button className="btn-icon" onClick={() => setEditing(true)} aria-label="Edit task">Edit</button>
              <button className="btn-icon" onClick={() => onDelete(columnId, card.id)} aria-label="Delete task">Remove</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
