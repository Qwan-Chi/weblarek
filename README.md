# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### IProduct
Основной интерфейс для описания товара в системе.

```typescript
interface IProduct {
    id: string;              // Уникальный идентификатор (UUID)
    title: string;           // Название товара
    description: string;     // Описание товара
    image: string;          // Путь к изображению
    category: ProductCategory; // Категория товара
    price: number | null;    // Цена (null для бесплатных товаров)
}
```

**Примечания:**
- `id` генерируется сервером в формате UUID
- `price` может быть `null` для бесплатных товаров
- `image` содержит относительный путь к SVG файлу

### ProductCategory
Тип-перечисление для категорий товаров.

```typescript
type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
```

**Доступные категории:**
- `софт-скил` - мягкие навыки
- `хард-скил` - технические навыки
- `другое` - разное
- `дополнительное` - дополнительные товары
- `кнопка` - интерактивные элементы

### IProductListResponse
Ответ API для получения списка товаров.

```typescript
interface IProductListResponse {
    total: number;    // Общее количество товаров
    items: IProduct[]; // Массив товаров
}
```

### IBuyer
Интерфейс для данных покупателя.

```typescript
interface IBuyer {
    email: string;    // Email адрес
    phone: string;    // Номер телефона
    address: string;  // Адрес доставки
}
```

**Требования к полям:**
- `email` - валидный email адрес
- `phone` - номер в формате +7XXXXXXXXXX
- `address` - обязательное поле для доставки

### PaymentMethod
Способы оплаты в системе.

```typescript
type PaymentMethod = 'online' | 'card';
```

### IOrderRequest
Структура заказа для отправки на сервер.

```typescript
interface IOrderRequest {
    payment: PaymentMethod; // Способ оплаты
    email: string;         // Email покупателя
    phone: string;         // Телефон покупателя
    address: string;       // Адрес доставки
    total: number;         // Общая сумма заказа
    items: string[];       // Массив ID товаров
}
```

### IOrderResponse
Ответ сервера при успешном создании заказа.

```typescript
interface IOrderResponse {
    id: string;     // UUID созданного заказа
    total: number;  // Подтвержденная сумма заказа
}
```

### IApiError
Структура ошибки API.

```typescript
interface IApiError {
    error: string;  // Текст ошибки
}
```

**Возможные ошибки:**
- `"NotFound"` - товар не найден
- `"Товар с id {id} не найден"` - конкретный товар отсутствует
- `"Неверная сумма заказа"` - несоответствие расчетной суммы
- `"Не указан адрес"` - отсутствует обязательное поле

## UI Компоненты

### IBasket
Интерфейс для управления корзиной покупок.

```typescript
interface IBasket {
    items: IBasketItem[];           // Товары в корзине
    total: number;                  // Общая сумма
    addItem(product: IProduct): void;      // Добавить товар
    removeItem(productId: string): void;   // Удалить товар
    clearBasket(): void;                   // Очистить корзину
    getItemCount(): number;                // Количество товаров
    getTotalPrice(): number;               // Общая стоимость
}
```

### IBasketItem
Представление товара в корзине.

```typescript
interface IBasketItem {
    id: string;         // ID товара
    title: string;      // Название
    price: number | null; // Цена
    quantity: number;   // Количество
}
```

### ICatalog
Интерфейс для каталога товаров с фильтрацией.

```typescript
interface ICatalog {
    products: IProduct[];                    // Все товары
    selectedCategory?: ProductCategory;      // Выбранная категория
    searchQuery?: string;                    // Поисковый запрос
    setCategory(category: ProductCategory | undefined): void;  // Установить категорию
    setSearchQuery(query: string): void;     // Установить поиск
    getFilteredProducts(): IProduct[];       // Получить отфильтрованные товары
}
```

### IProductCard
Карточка товара в каталоге.

```typescript
interface IProductCard {
    product: IProduct;                           // Данные товара
    isInBasket: boolean;                        // Находится ли в корзине
    onAddToBasket?: (product: IProduct) => void;      // Добавить в корзину
    onRemoveFromBasket?: (productId: string) => void; // Удалить из корзины
    onOpenDetails?: (product: IProduct) => void;      // Открыть детали
}
```

### IProductModal
Модальное окно с деталями товара.

```typescript
interface IProductModal {
    product: IProduct | null;                // Выбранный товар
    isOpen: boolean;                        // Состояние модального окна
    isInBasket: boolean;                    // Находится ли в корзине
    onClose(): void;                        // Закрыть модальное окно
    onAddToBasket?: (product: IProduct) => void;    // Добавить в корзину
    onRemoveFromBasket?: (productId: string) => void; // Удалить из корзины
}
```

