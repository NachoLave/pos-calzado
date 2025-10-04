/**
 * Datos de prueba (mock data)
 * En producción, estos datos vendrían de una base de datos
 */
import type { Product, Sale, DashboardStats } from "./types"

export const products: Product[] = [
  // Zapatos - Negro
  {
    id: "1",
    name: "Zapatos Clásicos de Cuero Negro",
    category: "shoes",
    price: 89.99,
    image: "/elegant-black-leather-dress-shoes.jpg",
    supplier: "Premium Leather",
    totalStock: 15,
    sizes: [
      { size: "38", stock: 3 },
      { size: "39", stock: 4 },
      { size: "40", stock: 5 },
      { size: "41", stock: 3 },
    ],
  },
  // Zapatos - Marrón (producto separado)
  {
    id: "2",
    name: "Zapatos Clásicos de Cuero Marrón",
    category: "shoes",
    price: 89.99,
    image: "/elegant-brown-leather-dress-shoes.jpg",
    supplier: "Premium Leather",
    totalStock: 8,
    sizes: [
      { size: "39", stock: 2 },
      { size: "40", stock: 4 },
      { size: "41", stock: 2 },
    ],
  },
  // Zapatillas - Blanco
  {
    id: "3",
    name: "Zapatillas Deportivas Urban Blancas",
    category: "shoes",
    price: 129.99,
    image: "/modern-white-sneakers-athletic-shoes.jpg",
    supplier: "Urban Style",
    totalStock: 19,
    sizes: [
      { size: "36", stock: 4 },
      { size: "37", stock: 5 },
      { size: "38", stock: 6 },
      { size: "39", stock: 4 },
    ],
  },
  // Zapatillas - Negro
  {
    id: "4",
    name: "Zapatillas Deportivas Urban Negras",
    category: "shoes",
    price: 129.99,
    image: "/modern-black-sneakers-athletic-shoes.jpg",
    supplier: "Urban Style",
    totalStock: 15,
    sizes: [
      { size: "36", stock: 3 },
      { size: "37", stock: 4 },
      { size: "38", stock: 5 },
      { size: "39", stock: 3 },
    ],
  },
  // Mocasines - Marrón
  {
    id: "5",
    name: "Mocasines de Gamuza Marrón",
    category: "shoes",
    price: 79.99,
    image: "/brown-suede-loafers-casual-shoes.jpg",
    supplier: "Classic Fashion",
    totalStock: 10,
    sizes: [
      { size: "39", stock: 3 },
      { size: "40", stock: 4 },
      { size: "41", stock: 3 },
    ],
  },
  // Botas - Negro
  {
    id: "6",
    name: "Botas de Cuero Altas Negras",
    category: "boots",
    price: 159.99,
    image: "/tall-black-leather-boots-womens-fashion.jpg",
    supplier: "Premium Leather",
    totalStock: 8,
    sizes: [
      { size: "36", stock: 2 },
      { size: "37", stock: 3 },
      { size: "38", stock: 2 },
      { size: "39", stock: 1 },
    ],
  },
  // Botines Chelsea - Negro
  {
    id: "7",
    name: "Botines Chelsea Negros",
    category: "boots",
    price: 119.99,
    image: "/black-chelsea-boots-ankle-boots.jpg",
    supplier: "Urban Style",
    totalStock: 10,
    sizes: [
      { size: "38", stock: 3 },
      { size: "39", stock: 4 },
      { size: "40", stock: 3 },
    ],
  },
  // Botines Chelsea - Marrón
  {
    id: "8",
    name: "Botines Chelsea Marrones",
    category: "boots",
    price: 119.99,
    image: "/brown-chelsea-boots-ankle-boots.jpg",
    supplier: "Urban Style",
    totalStock: 4,
    sizes: [
      { size: "38", stock: 2 },
      { size: "39", stock: 2 },
    ],
  },
  // Botas Militares
  {
    id: "9",
    name: "Botas Militares Negras",
    category: "boots",
    price: 139.99,
    image: "/black-military-combat-boots-lace-up.jpg",
    supplier: "Urban Style",
    totalStock: 10,
    sizes: [
      { size: "39", stock: 3 },
      { size: "40", stock: 4 },
      { size: "41", stock: 3 },
    ],
  },
  // Carteras - Negro
  {
    id: "10",
    name: "Cartera de Mano Elegante Negra",
    category: "bags",
    price: 99.99,
    image: "/elegant-black-leather-handbag-purse.jpg",
    supplier: "Modern Accessories",
    totalStock: 6,
    sizes: [{ size: "Única", stock: 6 }],
  },
  // Carteras - Marrón
  {
    id: "11",
    name: "Cartera de Mano Elegante Marrón",
    category: "bags",
    price: 99.99,
    image: "/elegant-brown-leather-handbag-purse.jpg",
    supplier: "Modern Accessories",
    totalStock: 5,
    sizes: [{ size: "Única", stock: 5 }],
  },
  // Carteras - Roja
  {
    id: "12",
    name: "Cartera de Mano Elegante Roja",
    category: "bags",
    price: 99.99,
    image: "/elegant-red-leather-handbag-purse.jpg",
    supplier: "Modern Accessories",
    totalStock: 3,
    sizes: [{ size: "Única", stock: 3 }],
  },
  // Mochila - Negro
  {
    id: "13",
    name: "Mochila de Cuero Negra",
    category: "bags",
    price: 149.99,
    image: "/black-leather-backpack-vintage-style.jpg",
    supplier: "Premium Leather",
    totalStock: 4,
    sizes: [{ size: "Única", stock: 4 }],
  },
  // Mochila - Marrón
  {
    id: "14",
    name: "Mochila de Cuero Marrón",
    category: "bags",
    price: 149.99,
    image: "/brown-leather-backpack-vintage-style.jpg",
    supplier: "Premium Leather",
    totalStock: 5,
    sizes: [{ size: "Única", stock: 5 }],
  },
  // Bolso Bandolera - Negro Pequeño
  {
    id: "15",
    name: "Bolso Bandolera Negro Pequeño",
    category: "bags",
    price: 69.99,
    image: "/black-crossbody-bag-leather-shoulder-bag-small.jpg",
    supplier: "Modern Accessories",
    totalStock: 7,
    sizes: [
      { size: "Pequeño", stock: 4 },
      { size: "Mediano", stock: 3 },
    ],
  },
  // Clutch - Negro
  {
    id: "16",
    name: "Cartera Clutch de Noche Negra",
    category: "bags",
    price: 59.99,
    image: "/elegant-evening-clutch-bag-black.jpg",
    supplier: "Classic Fashion",
    totalStock: 4,
    sizes: [{ size: "Única", stock: 4 }],
  },
  // Clutch - Dorada
  {
    id: "17",
    name: "Cartera Clutch de Noche Dorada",
    category: "bags",
    price: 59.99,
    image: "/elegant-evening-clutch-bag-gold.jpg",
    supplier: "Classic Fashion",
    totalStock: 3,
    sizes: [{ size: "Única", stock: 3 }],
  },
  // Cinturón - Negro
  {
    id: "18",
    name: "Cinturón de Cuero Clásico Negro",
    category: "belts",
    price: 39.99,
    image: "/classic-black-leather-belt-mens.jpg",
    supplier: "Premium Leather",
    totalStock: 13,
    sizes: [
      { size: "85", stock: 4 },
      { size: "90", stock: 5 },
      { size: "95", stock: 4 },
    ],
  },
  // Cinturón - Marrón
  {
    id: "19",
    name: "Cinturón de Cuero Clásico Marrón",
    category: "belts",
    price: 39.99,
    image: "/classic-brown-leather-belt-mens.jpg",
    supplier: "Premium Leather",
    totalStock: 7,
    sizes: [
      { size: "85", stock: 3 },
      { size: "90", stock: 4 },
    ],
  },
  // Cinturón Trenzado
  {
    id: "20",
    name: "Cinturón Trenzado Marrón",
    category: "belts",
    price: 34.99,
    image: "/braided-leather-belt-casual-brown.jpg",
    supplier: "Classic Fashion",
    totalStock: 10,
    sizes: [
      { size: "85", stock: 3 },
      { size: "90", stock: 4 },
      { size: "95", stock: 3 },
    ],
  },
  // Cinturón con Hebilla
  {
    id: "21",
    name: "Cinturón con Hebilla Plateada Negro",
    category: "belts",
    price: 44.99,
    image: "/black-leather-belt-silver-buckle.jpg",
    supplier: "Modern Accessories",
    totalStock: 10,
    sizes: [
      { size: "85", stock: 3 },
      { size: "90", stock: 4 },
      { size: "95", stock: 3 },
    ],
  },
  // Cinturón Reversible
  {
    id: "22",
    name: "Cinturón Reversible Negro/Marrón",
    category: "belts",
    price: 49.99,
    image: "/reversible-leather-belt-black-brown.jpg",
    supplier: "Premium Leather",
    totalStock: 10,
    sizes: [
      { size: "85", stock: 2 },
      { size: "90", stock: 4 },
      { size: "95", stock: 4 },
    ],
  },
  // Zapatos Oxford
  {
    id: "23",
    name: "Zapatos Oxford Marrones",
    category: "shoes",
    price: 94.99,
    image: "/brown-oxford-shoes-formal-leather.jpg",
    supplier: "Classic Fashion",
    totalStock: 10,
    sizes: [
      { size: "39", stock: 3 },
      { size: "40", stock: 4 },
      { size: "41", stock: 3 },
    ],
  },
  // Sandalias
  {
    id: "24",
    name: "Sandalias de Cuero Marrones",
    category: "shoes",
    price: 54.99,
    image: "/brown-leather-sandals-casual-summer.jpg",
    supplier: "Urban Style",
    totalStock: 12,
    sizes: [
      { size: "36", stock: 3 },
      { size: "37", stock: 4 },
      { size: "38", stock: 5 },
    ],
  },
]

