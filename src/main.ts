import './scss/styles.scss';
import { ProductCatalog } from './models/ProductCatalog.ts';
import { Basket } from './models/Basket.ts';
import { Buyer } from './models/Buyer.ts';
import { apiProducts } from './utils/data';
import {WebLarekAPI} from "./models/WebLarekAPI.ts";
import {API_URL, CDN_URL} from "./utils/constants.ts";

// ===== ТЕСТИРОВАНИЕ КЛАССА ProductCatalog =====
console.log('=== ТЕСТИРОВАНИЕ ProductCatalog ===');

const catalog = new ProductCatalog();

// Тест 1: Сохранение и получение товаров
console.log('1. Загрузка товаров в каталог...');
catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getItems());
console.log('Количество товаров в каталоге:', catalog.getItems().length);

// Тест 2: Получение товара по ID
console.log('\n2. Поиск товара по ID...');
const firstProductId = apiProducts.items[0].id;
const foundProduct = catalog.getProduct(firstProductId);
console.log('Найденный товар:', foundProduct);

// Тест 3: Поиск несуществующего товара
console.log('\n3. Поиск несуществующего товара...');
const notFoundProduct = catalog.getProduct('nonexistent-id');
console.log('Результат поиска несуществующего товара:', notFoundProduct);

// Тест 4: Установка и получение товара для превью
console.log('\n4. Работа с превью товара...');
catalog.setPreview(apiProducts.items[0]);
console.log('Товар для превью:', catalog.getPreview());

// ===== ТЕСТИРОВАНИЕ КЛАССА Basket =====
console.log('\n\n=== ТЕСТИРОВАНИЕ Basket ===');

const basket = new Basket();

// Тест 1: Проверка пустой корзины
console.log('1. Пустая корзина...');
console.log('Товары в корзине:', basket.getItems());
console.log('Количество товаров:', basket.getItemCount());
console.log('Общая стоимость:', basket.getTotalPrice());

// Тест 2: Добавление товаров в корзину
console.log('\n2. Добавление товаров в корзину...');
const product1 = apiProducts.items[0]; // "+1 час в сутках" - 750 руб
const product2 = apiProducts.items[1]; // "HEX-леденец" - 1450 руб
const product3 = apiProducts.items[2]; // "Мамка-таймер" - null (бесплатный)

basket.addItem(product1);
basket.addItem(product2);
basket.addItem(product3);

console.log('Товары в корзине после добавления:', basket.getItems().map(item => item.title));
console.log('Количество товаров:', basket.getItemCount());
console.log('Общая стоимость:', basket.getTotalPrice()); // должно быть 750 + 1450 = 2200

// Тест 3: Проверка наличия товара в корзине
console.log('\n3. Проверка наличия товаров...');
console.log('Товар 1 в корзине:', basket.hasItem(product1.id));
console.log('Несуществующий товар в корзине:', basket.hasItem('fake-id'));

// Тест 4: Удаление товара из корзины
console.log('\n4. Удаление товара из корзины...');
basket.removeItem(product2);
console.log('Товары после удаления:', basket.getItems().map(item => item.title));
console.log('Количество товаров:', basket.getItemCount());
console.log('Общая стоимость:', basket.getTotalPrice()); // должно быть 750

// Тест 5: Попытка добавить тот же товар повторно
console.log('\n5. Попытка добавить существующий товар...');
const itemsBeforeDuplicate = basket.getItemCount();
basket.addItem(product1); // товар уже есть в корзине
console.log('Количество товаров после повторного добавления:', basket.getItemCount());
console.log('Товар добавлен повторно:', itemsBeforeDuplicate !== basket.getItemCount());

// Тест 6: Очистка корзины
console.log('\n6. Очистка корзины...');
basket.clearBasket();
console.log('Товары после очистки:', basket.getItems());
console.log('Количество товаров:', basket.getItemCount());
console.log('Общая стоимость:', basket.getTotalPrice());

// ===== ТЕСТИРОВАНИЕ КЛАССА Buyer =====
console.log('\n\n=== ТЕСТИРОВАНИЕ Buyer ===');

const buyer = new Buyer();

