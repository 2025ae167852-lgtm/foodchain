// Unified Farm Roles Enum
export enum UserRole {
  Farmer = "farmer",
  Processor = "processor",
  Retailer = "retailer",
  InputProvider = "input_provider",
  FinancialProvider = "financial_provider",
  Regulator = "regulator",
  Consumer = "consumer"
}

export const ALL_ROLES = [
  UserRole.Farmer,
  UserRole.Processor,
  UserRole.Retailer,
  UserRole.InputProvider,
  UserRole.FinancialProvider,
  UserRole.Regulator,
  UserRole.Consumer
];
