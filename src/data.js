export const STATUS_STYLES = {
  Received: { bg: '#5B3FD9', color: '#180d47' },
  Diagnosis: { bg:'#1D6FD1' , color: '#DCEBFC' },
  Repairing: { bg: '#E8681A', color: '#340303' },
  'Quality Check': { bg: '#B8860B', color: '#FCF3D2' },
  Completed: { bg: '#1E8E4F', color: '#DFF5E6' },
}

export const VEHICLES = [
  { id: '001', model: 'Toyota Aqua', plate: 'ABC-1234', status: 'Repairing', customerName: 'Nimal Perera', customerAddress: '12 Lake Road, Colombo 05', phone: '077-1234567' },
  { id: '002', model: 'Suzuki Alto', plate: 'XYZ-5678', status: 'Diagnosis', customerName: 'Kasun Fernando', customerAddress: '45 Galle Road, Dehiwala', phone: '071-2345678' },
  { id: '003', model: 'Honda Vezel', plate: 'DEF-2345', status: 'Received', customerName: 'Dilani Silva', customerAddress: '8 Park Avenue, Nugegoda', phone: '076-3456789' },
  { id: '004', model: 'Nissan Leaf', plate: 'GHI-3456', status: 'Quality Check', customerName: 'Ruwan Jayasuriya', customerAddress: '23 Hill Street, Kandy', phone: '070-4567890' },
  { id: '005', model: 'Toyota Corolla', plate: 'JKL-4567', status: 'Completed', customerName: 'Ishara Wickramasinghe', customerAddress: '5 Temple Road, Homagama', phone: '075-5678901' },
  { id: '006', model: 'Honda Civic', plate: 'MNO-5678', status: 'Repairing', customerName: 'Chamara Rathnayake', customerAddress: '17 Station Road, Maharagama', phone: '072-6789012' },
  { id: '007', model: 'Mitsubishi Outlander', plate: 'PQR-6789', status: 'Received', customerName: 'Sanduni Gunawardena', customerAddress: '31 Main Street, Kottawa', phone: '078-7890123' },
  { id: '008', model: 'BMW X1', plate: 'SJR-6789', status: 'Completed', customerName: 'Shahen Ruwanwella', customerAddress: 'Suriyamal rd Delkanda', phone: '078-3456789' },
  { id: '009', model: 'Mitsubishi Montero', plate: 'SKK-7648', status: 'Diagnosis', customerName: 'Kamaya Kapugamage', customerAddress: '83/1 Embillawatte rd Boralesgamuwa', phone: '071-4983337' },
]

const DEFAULT_TASK_TEMPLATES = {
  Received: [{ text: 'Log vehicle intake details', days: 1 }],
  Diagnosis: [{ text: 'Run full diagnostic scan', days: 1 }],
  Repairing: [{ text: 'Order replacement parts', days: 2 }, { text: 'Carry out repair work', days: 3 }],
  'Quality Check': [{ text: 'Test drive and inspection', days: 1 }],
  Completed: [{ text: 'Generate invoice and notify customer', days: 1 }],
}

let cardCounter = 1000
const nextCardId = () => `task-${cardCounter++}`

export function buildDefaultBoard(vehicle) {
  const stages = ['Received', 'Diagnosis', 'Repairing', 'Quality Check', 'Completed']
  return stages.map((stage) => ({
    id: `col-${vehicle.id}-${stage.replace(/\s+/g, '').toLowerCase()}`,
    title: stage,
    cards:
      stage === vehicle.status
        ? (DEFAULT_TASK_TEMPLATES[stage] || []).map((t) => ({ id: nextCardId(), ...t }))
        : [],
  }))
}