### IBuyerForm
Форма ввода данных покупателя.

```typescript
interface IBuyerForm {
    formData: IBuyer;                              // Данные формы
    errors: Partial<IBuyer>;                       // Ошибки валидации
    isValid: boolean;                              // Состояние валидации
    onFieldChange(field: keyof IBuyer, value: string): void; // Изменение поля
    validateForm(): boolean;                       // Валидация формы
    resetForm(): void;                            // Сброс формы
}
```

### IPaymentForm
Форма выбора способа оплаты.

```typescript
interface IPaymentForm {
    selectedPayment: PaymentMethod;              // Выбранный способ
    onPaymentChange(method: PaymentMethod): void; // Изменение способа оплаты
}
```

### IOrderSuccess
Страница успешного оформления заказа.

```typescript
interface IOrderSuccess {
    orderId: string;    // ID созданного заказа
    total: number;      // Сумма заказа
    onClose(): void;    // Закрыть и вернуться в каталог
}
```

## Управление состоянием

### IAppState
Глобальное состояние приложения.

```typescript
interface IAppState {
    catalog: IProduct[];           // Каталог товаров
    basket: IBasketItem[];         // Корзина
    selectedProduct: IProduct | null; // Выбранный товар
    buyer: IBuyer;                 // Данные покупателя
    paymentMethod: PaymentMethod;  // Способ оплаты
    isLoading: boolean;            // Состояние загрузки
    error: string | null;          // Ошибка
}
```

### IAppEvents
Система событий приложения для связи компонентов.

```typescript
interface IAppEvents {
    // Каталог
    'catalog:loaded': IProduct[];
    'catalog:category-changed': ProductCategory | undefined;
    'catalog:search': string;
    
    // Товары
    'product:select': IProduct;
    'product:add-to-basket': IProduct;
    'product:remove-from-basket': string;
    
    // Корзина
    'basket:open': void;
    'basket:close': void;
    'basket:clear': void;
    'basket:item-count-changed': number;
    
    // Покупатель
    'buyer:field-changed': { field: keyof IBuyer; value: string };
    'buyer:validation-error': Partial<IBuyer>;
    
    // Заказ
    'order:create': IOrderRequest;
    'order:success': IOrderResponse;
    'order:error': string;
    
    // UI
    'modal:open': void;
    'modal:close': void;
    'loading:start': void;
    'loading:end': void;
}
```

## API Сервисы

### IWebLarekAPI
Основной сервис для взаимодействия с backend.

```typescript
interface IWebLarekAPI {
    baseUrl: string;
    getProductList(): Promise<IProductListResponse>;  // Получить список товаров
    getProduct(id: string): Promise<IProduct>;        // Получить товар по ID
    createOrder(order: IOrderRequest): Promise<IOrderResponse>; // Создать заказ
}
```

**Методы:**
- `getProductList()` - возвращает все товары каталога
- `getProduct(id)` - получает детальную информацию о товаре
- `createOrder(order)` - отправляет заказ на сервер

### IApiConfig
Конфигурация для API сервиса.

```typescript
interface IApiConfig {
    baseUrl: string;                    // Базовый URL API
    headers?: Record<string, string>;   // Дополнительные заголовки
}
```

### Валидация

### IValidationRules
Правила валидации для форм.

```typescript
interface IValidationRules {
    email: RegExp;      // Регулярное выражение для email
    phone: RegExp;      // Регулярное выражение для телефона
    required: string[]; // Список обязательных полей
}
```

### IValidationResult
Результат валидации формы.

```typescript
interface IValidationResult {
    isValid: boolean;                // Результат валидации
    errors: Record<string, string>;  // Словарь ошибок по полям
}
```

## Вспомогательные типы

### EventHandler
Тип для обработчиков событий.

```typescript
type EventHandler<T = any> = (data: T) => void;
```

### AsyncResult
Обертка для асинхронных операций с обработкой ошибок.

```typescript
type AsyncResult<T> = Promise<{
    success: boolean;
    data?: T;
    error?: string;
}>;
```

### IComponentOptions
Базовые опции для UI компонентов.

```typescript
interface IComponentOptions {
    className?: string;  // CSS класс
    disabled?: boolean;  // Состояние блокировки
}
```

### IFormField
Базовый интерфейс для полей формы.

