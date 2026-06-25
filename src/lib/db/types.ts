import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface UserTable {
  id: Generated<string>
  email: string
  name: string | null
  created_at: Generated<Date>
}

export interface CoffeeLogTable {
  id: Generated<number>
  user_id: string
  brewed_at: Date
  created_at: Generated<Date>
  bean_name: string | null
  roaster: string | null
  origin: string | null
  ratio: number | null
  grind_setting: string | null
  rating: number | null
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
