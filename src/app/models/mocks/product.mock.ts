import { faker } from '@faker-js/faker';
import { Product } from '../product.model';

export const generateOneProduct = (): Product => ({
  id: faker.string.uuid(),
  title: faker.commerce.productName(),
  price: +faker.commerce.price(),
  description: faker.commerce.productDescription(),
  category: {
    id: +faker.string.numeric,
    name: faker.commerce.department(),
  },
  images: [faker.image.url(), faker.image.url()],
});

export const generateManyProduct = (count: number = 10): Product[] => {
  const products: Product[] = [];
  for (let index = 0; index < count; index++) {
    products.push(generateOneProduct());
  }
  return products;
};
