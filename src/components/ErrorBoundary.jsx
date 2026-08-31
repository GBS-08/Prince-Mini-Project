import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="container flex min-h-[60svh] flex-col items-center justify-center gap-4 py-24 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="text-display-sm font-extrabold">Something went wrong</h1>
        <p className="max-w-md text-sm prose-muted">
          This section could not be displayed. Please reload the page — if the problem continues,
          contact the college office.
        </p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    )
  }
}

export default ErrorBoundary
