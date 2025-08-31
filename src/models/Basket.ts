import {IProduct} from "../types";

    /**
     * Класс Basket
     * Назначение: управление корзиной покупок пользователя
     * Зона ответственности: добавление/удаление товаров, подсчет стоимости и количества товаров в корзине
     */
export class Basket {
    private items: IProduct[] = []; // Массив товаров в корзине

    /**
     * Конструктор класса Basket
     * Инициализирует пустой массив товаров в корзине
     */
    constructor() {
        this.items = [];
    }

    /**
     * Получение массива товаров, находящихся в корзине
     * @returns массив товаров в корзине
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Добавление товара в корзину
     * @param product - товар для добавления в корзину
     */
    addItem(product: IProduct): void {
        // Проверяем, что товар еще не добавлен в корзину
        if (!this.hasItem(product.id)) {
            this.items.push(product);
        }
    }

    /**
     * Удаление товара из корзины
     * @param product - товар для удаления из корзины
     */
    removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item.id !== product.id);
    }

    /**
     * Полная очистка корзины от всех товаров
     */
    clearBasket(): void {
        this.items = [];
    }

    /**
     * Получение общей стоимости всех товаров в корзине
     * @returns общая сумма заказа (товары с price: null не учитываются)
     */
    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            if (item.price !== null) {
                return total + item.price;
            }
            return total;
        }, 0);
    }

    /**
     * Получение количества товаров в корзине
     * @returns количество товаров
     */
    getItemCount(): number {
        return this.items.length;
    }

    /**
     * Проверка наличия товара в корзине по его идентификатору
     * @param id - идентификатор товара для проверки
     * @returns true, если товар находится в корзине, иначе false
     */
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}