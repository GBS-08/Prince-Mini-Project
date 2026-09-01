import { useMemo, useState } from 'react'
import ClassroomFormModal from './ClassroomFormModal'
import RoomModal from './RoomModal'
import MarkAttendanceModal from './MarkAttendanceModal'
import SessionModal from './SessionModal'
import DeleteRoomModal from './DeleteRoomModal'
import { supabase } from '../../services/supabase'

function ClassroomGrid({ rooms, mine, onOpen, onCreate }) {
  if (rooms.length === 0) {
    return (
      <div className="tc-cls-grid">
        <div className="tc-empty" style={{ gridColumn: '1/-1' }}>
          <div className="tc-empty-ico">🏫</div>
          <div className="tc-empty-title">{mine ? 'No Classrooms Yet' : 'No Classrooms Found'}</div>
          <div className="tc-empty-sub">
            {mine ? 'Click "Create Classroom" to get started.' : 'No classrooms have been created yet.'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tc-cls-grid">
      {rooms.map((room) => (
        <div
          key={room.id}
          role="button"
          tabIndex={0}
          className="tg tc-cls-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpen(room)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onOpen(room)
            }
          }}
        >
          <div className="tc-cls-ico">
            <i className="fas fa-door-open" aria-hidden="true" />
          </div>
          <div className="tc-cls-name">{room.class_name}</div>
          <div className="tc-cls-meta">
            <div>
              <i className="fas fa-user-tie" aria-hidden="true" /> {room.teacher_name || room.teacher_regno || '—'}
            </div>
            {room.department && (
              <div>
                <i className="fas fa-building" aria-hidden="true" /> {room.department}
                {room.year ? ` · Year ${room.year}` : ''}
              </div>
            )}
            {room.subject && (
              <div>
                <i className="fas fa-book" aria-hidden="true" /> {room.subject}
              </div>
            )}
          </div>
          <span className="tc-cls-cnt">
            <i className="fas fa-users" aria-hidden="true" /> {(room.student_regnos || []).length} Students
          </span>
        </div>
      ))}

      {mine && (
        <button type="button" className="tc-create-btn" onClick={onCreate}>
          <i className="fas fa-plus-circle" aria-hidden="true" />
          <span>Create New Classroom</span>
        </button>
      )}
    </div>
  )
}

/** Classroom tabs + all the classroom/attendance modals. */
export default function AttendanceManager({ regno, teacher, rooms, students, onRoomsChanged }) {
  const [tab, setTab] = useState('my')
  const [dialog, setDialog] = useState({ type: null, room: null, sessionId: null })

  const mine = useMemo(
    () => rooms.filter((r) => (r.teacher_regno || '').toUpperCase().trim() === (regno || '').toUpperCase().trim()),
    [rooms, regno],
  )

  const close = () => setDialog({ type: null, room: null, sessionId: null })

  /** Always re-read a room before opening it, like the original `fetchRoom`. */
  const openRoom = async (room) => {
    const { data } = await supabase.from('classrooms').select('*').eq('id', room.id).maybeSingle()
    setDialog({ type: 'room', room: data || room, sessionId: null })
  }

  return (
    <div style={{ marginTop: 30 }}>
      <div className="tc-att-hdr">
        <i className="fas fa-calendar-check" aria-hidden="true" /> Attendance Manager
      </div>

      <div className="tc-tabs">
        <button type="button" className={`tc-tab${tab === 'my' ? ' on' : ''}`} onClick={() => setTab('my')}>
          <i className="fas fa-door-open" aria-hidden="true" /> My Classrooms
          <span
            style={{
              marginLeft: 5,
              background: 'rgba(245,158,11,.15)',
              border: '1px solid rgba(245,158,11,.3)',
              color: 'var(--tc-amber)',
              padding: '1px 8px',
              borderRadius: 50,
              fontSize: '.72rem',
            }}
          >
            {mine.length}
          </span>
        </button>
        <button type="button" className={`tc-tab${tab === 'all' ? ' on' : ''}`} onClick={() => setTab('all')}>
          <i className="fas fa-list" aria-hidden="true" /> All Classrooms
          <span
            style={{
              marginLeft: 5,
              background: 'rgba(96,165,250,.1)',
              border: '1px solid rgba(96,165,250,.25)',
              color: 'var(--tc-blue)',
              padding: '1px 8px',
              borderRadius: 50,
              fontSize: '.72rem',
            }}
          >
            {rooms.length}
          </span>
        </button>
      </div>

      <div className={`tc-tpanel${tab === 'my' ? ' on' : ''}`}>
        <div style={{ display: 'flex', gap: 9, justifyContent: 'flex-end', marginBottom: 16 }}>
          <button
            type="button"
            className="tb tb-pri tb-sm"
            onClick={() => setDialog({ type: 'create', room: null, sessionId: null })}
          >
            <i className="fas fa-plus" /> Create Classroom
          </button>
        </div>
        <ClassroomGrid
          rooms={mine}
          mine
          onOpen={openRoom}
          onCreate={() => setDialog({ type: 'create', room: null, sessionId: null })}
        />
      </div>

      <div className={`tc-tpanel${tab === 'all' ? ' on' : ''}`}>
        <ClassroomGrid rooms={rooms} mine={false} onOpen={openRoom} onCreate={() => {}} />
      </div>

      {(dialog.type === 'create' || dialog.type === 'edit') && (
        <ClassroomFormModal
          open
          mode={dialog.type}
          room={dialog.room}
          students={students}
          teacher={teacher}
          regno={regno}
          onClose={close}
          onSaved={(room) => {
            onRoomsChanged()
            if (dialog.type === 'edit') setDialog({ type: 'room', room, sessionId: null })
            else close()
          }}
        />
      )}

      {dialog.type === 'room' && (
        <RoomModal
          open
          room={dialog.room}
          students={students}
          onClose={close}
          onMarkAttendance={(room) => setDialog({ type: 'mark', room, sessionId: null })}
          onEdit={(room) => setDialog({ type: 'edit', room, sessionId: null })}
          onDelete={(room) => setDialog({ type: 'delete', room, sessionId: null })}
          onViewSession={(sessionId) => setDialog({ type: 'session', room: dialog.room, sessionId })}
        />
      )}

      {dialog.type === 'mark' && (
        <MarkAttendanceModal
          open
          room={dialog.room}
          students={students}
          regno={regno}
          onClose={close}
          onSaved={(room) => openRoom(room)}
        />
      )}

      {dialog.type === 'session' && (
        <SessionModal
          open
          sessionId={dialog.sessionId}
          onClose={() => setDialog({ type: 'room', room: dialog.room, sessionId: null })}
        />
      )}

      {dialog.type === 'delete' && (
        <DeleteRoomModal
          open
          room={dialog.room}
          onClose={() => setDialog({ type: 'room', room: dialog.room, sessionId: null })}
          onDeleted={() => {
            onRoomsChanged()
            close()
          }}
        />
      )}
    </div>
  )
}
