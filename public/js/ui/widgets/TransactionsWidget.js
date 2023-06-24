/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const addMoney = Array.from(document.querySelectorAll(".create-income-button"));
    const takeMoney = Array.from(document.querySelectorAll(".create-expense-button"));

    addMoney.forEach(element => element.addEventListener("click", () => {
      const addMoneyWindow = App.getModal("newIncome");
      addMoneyWindow.open();
    }));

    takeMoney.forEach(element => element.addEventListener("click", () => {
      const takeMoneyWindow = App.getModal("newExpense");
      takeMoneyWindow.open();
    }));
  }
}
