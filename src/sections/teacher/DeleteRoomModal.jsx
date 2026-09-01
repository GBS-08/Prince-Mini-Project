import { useState } from 'react'
import TcModal from './TcModal'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'

/** Destructive confirmation before deleting a classroom and its records. */
export default function DeleteRoomModal({ open, room, onClose, onDeleted }) {
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const remove = async () => {
    setDeleting(true)

    await supabase.from('attendance_records').delete().eq('classroom_id', room.id)
    await supabase.from('attendance_sessions').delete().eq('classroom_id', room.id)
    const { error } = await supabase.from('classrooms').delete().eq('id', room.id)

    setDeleting(false)

    if (error) {
      showToast(`Failed to delete: ${errorMessage(error)}`, 'error')
      return
    }

    showToast('Classroom deleted.', 'info')
    onDeleted(room.id)
  }

  if (!room) return null

  return (
    <TcModal open={open} onClose={onClose} size="sm" icon="fas fa-trash" title="Delete Classroom">
      <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 14 }} aria-hidden="true">
          🗑️
        </div>
        <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, marginBottom: 10 }}>
          Delete &quot;{room.class_name}&quot;?
        </div>
        <div style={{ fontSize: '.86rem', color: 'var(--tc-muted)', lineHeight: 1.65, marginBottom: 22 }}>
          This will permanently delete the classroom and all its attendance records. This action cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button type="button" className="tb tb-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="tb tb-danger" onClick={remove} disabled={deleting}>
            {deleting ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Deleting…
              </>
            ) : (
              <>
                <i className="fas fa-trash" /> Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </TcModal>
  )
}
