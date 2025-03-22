document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");
    const contentDivs = document.querySelectorAll('.card');
    const menuItems = document.querySelectorAll("[data-content]");
    const dropdowns = document.querySelectorAll(".dropdown");
    const userProfileBtn = document.querySelector('.user-profile-btn');
    const userDropdown = document.querySelector('.user-dropdown');

    // Handle sidebar toggle
    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("expanded");
    });

    // Handle content switching
    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            const contentId = this.getAttribute("data-content");
            contentDivs.forEach(div => div.style.display = "none");
            document.getElementById(contentId).style.display = "block";
        });
    });

    // Handle dropdowns
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const submenu = dropdown.querySelector('.submenu');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            submenu.classList.toggle('hidden');
        });

        // Prevent dropdown from closing when clicking inside the submenu
        submenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
        dropdowns.forEach(dropdown => dropdown.querySelector('.submenu').classList.add('hidden'));
    });

    // Handle User Info dropdown toggle
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Close User Info dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userProfileBtn.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    // Handle dropdown item clicks
    document.querySelectorAll('.user-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = e.currentTarget.textContent.trim();
            switch(action) {
                case 'Edit Profile':
                    console.log('Editing profile...');
                    break;
                case 'Journal':
                    console.log('Opening journal...');
                    break;
                case 'Log Out':
                    console.log('Logging out...');
                    break;
            }
            userDropdown.classList.remove('show');
        });
    });

    // Handle modals
    function setupModal(modalId, triggerSelector) {
        const modal = document.getElementById(modalId);
        const triggers = document.querySelectorAll(triggerSelector);
        const closeBtn = modal.querySelector('.close-modal');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
            });
        });

        closeBtn.addEventListener('click', () => modal.classList.remove('show'));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }

    setupModal('editProfileModal', '.user-dropdown-item[href="#editProfileModal"]');
    setupModal('viewCompletedTasksModal', '.view-completed-btn');
    setupModal('addTaskModal', '.add-task-card-btn');
    setupModal('attendance', '.clock-btn');
    setupModal('thirteenthMonthModal', '.thirteenth-month-btn');
    setupModal('groupChatModal', '.group-chat-btn');

    // Handle Attendance Actions
    const clockInBtn = document.querySelector('.clock-in-btn');
    const breakTimeBtn = document.querySelector('.break-time-btn');
    const clockOutBtn = document.querySelector('.clock-out-btn');
    const userStatus = document.getElementById('userStatus');
    const statusIndicator = document.getElementById('statusIndicator');

    clockInBtn.addEventListener('click', () => {
        userStatus.textContent = 'Active';
        statusIndicator.style.backgroundColor = 'green';
    });

    breakTimeBtn.addEventListener('click', () => {
        const isBreak = breakTimeBtn.textContent === 'Break Time';
        userStatus.textContent = isBreak ? 'Break Time' : 'Active';
        statusIndicator.style.backgroundColor = isBreak ? 'grey' : 'green';
        breakTimeBtn.textContent = isBreak ? 'End Break' : 'Break Time';
    });

    clockOutBtn.addEventListener('click', () => {
        userStatus.textContent = 'Inactive';
        statusIndicator.style.backgroundColor = 'red';
    });

    // Update Date and Time
    function updateDateTime() {
        const now = new Date();
        document.getElementById('dateTimeDisplay').textContent = now.toLocaleString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Handle Add Task form submission
    const addTaskForm = document.getElementById('addTaskForm');
    const taskTableBody = document.querySelector('.task-table tbody');
    const addTaskModal = document.getElementById('addTaskModal');

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const projectName = document.getElementById('projectName').value;
        const approverName = document.getElementById('approverName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const hours = document.getElementById('hours').value;
        const minutes = document.getElementById('minutes').value;
        const priorityLevel = document.getElementById('priorityLevel').value;
        const status = document.getElementById('status').value;

        // Create a new row for the task table
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${projectName}</td>
            <td>${taskDescription}</td>
            <td>${new Date().toISOString().split('T')[0]}</td>
            <td><span class="priority ${priorityLevel}">${priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}</span></td>
            <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
            <td>${approverName}</td>
        `;

        // Append the new row to the task table
        taskTableBody.appendChild(newRow);

        // Reset the form and close the modal
        addTaskForm.reset();
        addTaskModal.classList.remove('show');
    });

    // Handle Cancel button in Add Task modal
    const cancelBtn = addTaskForm.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        addTaskForm.reset();
        addTaskModal.classList.remove('show');
    });
});