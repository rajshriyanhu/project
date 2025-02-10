export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

export interface TripUser {
    id: string;
    role: string;
    tripId: string;
    userId: string;
    user: User;
}

export interface Trip {
    budget: number;
    createdAt: string;
    currency: string;
    description: string;
    destination: string;
    endDate: string;
    id: string;
    name: string;
    startDate: string;
    updatedAt: string;
    totalExpenses: number;
    expenses: Expense[];
    users: TripUser[];
} 

export interface Expense {
    amount: number;
    categoryId: string;
    date: string;
    description: string;
    id: string;
    tripId: string;
    userId: string;
    category: Category;
}

export interface Category {
    id: string;
    name: string;
}