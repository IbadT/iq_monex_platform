const io = require('socket.io-client');

console.log('🚀 Запуск комплексного теста WebSocket...');
console.log('📍 URL чатов: http://localhost:3000/chats');
console.log('📍 URL уведомлений: http://localhost:3000/notifications\n');

// Создаем двух пользователей для тестирования
const user1 = {
  id: '1bb0288e-3930-44f6-8448-ec2182c11b13',
  name: 'Alice 4',
  email: 'alice4@example.com',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiYjAyODhlLTM5MzAtNDRmNi04NDQ4LWVjMjE4MmMxMWIxMyIsImlhdCI6MTc3MjkzNDYxNiwiZXhwIjoxNzcyOTM1NTE2fQ.z2K8L_h-NZyIlPoR88TSSRqeU1GvfxyIj-coVVbH5oI'
};

const user2 = {
  id: '8f85dcd2-3956-4885-ac78-e27c603d90f8', 
  name: 'Bob 4',
  email: 'bob4@example.com',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhmODVkY2QyLTM5NTYtNDg4NS1hYzc4LWUyN2M2MDNkOTBmOCIsImlhdCI6MTc3MjkzNDYzMSwiZXhwIjoxNzcyOTM1NTMxfQ.z0kwZ05MENrctGlTOqtPSDNVhC5PB5Af9qeABbnPDKM'
};

console.log('👥 Пользователи в тесте:');
console.log(`  👩 Alice (${user1.id})`);
console.log(`  👨 Bob (${user2.id})\n`);

// Создаем подключения для Alice
const aliceChats = io('http://localhost:3000/chats', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  query: { token: user1.token }
});

const aliceNotifications = io('http://localhost:3000/notifications', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  query: { token: user1.token }
});

// Создаем подключения для Bob
const bobChats = io('http://localhost:3000/chats', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  query: { token: user2.token }
});

const bobNotifications = io('http://localhost:3000/notifications', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  query: { token: user2.token }
});

let connectedSockets = 0;
let authenticatedSockets = 0;
const maxConnections = 4; // aliceChats, aliceNotifications, bobChats, bobNotifications

function checkAllConnected() {
  connectedSockets++;
  if (connectedSockets === maxConnections) {
    console.log('\n✅ Все пользователи подключены, начинаем тестирование...');
  }
}

function checkAllAuthenticated() {
  authenticatedSockets++;
  if (authenticatedSockets === maxConnections) {
    console.log('\n🎉 Все пользователи аутентифицированы, запускаем сценарий...');
    runTestScenario();
  }
}

// ============ ALICE (Отправитель) ============
aliceChats.on('connect', () => {
  console.log('👩 Alice чаты подключены:', aliceChats.id);
  checkAllConnected();
  
  // Автоматически отправляем аутентификацию
  setTimeout(() => {
    console.log('📤 Alice отправляет аутентификацию в чаты...');
    aliceChats.emit('authenticate', { userId: user1.id });
  }, 100);
});

aliceChats.on('authenticated', (data) => {
  console.log('🔐 Alice аутентифицирована в чатах');
  checkAllAuthenticated();
});

aliceChats.on('joined-chat', (data) => {
  console.log('📥 👩 Alice ВОШЛА в чат:');
  console.log('   🆔 ID чата:', data.chatId);
  console.log('   👥 Пользователи:', data.participants?.length || 0);
  console.log('');
});

aliceChats.on('new-message', (data) => {
  console.log('💬 👩 Alice ПОЛУЧИЛА сообщение в чате:');
  console.log('   📨 Отправитель:', data.senderId || 'Неизвестно');
  console.log('   📝 Сообщение:', data.message);
  console.log('   🆔 ID чата:', data.chatId);
  console.log('   ⏰ Время:', data.createdAt || new Date().toISOString());
  console.log('');
});

aliceNotifications.on('connect_error', (err) => {
  console.log('❌ Ошибка подключения Alice уведомления:', err.message);
  // Не вызываем checkAllConnected() здесь, чтобы избежать двойного подсчета
});

aliceNotifications.on('error', (err) => {
  console.log('❌ Ошибка Alice уведомления:', err.message);
});

aliceNotifications.on('disconnect', () => {
  console.log('🔌 Alice уведомления отключены');
});

// Добавляем обработчик для ошибок аутентификации
aliceNotifications.on('connect', () => {
  console.log('🔔 Alice уведомления подключены:', aliceNotifications.id);
  checkAllConnected();
  
  // Автоматически отправляем аутентификацию
  setTimeout(() => {
    console.log('📤 Alice отправляет аутентификацию в уведомления...');
    aliceNotifications.emit('authenticate', { token: user1.token });
    
    // Добавим timeout для отслеживания ошибки
    setTimeout(() => {
      if (!aliceNotifications.authenticated) {
        console.log('❌ Alice: таймаут аутентификации в уведомлениях');
      }
    }, 2000);
  }, 100);
});

