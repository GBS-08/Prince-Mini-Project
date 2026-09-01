/** Shared "nothing here yet" placeholder for the student portal cards. */
export default function PortalPending({ icon, bg, color, title, subtitle }) {
  return (
    <div className="sp-glass st-pend" style={{ borderTop: `3px solid ${color}` }}>
      <div className="st-pend-ico" style={{ background: bg, color }}>
        <i className={icon} aria-hidden="true" />
      </div>
      <div className="st-pend-title">{title}</div>
      <div className="st-pend-sub">{subtitle}</div>
    </div>
  )
}
