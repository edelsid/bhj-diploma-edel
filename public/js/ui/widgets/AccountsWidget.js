/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element === null) {
      throw new Error ("В конструктор передан пустой элемент");
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const accBtn = document.querySelector(".create-account");
    accBtn.addEventListener("click", () =>{
      const accWindow = App.getModal("createAccount");
      accWindow.open();
    })
    const accList = Array.from(document.querySelectorAll(".account"));
    accList.forEach (element => element.addEventListener("click", () => {
      this.onSelectAccount(element);
    }))
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {

    function updCallback (err, response) {
      if (response && response.success === true) {
        const accList = response.data;
        this.clear();        
        accList.forEach (element => this.renderItem(element));
        this.registerEvents();
        return false;
      }
    }
    if (User.current() != null) {
      const data = User.current();       
      Account.list(data, updCallback.bind(this));      
  }
}

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const deleteList = Array.from(document.querySelectorAll(".account"));
    deleteList.forEach (element => element.parentNode.removeChild(element));
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    element.classList.toggle("active");
    App.showPage('transactions', {account_id: element.dataset.id})
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const output = `
    <li class="active account" data-id="`+item.id+`">
      <a href="#">
        <span>`+item.name+`</span> / 
        <span>`+item.sum+`</span>
      </a>
    </li>`;
    return output;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const accPanel = document.querySelector(".accounts-panel");
    const newAcc = this.getAccountHTML(data);
    accPanel.insertAdjacentHTML("beforeend", newAcc);
  }
}
