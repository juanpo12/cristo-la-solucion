const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function verifyDatabase() {
  const sql = postgres(process.env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    console.log('Verifying database tables...');
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\nExisting tables:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    // Expected tables
    const expectedTables = ['categories', 'contacts', 'order_items', 'orders', 'products', 'store_config'];
    
    console.log('\nVerification:');
    expectedTables.forEach(expectedTable => {
      const exists = tables.some(table => table.table_name === expectedTable);
      console.log(`${expectedTable}: ${exists ? '✓' : '✗'}`);
    });
    
    console.log('\nDatabase verification completed!');
  } catch (error) {
    console.error('Error verifying database:', error);
  } finally {
    await sql.end();
  }
}

verifyDatabase();