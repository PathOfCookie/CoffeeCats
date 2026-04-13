export type UserRole = 'admin' | 'barista' | 'volunteer';

// Пользователь
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

// Ответ при авторизации
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Данные для входа
export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Данные для регистрации
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  agreeTerms: boolean;
}

// Категории товаров
export type ProductCategory = 'coffee' | 'tea' | 'food' | 'litter' | 'medicine' | 'other';

// Единицы измерения
export type Unit = 'шт' | 'г' | 'кг' | 'л' | 'мл';

// Товар
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  stock: number;
  unit: Unit;
  minQuantity: number;
  supplier?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// Котик
export interface Cat {
  id: string;
  name: string;
  age: number;
  color: string;
  gender: 'male' | 'female';
  breed: string;
  personality: string;
  status: 'in_cafe' | 'reserved' | 'adopted';
  arrivalDate: string;
  arrivalType: 'found' | 'from_shelter' | 'from_owner';
  foundLocation?: string;
  finderName?: string;
  finderPhone?: string;
  medicalHistory: MedicalRecord[];
  adoptedDate?: string;
  newHome?: string;
  newOwnerName?: string;
  newOwnerPhone?: string;
  image?: string;
}

// Медицинская запись
export interface MedicalRecord {
  id: string;
  date: string;
  type: 'vaccination' | 'treatment' | 'checkup' | 'surgery';
  description: string;
  vetName: string;
  nextDate?: string;
}

// Кандидат на усыновление
export interface Adoption {
  id: string;
  catId?: string;
  candidate: {
    name: string;
    phone: string;
    email: string;
    experience?: string;
    hasOtherPets: boolean;
    hasChildren: boolean;
    livingConditions?: string;
    preferences?: {
      age?: string;
      gender?: string;
      color?: string;
    };
  };
  status: 'interested' | 'meeting_scheduled' | 'approved' | 'rejected';
  meetingDate?: string;
  notes?: string;
  contract?: {
    contractNumber: string;
    contractDate: string;
    terms: string;
    agreedToFollowUp: boolean;
    followUpDates?: string[];
    documentUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Контекст авторизации
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBarista: boolean;
  isVolunteer: boolean;
}