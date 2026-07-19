import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabaseServer'

const BUCKET_NAME = 'product-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase image storage is not configured.',
        },
        { status: 503 }
      )
    }

    const supabase = createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please sign in to upload an image.',
        },
        { status: 401 }
      )
    }

    const {
      data: userProfile,
      error: profileError,
    } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile?.is_admin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin access is required to upload images.',
        },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const fileValue = formData.get('file')

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: 'No image was selected.',
        },
        { status: 400 }
      )
    }

    const file = fileValue

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only JPG, PNG, WebP and GIF images are allowed.',
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'The image must be smaller than 5 MB.',
        },
        { status: 400 }
      )
    }

    const extension = EXTENSION_BY_MIME_TYPE[file.type]
    const dateFolder = new Date().toISOString().slice(0, 10)

    const storagePath =
      `recipes/${dateFolder}/${randomUUID()}.${extension}`

    const fileBuffer = await file.arrayBuffer()

    const {
      error: uploadError,
    } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[recipe-upload] Supabase error:', uploadError)

      return NextResponse.json(
        {
          success: false,
          error: `Upload failed: ${uploadError.message}`,
        },
        { status: 500 }
      )
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      path: storagePath,
    })
  } catch (error) {
    console.error('[recipe-upload] Unexpected error:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'The image could not be uploaded.',
      },
      { status: 500 }
    )
  }
}