import { NextResponse } from 'next/server'
import postgres from 'postgres'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    const sql = postgres(process.env.DATABASE_URL!, { 
      prepare: false,
      ssl: 'require',
      connection: {
        options: `--search_path=public`,
      },
    })
    
    // Test simple query
    const result = await sql`SELECT version()`
    console.log('✅ Connection successful!')
    
    // Test products table
    const products = await sql`SELECT COUNT(*) as count FROM products`
    console.log('Products count:', products[0].count)
    
    await sql.end()
    
    return NextResponse.json({ 
      success: true, 
      version: result[0].version,
      productsCount: products[0].count
    })
  } catch (error) {
    console.error('❌ Connection failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}