```typescript
interface IFormField {
    name: string;                        // Имя поля
    value: string;                       // Значение
    placeholder?: string;                // Placeholder текст
    required?: boolean;                  // Обязательное поле
    error?: string;                      // Текст ошибки
    onChange?: (value: string) => void;  // Обработчик изменения
}
```

### IButton
Интерфейс для кнопок.

```typescript
interface IButton extends IComponentOptions {
    text: string;                 // Текст кнопки
    type?: 'button' | 'submit';   // Тип кнопки
    onClick?: () => void;         // Обработчик клика
}
```

### IModal
Интерфейс для модальных окон.

```typescript
interface IModal extends IComponentOptions {
    isOpen: boolean;                      // Состояние открытия
    title?: string;                       // Заголовок
    content: HTMLElement | string;        // Содержимое
    onClose?: () => void;                 // Обработчик закрытия
}
```

## Архитектурные принципы

### Разделение ответственности
- **Данные** - чистые интерфейсы без логики
- **UI Компоненты** - интерфейсы для отображения и взаимодействия
- **Состояние** - управление данными приложения
- **API** - взаимодействие с сервером

### Типизация
- Все интерфейсы строго типизированы
- Использование union types для ограниченных значений
- Nullable типы для опциональных полей

### События
- Слабосвязанная архитектура через систему событий
- Типизированные события для безопасности
- Централизованное управление состоянием

## Примеры использования

### Создание товара
```typescript
const product: IProduct = {
    id: "854cef69-976d-4c2a-a18c-2aa45046c390",
    title: "+1 час в сутках",
    description: "Если планируете решать задачи в тренажёре, берите два.",
    image: "/5_Dots.svg",
    category: "софт-скил",
    price: 750
};
```

### Создание заказа
```typescript
const order: IOrderRequest = {
    payment: "online",
    email: "user@example.com",
    phone: "+71234567890",
    address: "Санкт-Петербург, ул. Восстания, 1",
    total: 2200,
    items: [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
    ]
};
```

### Обработка событий
```typescript
// Добавление товара в корзину
eventEmitter.emit('product:add-to-basket', product);

// Изменение данных покупателя
eventEmitter.emit('buyer:field-changed', {
    field: 'email',
    value: 'new@email.com'
});
```
## Модели данных

## Класс ProductCatalog

### Назначение и зона ответственности
Класс `ProductCatalog` отвечает за управление каталогом товаров в приложении. Он хранит полный список доступных товаров, управляет выбранным для детального просмотра товаром и предоставляет методы для работы с каталогом.

### Конструктор
```typescript
constructor()
```
**Параметры:** отсутствуют.
Конструктор инициализирует пустые массивы и значения по умолчанию.

### Поля класса

| Поле | Тип | Описание |
|------|-----|----------|
| `items` | `IProduct[]` | Массив всех товаров в каталоге. Хранит полный список товаров, полученных с сервера |
| `preview` | `IProduct \| null` | Товар, выбранный для подробного отображения в модальном окне. Может быть `null`, если товар не выбран |

### Методы класса

#### setItems(items: IProduct[]): void
**Назначение:** Сохранение массива товаров в модели каталога.
**Параметры:**
- `items: IProduct[]` - массив товаров для сохранения
  **Возвращаемое значение:** `void`

#### getItems(): IProduct[]
**Назначение:** Получение полного массива товаров из модели.
**Параметры:** отсутствуют
**Возвращаемое значение:** `IProduct[]` - массив всех товаров в каталоге

#### getProduct(id: string): IProduct | null
**Назначение:** Получение конкретного товара по его идентификатору.
**Параметры:**
- `id: string` - уникальный идентификатор товара
  **Возвращаемое значение:** `IProduct | null` - найденный товар или `null`, если товар не найден

#### setPreview(product: IProduct): void
**Назначение:** Сохранение товара для подробного отображения.
**Параметры:**
- `product: IProduct` - товар для детального просмотра
  **Возвращаемое значение:** `void`

#### getPreview(): IProduct | null
**Назначение:** Получение товара, выбранного для подробного отображения.
**Параметры:** отсутствуют
**Возвращаемое значение:** `IProduct | null` - выбранный товар или `null`

---

## Класс Basket

### Назначение и зона ответственности
Класс `Basket` управляет корзиной покупок пользователя. Он отвечает за добавление и удаление товаров, подсчет общей стоимости, учет количества товаров и предоставляет методы для работы с содержимым корзины.

