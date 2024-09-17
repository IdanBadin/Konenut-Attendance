// Firebase configuration (use your actual details here)
const firebaseConfig = {
    apiKey: "AIzaSyCcDWbyb6pBnKPtPocjU6qlL_BmjBqXXmY",
    authDomain: "konenut-attendance-app.firebaseapp.com",
    projectId: "konenut-attendance-app",
    storageBucket: "konenut-attendance-app.appspot.com",
    messagingSenderId: "58462445763",
    appId: "1:58462445763:web:6292a67cb85d9ad3b00276",
    measurementId: "G-4P0GPEX7XZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const messaging = firebase.messaging();

// Register the service worker for Firebase Messaging
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(function (registration) {
            console.log('Service Worker registered with scope:', registration.scope);
            messaging.useServiceWorker(registration);  // Attach the service worker to Firebase messaging
        })
        .catch(function (error) {
            console.error('Service Worker registration failed:', error);
        });
} else {
    console.error('Service Worker is not supported in this browser.');
}

document.addEventListener("DOMContentLoaded", function () {
    const presentButton = document.getElementById("presentButton");
    const absentButton = document.getElementById("absentButton");
    const nameSelect = document.getElementById("nameSelect");
    const popupMessage = document.getElementById("popupMessage");
    const closePopupButton = document.getElementById("closePopupButton");

    const presentList = document.getElementById("presentList");
    const absentList = document.getElementById("absentList");

    const presentCount = document.getElementById("presentCount");
    const absentCount = document.getElementById("absentCount");

    const toListPage = document.getElementById("toListPage");
    const toSelectionPage = document.getElementById("toSelectionPage");

    const sosButton = document.getElementById("sosButton");

    const attendanceRef = db.collection("attendance");

    let attendanceData = {
        present: [],
        absent: []
    };

    // Initialize Select2 only if the select element is present
    if (nameSelect) {
        $(document).ready(function () {
            $('#nameSelect').select2({
                placeholder: "בחר שם",
                allowClear: true,
                language: {
                    inputTooShort: function () { return "חפש שם"; },
                    noResults: function () { return "אין תוצאות"; }
                },
                dropdownCssClass: 'big-dropdown',
                searchInputPlaceholder: 'חפש שם'
            });
        });
    }

    function updateUI() {
        attendanceRef.doc("current").get().then((doc) => {
            if (doc.exists) {
                attendanceData = doc.data();
                renderLists(); // Update the lists and button counts
            }
        });
    }

    function renderLists() {
        const phoneNumbers = {
            // Example phone numbers mapped to names
            "דודי טוביהו": "+972536062619",
            // (Other numbers here)
        };

        if (presentList && absentList) {
            presentList.innerHTML = "";
            absentList.innerHTML = "";

            attendanceData.present.forEach(name => {
                const li = document.createElement("li");
                li.textContent = name;

                if (phoneNumbers[name]) {
                    const phoneIcon = document.createElement('a');
                    phoneIcon.href = `tel:${phoneNumbers[name]}`;
                    phoneIcon.className = 'phone-icon';
                    phoneIcon.innerHTML = '<i class="fas fa-phone"></i>';
                    li.appendChild(phoneIcon);

                    const whatsappIcon = document.createElement('a');
                    whatsappIcon.href = `https://wa.me/${phoneNumbers[name].replace('+', '')}`;
                    whatsappIcon.className = 'whatsapp-icon';
                    whatsappIcon.innerHTML = '<i class="fab fa-whatsapp"></i>';
                    li.appendChild(whatsappIcon);
                }

                li.classList.add('list-item-hidden');
                presentList.appendChild(li);
            });

            attendanceData.absent.forEach(name => {
                const li = document.createElement("li");
                li.textContent = name;

                if (phoneNumbers[name]) {
                    const phoneIcon = document.createElement('a');
                    phoneIcon.href = `tel:${phoneNumbers[name]}`;
                    phoneIcon.className = 'phone-icon';
                    phoneIcon.innerHTML = '<i class="fas fa-phone"></i>';
                    li.appendChild(phoneIcon);

                    const whatsappIcon = document.createElement('a');
                    whatsappIcon.href = `https://wa.me/${phoneNumbers[name].replace('+', '')}`;
                    whatsappIcon.className = 'whatsapp-icon';
                    whatsappIcon.innerHTML = '<i class="fab fa-whatsapp"></i>';
                    li.appendChild(whatsappIcon);
                }

                li.classList.add('list-item-hidden');
                absentList.appendChild(li);
            });

            setTimeout(() => {
                document.querySelectorAll('.list-item-hidden').forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('list-item-visible');
                        item.classList.remove('list-item-hidden');
                    }, index * 100);
                });
            }, 100);

            if (presentCount) {
                presentCount.textContent = `${attendanceData.present.length}`;
            }

            if (absentCount) {
                absentCount.textContent = `${attendanceData.absent.length}`;
            }
        }
    }

    function handleAttendance(status) {
        const selectedName = nameSelect ? nameSelect.value : null;
        if (!selectedName) {
            alert("אנא בחר שם");
            return;
        }

        attendanceRef.doc("current").get().then((doc) => {
            if (doc.exists) {
                attendanceData = doc.data();
            }

            attendanceData.present = attendanceData.present.filter(name => name !== selectedName);
            attendanceData.absent = attendanceData.absent.filter(name => name !== selectedName);

            if (status === "present") {
                attendanceData.present.push(selectedName);
            } else {
                attendanceData.absent.push(selectedName);
            }

            attendanceRef.doc("current").set(attendanceData).then(() => {
                updateUI();
                resetNameSelect();
                showPopup();
            });
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    }

    function resetNameSelect() {
        if (nameSelect) {
            $('#nameSelect').val(null).trigger('change');
        }
    }

    function showPopup() {
        popupMessage.style.display = "block";
    }

    function hidePopup() {
        popupMessage.style.display = "none";
    }

    if (presentButton) {
        presentButton.addEventListener("click", () => handleAttendance("present"));
    }

    if (absentButton) {
        absentButton.addEventListener("click", () => handleAttendance("absent"));
    }

    if (closePopupButton) {
        closePopupButton.addEventListener("click", hidePopup);
    }

    if (toListPage) {
        toListPage.addEventListener("click", () => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = "lists.html";
            }, 500);
        });
    }

    if (toSelectionPage) {
        toSelectionPage.addEventListener("click", () => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        });
    }

    if (sosButton) {
        sosButton.addEventListener("click", sendSOSNotification);
    }

    updateUI();
    document.body.classList.add('fade-in');

    requestNotificationPermission();
});

