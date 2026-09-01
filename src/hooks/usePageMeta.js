import { useEffect } from 'react'

/** Keeps <title> and the meta description in sync per route. */
export default function usePageMeta({ title, description, themeColor }) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }

    if (themeColor) {
      const tag = document.querySelector('meta[name="theme-color"]')
      if (tag) tag.setAttribute('content', themeColor)
    }
  }, [title, description, themeColor])
}
