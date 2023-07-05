/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (element === null) {
      throw new Error ("В конструктор передан пустой элемент");
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions != null) {
      this.render(this.lastOptions);
    } else {
      this.render(); 
    }       
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const accButton = document.querySelector(".remove-account");
    const tranButton = Array.from(document.querySelectorAll(".transaction__remove"));
    accButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.removeAccount();
    })
    if (tranButton != null) {
      tranButton.forEach(element => element.addEventListener("click", (event) => {
        event.preventDefault();
        let id = {"id": element.dataset.id};
        this.removeTransaction(id);
      }))
    }
    
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions != null) {
      let ask = confirm("Вы действительно хотите удалить счёт?");
      if (ask) {
        function removeCallback (err, response) {
          if (response && response.success === true) {
            App.updateWidgets();
            App.updateForms();
          }
        }
        const data = {"id": this.lastOptions.account_id};
        Account.remove(data, removeCallback);
        this.clear();
      }
    }    
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let ask = confirm("Вы действительно хотите удалить эту транзакцию?");
      if (ask) {
        function removeCallback (err, response) {
          if (response && response.success === true) {
            App.update();
          }
        }
      Transaction.remove(id, removeCallback.bind(this));
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options != undefined) {
      this.lastOptions = options;
      function rendCallback (err, response) {
        if (response && response.success === true) {
          console.log(response);
          this.renderTitle(response.data.name);
        }
      }

      function tranCallback (err, response) {
        if (response && response.success === true) {
          console.log(response);
          this.renderTransactions(response.data)
        }
      }

      Account.get(options, rendCallback.bind(this));
      Transaction.list(options, tranCallback.bind(this));    
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    let data = [];
    this.renderTransactions(data);
    this.renderTitle("Название счёта");
    this.lastOptions = "";
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const titleSpace = document.querySelector(".content-title");
    titleSpace.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const newString = date.replace(/ /g, "T");
    const trueDate = new Date(Date.parse(newString));
    const dayMonthYear = trueDate.toLocaleString("ru", {month: "long", day: "numeric", year: "numeric"});
    const hourMin = trueDate.toLocaleString("ru", {hour: "2-digit", minute: "2-digit"});
    const displayDate = dayMonthYear + " в " + hourMin;
    return displayDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const date = this.formatDate(item.created_at);
    let typeString;
    if (item.type === "income") {
      typeString = "transaction_income";
    } else if (item.type === "expense") {
      typeString = "transaction_expense";
    }
    const output = `
    <div class="transaction `+typeString+` row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">`+item.name+`</h4>
          <div class="transaction__date">`+date+`</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">`+
          item.sum+`<span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="`+item.id+`">
          <i class="fa fa-trash"></i>  
        </button>
      </div>
    </div>`
    return output;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const tranPanel = document.querySelector(".content");
    let allData = "";
    data.forEach(entry => {
      const output = this.getTransactionHTML(entry);
      allData = allData + output;
    });  
    tranPanel.innerHTML = allData;
    const tranButton = Array.from(document.querySelectorAll(".transaction__remove"));
    tranButton.forEach(element => element.addEventListener("click", (event) => {
      event.preventDefault();
      let id = {"id": element.dataset.id};
      this.removeTransaction(id);
    }))
  }
}