export type OrderStatus = 'Delivered' | 'Out for Delivery' | 'Scheduled';

export type Order = {
  id: string;
  date: string;
  items: string;
  total: number;
  status: OrderStatus;
};

export const ORDERS: Order[] = [
  {
    id: '1',
    date: 'Aug 28, 2026',
    items: '2x 5-Gallon Jug',
    total: 17.98,
    status: 'Delivered',
  },
  {
    id: '2',
    date: 'Aug 30, 2026',
    items: '1x Case of 24 Bottles',
    total: 6.49,
    status: 'Out for Delivery',
  },
  {
    id: '3',
    date: 'Sep 3, 2026',
    items: '1x Water Dispenser',
    total: 39.99,
    status: 'Scheduled',
  },
];