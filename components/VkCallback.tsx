import { useEffect } from 'react';
import { mockDb } from '../services/mockDb';
import { User } from '../types';

const VkCallback = () => {
  useEffect(() => {
    // Парсим хэш из URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const userId = params.get('user_id');

    if (!accessToken || !userId) {
      alert('Ошибка авторизации ВК');
      window.location.href = 'http://localhost:3002'; // возврат на главную
      return;
    }

    // Запрос к VK API для получения имени и аватара
    fetch(`https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_200&access_token=${accessToken}&v=5.199`)
      .then(res => res.json())
      .then(data => {
        if (data.response && data.response[0]) {
          const vkUser = data.response[0];

          const currentUser: User = {
            id: `vk_${userId}`,
            email: params.get('email') || `vk${userId}@example.com`, // если email пришёл
            name: `${vkUser.first_name} ${vkUser.last_name}`,
            provider: 'vk',
            avatar: vkUser.photo_200 || 'https://vk.com/images/camera_200.png'
          };

          mockDb.setCurrentUser(currentUser);
          alert(`Добро пожаловать, ${currentUser.name}!`);
          window.location.href = 'http://localhost:3002'; // возврат на главную
        }
      })
      .catch(() => {
        alert('Ошибка получения данных');
        window.location.href = 'http://localhost:3002';
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Входим через ВК...</h2>
        <p>Получаем ваши данные...</p>
      </div>
    </div>
  );
};

export default VkCallback;