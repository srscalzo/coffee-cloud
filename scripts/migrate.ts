import { db } from '@/lib/db'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import { promises as fs } from 'fs'
import path from 'path'

async function main() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'migrations'),
    }),
  })

  const goingDown = process.argv[2] === 'down'
  const { error, results } = goingDown
    ? await migrator.migrateDown()
    : await migrator.migrateToLatest()

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`✓ ${result.migrationName}`)
    } else if (result.status === 'Error') {
      console.error(`✗ ${result.migrationName}`)
    }
  })

  if (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }

  await db.destroy()
}

main()
