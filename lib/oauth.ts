// lib/oauth.ts

export const loginWithYandex = () => {
  const clientId = import.meta.env.VITE_YANDEX_CLIENT_ID;

  if (!clientId) {
    alert("Ошибка: YANDEX_CLIENT_ID не найден в .env файле");
    return;
  }

  const redirectUri = encodeURIComponent("http://localhost:5173/auth/success");

  const yandexAuthUrl =
    `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=login:email login:info login:default_phone`;

  window.location.href = yandexAuthUrl;
};

export const loginWithVk = () => {
  const clientId = import.meta.env.VITE_VK_CLIENT_ID;

  if (!clientId) {
    alert("Ошибка: VK_CLIENT_ID не найден в .env");
    return;
  }

  const redirectUri = encodeURIComponent("https://oauth.vk.com/blank.html");

  const vkAuthUrl =
    `https://oauth.vk.com/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&display=page` +
    `&response_type=token` +
    `&v=5.199`;

  window.location.href = vkAuthUrl;
};