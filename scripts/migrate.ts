import { db } from '@/lib/db'
import { Migrator, type MigrationProvider, type Migration } from 'kysely/migration'
import { promises as fs } from 'fs'
import path from 'path'
const migrationFolder = path.join(process.cwd(), 'migrations')

const provider: MigrationProvider = {
  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {}
    const files = await fs.readdir(migrationFolder)

    for (const file of files.sort()) {
      if (file.match(/\.(js|ts|cjs|mjs)$/)) {
        const filePath = path.join(migrationFolder, file)
        const mod = require(filePath)
        const key = file.replace(/\.(js|ts|cjs|mjs)$/, '')
        migrations[key] = mod
      }
    }

    return migrations
  },
}

async function main() {
  const migrator = new Migrator({ db, provider })

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
