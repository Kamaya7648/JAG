import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Column from '../components/Column.jsx'
import AddColumn from '../components/AddColumn.jsx'
import { VEHICLES, STATUS_STYLES, buildDefaultBoard } from '../data.js'

let idCounter = 5000
const nextId = () => `col-${Date.now()}-${idCounter++}`

export default function Board() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const vehicle = VEHICLES.find((v) => v.id === vehicleId)
  const [columns, setColumns] = useState(() => buildDefaultBoard(vehicle || { id: vehicleId, status: 'Received' }))

  const handleDragStart = (e, cardId, fromColumnId) => {
    e.dataTransfer.setData('cardId', cardId)
    e.dataTransfer.setData('fromColumnId', fromColumnId)
  }

  const handleDrop = (e, toColumnId) => {
    const cardId = e.dataTransfer.getData('cardId')
    const fromColumnId = e.dataTransfer.getData('fromColumnId')
    if (!cardId || fromColumnId === toColumnId) return

    setColumns((prev) => {
      let movedCard = null
      const withoutCard = prev.map((col) => {
        if (col.id !== fromColumnId) return col
        const card = col.cards.find((c) => c.id === cardId)
        movedCard = card
        return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
      })
      if (!movedCard) return prev
      return withoutCard.map((col) =>
        col.id === toColumnId ? { ...col, cards: [...col.cards, movedCard] } : col
      )
    })
  }

  const addCard = (columnId, text, days) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, { id: `task-${Date.now()}`, text, days }] }
          : col
      )
    )
  }

  const deleteCard = (columnId, cardId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    )
  }

  const editCard = (columnId, cardId, text, days) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.map((c) => (c.id === cardId ? { ...c, text, days } : c)) }
          : col
      )
    )
  }

  const addColumn = (title) => {
    setColumns((prev) => [...prev, { id: nextId(), title, cards: [] }])
  }

  const deleteColumn = (columnId) => {
    setColumns((prev) => prev.filter((c) => c.id !== columnId))
  }

  const renameColumn = (columnId, title) => {
    setColumns((prev) => prev.map((c) => (c.id === columnId ? { ...c, title } : c)))
  }

  const statusStyle = vehicle ? STATUS_STYLES[vehicle.status] : null

  return (
    <div className="board-page">
      <nav className="topbar">
        <div className="topbar-left">
          <span className="logo">◆ GarageSync</span>
          <button className="back-link" onClick={() => navigate('/')}>← Assigned Vehicles</button>
        </div>
        <div className="topbar-right">
          <div className="search-box">🔍 <span>Search</span></div>
          <span className="icon-btn">🔔</span>
          <span className="avatar avatar-self">K</span>
        </div>
      </nav>

      <div className="board-header">
        <h1 className="board-title">
          Service Board — {vehicle ? `${vehicle.model} (${vehicle.plate})` : `Vehicle ${vehicleId}`}
        </h1>
        {statusStyle && (
          <span className="status-pill" style={{ background: statusStyle.bg, color: statusStyle.color }}>
            {vehicle.status}
          </span>
        )}
        <span className="vehicle-id-pill">ID: {vehicleId}</span>
      </div>

      <main className="board">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onEditCard={editCard}
            onDeleteColumn={deleteColumn}
            onRenameColumn={renameColumn}
          />
        ))}
        <AddColumn onAdd={addColumn} existingCount={columns.length} />
      </main>
    </div>
  )
}
