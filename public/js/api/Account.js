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
  static get(id, callback){ 
    createRequest({
      url: this.URL + "/" + id.account_id,
      method: 'GET',
      responseType: 'json',
      callback: (err, response) => {
        console.log(response);
        if (response && response.success === true) {
          callback(err, response);
        }
      }
    })
  }
}