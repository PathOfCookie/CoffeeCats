export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'barista' | 'volunteer';
    createdAt: string;
}
export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    unit: string;
    minQuantity: number;
}
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
    medicalHistory: any[];
    image?: string;
}
