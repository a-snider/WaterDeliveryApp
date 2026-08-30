export type Product = {
  id: string;
  name: string;
  price: number;
  image: any;
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '5-Gallon Jug',
    price: 8.99,
    image: require('@/assets/images/partial-react-logo.png'),
  },
  {
    id: '2',
    name: 'Case of 24 Bottles',
    price: 6.49,
    image: require('@/assets/images/partial-react-logo.png'),
  },
  {
    id: '3',
    name: 'Water Dispenser',
    price: 39.99,
    image: require('@/assets/images/partial-react-logo.png'),
  },
  {
    id: '4',
    name: '3-Gallon Jug',
    price: 5.99,
    image: require('@/assets/images/partial-react-logo.png'),
  },
];