// Global Variables
let currentUser = null;
let currentUserType = null;
let animals = [];
let reminders = [];
let editingAnimalId = null;

// Sample data
const sampleAnimals = [
    {
        id: '1',
        name: 'Buddy',
        type: 'Dog',
        age: 3,
        healthCondition: 'Healthy',
        ownerName: 'John Smith',
        ownerContact: '+1-555-0123',
        medicalNotes: 'Annual vaccination completed. All vitals normal.',
        images: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
        id: '2',
        name: 'Whiskers',
        type: 'Cat',
        age: 5,
        healthCondition: 'Monitoring',
        ownerName: 'Maria Garcia',
        ownerContact: '+1-555-0124',
        medicalNotes: 'Slight weight loss noted. Recommended diet adjustment.',
        images: ['https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
        id: '3',
        name: 'Charlie',
        type: 'Bird',
        age: 2,
        healthCondition: 'Needs Check-up',
        ownerName: 'David Wilson',
        ownerContact: '+1-555-0125',
        medicalNotes: 'Due for routine health assessment.',
        images: []
    }
];

const sampleReminders = [
    {
        id: '1',
        animalId: '1',
        animalName: 'Buddy',
        type: 'Annual Check-up',
        date: '2024-03-15',
        notes: 'Annual health check-up and vaccination',
        emailSent: true
    },
    {
        id: '2',
        animalId: '2',
        animalName: 'Whiskers',
        type: 'Weight Check',
        date: '2024-02-28',
        notes: 'Follow-up weight monitoring',
        emailSent: false
    },
    {
        id: '3',
        animalId: '3',
        animalName: 'Charlie',
        type: 'Health Assessment',
        date: '2024-02-20',
        notes: 'Comprehensive health evaluation',
        emailSent: true
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data
    animals = [...sampleAnimals];
    reminders = [...sampleReminders];
    
    // Initialize dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html') || document.getElementById('animalsGrid')) {
        initializeDashboard();
    }
});

// Landing Page Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    showLoginTypeSelection();
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    resetForms();
}

function showLoginTypeSelection() {
    document.getElementById('loginTypeSelection').style.display = 'block';
    document.getElementById('loginFormContainer').style.display = 'none';
}

function showLoginForm(userType) {
    currentUserType = userType;
    document.getElementById('loginTypeSelection').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    
    const title = userType === 'vet' ? 'Veterinarian Login' : 'Pet Owner Login';
    document.getElementById('loginTitle').textContent = title;
    document.getElementById('registerTitle').textContent = `Register as ${userType === 'vet' ? 'Veterinarian' : 'Pet Owner'}`;
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginFormFromRegister() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function resetForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate login (in real app, this would be an API call)
            currentUser = {
                name: currentUserType === 'vet' ? 'Dr. Smith' : 'John Doe',
                email: email,
                type: currentUserType
            };
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Simulate registration
            alert('Registration successful! Please login with your credentials.');
            showLoginFormFromRegister();
        });
    }
});

// Dashboard Functions
function initializeDashboard() {
    // Set user info
    const userInfo = getCurrentUser();
    if (userInfo) {
        document.getElementById('userWelcome').textContent = `Welcome, ${userInfo.name}`;
        document.getElementById('userType').textContent = userInfo.type === 'vet' ? 'Veterinarian' : 'Pet Owner';
    }
    
    // Load dashboard data
    loadAnimals();
    loadReminders();
    updateReports();
    populateAnimalSelect();
}

function getCurrentUser() {
    // In a real app, this would get user from session/localStorage
    return {
        name: 'Dr. Smith',
        type: 'vet'
    };
}

function logout() {
    currentUser = null;
    currentUserType = null;
    window.location.href = 'index.html';
}

// Navigation Functions
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Update nav tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load data for specific sections
    if (sectionName === 'reminders') {
        loadReminders();
    } else if (sectionName === 'reports') {
        updateReports();
    }
}

// Animal Management Functions
function loadAnimals() {
    const animalsGrid = document.getElementById('animalsGrid');
    if (!animalsGrid) return;
    
    animalsGrid.innerHTML = '';
    
    if (animals.length === 0) {
        animalsGrid.innerHTML = '<div class="no-data">No animals registered yet. Click "Add New Animal" to get started.</div>';
        return;
    }
    
    animals.forEach(animal => {
        const animalCard = createAnimalCard(animal);
        animalsGrid.appendChild(animalCard);
    });
}

