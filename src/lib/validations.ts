import { z } from "zod";
import { moneyToNumber, onlyDigits } from "@/lib/format";

export const signInSchema = z.object({
  email: z.string().email("Informe um email válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    storeName: z.string().min(2, "Informe o nome do comércio."),
    email: z.string().email("Informe um email válido."),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme sua senha."),
    terms: z.boolean().refine(Boolean, "Aceite os termos para continuar."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem.",
  });

export const onboardingSchema = z.object({
  storeName: z.string().min(2, "Informe o nome do comércio."),
  phone: z
    .string()
    .optional()
    .transform((value) => (value ? onlyDigits(value) : undefined)),
});

export const customerFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Informe o nome do cliente."),
  phone: z
    .string()
    .optional()
    .transform((value) => onlyDigits(value)),
  credit_limit: z
    .unknown()
    .transform((value) => moneyToNumber(value))
    .refine((value) => value >= 0, "O limite não pode ser negativo."),
  notes: z.string().optional(),
});

export const transactionFormSchema = z.object({
  customer_id: z.string().min(1, "Escolha um cliente."),
  type: z.enum(["debit", "payment"], {
    message: "Escolha o tipo de transação.",
  }),
  amount: z
    .unknown()
    .transform((value) => moneyToNumber(value))
    .refine((value) => value >= 0.01, "Informe um valor de pelo menos R$ 0,01."),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

export const settingsSchema = z.object({
  storeName: z.string().min(2, "Informe o nome do comércio."),
  phone: z
    .string()
    .optional()
    .transform((value) => onlyDigits(value)),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type OnboardingValues = z.infer<typeof onboardingSchema>;
export type CustomerFormValues = z.input<typeof customerFormSchema>;
export type TransactionFormValues = z.input<typeof transactionFormSchema>;
export type SettingsValues = z.infer<typeof settingsSchema>;
