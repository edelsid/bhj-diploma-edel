/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
   const xhr = new XMLHttpRequest;
   xhr.responseType = "json";

   if (options.method === "GET") {
      if (options.data != null) {
         const urlString = Object.entries(options.data).map(([key, val]) => `${key}=${val}`).join('&');
         options.url = options.url+"?"+urlString;
      }      
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

   } else {
      formData = new FormData;
      if(options.data != null) {
         for (const [key, value] of Object.entries(options.data)) {
            formData.append(key, value);
         }
      }      

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


