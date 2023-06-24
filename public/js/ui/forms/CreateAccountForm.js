/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {

    function accCallback (err, response) {
      if (response && response.success === true) {
        const accWindow = App.getModal("createAccount");
        let formSpaces = Array.from(accWindow.element.querySelectorAll(".form-control"));
        formSpaces.forEach (element => element.value = "");
        accWindow.close();
        App.update();
      }
    }

    Account.create(data, accCallback);

  }
}