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

document.addEventListener("DOMContentLoaded", function() {
    const presentButton = document.getElementById("presentButton");
    const absentButton = document.getElementById("absentButton");
    const nameSelect = document.getElementById("nameSelect");
    const nameSearch = document.getElementById("nameSearch");

    const presentList = document.getElementById("presentList");
    const absentList = document.getElementById("absentList");

    const presentCount = document.getElementById("presentCount");
    const absentCount = document.getElementById("absentCount");

    const toListPage = document.getElementById("toListPage");
    const toSelectionPage = document.getElementById("toSelectionPage");

    const attendanceRef = db.collection("attendance");

    let attendanceData = {
        present: [],
        absent: []
    };

    // Only add event listener if nameSearch exists (i.e., on the index page)
    if (nameSearch) {
        nameSearch.addEventListener('input', function() {
            const filter = nameSearch.value.toLowerCase();
            const options = nameSelect.options;

            for (let i = 1; i < options.length; i++) {
                const txtValue = options[i].textContent || options[i].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    options[i].style.display = "";
                } else {
                    options[i].style.display = "none";
                }
            }
        });
    }

    // Function to update UI with Firestore data
    function updateUI() {
        attendanceRef.doc("current").get().then((doc) => {
            if (doc.exists) {
                attendanceData = doc.data();
                renderLists(); // Update the lists and button counts
            }
        });
    }

    // Function to render lists
    function renderLists() {
        const phoneNumbers = {
            "עידן בדין": "+972502266557",  // Example phone number for עידן בדין
            "דודי טוביהו": "+972501234567",  // Add the correct phone number here
            "מירון בדין": "+972509876543"    // Add the correct phone number here
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

        if (presentButton) {
            presentButton.querySelector('span').textContent = `${attendanceData.present.length}`;
        }

        if (absentButton) {
            absentButton.querySelector('span').textContent = `${attendanceData.absent.length}`;
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
            });
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    }

    function resetNameSelect() {
        if (nameSelect) {
            nameSelect.value = "";
        }
        if (nameSearch) {
            nameSearch.value = "";
        }
        const options = nameSelect ? nameSelect.options : [];
        for (let i = 1; i < options.length; i++) {
            options[i].style.display = "";
        }
    }

    if (presentButton) {
        presentButton.addEventListener("click", () => handleAttendance("present"));
    }

    if (absentButton) {
        absentButton.addEventListener("click", () => handleAttendance("absent"));
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

    updateUI();
    document.body.classList.add('fade-in');
});