export const dailySales: Sale[] = [
  {
    id: "V001",
    time: "09:15",
    type: "sale",
    items: "Zapatillas Deportivas Urban Blancas (Talle 38)",
    total: 129.99,
    paymentMethod: "cash",
  },
  {
    id: "V002",
    time: "10:30",
    type: "deposit",
    items: "Botas de Cuero Altas Negras (Talle 37)",
    total: 50.0,
    paymentMethod: "transfer",
  },
  {
    id: "V003",
    time: "11:45",
    type: "sale",
    items: "Cartera de Mano Elegante Negra, Cinturón Clásico Negro (85)",
    total: 139.98,
    paymentMethod: "credit",
  },
  {
    id: "V004",
    time: "12:20",
    type: "sale",
    items: "Mocasines de Gamuza Marrón (Talle 40)",
    total: 79.99,
    paymentMethod: "debit",
  },
  {
    id: "V005",
    time: "13:50",
    type: "exchange",
    items: "Botines Chelsea Negros (Talle 39)",
    total: 119.99,
    paymentMethod: "cash",
  },
  {
    id: "V006",
    time: "14:15",
    type: "sale",
    items: "Mochila de Cuero Marrón",
    total: 149.99,
    paymentMethod: "credit",
  },
  {
    id: "V007",
    time: "15:30",
    type: "sale",
    items: "Zapatos Clásicos Negro (Talle 40), Cinturón Reversible (90)",
    total: 139.98,
    paymentMethod: "transfer",
  },
  {
    id: "V008",
    time: "16:00",
    type: "deposit",
    items: "Botas Militares Negras (Talle 41)",
    total: 70.0,
    paymentMethod: "cash",
  },
]

export const cashRegister = {
  initialAmount: 500.0,
  openTime: "08:00",
  cashier: "María González",
}

export const dashboardStats: DashboardStats = {
  todaySales: 1029.92,
  monthSales: 28450.0,
  branchSales: 15230.0,
  topSupplier: {
    name: "Premium Leather",
    productsSold: 145,
  },
  monthlySales: [
    { month: "Ene", sucursal1: 12500, sucursal2: 9800, sucursal3: 8200 },
    { month: "Feb", sucursal1: 15200, sucursal2: 11500, sucursal3: 9800 },
    { month: "Mar", sucursal1: 18900, sucursal2: 13200, sucursal3: 11400 },
    { month: "Abr", sucursal1: 16800, sucursal2: 12800, sucursal3: 10200 },
    { month: "May", sucursal1: 21500, sucursal2: 15600, sucursal3: 13800 },
    { month: "Jun", sucursal1: 19200, sucursal2: 14100, sucursal3: 12300 },
  ],
}