function createAnimalCard(animal) {
    const card = document.createElement('div');
    card.className = 'animal-card';
    
    const healthStatusClass = animal.healthCondition.toLowerCase().replace(/\s+/g, '-');
    
    card.innerHTML = `
        <div class="animal-header">
            <div class="animal-info">
                <h3>${animal.name}</h3>
                <div class="animal-type">${animal.type}</div>
            </div>
            <div class="health-status ${healthStatusClass}">${animal.healthCondition}</div>
        </div>
        
        <div class="animal-details">
            <div class="animal-detail">
                <span>Age:</span>
                <span>${animal.age} years</span>
            </div>
            <div class="animal-detail">
                <span>Owner:</span>
                <span>${animal.ownerName}</span>
            </div>
            <div class="animal-detail">
                <span>Contact:</span>
                <span>${animal.ownerContact}</span>
            </div>
        </div>
        
        <div class="animal-actions">
            <button class="action-btn view" onclick="viewAnimal('${animal.id}')">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="action-btn edit" onclick="editAnimal('${animal.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn delete" onclick="deleteAnimal('${animal.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

function showAddAnimalModal() {
    editingAnimalId = null;
    document.getElementById('animalModalTitle').textContent = 'Add New Animal';
    document.getElementById('animalForm').reset();
    document.getElementById('animalModal').style.display = 'block';
}

function hideAnimalModal() {
    document.getElementById('animalModal').style.display = 'none';
    editingAnimalId = null;
}

function editAnimal(animalId) {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;
    
    editingAnimalId = animalId;
    document.getElementById('animalModalTitle').textContent = 'Edit Animal';
    
    // Populate form with animal data
    document.getElementById('animalName').value = animal.name;
    document.getElementById('animalType').value = animal.type;
    document.getElementById('animalAge').value = animal.age;
    document.getElementById('healthCondition').value = animal.healthCondition;
    document.getElementById('ownerName').value = animal.ownerName;
    document.getElementById('ownerContact').value = animal.ownerContact;
    document.getElementById('medicalNotes').value = animal.medicalNotes || '';
    
    document.getElementById('animalModal').style.display = 'block';
}

function deleteAnimal(animalId) {
    if (confirm('Are you sure you want to delete this animal record?')) {
        animals = animals.filter(a => a.id !== animalId);
        // Also remove related reminders
        reminders = reminders.filter(r => r.animalId !== animalId);
        loadAnimals();
        updateReports();
        populateAnimalSelect();
        alert('Animal record deleted successfully!');
    }
}

function viewAnimal(animalId) {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;
    
    document.getElementById('animalDetailTitle').textContent = `${animal.name} - Details`;
    
    const detailContent = document.getElementById('animalDetailContent');
    detailContent.innerHTML = `
        <div class="detail-section">
            <h4>Basic Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Name:</label>
                    <span>${animal.name}</span>
                </div>
                <div class="detail-item">
                    <label>Type:</label>
                    <span>${animal.type}</span>
                </div>
                <div class="detail-item">
                    <label>Age:</label>
                    <span>${animal.age} years</span>
                </div>
                <div class="detail-item">
                    <label>Health Status:</label>
                    <span class="health-status ${animal.healthCondition.toLowerCase().replace(/\s+/g, '-')}">${animal.healthCondition}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Owner Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Owner Name:</label>
                    <span>${animal.ownerName}</span>
                </div>
                <div class="detail-item">
                    <label>Contact:</label>
                    <span>${animal.ownerContact}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Medical Notes</h4>
            <div class="detail-item">
                <p>${animal.medicalNotes || 'No medical notes available.'}</p>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Images</h4>
            <div class="image-gallery">
                ${animal.images && animal.images.length > 0 
                    ? animal.images.map(img => `<img src="${img}" alt="${animal.name}" class="image-thumbnail" onclick="openImageModal('${img}')">`).join('')
                    : '<p>No images uploaded yet.</p>'
                }
                <div class="upload-area" onclick="document.getElementById('imageUpload-${animalId}').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Click to upload image</p>
                    <input type="file" id="imageUpload-${animalId}" accept="image/*" style="display: none;" onchange="handleImageUpload(event, '${animalId}')">
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('animalDetailModal').style.display = 'block';
}

function hideAnimalDetailModal() {
    document.getElementById('animalDetailModal').style.display = 'none';
}

function handleImageUpload(event, animalId) {
    const file = event.target.files[0];
    if (!file) return;
    
    // In a real application, you would upload to a server
    // For demo purposes, we'll create a local URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const animal = animals.find(a => a.id === animalId);
        if (animal) {
            if (!animal.images) animal.images = [];
            animal.images.push(e.target.result);
            viewAnimal(animalId); // Refresh the view
            alert('Image uploaded successfully!');
        }
    };
    reader.readAsDataURL(file);
}

// Animal Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const animalForm = document.getElementById('animalForm');
    if (animalForm) {
        animalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const animalData = {
                name: formData.get('name'),
                type: formData.get('type'),
                age: parseInt(formData.get('age')),
                healthCondition: formData.get('healthCondition'),
                ownerName: formData.get('ownerName'),
                ownerContact: formData.get('ownerContact'),
                medicalNotes: formData.get('medicalNotes')
            };
            
            // Validation
            if (!animalData.name || !animalData.type || !animalData.age || !animalData.healthCondition || !animalData.ownerName || !animalData.ownerContact) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (editingAnimalId) {
                // Update existing animal
                const animalIndex = animals.findIndex(a => a.id === editingAnimalId);
                if (animalIndex !== -1) {
                    animals[animalIndex] = { ...animals[animalIndex], ...animalData };
                    alert('Animal updated successfully!');
                }
            } else {
                // Add new animal
                const newAnimal = {
                    id: Date.now().toString(),
                    ...animalData,
                    images: []
                };
                animals.push(newAnimal);
                alert('Animal added successfully!');
            }
            
            hideAnimalModal();
            loadAnimals();
            updateReports();
            populateAnimalSelect();
        });
    }
});

