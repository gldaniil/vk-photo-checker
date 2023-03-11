const cfg = require("./config");

const url = `https://api.vk.com/method/photos.getAll?access_token=${cfg.tokenVk}&v=${cfg.apiVersion}&owner_id=${cfg.idUser}&count=${cfg.countVk}$no_service_albums=${cfg.noServiceAlbum}`;

const getData = async (url) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
    },
  });
  const json = await res.json();
  return json;
};

getData(url)
  .then((data) => {
    data.error.error_code != 30;
    console.log(data);
    console.log("uraa");
  })
  .catch((error) => console.log(error.message));

/** При закрытом профиле возвращает 
 * {
  error: {
    error_code: 30,
    error_msg: 'This profile is private',
    request_params: [ [Object], [Object], [Object], [Object], [Object] ]
  }
}
 */

/** Нужно сделать так, чтобы  */