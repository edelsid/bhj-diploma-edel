/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {

    function regCallback (err, response) {
      if (response && response.success === true) {
        const registerWindow = App.getModal("register");
        let formSpaces = Array.from(registerWindow.element.querySelectorAll(".form-control"));
        formSpaces.forEach (element => element.value = "");
        registerWindow.close();
        App.setState("user-logged");
      }
    }

    User.register(data, regCallback);

  }
}