import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { noticeTypes } from '@/data/announcements'

function formatDate(value) {
  if (!value) return 'Date to be announced'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function decorate(notice) {
  const config = noticeTypes[notice.type] ?? noticeTypes.notice
  const registrations = Array.isArray(notice.registrations) ? notice.registrations : []
  const date = notice.date ? new Date(`${notice.date}T00:00:00`) : null

  return {
    ...notice,
    typeLabel: config.label,
    emoji: config.emoji,
    tone: config.tone,
    dateLabel: formatDate(notice.date),
    registrations,
    registrationCount: notice.type === 'notice' ? null : registrations.length,
    day: date ? String(date.getDate()).padStart(2, '0') : '--',
    month: date ? date.toLocaleDateString('en-IN', { month: 'short' }) : '',
    isUpcoming: date ? date.getTime() >= new Date().setHours(0, 0, 0, 0) : false,
  }
}

export function useNotices() {
  const [notices, setNotices] = useState([])
  const [status, setStatus] = useState(supabase ? 'loading' : 'unavailable')
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus('unavailable')
      return
    }
    const { data, error: queryError } = await supabase
      .from('notices_informations')
      .select('*')
      .order('date', { ascending: true })

    if (queryError) {
      setError(queryError.message)
      setStatus('error')
      return
    }

    setNotices((data ?? []).map(decorate))
    setStatus('ready')
  }, [])

  useEffect(() => {
    load()
    if (!supabase) return undefined

    const channel = supabase
      .channel('pdkv-notices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices_informations' },
        load,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const events = useMemo(
    () => notices.filter((notice) => notice.type === 'event' || notice.type === 'exam'),
    [notices],
  )

  return { notices, events, status, error, reload: load }
}
