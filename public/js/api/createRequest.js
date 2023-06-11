/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
   const xhr = new XMLHttpRequest;
   xhr.responseType = "json";

   if (options.method === "GET") {
      try {
         xhr.open(options.method, options.url);
         xhr.send();
      }
      catch (e) {
         callback(e);
      }
      xhr.onload = () => {
         if (xhr.response.error) {
            err = xhr.response.error;
            options.callback(err, xhr.response);
         }
         options.callback(null, xhr.response);
      }      

   } else if (options.method === "POST" || options.method === "PUT" || options.method === "DELETE") {
      formData = new FormData;
      formData.append("name", options.data.name);
      formData.append("email", options.data.email);
      formData.append("password", options.data.password);

      try {
         xhr.open(options.method, options.url);
         xhr.send(formData);
      }
      catch (e) {
         callback(e);
      }
      
      xhr.onload = () => {
         if (xhr.response.error) {
            err = xhr.response.error;
            options.callback(err, xhr.response);
            return false;
         }
         options.callback(null, xhr.response);
      }
   }   
};


