export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string;
          store_name: string;
          phone: string | null;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          store_name: string;
          phone?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_name?: string;
          phone?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          merchant_id: string;
          name: string;
          phone: string | null;
          credit_limit: string;
          notes: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          merchant_id: string;
          name: string;
          phone?: string | null;
          credit_limit?: number;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          merchant_id?: string;
          name?: string;
          phone?: string | null;
          credit_limit?: number;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_merchant_id_fkey";
            columns: ["merchant_id"];
            isOneToOne: false;
            referencedRelation: "merchants";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          id: string;
          merchant_id: string;
          customer_id: string;
          type: "debit" | "payment";
          amount: string;
          description: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          merchant_id: string;
          customer_id: string;
          type: "debit" | "payment";
          amount: number;
          description?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          merchant_id?: string;
          customer_id?: string;
          type?: "debit" | "payment";
          amount?: number;
          description?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_merchant_id_fkey";
            columns: ["merchant_id"];
            isOneToOne: false;
            referencedRelation: "merchants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      customer_balances: {
        Row: {
          id: string;
          merchant_id: string;
          name: string;
          phone: string | null;
          credit_limit: string;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          total_debit: string;
          total_payment: string;
          balance: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
