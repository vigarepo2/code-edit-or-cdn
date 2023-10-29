addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { method, body } = request;

  if (method === 'POST') {
    const json = await request.json();
    const chatId = json.message.chat.id;
    const messageText = json.message.text;

    if (json.message.forward_from_chat) {
      // Handle forwarded messages and extract channel or group ID
      const forwardedChatId = json.message.forward_from_chat.id;
      const responseText = `<b>Your User ID is:</b> <code>${json.message.from.id}</code>\n\n<b>Forwarded from:</b> <code>${forwardedChatId}</code>`;
      await sendMessage(chatId, responseText);
    } else if (json.message.reply_to_message) {
      // Handle replies to forwarded messages
      const repliedMessage = json.message.reply_to_message;
      if (repliedMessage.forward_from_chat) {
        const repliedChatId = repliedMessage.forward_from_chat.id;
        const responseText = `<b>Your User ID is:</b> <code>${json.message.from.id}</code>\n\n<b>Replied to a message from:</b> <code>${repliedChatId}</code>`;
        await sendMessage(chatId, responseText);
      }
    } else if (messageText === '/start') {
      // Handle the /start command
      const responseText = 'Welcome to your Telegram bot!\n\n<b>Your User ID is:</b> <code>' + json.message.from.id + '</code>\n\n<b>Bot By:</b> <i>@DokuBots</i>';
      await sendMessage(chatId, responseText);
    } else if (messageText === '/id') {
      // Handle the /id command
      if (chatId !== json.message.from.id) {
        // The /id command was used in a group, send both user and group IDs
        const responseText = `<b>Your User ID is:</b> <code>${json.message.from.id}</code>\n<b>Group ID is:</b> <code>${chatId}</code>`;
        await sendMessage(chatId, responseText);
      } else {
        // The /id command was used in a private chat
        const responseText = `<b>Your User ID is:</b> <code>${json.message.from.id}</code>`;
        await sendMessage(chatId, responseText);
      }
    }
  }

  return new Response('OK', { status: 200 });
}

async function sendMessage(chatId, text) {
  const telegramBotToken = '6149643691:AAHKuAEL5BLub8NGDi77ngjy6nqvI-SkmGg'; // Replace with your actual Telegram bot token
  const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML', // To enable HTML formatting
    }),
  };

  await fetch(apiUrl, params);
}
