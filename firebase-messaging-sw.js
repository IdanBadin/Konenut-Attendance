importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging.js');

// Initialize Firebase in the service worker using your firebaseConfig
const firebaseConfig = {
    apiKey: "AIzaSyCcDWbyb6pBnKPtPocjU6qlL_BmjBqXXmY",
    authDomain: "konenut-attendance-app.firebaseapp.com",
    projectId: "konenut-attendance-app",
    storageBucket: "konenut-attendance-app.appspot.com",
    messagingSenderId: "58462445763",
    appId: "1:58462445763:web:6292a67cb85d9ad3b00276",
    measurementId: "G-4P0GPEX7XZ"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
