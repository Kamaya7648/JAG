import { useState } from 'react'
import Card from './Card.jsx'

export default function Column({
  column,
  onDragStart,
  onDrop,
  onDeleteCard,
  onEditCard,
  onAddCard,
  onDeleteColumn,
  onRenameColumn,
}) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftDays, setDraftDays] = useState(1)
  const [renaming, setRenaming] = useState(false)
  const [titleDraft, setTitleDraft] = useState(column.title)
  const [isOver, setIsOver] = useState(false)

  const submitCard = () => {
    const trimmed = draft.trim()
    if (trimmed) onAddCard(column.id, trimmed, Math.max(1, Number(draftDays) || 1))
    setDraft('')
    setDraftDays(1)
    setAdding(false)
  }

  const submitTitle = () => {
    const trimmed = titleDraft.trim()
    if (trimmed) onRenameColumn(column.id, trimmed)
    setRenaming(false)
  }

  return (
    <div
      className={`column ${isOver ? 'column-over' : ''}`}
      style={{ '--accent': column.accent }}
      onDragOver={(e) => {
        e.preventDefault()
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        setIsOver(false)
        onDrop(e, column.id)
      }}
    >
      <div className="column-tab" />
      <div className="column-header">
        {renaming ? (
          <input
            className="column-title-input"
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={submitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitTitle()
              if (e.key === 'Escape') setRenaming(false)
            }}
          />
        ) : (
          <h2 className="column-title" onClick={() => setRenaming(true)}>
            {column.title}
          </h2>
        )}
        <div className="column-header-right">
          <span className="column-count">{column.cards.length}</span>
          <button className="btn-icon" onClick={() => onDeleteColumn(column.id)} aria-label="Delete column">×</button>
        </div>
      </div>

      <div className="column-body">
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            onDragStart={onDragStart}
            onDelete={onDeleteCard}
            onEdit={onEditCard}
          />
        ))}

        {adding ? (
          <div className="card card-new">
            <textarea
              autoFocus
              placeholder="Task that needs to be done…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submitCard()
                }
                if (e.key === 'Escape') setAdding(false)
              }}
            />
            <div className="days-input-row">
              <label>Days to complete</label>
              <input
                type="number"
                min="1"
                value={draftDays}
                onChange={(e) => setDraftDays(e.target.value)}
              />
            </div>
            <div className="card-edit-actions">
              <button className="btn-mini" onClick={submitCard}>Add task</button>
              <button className="btn-mini btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="add-card-btn" onClick={() => setAdding(true)}>+ Add a task</button>
        )}
      </div>
    </div>
  )
}
