/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */
  static URL = "/account";
  static get(id = '', callback){ 
    createRequest({
      url: this.URL,
      method: 'GET',
      callback: (err, response) => {
        console.log("11")
      }
    })
    const accountNum = Account.URL + id;
  }
}