### Конструктор
```typescript
constructor()
```
**Параметры:** отсутствуют.
Конструктор инициализирует пустой массив товаров в корзине.

### Поля класса

| Поле | Тип | Описание |
|------|-----|----------|
| `items` | `IProduct[]` | Массив товаров, добавленных в корзину. Хранит все товары, которые пользователь выбрал для покупки |

### Методы класса

#### getItems(): IProduct[]
**Назначение:** Получение массива товаров, находящихся в корзине.
**Параметры:** отсутствуют
**Возвращаемое значение:** `IProduct[]` - массив товаров в корзине

#### addItem(product: IProduct): void
**Назначение:** Добавление товара в корзину.
**Параметры:**
- `product: IProduct` - товар для добавления в корзину
  **Возвращаемое значение:** `void`

#### removeItem(product: IProduct): void
**Назначение:** Удаление товара из корзины.
**Параметры:**
- `product: IProduct` - товар для удаления из корзины
  **Возвращаемое значение:** `void`

#### clearBasket(): void
**Назначение:** Полная очистка корзины от всех товаров.
**Параметры:** отсутствуют
**Возвращаемое значение:** `void`

#### getTotalPrice(): number
**Назначение:** Получение общей стоимости всех товаров в корзине.
**Параметры:** отсутствуют
**Возвращаемое значение:** `number` - общая сумма заказа (товары с `price: null` не учитываются)

#### getItemCount(): number
**Назначение:** Получение количества товаров в корзине.
**Параметры:** отсутствуют
**Возвращаемое значение:** `number` - количество товаров

#### hasItem(id: string): boolean
**Назначение:** Проверка наличия товара в корзине по его идентификатору.
**Параметры:**
- `id: string` - идентификатор товара для проверки
  **Возвращаемое значение:** `boolean` - `true`, если товар находится в корзине, иначе `false`

---

## Класс Buyer

### Назначение и зона ответственности
Класс `Buyer` управляет данными покупателя при оформлении заказа. Он отвечает за хранение контактной информации, способа оплаты, валидацию введенных данных и предоставляет методы для работы с информацией о покупателе.

### Конструктор
```typescript
constructor()
```
**Параметры:** отсутствуют.
Конструктор инициализирует поля покупателя значениями по умолчанию.

### Поля класса

| Поле | Тип | Описание |
|------|-----|----------|
| `payment` | `TPayment` | Выбранный способ оплаты. Хранит информацию о том, как покупатель планирует оплатить заказ |
| `email` | `string` | Email адрес покупателя. Используется для отправки подтверждения заказа |
| `phone` | `string` | Номер телефона покупателя. Контактный номер для связи |
| `address` | `string` | Адрес доставки заказа. Место, куда нужно доставить товары |

### Методы класса

#### setPayment(payment: TPayment): void
**Назначение:** Установка способа оплаты.
**Параметры:**
- `payment: TPayment` - выбранный способ оплаты
  **Возвращаемое значение:** `void`

#### setEmail(email: string): void
**Назначение:** Установка email адреса покупателя.
**Параметры:**
- `email: string` - email адрес
  **Возвращаемое значение:** `void`

#### setPhone(phone: string): void
**Назначение:** Установка номера телефона покупателя.
**Параметры:**
- `phone: string` - номер телефона
  **Возвращаемое значение:** `void`

#### setAddress(address: string): void
**Назначение:** Установка адреса доставки.
**Параметры:**
- `address: string` - адрес доставки
  **Возвращаемое значение:** `void`

#### setBuyerData(data: Partial<IBuyer>): void
**Назначение:** Массовое обновление данных покупателя.
**Параметры:**
- `data: Partial<IBuyer>` - объект с частичными данными покупателя
  **Возвращаемое значение:** `void`

#### getBuyerData(): IBuyer
**Назначение:** Получение всех данных покупателя.
**Параметры:** отсутствуют
**Возвращаемое значение:** `IBuyer` - полные данные покупателя

#### clearBuyerData(): void
**Назначение:** Очистка всех данных покупателя.
**Параметры:** отсутствуют
**Возвращаемое значение:** `void`

#### validateBuyerData(): { isValid: boolean; errors: Partial<IBuyer> }
**Назначение:** Валидация введенных данных покупателя.
**Параметры:** отсутствуют
**Возвращаемое значение:**
- `{ isValid: boolean; errors: Partial<IBuyer> }` - объект с результатом валидации и списком ошибок по полям

