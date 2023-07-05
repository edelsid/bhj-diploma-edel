/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {

    let data;

    function renderAccCallback (err, response) {
      if (response && response.success === true) {
        const renderSpace = this.element.querySelector(".accounts-select");
        renderSpace.innerHTML = "";
        response.data.forEach(element => {
          renderSpace.add(new Option(element.name, element.id))
          });
        };
      }
    Account.list(data, renderAccCallback.bind(this));
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {

    function submitTranCallback (err, response) {
      if (response && response.success === true) {
        const incWindow = App.getModal("newIncome");
        const takeWindow = App.getModal("newExpense");

        let formSpaces_1 = Array.from(incWindow.element.querySelectorAll(".form-control"));
        formSpaces_1.forEach (element => element.value = "");
        let formSpaces_2 = Array.from(takeWindow.element.querySelectorAll(".form-control"));
        formSpaces_2.forEach (element => element.value = "");
        
        incWindow.close();
        takeWindow.close();
        App.update();
      }
    }
    Transaction.create(data, submitTranCallback);

  }
}