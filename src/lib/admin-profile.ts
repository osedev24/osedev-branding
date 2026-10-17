import { supabase } from './supabase'

const ADMIN_PROFILE_KEY = 'osedev-admin-profile-v1'
const AVATAR_BUCKET = 'admin-avatars'

export type AdminProfile = {
  name: string
  role: string
  email: string
  photoPath?: string
  legacyPhoto?: string
}

export type ProfilePhotoChange = string | null | undefined

const defaultAdminProfile: AdminProfile = {
  name: 'Alex Carter',
  role: 'Studio admin',
  email: 'alex@osedev.studio',
}

export function getAdminProfile(): AdminProfile {
  try {
    const stored = localStorage.getItem(ADMIN_PROFILE_KEY)
    if (!stored) return defaultAdminProfile
    const parsed = JSON.parse(stored) as Partial<AdminProfile> & { photo?: unknown }
    return {
      name: parsed.name?.trim() || defaultAdminProfile.name,
      role: parsed.role?.trim() || defaultAdminProfile.role,
      email: parsed.email?.trim() || defaultAdminProfile.email,
      photoPath: typeof parsed.photoPath === 'string' ? parsed.photoPath : undefined,
      legacyPhoto: typeof parsed.photo === 'string' && parsed.photo.startsWith('data:image/jpeg;base64,')
        ? parsed.photo
        : undefined,
    }
  } catch {
    return defaultAdminProfile
  }
}

function cacheAdminProfile(profile: AdminProfile) {
  const { name, role, email, photoPath } = profile
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify({ name, role, email, photoPath }))
}

async function getCurrentAdminId() {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Sign in again to update your profile.')
  return data.user.id
}

async function getPhotoUrl(photoPath?: string) {
  if (!supabase || !photoPath) return undefined
  const { data, error } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrl(photoPath, 3600)
  if (error) throw error
  return data.signedUrl
}

async function uploadPhoto(userId: string, photoDataUrl: string) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const response = await fetch(photoDataUrl)
  const image = await response.blob()
  const photoPath = `${userId}/profile.jpg`
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(photoPath, image, {
    cacheControl: '3600',
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) throw error
  return photoPath
}

async function fetchProfile(userId: string) {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase.from('admin_profiles')
    .select('display_name, role, email, photo_path')
    .eq('user_id', userId)
    .maybeSingle()
}

export async function loadAdminProfileFromDatabase() {
  if (!supabase) throw new Error('Supabase is not configured.')
  const userId = await getCurrentAdminId()
  const existing = await fetchProfile(userId)
  if (existing.error) throw existing.error

  let profile: AdminProfile
  if (existing.data) {
    profile = {
      name: existing.data.display_name,
      role: existing.data.role,
      email: existing.data.email,
      photoPath: existing.data.photo_path ?? undefined,
    }
  } else {
    const localProfile = getAdminProfile()
    let photoPath: string | undefined
    if (localProfile.legacyPhoto) {
      photoPath = await uploadPhoto(userId, localProfile.legacyPhoto)
    }
    const created = await supabase.from('admin_profiles').insert({
      user_id: userId,
      display_name: localProfile.name,
      role: localProfile.role,
      email: localProfile.email,
      photo_path: photoPath ?? null,
    })

    if (created.error?.code === '23505') {
      const raced = await fetchProfile(userId)
      if (raced.error || !raced.data) throw raced.error ?? new Error('Profile could not be loaded.')
      profile = {
        name: raced.data.display_name,
        role: raced.data.role,
        email: raced.data.email,
        photoPath: raced.data.photo_path ?? undefined,
      }
    } else if (created.error) {
      throw created.error
    } else {
      profile = { ...localProfile, photoPath }
    }
  }

  cacheAdminProfile(profile)
  return { profile, photoUrl: await getPhotoUrl(profile.photoPath) }
}

export async function saveAdminProfileToDatabase(profile: AdminProfile, photoChange: ProfilePhotoChange) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const userId = await getCurrentAdminId()
  const oldPhotoPath = profile.photoPath
  let photoPath = oldPhotoPath

  if (typeof photoChange === 'string') {
    photoPath = await uploadPhoto(userId, photoChange)
  } else if (photoChange === null) {
    photoPath = undefined
  }

  const { error } = await supabase.from('admin_profiles').upsert({
    user_id: userId,
    display_name: profile.name,
    role: profile.role,
    email: profile.email,
    photo_path: photoPath ?? null,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error

  if (photoChange === null && oldPhotoPath) {
    const { error: removeError } = await supabase.storage.from(AVATAR_BUCKET).remove([oldPhotoPath])
    if (removeError) throw removeError
  }

  const savedProfile = { ...profile, photoPath }
  cacheAdminProfile(savedProfile)
  return { profile: savedProfile, photoUrl: await getPhotoUrl(photoPath) }
}