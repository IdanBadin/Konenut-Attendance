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
    const popupMessage = document.getElementById("popupMessage");
    const closePopupButton = document.getElementById("closePopupButton");

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

    // Initialize Select2 only if the select element is present
    if (nameSelect) {
        $(document).ready(function() {
            $('#nameSelect').select2({
                placeholder: "בחר שם", // Placeholder text for the dropdown itself
                allowClear: true, // Allows users to clear the selection
                language: {
                    inputTooShort: function () { return "חפש שם"; } // Custom message when searching
                }
            });
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
            "עידן בדין": "+972502266557",
            "דודי טוביהו": "+972536062619",
            "ערן אבנון": "+972507515080",
            "איתן להב": "+972529615639",
            "נבות מרזל": "+972584777433",
            "ערן אבידור": "+972546682820",
            "אילן כץ": "+972547887007",
            "דני להב": "+972522741519",
            "יובל קרנר": "+972528893904",
            "משה שרביט": "+972542288890",
            "אלי דפס": "+972545870644",
            "עמוס קורן": "+972505238282",
            "אמיר אבידור": "+972544643345",
            "גל פאר": "+972544866402",
            "אלון מאור": "+972506247983",
            "ארז עצמון": "+972508673329",
            "יניב גולן": "+972544548249",
            "משה ברזלי": "+972543166691",
            "ורד ליברנט": "+972544889987",
            "חיים ליברנט": "+972505311085",
            "בועז פאר": "+972508234090",
            "ניב רוטברג": "+972522211175"
        };

        if (presentList && absentList) {  // Only if these elements exist
            presentList.innerHTML = "";
            absentList.innerHTML = "";

            attendanceData.present.forEach(name => {
                const li = document.createElement("li");
                li.textContent = name;

                if (phoneNumbers[name]) {
                    // Add phone icon
                    const phoneIcon = document.createElement('a');
                    phoneIcon.href = `tel:${phoneNumbers[name]}`;
                    phoneIcon.className = 'phone-icon';
                    phoneIcon.innerHTML = '<i class="fas fa-phone"></i>'; // Font Awesome phone icon
                    li.appendChild(phoneIcon);

                    // Add WhatsApp icon
                    const whatsappIcon = document.createElement('a');
                    whatsappIcon.href = `https://wa.me/${phoneNumbers[name].replace('+', '')}`;
                    whatsappIcon.className = 'whatsapp-icon';
                    whatsappIcon.innerHTML = '<i class="fab fa-whatsapp"></i>'; // Font Awesome WhatsApp icon
                    li.appendChild(whatsappIcon);
                }

                li.classList.add('list-item-hidden'); // Add hidden class initially
                presentList.appendChild(li);
            });

            attendanceData.absent.forEach(name => {
                const li = document.createElement("li");
                li.textContent = name;

                if (phoneNumbers[name]) {
                    // Add phone icon
                    const phoneIcon = document.createElement('a');
                    phoneIcon.href = `tel:${phoneNumbers[name]}`;
                    phoneIcon.className = 'phone-icon';
                    phoneIcon.innerHTML = '<i class="fas fa-phone"></i>'; // Font Awesome phone icon
                    li.appendChild(phoneIcon);

                    // Add WhatsApp icon
                    const whatsappIcon = document.createElement('a');
                    whatsappIcon.href = `https://wa.me/${phoneNumbers[name].replace('+', '')}`;
                    whatsappIcon.className = 'whatsapp-icon';
                    whatsappIcon.innerHTML = '<i class="fab fa-whatsapp"></i>'; // Font Awesome WhatsApp icon
                    li.appendChild(whatsappIcon);
                }

                li.classList.add('list-item-hidden'); // Add hidden class initially
                absentList.appendChild(li);
            });

            // Add scroll-in effect
            setTimeout(() => {
                document.querySelectorAll('.list-item-hidden').forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('list-item-visible');
                        item.classList.remove('list-item-hidden');
                    }, index * 100); // Delay each item by 100ms for a staggered effect
                });
            }, 100); // Slight delay to ensure all items are in the DOM

            // Update button counts
            if (presentCount) {
                presentCount.textContent = `${attendanceData.present.length}`;
            }

            if (absentCount) {
                absentCount.textContent = `${attendanceData.absent.length}`;
            }
        }

        // Also update the button counts if presentCount or absentCount exist
        if (presentButton) {
            presentButton.querySelector('span').textContent = `${attendanceData.present.length}`;
        }

        if (absentButton) {
            absentButton.querySelector('span').textContent = `${attendanceData.absent.length}`;
        }
    }

    // Function to handle button clicks
    function handleAttendance(status) {
        const selectedName = nameSelect ? nameSelect.value : null;
        if (!selectedName) {
            alert("אנא בחר שם");
            return;
        }

        // First, fetch the latest data to ensure we're working with up-to-date lists
        attendanceRef.doc("current").get().then((doc) => {
            if (doc.exists) {
                attendanceData = doc.data();
            }

            // Remove name from both lists to prevent duplicates
            attendanceData.present = attendanceData.present.filter(name => name !== selectedName);
            attendanceData.absent = attendanceData.absent.filter(name => name !== selectedName);

            // Add name to the correct list
            if (status === "present") {
                attendanceData.present.push(selectedName);
            } else {
                attendanceData.absent.push(selectedName);
            }

            // Save updated lists back to Firestore
            attendanceRef.doc("current").set(attendanceData).then(() => {
                updateUI();
                resetNameSelect(); // Reset the name selection after updating the lists
                showPopup(); // Show the pop-up message
            });
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    }

    // Function to reset the name select dropdown
    function resetNameSelect() {
        if (nameSelect) {
            $('#nameSelect').val(null).trigger('change'); // Reset the dropdown to its default state
        }
    }

    // Function to show the pop-up message
    function showPopup() {
        popupMessage.style.display = "block";
    }

    // Function to hide the pop-up message
    function hidePopup() {
        popupMessage.style.display = "none";
    }

    // Add event listeners only if the elements exist
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

    // Initial UI update on page load
    updateUI(); // This ensures that the button counts are updated after a refresh
    document.body.classList.add('fade-in'); // Fade in the page content on load
});
