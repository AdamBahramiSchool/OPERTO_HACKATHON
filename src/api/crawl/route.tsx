import React from 'react'

export async function POST(request: Request){
    const {seed_url} = await request.json()
    // start crawl on seed_url with pupeteer
}