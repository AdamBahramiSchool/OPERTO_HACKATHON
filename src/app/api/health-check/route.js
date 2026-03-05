import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .list()

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }

  return NextResponse.json({
    success: true,
    files: data
  })
}