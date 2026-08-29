import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Column from '../components/Column.jsx'
import AddColumn from '../components/AddColumn.jsx'
import { STATUS_STYLES } from '../data.js'

let idCounter = 5000
const nextId = () => `col-${Date.now()}-${idCounter++}`

const TASKLIST_ID = 'tasklist'
const DEFAULT_SIDEBAR_WIDTH = 227
const MIN_SIDEBAR_WIDTH = 150
const MAX_SIDEBAR_WIDTH = 480

const API_URL = 'http://localhost:5000/api'

export default function Board() {
  const { vehicleId } = useParams()

  const [vehicle, setVehicle] = useState(null)
  const [columns, setColumns] = useState([])
  const [taskList, setTaskList] = useState([])
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const startResize = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const stopResize = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e) => {
      if (!isResizing) return

      const boardLayoutEl = document.getElementById('board-layout')

      if (!boardLayoutEl) return

      const layoutLeft = boardLayoutEl.getBoundingClientRect().left

      let newWidth = e.clientX - layoutLeft

      newWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(MAX_SIDEBAR_WIDTH, newWidth)
      )

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

  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true)
        setError('')

        const vehicleResponse = await fetch(
          `${API_URL}/vehicles/${vehicleId}`
        )

        if (!vehicleResponse.ok) {
          throw new Error('Vehicle not found')
        }

        const vehicleData = await vehicleResponse.json()

        setVehicle(vehicleData)

        const taskResponse = await fetch(
          `${API_URL}/tasks/${vehicleId}`
        )

        if (!taskResponse.ok) {
          throw new Error('Failed to load tasks')
        }

        const taskData = await taskResponse.json()

        const stages = [
          'Received',
          'Diagnosis',
          'Repairing',
          'Quality Check',
          'Completed',
        ]

        const boardColumns = stages.map((stage) => ({
            id: stage,
            title: stage,
            cards: taskData.filter(
              (task) => task.columnId === stage
            ),
         }))

        setColumns(boardColumns)

        setTaskList(
          taskData.filter(
            (task) => task.columnId === TASKLIST_ID
          )
        )
      } catch (err) {
        setError(err.message || 'Failed to load board')
      } finally {
        setLoading(false)
      }
    }

    loadBoard()
  }, [vehicleId])

  const handleDragStart = (e, cardId, fromColumnId) => {
    e.dataTransfer.setData('cardId', cardId)
    e.dataTransfer.setData('fromColumnId', fromColumnId)
  }

  const moveTaskInBackend = async (cardId, columnId) => {
    try {
      await fetch(`${API_URL}/tasks/${cardId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columnId,
        }),
      })
    } catch (err) {
      console.error('Failed to move task:', err)
    }
  }

  const handleDrop = async (e, toColumnId) => {
    const cardId = e.dataTransfer.getData('cardId')
    const fromColumnId = e.dataTransfer.getData('fromColumnId')

    if (!cardId || fromColumnId === toColumnId) return

    if (fromColumnId === TASKLIST_ID) {
      const card = taskList.find((c) => c.id === cardId)

      if (!card) return

      setTaskList((prev) =>
        prev.filter((c) => c.id !== cardId)
      )

      setColumns((prev) =>
        prev.map((col) =>
          col.id === toColumnId
            ? {
                ...col,
                cards: [...col.cards, card],
              }
            : col
        )
      )

      await moveTaskInBackend(cardId, toColumnId)
      return
    }

    if (toColumnId === TASKLIST_ID) {
      let movedCard = null

      setColumns((prev) => {
        const withoutCard = prev.map((col) => {
          if (col.id !== fromColumnId) return col

          const card = col.cards.find(
            (c) => c.id === cardId
          )

          movedCard = card

          return {
            ...col,
            cards: col.cards.filter(
              (c) => c.id !== cardId
            ),
          }
        })

        return withoutCard
      })

      if (movedCard) {
        setTaskList((prev) => [...prev, movedCard])
        await moveTaskInBackend(cardId, TASKLIST_ID)
      }

      return
    }

    let movedCard = null

    setColumns((prev) => {
      const withoutCard = prev.map((col) => {
        if (col.id !== fromColumnId) return col

        const card = col.cards.find(
          (c) => c.id === cardId
        )

        movedCard = card

        return {
          ...col,
          cards: col.cards.filter(
            (c) => c.id !== cardId
          ),
        }
      })

      if (!movedCard) return prev

      return withoutCard.map((col) =>
        col.id === toColumnId
          ? {
              ...col,
              cards: [...col.cards, movedCard],
            }
          : col
      )
    })

    await moveTaskInBackend(cardId, toColumnId)
  }

  const addCard = async (columnId, text, days) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          text,
          days,
          columnId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const data = await response.json()
      const newTask = data.task

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: [...col.cards, newTask],
              }
            : col
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const deleteCard = async (columnId, cardId) => {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${cardId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.filter(
                  (c) => c.id !== cardId
                ),
              }
            : col
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const editCard = async (
    columnId,
    cardId,
    text,
    days
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${cardId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            days,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const data = await response.json()
      const updatedTask = data.task

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((c) =>
                  c.id === cardId
                    ? updatedTask
                    : c
                ),
              }
            : col
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const addTaskListCard = async (_, text, days) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          text,
          days,
          columnId: TASKLIST_ID,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const data = await response.json()

      setTaskList((prev) => [
        ...prev,
        data.task,
      ])
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTaskListCard = async (_, cardId) => {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${cardId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTaskList((prev) =>
        prev.filter((c) => c.id !== cardId)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const editTaskListCard = async (
    _,
    cardId,
    text,
    days
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${cardId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            days,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const data = await response.json()

      setTaskList((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? data.task
            : c
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const addColumn = (title) => {
    setColumns((prev) => [
      ...prev,
      {
        id: nextId(),
        title,
        cards: [],
      },
    ])
  }

  const deleteColumn = (columnId) => {
    setColumns((prev) =>
      prev.filter((c) => c.id !== columnId)
    )
  }

  const renameColumn = (columnId, title) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === columnId
          ? {
              ...c,
              title,
            }
          : c
      )
    )
  }

  const statusStyle = vehicle
    ? STATUS_STYLES[vehicle.status]
    : null

  if (loading) {
    return (
      <div className="board-page">
        <div className="empty-state">
          Loading service board...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="board-page">
        <div className="empty-state">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <h1 className="board-title">
          Service Board —{' '}
          {vehicle
            ? `${vehicle.model} (${vehicle.plate})`
            : `Vehicle ${vehicleId}`}
        </h1>

        {statusStyle && (
          <span
            className="status-pill"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {vehicle.status}
          </span>
        )}

        <span className="vehicle-id-pill">
          ID: {vehicleId}
        </span>
      </div>

      <div
        className="board-layout"
        id="board-layout"
      >
        <aside
          className="task-sidebar"
          style={{
            width: sidebarWidth,
            flex: `0 0 ${sidebarWidth}px`,
          }}
        >
          <Column
            column={{
              id: TASKLIST_ID,
              title: 'Task List',
              cards: taskList,
            }}
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
          className={`sidebar-resizer ${
            isResizing ? 'resizing' : ''
          }`}
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

          <AddColumn
            onAdd={addColumn}
            existingCount={columns.length}
          />
        </main>
      </div>
    </div>
  )
}