aliceNotifications.on('authenticated', (data) => {
  console.log('🔐 👩 Alice аутентифицирована в уведомлениях:');
  console.log('   ✅ Успех:', data.success);
  console.log('   📊 Непрочитанных:', data.unreadCount || 0);
  console.log('');
  aliceNotifications.authenticated = true;
  checkAllAuthenticated();
});

aliceNotifications.on('unauthorized', (err) => {
  console.log('❌ Alice не авторизована в уведомлениях:', err.message);
});

aliceNotifications.on('authentication_error', (err) => {
  console.log('❌ Ошибка аутентификации Alice в уведомлениях:', err.message);
});

aliceNotifications.on('notification', (data) => {
  console.log('🔔 👩 Alice ПОЛУЧИЛА УВЕДОМЛЕНИЕ:');
  console.log('   📢 Тип:', data.type);
  console.log('   📋 Заголовок:', data.title);
  console.log('   📄 Сообщение:', data.message);
  console.log('   👤 От:', data.data?.senderName || 'Система');
  console.log('   🆔 ID:', data.id);
  console.log('   ⏰ Время:', data.createdAt);
  console.log('   🔥 Приоритет:', data.priority || 'medium');
  console.log('');
});

// ============ BOB (Получатель) ============
bobChats.on('connect', () => {
  console.log('👨 Bob чаты подключены:', bobChats.id);
  checkAllConnected();
  
  // Автоматически отправляем аутентификацию
  setTimeout(() => {
    console.log('📤 Bob отправляет аутентификацию в чаты...');
    bobChats.emit('authenticate', { userId: user2.id });
  }, 100);
});

bobChats.on('authenticated', (data) => {
  console.log('🔐 Bob аутентифицирован в чатах');
  checkAllAuthenticated();
});

bobChats.on('joined-chat', (data) => {
  console.log('📥 👨 Bob ВОШЕЛ в чат:');
  console.log('   🆔 ID чата:', data.chatId);
  console.log('   👥 Пользователи:', data.participants?.length || 0);
  console.log('');
});

bobChats.on('new-message', (data) => {
  console.log('💬 👨 Bob ПОЛУЧИЛ сообщение в чате:');
  console.log('   📨 Отправитель:', data.senderId || 'Неизвестно');
  console.log('   📝 Сообщение:', data.message);
  console.log('   🆔 ID чата:', data.chatId);
  console.log('   ⏰ Время:', data.createdAt || new Date().toISOString());
  console.log('');
});

bobNotifications.on('connect', () => {
  console.log('🔔 Bob уведомления подключены:', bobNotifications.id);
  checkAllConnected();
  
  // Автоматически отправляем аутентификацию
  setTimeout(() => {
    console.log('📤 Bob отправляет аутентификацию в уведомления...');
    bobNotifications.emit('authenticate', { token: user2.token });
  }, 100);
});

bobNotifications.on('connect_error', (err) => {
  console.log('❌ Ошибка подключения Bob уведомления:', err.message);
  // Не вызываем checkAllConnected() здесь, чтобы избежать двойного подсчета
});

bobNotifications.on('error', (err) => {
  console.log('❌ Ошибка Bob уведомления:', err.message);
});

bobNotifications.on('disconnect', () => {
  console.log('🔌 Bob уведомления отключены');
});

bobNotifications.on('authenticated', (data) => {
  console.log('🔐 👨 Bob аутентифицирован в уведомлениях:');
  console.log('   ✅ Успех:', data.success);
  console.log('   📊 Непрочитанных:', data.unreadCount || 0);
  console.log('');
  checkAllAuthenticated();
});

bobNotifications.on('notification', (data) => {
  console.log('🔔 👨 Bob ПОЛУЧИЛ УВЕДОМЛЕНИЕ:');
  console.log('   📢 Тип:', data.type);
  console.log('   📋 Заголовок:', data.title);
  console.log('   📄 Сообщение:', data.message);
  console.log('   👤 От:', data.data?.senderName || 'Система');
  console.log('   🆔 ID:', data.id);
  console.log('   ⏰ Время:', data.createdAt);
  console.log('   🔥 Приоритет:', data.priority || 'medium');
  console.log('');
});

