/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {

    function logCallback (err, response) {
      if (response && response.success === true) {
        const registerWindow = App.getModal("login");
        let formSpaces = Array.from(registerWindow.element.querySelectorAll(".form-control"));
        formSpaces.forEach (element => element.value = "");
        registerWindow.close();
        App.setState("user-logged");
      }
    }

    User.login(data, logCallback);
  }
}