#### isValidEmail(): boolean
**Назначение:** Проверка корректности email адреса.
**Параметры:** отсутствуют
**Возвращаемое значение:** `boolean` - `true`, если email корректный

#### isValidPhone(): boolean
**Назначение:** Проверка корректности номера телефона.
**Параметры:** отсутствуют
**Возвращаемое значение:** `boolean` - `true`, если номер корректный

#### isValidAddress(): boolean
**Назначение:** Проверка заполненности адреса доставки.
**Параметры:** отсутствуют
**Возвращаемое значение:** `boolean` - `true`, если адрес заполнен

---

## Взаимодействие классов

### Схема использования
1. **ProductCatalog** загружает товары с сервера и предоставляет их для отображения
2. **Basket** управляет выбранными товарами и рассчитывает стоимость заказа
3. **Buyer** собирает и валидирует данные покупателя для оформления заказа

### Типичный флоу
```typescript
// Загрузка каталога
const catalog = new ProductCatalog();
catalog.setItems(productsFromAPI);

// Работа с корзиной
const basket = new Basket();
basket.addItem(catalog.getProduct('some-id'));

// Оформление заказа
const buyer = new Buyer();
buyer.setEmail('user@example.com');
buyer.setPhone('+71234567890');
buyer.setAddress('Санкт-Петербург, ул. Восстания, 1');
buyer.setPayment('online');

if (buyer.validateBuyerData().isValid) {
    // Создание заказа
    const orderData = {
        ...buyer.getBuyerData(),
        total: basket.getTotalPrice(),
        items: basket.getItems().map(item => item.id)
    };
}
```

### Слой коммуникации

#### Назначение
Предоставление семантически ясных методов для работы с ресурсами сервера, такими как **товары** и **заказы**.  
Класс преобразует общие `get` и `post` запросы в конкретные действия.

#### Конструктор

```ts
constructor(cdn: string, baseUrl: string, options?: RequestInit)
````

* **cdn: string** — базовый URL для хостинга медиафайлов (изображений товаров).
* **baseUrl: string** — базовый URL сервера API.
* **options?: RequestInit** *(опционально)* — объект с настройками для HTTP-запросов (например, заголовки `headers`), который будет передан в базовый класс `Api`.

---

#### Методы

##### `getProductList(): Promise<IProduct[]>`

Асинхронный метод для получения полного списка товаров, доступных в магазине.

* **Описание:** Выполняет `GET`-запрос к серверу, получает список всех товаров и преобразует относительные пути изображений в абсолютные, используя `cdn` из конструктора.
* **Эндпоинт:** `GET /api/weblarek/product/`
* **Возвращает:** `Promise<IProduct[]>` — массив объектов `IProduct`. В случае ошибки `Promise` будет отклонен.

---

##### `getProduct(id: string): Promise<IProduct>`

Асинхронный метод для получения детальной информации об одном товаре по его уникальному идентификатору.

* **Описание:** Выполняет `GET`-запрос для получения данных одного товара. Также формирует полный URL для изображения.
* **Параметры:**

    * `id: string` — уникальный идентификатор (UUID) товара.
* **Эндпоинт:** `GET /api/weblarek/product/{id}`
* **Возвращает:** `Promise<IProduct>` — объект товара.

---

##### `createOrder(order: IOrderRequest): Promise<IOrderResponse>`

Асинхронный метод для оформления нового заказа.

* **Описание:** Отправляет данные заказа на сервер с помощью `POST`-запроса. Тело запроса содержит информацию о способе оплаты, контактных данных покупателя, адресе, итоговой сумме и составе заказа.
* **Параметры:**

    * `order: IOrderRequest` — объект с данными заказа, соответствующий интерфейсу `IOrderRequest`.
* **Эндпоинт:** `POST /api/weblarek/order/`
* **Возвращает:** `Promise<IOrderResponse>` — объект с `id` созданного заказа и его итоговой `total` суммой.

---

#### Пример использования

```ts
import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';

// 1. Создаем экземпляр класса для работы с API
const api = new WebLarekAPI(CDN_URL, API_URL);

// 2. Вызываем метод для получения списка товаров
api.getProductList()
  .then((products) => {
    // 3. Работаем с полученными данными
    console.log('Товары успешно загружены:');
    console.log(products);

    // Далее эти данные можно передать в модель состояния приложения
    // appData.setCatalog(products);
  })
  .catch((err) => {
    console.error('Произошла ошибка при загрузке товаров:', err);
  });
```
