self.addEventListener('push', (event) => {
    try {
        const data = event.data.json();
        const { title, body, icon, url, chatId } = data;

        const options = {
            body: body || 'You have a new message',
            icon: icon || '/logo192.png',
            badge: '/logo192.png',
            data: {
                url: url || '/',
                chatId: chatId
            },
            vibrate: [100, 50, 100],
            actions: [
                { action: 'open', title: 'Open Chat' }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(title || 'New Message', options)
        );
    } catch (err) {
        console.error('Push event error:', err);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let c of clientList) {
                    if (c.focused) {
                        client = c;
                        break;
                    }
                }
                return client.focus().then(c => c.navigate(event.notification.data.url));
            }
            return clients.openWindow(event.notification.data.url);
        })
    );
});
