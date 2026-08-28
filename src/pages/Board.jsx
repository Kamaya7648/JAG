import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Column from '../components/Column.jsx'
import AddColumn from '../components/AddColumn.jsx'
import { VEHICLES, STATUS_STYLES, buildDefaultBoard } from '../data.js'

let idCounter = 5000
const nextId = () => `col-${Date.now()}-${idCounter++}`

const TASKLIST_ID = 'tasklist'
const DEFAULT_SIDEBAR_WIDTH = 227
const MIN_SIDEBAR_WIDTH = 150
const MAX_SIDEBAR_WIDTH = 480

export default function Board() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const vehicle = VEHICLES.find((v) => v.id === vehicleId)
  const [columns, setColumns] = useState(() => buildDefaultBoard(vehicle || { id: vehicleId, status: 'Received' }))
  const [taskList, setTaskList] = useState([])
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

  const startResize = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const stopResize = useCallback(() => setIsResizing(false), [])

  const resize = useCallback(
    (e) => {
      if (!isResizing) return
      const boardLayoutEl = document.getElementById('board-layout')
      if (!boardLayoutEl) return
      const layoutLeft = boardLayoutEl.getBoundingClientRect().left
      let newWidth = e.clientX - layoutLeft
      newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth))
      setSidebarWidth(newWidth)
    },
    [isResizing]
  )

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResize)
    }
  }, [resize, stopResize])

  const handleDragStart = (e, cardId, fromColumnId) => {
    e.dataTransfer.setData('cardId', cardId)
    e.dataTransfer.setData('fromColumnId', fromColumnId)
  }

  const handleDrop = (e, toColumnId) => {
    const cardId = e.dataTransfer.getData('cardId')
    const fromColumnId = e.dataTransfer.getData('fromColumnId')
    if (!cardId || fromColumnId === toColumnId) return

    if (fromColumnId === TASKLIST_ID) {
      const card = taskList.find((c) => c.id === cardId)
      if (!card) return
      setTaskList((prev) => prev.filter((c) => c.id !== cardId))
      setColumns((prev) =>
        prev.map((col) => (col.id === toColumnId ? { ...col, cards: [...col.cards, card] } : col))
      )
      return
    }

    if (toColumnId === TASKLIST_ID) {
      setColumns((prev) => {
        let movedCard = null
        const withoutCard = prev.map((col) => {
          if (col.id !== fromColumnId) return col
          const card = col.cards.find((c) => c.id === cardId)
          movedCard = card
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        })
        if (movedCard) setTaskList((tPrev) => [...tPrev, movedCard])
        return withoutCard
      })
      return
    }

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

  const addTaskListCard = (_, text, days) => {
    setTaskList((prev) => [...prev, { id: `task-${Date.now()}`, text, days }])
  }

  const deleteTaskListCard = (_, cardId) => {
    setTaskList((prev) => prev.filter((c) => c.id !== cardId))
  }

  const editTaskListCard = (_, cardId, text, days) => {
    setTaskList((prev) => prev.map((c) => (c.id === cardId ? { ...c, text, days } : c)))
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

      <div className="board-layout" id="board-layout">
        <aside className="task-sidebar" style={{ width: sidebarWidth, flex: `0 0 ${sidebarWidth}px` }}>
          <Column
            column={{ id: TASKLIST_ID, title: 'Task List', cards: taskList }}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onAddCard={addTaskListCard}
            onDeleteCard={deleteTaskListCard}
            onEditCard={editTaskListCard}
            onDeleteColumn={() => {}}
            onRenameColumn={() => {}}
          />
        </aside>

        <div
          className={`sidebar-resizer ${isResizing ? 'resizing' : ''}`}
          onMouseDown={startResize}
        />

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
    </div>
  )
}