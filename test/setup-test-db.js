const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function setupTestDatabase() {
  const testDatabaseUrl = 'postgresql://postgres:postgres@localhost:5432/rooms_test?schema=public';
  
  console.log('Setting up test database...');
  
  try {
    // Set the DATABASE_URL environment variable for this process
    process.env.DATABASE_URL = testDatabaseUrl;
    
    // Run Prisma db push to create the database and schema
    console.log('Running prisma db push...');
    const { stdout, stderr } = await execAsync('npx prisma db push --force-reset --skip-generate', {
      env: { ...process.env, DATABASE_URL: testDatabaseUrl }
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('Test database setup complete!');
  } catch (error) {
    console.error('Error setting up test database:', error.message);
    process.exit(1);
  }
}

setupTestDatabase();
