import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('coffee_logs')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('brewed_at', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    // Bean info
    .addColumn('bean_name', 'text')
    .addColumn('roaster', 'text')
    .addColumn('origin', 'text')
    .addColumn('roast_level', 'text')
    .addColumn('roast_date', 'date')
    // Brew parameters
    .addColumn('method', 'text')
    .addColumn('dose_g', sql`numeric(6,1)`)
    .addColumn('water_g', sql`numeric(6,1)`)
    .addColumn('water_temp_c', sql`numeric(4,1)`)
    .addColumn('grind_setting', 'text')
    .addColumn('bloom_time_s', 'integer')
    .addColumn('total_time_s', 'integer')
    // Tasting
    .addColumn('rating', 'integer')
    .addColumn('acidity', 'integer')
    .addColumn('sweetness', 'integer')
    .addColumn('body', 'integer')
    .addColumn('bitterness', 'integer')
    .addColumn('flavor_notes', 'text')
    .addColumn('notes', 'text')
    .execute()

  await db.schema
    .createIndex('coffee_logs_user_id_brewed_at_idx')
    .on('coffee_logs')
    .columns(['user_id', 'brewed_at'])
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('coffee_logs').execute()
}
