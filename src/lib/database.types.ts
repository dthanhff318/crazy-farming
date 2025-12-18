export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type LevelConfig = {
  [level: string]: {
    capacity: number
    upgrade_price: number
  }
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          level: number
          exp: number
          coin: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          level?: number
          exp?: number
          coin?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          level?: number
          exp?: number
          coin?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      animal_types: {
        Row: {
          id: string
          code: string
          name: string
          type: string
          description: string | null
          icon: string | null
          base_price: number
          sell_price: number
          production_time: number
          production_item: string | null
          production_value: number
          unlock_level: number
          created_at: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          type: string
          description?: string | null
          icon?: string | null
          base_price?: number
          sell_price?: number
          production_time?: number
          production_item?: string | null
          production_value?: number
          unlock_level?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          name?: string
          type?: string
          description?: string | null
          icon?: string | null
          base_price?: number
          sell_price?: number
          production_time?: number
          production_item?: string | null
          production_value?: number
          unlock_level?: number
          created_at?: string | null
        }
      }
      building_types: {
        Row: {
          id: string
          code: string
          name: string
          type: string
          description: string | null
          icon: string | null
          base_price: number
          unlock_level: number
          level_config: LevelConfig
          created_at: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          type: string
          description?: string | null
          icon?: string | null
          base_price?: number
          unlock_level?: number
          level_config?: LevelConfig
          created_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          name?: string
          type?: string
          description?: string | null
          icon?: string | null
          base_price?: number
          unlock_level?: number
          level_config?: LevelConfig
          created_at?: string | null
        }
      }
      user_buildings: {
        Row: {
          id: string
          user_id: string
          building_code: string
          current_level: number
          purchased_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          building_code: string
          current_level?: number
          purchased_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          building_code?: string
          current_level?: number
          purchased_at?: string | null
          created_at?: string | null
        }
      }
      user_animals: {
        Row: {
          id: string
          user_id: string
          animal_code: string
          user_building_id: string | null
          name: string | null
          health: number
          last_fed_at: string | null
          last_produced_at: string | null
          purchased_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          animal_code: string
          user_building_id?: string | null
          name?: string | null
          health?: number
          last_fed_at?: string | null
          last_produced_at?: string | null
          purchased_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          animal_code?: string
          user_building_id?: string | null
          name?: string | null
          health?: number
          last_fed_at?: string | null
          last_produced_at?: string | null
          purchased_at?: string | null
          created_at?: string | null
        }
      }
      seed_types: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          icon: string | null
          base_price: number
          sell_price: number
          growth_time: number
          harvest_value: number
          unlock_level: number
          created_at: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          icon?: string | null
          base_price?: number
          sell_price?: number
          growth_time?: number
          harvest_value?: number
          unlock_level?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          icon?: string | null
          base_price?: number
          sell_price?: number
          growth_time?: number
          harvest_value?: number
          unlock_level?: number
          created_at?: string | null
        }
      }
      user_inventory: {
        Row: {
          id: string
          user_id: string
          item_type: string
          item_code: string
          quantity: number
          acquired_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          item_type: string
          item_code: string
          quantity?: number
          acquired_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          item_type?: string
          item_code?: string
          quantity?: number
          acquired_at?: string | null
          created_at?: string | null
        }
      }
      farm_plots: {
        Row: {
          id: string
          user_id: string
          plot_number: number
          position_x: number | null
          position_y: number | null
          is_unlocked: boolean
          unlocked_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plot_number: number
          position_x?: number | null
          position_y?: number | null
          is_unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plot_number?: number
          position_x?: number | null
          position_y?: number | null
          is_unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string | null
        }
      }
      user_crops: {
        Row: {
          id: string
          user_id: string
          plot_id: string
          seed_code: string
          planted_at: string
          ready_at: string
          status: string
          withered_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plot_id: string
          seed_code: string
          planted_at?: string
          ready_at: string
          status?: string
          withered_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plot_id?: string
          seed_code?: string
          planted_at?: string
          ready_at?: string
          status?: string
          withered_at?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
