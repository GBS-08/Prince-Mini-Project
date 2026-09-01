import { supabase, errorMessage, publicUrl } from './supabase'

export const IMAGE_BUCKET = 'image_files'
export const STUDENT_FOLDER = 'Student_images'
export const ACHIEVEMENT_FOLDER = 'Achievement_images'
export const TEACHER_FOLDER = 'Teacher_images'

/**
 * Uploads a file to `image_files/<folder>/<key>_<timestamp>.<ext>` and returns
 * its public URL — the storage helper shared by the student and teacher portals.
 */
export async function uploadPortalFile(file, folder, key) {
  if (!file) return { url: null, error: null }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${folder}/${key}_${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { upsert: true })
  if (error) return { url: null, error: errorMessage(error) }

  return { url: publicUrl(IMAGE_BUCKET, path), error: null }
}