function requestNotificationPermission() {
    messaging.requestPermission()
        .then(() => {
            console.log('Notification permission granted.');
            return messaging.getToken();
        })
        .then(token => {
            console.log('Token received:', token);
            storeToken(token);
        })
        .catch(error => {
            if (error.code === 'messaging/permission-blocked') {
                console.error('Permission blocked. Please enable notifications in your browser settings.');
                alert('Notification permission was blocked. Please enable notifications in your browser settings.');
            } else {
                console.error('Unable to get permission to notify:', error);
            }
        });
}

function storeToken(token) {
    const userID = 'test_user';
    db.collection('userTokens').doc(userID).set({
        token: token
    })
    .then(() => {
        console.log('Token successfully stored in Firestore.');
    })
    .catch(error => {
        console.error('Error storing token in Firestore:', error);
    });
}

function sendSOSNotification() {
    console.log('Attempting to send SOS notification');

    const userID = 'test_user';
    db.collection('userTokens').doc(userID).get().then((doc) => {
        if (doc.exists) {
            const token = doc.data().token;
            console.log('Token retrieved:', token);
            fetch('http://localhost:3000/send-sos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tokens: [token]
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log('SOS notification sent successfully.');
                } else {
                    console.error('Failed to send SOS notification.');
                }
            })
            .catch(error => {
                console.error('Error sending SOS notification:', error);
            });
        } else {
            console.error('No token found for user.');
        }
    }).catch((error) => {
        console.error('Error retrieving token from Firestore:', error);
    });
}