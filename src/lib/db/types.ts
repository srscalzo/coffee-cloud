import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface UserTable {
  id: Generated<string>
  email: string
  name: string | null
  image: string | null
  created_at: Generated<Date>
}

export interface CoffeeLogTable {
  id: Generated<number>
  user_id: string
  brewed_at: Date
  created_at: Generated<Date>

  // Bean info
  bean_name: string | null
  roaster: string | null
  origin: string | null
  roast_level: string | null
  roast_date: Date | null

  // Brew parameters
  method: string | null
  dose_g: number | null
  water_g: number | null
  water_temp_c: number | null
  grind_setting: string | null
  bloom_time_s: number | null
  total_time_s: number | null

  // Tasting
  rating: number | null
  acidity: number | null
  sweetness: number | null
  body: number | null
  bitterness: number | null
  flavor_notes: string | null
  notes: string | null
}

export interface Database {
  users: UserTable
  coffee_logs: CoffeeLogTable
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

export type CoffeeLog = Selectable<CoffeeLogTable>
export type NewCoffeeLog = Insertable<CoffeeLogTable>
export type CoffeeLogUpdate = Updateable<CoffeeLogTable>
