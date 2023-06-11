/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {

  static URL = "/user";
  static setCurrent(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  static current() {
    return JSON.parse(localStorage.getItem("user"));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    const xhr = createRequest({
      url: this.URL + "/current",
      method: 'GET',
      responseType: 'json',
      callback: (err, response) => {
        if (localStorage.getItem("user") === null) {
          response = {
            "success": false,
            "error": "Необходима авторизация"
          }
          console.log(response);
        }
        if (response && response.success === true) {
          User.setCurrent(response.user);
        } else {
          User.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    const xhr = createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.success === true) {
          this.setCurrent(response.user);
          callback(err, response);
          return false;
        }
        alert(err);      
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    const xhr = createRequest({
      url: this.URL + '/register',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.success === true) {
          this.setCurrent(response.user);
          callback(err, response);
        }
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      responseType: 'json',
      data: this.current(),
      callback: (err, response) => {
        if (response && response.success === true) {
          this.unsetCurrent();
          callback(err, response);
        }
      } 
    });
  }
}