// Тест 1: Проверка начального состояния
console.log('1. Начальное состояние покупателя...');
console.log('Данные покупателя:', buyer.getBuyerData());

// Тест 2: Установка отдельных полей
console.log('\n2. Установка отдельных полей...');
buyer.setEmail('test@example.com');
buyer.setPhone('+71234567890');
buyer.setAddress('Санкт-Петербург, ул. Восстания, 1');
buyer.setPayment('card');

console.log('Данные после установки полей:', buyer.getBuyerData());

// Тест 3: Валидация корректных данных
console.log('\n3. Валидация корректных данных...');
const validationResult = buyer.validateBuyerData();
console.log('Результат валидации:', validationResult);

// Тест 4: Валидация некорректных данных
console.log('\n4. Валидация некорректных данных...');
buyer.setEmail('invalid-email');
buyer.setPhone('123');
buyer.setAddress('');

const invalidValidation = buyer.validateBuyerData();
console.log('Результат валидации некорректных данных:', invalidValidation);

// Тест 5: Проверка отдельных методов валидации
console.log('\n5. Проверка отдельных методов валидации...');
console.log('Email валиден:', buyer.isValidEmail());
console.log('Телефон валиден:', buyer.isValidPhone());
console.log('Адрес валиден:', buyer.isValidAddress());

// Тест 6: Массовое обновление данных
console.log('\n6. Массовое обновление данных...');
buyer.setBuyerData({
    email: 'user@test.ru',
    phone: '+79876543210',
    address: 'Москва, Красная площадь, 1'
});
console.log('Данные после массового обновления:', buyer.getBuyerData());

// Тест 7: Очистка данных
console.log('\n7. Очистка данных покупателя...');
buyer.clearBuyerData();
console.log('Данные после очистки:', buyer.getBuyerData());

// ===== ИНТЕГРАЦИОННЫЙ ТЕСТ =====
console.log('\n\n=== ИНТЕГРАЦИОННЫЙ ТЕСТ ===');

// Создаем полный флоу работы с моделями
console.log('Создание полного заказа...');

// 1. Загружаем каталог
catalog.setItems(apiProducts.items);
console.log('Товаров в каталоге:', catalog.getItems().length);

// 2. Добавляем товары в корзину
basket.addItem(catalog.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390')!); // +1 час в сутках
basket.addItem(catalog.getProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9')!); // HEX-леденец

console.log('Товары в корзине:', basket.getItems().map(item => `${item.title} - ${item.price} руб`));
console.log('Общая стоимость корзины:', basket.getTotalPrice());

// 3. Заполняем данные покупателя
buyer.setBuyerData({
    payment: 'online',
    email: 'customer@weblarek.ru',
    phone: '+71234567890',
    address: 'Санкт-Петербург, ул. Восстания, 1'
});

// 4. Валидируем данные
const finalValidation = buyer.validateBuyerData();
console.log('Финальная валидация покупателя:', finalValidation);

// 5. Формируем данные заказа
if (finalValidation.isValid) {
    const orderData = {
        ...buyer.getBuyerData(),
        total: basket.getTotalPrice(),
        items: basket.getItems().map(item => item.id)
    };
    console.log('Данные для отправки заказа:', orderData);
} else {
    console.log('Заказ не может быть оформлен из-за ошибок валидации');
}


// ===== ПРОВЕРКА РАБОТЫ С СЕРВЕРОМ (API) =====
console.log('\n\n=== ПРОВЕРКА РАБОТЫ С API ===');

// 1. Создаем экземпляр класса для работы с API
const api = new WebLarekAPI(CDN_URL, API_URL);

// 2. Выполняем запрос на сервер для получения каталога товаров
console.log('Запрашиваем каталог товаров с сервера...');
api.getProductList()
    .then((products) => {
        // 3. В обработчике запроса сохраняем полученный массив в модель данных
        catalog.setItems(products);
        console.log('Данные успешно получены и сохранены в модель каталога.');

        // 4. Выводим только что сохранённый каталог в консоль для проверки
        console.log('Содержимое каталога после загрузки с сервера:');
        console.log(catalog.getItems());
    })
    .catch((err) => {
        // Обработка возможной ошибки при запросе
        console.error('Ошибка при загрузке каталога с сервера:', err);
    });

console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');