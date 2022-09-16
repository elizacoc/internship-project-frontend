import { Unit } from "../enums/unit.enum";
import { Stock } from "./stock.model";

export interface Product {
    pzn: string;
    supplier?: string;
    productName: string;
    strength: string;
    packageSize: string;
    unit: Unit;
    // quantity: number;
    // price: number;
    stock?: Stock;
} 