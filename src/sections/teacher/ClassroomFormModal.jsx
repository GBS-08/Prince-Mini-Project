import { useState } from 'react'
import TcModal from './TcModal'
import StudentSelector from './StudentSelector'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'
import { ordinal } from '../../data/teacher'

/** Create / edit classroom modal (shared form, both flows from Teacher.js). */
export default function ClassroomFormModal({ open, mode, room, students, teacher, regno, onClose, onSaved }) {
  const { showToast } = useToast()
  const isEdit = mode === 'edit'

  const [form, setForm] = useState(() => ({
    class_name: room?.class_name || '',
    subject: room?.subject || '',
    department: room?.department || '',
    year: room?.year ? String(room.year) : '',
  }))
  const [selected, setSelected] = useState(() => new Set(room?.student_regnos || []))
  const [saving, setSaving] = useState(false)

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  const submit = async () => {
    const name = form.class_name.trim()
    if (!name) {
      showToast('Classroom name is required.', 'warning')
      return
    }
    if (!isEdit && selected.size === 0) {
      showToast('Select at least one student.', 'warning')
      return
    }

    setSaving(true)

    const payload = {
      class_name: name,
      subject: form.subject.trim() || null,
      department: form.department.trim() || null,
      year: parseInt(form.year, 10) || null,
      student_regnos: [...selected],
    }

    if (isEdit) {
      const { error } = await supabase
        .from('classrooms')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', room.id)

      setSaving(false)
      if (error) {
        showToast(`Failed: ${errorMessage(error)}`, 'error')
        return
      }
      showToast('Classroom updated! ✅', 'success')
      onSaved({ ...room, ...payload })
      return
    }

    const { data, error } = await supabase
      .from('classrooms')
      .insert({ ...payload, teacher_regno: regno, teacher_name: teacher?.name || regno })
      .select()
      .single()

    setSaving(false)

    if (error) {
      showToast(`Failed to create classroom: ${errorMessage(error)}`, 'error')
      return
    }

    showToast(`Classroom "${name}" created! 🎉`, 'success')
    onSaved(data)
  }

  return (
    <TcModal
      open={open}
      onClose={onClose}
      size="lg"
      icon={isEdit ? 'fas fa-edit' : 'fas fa-plus-circle'}
      title={isEdit ? `Edit Classroom — ${room?.class_name}` : 'Create New Classroom'}
    >
      <div className="tgrid" style={{ marginBottom: 18 }}>
        <div className="tg-fg">
          <label className="tl" htmlFor="cf_name">
            <i className="fas fa-door-open" aria-hidden="true" /> Classroom Name *
          </label>
          <input
            id="cf_name"
            className="ti"
            placeholder="e.g. CSE-A 3rd Year"
            value={form.class_name}
            onChange={set('class_name')}
          />
        </div>

        <div className="tg-fg">
          <label className="tl" htmlFor="cf_subj">
            <i className="fas fa-book" aria-hidden="true" /> Subject
          </label>
          <input
            id="cf_subj"
            className="ti"
            placeholder="e.g. Data Structures"
            value={form.subject}
            onChange={set('subject')}
          />
        </div>

        <div className="tg-fg">
          <label className="tl" htmlFor="cf_dept">
            <i className="fas fa-building" aria-hidden="true" /> Department (optional)
          </label>
          <input
            id="cf_dept"
            className="ti"
            placeholder="Department"
            value={form.department}
            onChange={set('department')}
          />
        </div>

        <div className="tg-fg">
          <label className="tl" htmlFor="cf_year">
            <i className="fas fa-layer-group" aria-hidden="true" /> Year (optional)
          </label>
          <select id="cf_year" className="ts" value={form.year} onChange={set('year')}>
            <option value="">Any Year</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
                {ordinal(n)} Year
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 11,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span style={{ fontSize: '.95rem', color: '#fff', fontWeight: 700 }}>
          <i className="fas fa-users" style={{ color: 'var(--tamb)', marginRight: 7 }} aria-hidden="true" />
          {isEdit ? 'Edit Students' : 'Select Students'}
        </span>
        <span className="tbd tb-teal">{selected.size} Selected</span>
      </div>

      <StudentSelector students={students} selected={selected} onChange={setSelected} maxHeight={isEdit ? 340 : 370} />

      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
          marginTop: 18,
          paddingTop: 15,
          borderTop: '1px solid var(--tbord)',
        }}
      >
        <button type="button" className="tb tb-ghost tb-sm" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="tb tb-pri" onClick={submit} disabled={saving}>
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin" /> {isEdit ? 'Saving…' : 'Creating…'}
            </>
          ) : (
            <>
              <i className="fas fa-save" /> {isEdit ? 'Save Changes' : 'Create Classroom'}
            </>
          )}
        </button>
      </div>
    </TcModal>
  )
}