// Reminder Management Functions
function loadReminders() {
    const remindersList = document.getElementById('remindersList');
    if (!remindersList) return;
    
    remindersList.innerHTML = '';
    
    if (reminders.length === 0) {
        remindersList.innerHTML = '<div class="no-data">No reminders set. Click "Add Reminder" to create one.</div>';
        return;
    }
    
    // Sort reminders by date
    const sortedReminders = reminders.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedReminders.forEach(reminder => {
        const reminderCard = createReminderCard(reminder);
        remindersList.appendChild(reminderCard);
    });
}

function createReminderCard(reminder) {
    const card = document.createElement('div');
    card.className = 'reminder-card';
    
    const formattedDate = new Date(reminder.date).toLocaleDateString();
    const isOverdue = new Date(reminder.date) < new Date();
    
    card.innerHTML = `
        <div class="reminder-info">
            <h4>${reminder.animalName} - ${reminder.type}</h4>
            <div class="reminder-details">
                <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                <span class="email-status ${reminder.emailSent ? 'email-sent' : 'email-pending'}">
                    <i class="fas fa-envelope${reminder.emailSent ? '-open' : ''}"></i>
                    ${reminder.emailSent ? 'Email Sent' : 'Email Pending'}
                </span>
                ${isOverdue ? '<span style="color: #F44336;"><i class="fas fa-exclamation-triangle"></i> Overdue</span>' : ''}
            </div>
            ${reminder.notes ? `<p style="margin-top: 0.5rem; color: #CCCCCC;">${reminder.notes}</p>` : ''}
        </div>
        <div class="reminder-actions">
            <button class="action-btn edit" onclick="editReminder('${reminder.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteReminder('${reminder.id}')">
                <i class="fas fa-trash"></i>
            </button>
            ${!reminder.emailSent ? `<button class="action-btn view" onclick="sendReminderEmail('${reminder.id}')">
                <i class="fas fa-paper-plane"></i> Send
            </button>` : ''}
        </div>
    `;
    
    return card;
}

function showAddReminderModal() {
    document.getElementById('reminderModal').style.display = 'block';
    populateAnimalSelect();
}

function hideReminderModal() {
    document.getElementById('reminderModal').style.display = 'none';
    document.getElementById('reminderForm').reset();
}

function populateAnimalSelect() {
    const select = document.getElementById('reminderAnimal');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Animal</option>';
    
    animals.forEach(animal => {
        const option = document.createElement('option');
        option.value = animal.id;
        option.textContent = `${animal.name} (${animal.type})`;
        select.appendChild(option);
    });
}

function deleteReminder(reminderId) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        reminders = reminders.filter(r => r.id !== reminderId);
        loadReminders();
        updateReports();
        alert('Reminder deleted successfully!');
    }
}

function sendReminderEmail(reminderId) {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
        // Simulate sending email
        reminder.emailSent = true;
        loadReminders();
        alert(`Email reminder sent for ${reminder.animalName}!`);
    }
}

// Reminder Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const reminderForm = document.getElementById('reminderForm');
    if (reminderForm) {
        reminderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const animalId = formData.get('animalId');
            const animal = animals.find(a => a.id === animalId);
            
            if (!animal) {
                alert('Please select an animal');
                return;
            }
            
            const reminderData = {
                id: Date.now().toString(),
                animalId: animalId,
                animalName: animal.name,
                type: formData.get('type'),
                date: formData.get('date'),
                notes: formData.get('notes'),
                emailSent: false
            };
            
            // Validation
            if (!reminderData.type || !reminderData.date) {
                alert('Please fill in all required fields');
                return;
            }
            
            reminders.push(reminderData);
            alert('Reminder added successfully!');
            
            hideReminderModal();
            loadReminders();
            updateReports();
        });
    }
});

// Reports Functions
function updateReports() {
    const totalAnimalsEl = document.getElementById('totalAnimals');
    const healthyAnimalsEl = document.getElementById('healthyAnimals');
    const needsAttentionEl = document.getElementById('needsAttention');
    const upcomingRemindersEl = document.getElementById('upcomingReminders');
    
    if (!totalAnimalsEl) return;
    
    const totalAnimals = animals.length;
    const healthyAnimals = animals.filter(a => a.healthCondition === 'Healthy').length;
    const needsAttention = animals.filter(a => a.healthCondition !== 'Healthy').length;
    const upcomingReminders = reminders.filter(r => new Date(r.date) > new Date()).length;
    
    totalAnimalsEl.textContent = totalAnimals;
    healthyAnimalsEl.textContent = healthyAnimals;
    needsAttentionEl.textContent = needsAttention;
    upcomingRemindersEl.textContent = upcomingReminders;
}

// Modal Event Handlers
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Initialize dashboard when DOM is loaded
if (document.getElementById('animalsGrid')) {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}