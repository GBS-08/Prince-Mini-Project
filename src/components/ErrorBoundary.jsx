import { Component } from 'react'
import { Link } from 'react-router-dom'

/** Catches render errors so a broken section never blanks the whole site. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('Unhandled UI error:', error)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="section-block bg-surface-light">
        <div className="container-page text-center">
          <div className="mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-br from-danger to-danger-dark text-[1.9rem] text-white shadow-[0_8px_24px_rgba(244,67,54,0.32)]">
            <i className="fas fa-triangle-exclamation" aria-hidden="true" />
          </div>
          <h2 className="section-title mb-3.5">Something went wrong</h2>
          <p className="section-subtitle mb-8">
            An unexpected error stopped this page from loading. Please refresh, or head back to the home page.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              <i className="fas fa-rotate-right" /> Reload Page
            </button>
            <Link to="/" className="btn btn-outline" onClick={() => this.setState({ error: null })}>
              <i className="fas fa-home" /> Back Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