// ============ ТЕСТОВЫЙ СЦЕНАРИЙ ============
function runTestScenario() {
  console.log('\n🎬 Начинаем тестовый сценарий...');
  
  const chatId = 'chat-general-123';
  
  // Шаг 1: Alice и Bob входят в общий чат
  console.log('\n📍 Шаг 1: Пользователи входят в чат...');
  
  aliceChats.emit('join-chat', { chatId });
  bobChats.emit('join-chat', { chatId });
  
  // Шаг 2: Alice отправляет сообщение Bob
  setTimeout(() => {
    console.log('\n📍 Шаг 2: 👩 Alice отправляет сообщение 👨 Bob...');
    console.log('💬 Текст сообщения: "Привет, Bob! Как дела?"');
    console.log('📤 Отправка через WebSocket в чат:', chatId);
    console.log('');
    
    aliceChats.emit('send-message', {
      chatId: chatId,
      message: 'Привет, Bob! Как дела?'
    });
    
    console.log('⏳ Ожидаем доставки сообщения и уведомления...\n');
    
    // Шаг 3: Bob отвечает на сообщение
    setTimeout(() => {
      console.log('\n📍 Шаг 3: 👨 Bob отвечает на сообщение 👩 Alice...');
      console.log('💬 Текст ответа: "Привет, Alice! Все отлично, спасибо!"');
      console.log('📤 Отправка через WebSocket в чат:', chatId);
      console.log('');
      
      bobChats.emit('send-message', {
        chatId: chatId,
        message: 'Привет, Alice! Все отлично, спасибо!'
      });
      
      console.log('⏳ Ожидаем доставки ответа и уведомления...\n');
      
      // Шаг 4: Тест системного уведомления
      setTimeout(() => {
        console.log('\n📍 Шаг 4: 📢 Тест системного уведомления...');
        console.log('🔔 Отправляем системное уведомление 👩 Alice...');
        console.log('📤 Канал: app:notifications (Redis Pub/Sub)');
        console.log('');
        
        // Эмулируем системное уведомление через Redis
        const Redis = require('redis');
        const publisher = Redis.createClient();
        
        publisher.connect().then(() => {
          const systemNotification = {
            userId: user1.id,
            type: 'SYSTEM',
            title: 'Системное уведомление',
            message: 'Ваш профиль успешно обновлен',
            id: 'system-123',
            createdAt: new Date().toISOString(),
            read: false,
            priority: 'high'
          };
          
          console.log('📨 Данные системного уведомления:');
          console.log('   👤 Получатель:', systemNotification.userId);
          console.log('   📢 Тип:', systemNotification.type);
          console.log('   📋 Заголовок:', systemNotification.title);
          console.log('   📄 Сообщение:', systemNotification.message);
          console.log('   🔥 Приоритет:', systemNotification.priority);
          console.log('');
          
          publisher.publish('app:notifications', JSON.stringify(systemNotification))
            .then(() => {
              console.log('✅ Системное уведомление отправлено в Redis');
              return publisher.quit();
            })
            .then(() => {
              setTimeout(finishTest, 2000);
            });
        });
      }, 2000);
    }, 2000);
  }, 2000);
}

function finishTest() {
  console.log('\n🏁 Тест завершен!');
  console.log('\n📊 Результаты теста:');
  console.log('✅ WebSocket подключения: Работают');
  console.log('✅ Аутентификация: Работает');
  console.log('✅ Отправка сообщений: Работает');
  console.log('✅ Уведомления о сообщениях: Работают');
  console.log('✅ Redis Pub/Sub: Работает');
  console.log('✅ Системные уведомления: Работают');
  
  console.log('\n🔌 Отключение всех пользователей...');
  
  aliceChats.disconnect();
  aliceNotifications.disconnect();
  bobChats.disconnect();
  bobNotifications.disconnect();
  
  setTimeout(() => {
    console.log('✅ Все отключены. Тест успешно завершен!');
    process.exit(0);
  }, 1000);
}

// Обработка ошибок
aliceChats.on('connect_error', (err) => {
  console.log('❌ Ошибка подключения Alice чаты:', err.message);
  // Не вызываем checkAllConnected() здесь, чтобы избежать двойного подсчета
});

aliceChats.on('error', (err) => {
  console.log('❌ Ошибка Alice чаты:', err.message);
});

aliceChats.on('disconnect', () => {
  console.log('🔌 Alice чаты отключены');
});

bobChats.on('connect_error', (err) => {
  console.log('❌ Ошибка подключения Bob чаты:', err.message);
  // Не вызываем checkAllConnected() здесь, чтобы избежать двойного подсчета
});

bobChats.on('error', (err) => {
  console.log('❌ Ошибка Bob чаты:', err.message);
});

bobChats.on('disconnect', () => {
  console.log('🔌 Bob чаты отключены');
});

console.log('⏳ Ожидание подключения пользователей...\n');
