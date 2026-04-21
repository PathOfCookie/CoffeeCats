const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Mock данные для товаров
const products = [
  { id: '1', name: 'Кофе зерновой', description: 'Арабика 100%', price: 450, category: 'coffee', stock: 50, unit: 'кг', minQuantity: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Кофе молотый', description: 'Средняя обжарка', price: 380, category: 'coffee', stock: 30, unit: 'кг', minQuantity: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Молоко', description: 'Пастеризованное', price: 85, category: 'dairy', stock: 100, unit: 'л', minQuantity: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'Сахар', description: 'Кристаллический', price: 65, category: 'ingredients', stock: 200, unit: 'кг', minQuantity: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: 'Сироп ванильный', description: '0.5л', price: 220, category: 'syrups', stock: 20, unit: 'бут', minQuantity: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Получить все товары
app.get('/products', (req, res) => {
  res.json(products);
});

// Обновить остаток товара
app.patch('/products/:id', (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  const product = products.find(p => p.id === id);
  
  if (product) {
    product.stock = stock;
    product.updatedAt = new Date().toISOString();
    res.json(product);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

app.listen(PORT, () => {
  console.log(`Products service running on port ${PORT}`);
});