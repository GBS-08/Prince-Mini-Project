import { useEffect, useRef, useState } from 'react'

/**
 * Drag & drop image picker used by the portals (`.sp-upload-area` +
 * `.sp-preview-wrap`). Keeps the chosen `File` in the parent via `onChange`.
 */
export default function ImageUploadField({
  id,
  accept = 'image/*',
  hint = 'JPG, PNG — max 5MB',
  label = 'Click or drag & drop to change photo',
  icon = 'fas fa-cloud-upload-alt',
  file,
  onChange,
  classes = {},
}) {
  const [preview, setPreview] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreview('')
      return undefined
    }
    if (!file.type?.startsWith('image/')) {
      setPreview('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const clear = () => {
    if (inputRef.current) inputRef.current.value = ''
    onChange(null)
  }

  return (
    <>
      <div className={classes.area || 'sp-upload-area'}>
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept={accept}
          aria-label={label}
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
        <i className={`${icon} ${classes.icon || 'sp-upload-ico'}`} aria-hidden="true" />
        <div className={classes.text || 'sp-upload-txt'}>
          <strong>{label}</strong>
          <br />
          {hint}
        </div>
      </div>

      <div className={`${classes.previewWrap || 'sp-preview-wrap'}${preview ? ' show' : ''}`}>
        {preview && <img src={preview} alt="Preview" />}
        <button
          type="button"
          className={classes.previewRemove || 'sp-preview-rm'}
          onClick={clear}
          aria-label="Remove selected file"
        >
          <i className="fas fa-times" aria-hidden="true" />
        </button>
      </div>

      {file && !preview && (
        <p className="mt-2 text-[0.8rem] opacity-70">
          <i className="fas fa-file" aria-hidden="true" /> {file.name}
        </p>
      )}
    </>
  )
}
