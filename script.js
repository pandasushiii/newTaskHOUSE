document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");
    const contentDivs = document.querySelectorAll('.card');
    const menuItems = document.querySelectorAll("[data-content]");
    const dropdowns = document.querySelectorAll(".dropdown");
    const userProfileBtn = document.querySelector('.user-profile-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    const groupChatDropdown = document.getElementById('groupChatDropdown');
    const groupChatMembersList = document.querySelector('.group-chat-members');
    const members = [
        { name: 'John Doe', status: 'online' },
        { name: 'Jane Smith', status: 'offline' },
        { name: 'Mike Johnson', status: 'break-time' },
    ];

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

        submenu.addEventListener('click', (e) => e.stopPropagation());
    });

    document.addEventListener("click", () => {
        dropdowns.forEach(dropdown => dropdown.querySelector('.submenu').classList.add('hidden'));
    });

    // Handle User Info dropdown toggle
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userProfileBtn.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
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
    setupModal('messagesModal', '.message-btn');

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

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const projectName = document.getElementById('projectName').value;
        const approverName = document.getElementById('approverName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const priorityLevel = document.getElementById('priorityLevel').value;
        const status = document.getElementById('status').value;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${projectName}</td>
            <td>${taskDescription}</td>
            <td>${new Date().toISOString().split('T')[0]}</td>
            <td><span class="priority ${priorityLevel}">${priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}</span></td>
            <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
            <td>${approverName}</td>
        `;

        taskTableBody.appendChild(newRow);
        addTaskForm.reset();
        document.getElementById('addTaskModal').classList.remove('show');
    });

    // Populate Group Chat Members with the provided members array
    function populateGroupChatMembers() {
        groupChatMembersList.innerHTML = ''; // Clear existing members
        members.forEach(member => {
            const memberItem = document.createElement('li');
            memberItem.innerHTML = `
                <span>${member.name}</span>
                <div class="member-status">
                    <span class="status-indicator ${member.status}"></span>
                </div>
            `;
            groupChatMembersList.appendChild(memberItem);
        });
    }

    const viewGroupChatMembersBtn = document.getElementById('viewGroupChatMembersBtn');
    viewGroupChatMembersBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        populateGroupChatMembers(); // Populate with the `members` array
        groupChatDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!groupChatDropdown.contains(e.target) && !viewGroupChatMembersBtn.contains(e.target)) {
            groupChatDropdown.classList.remove('show');
        }
    });

    // Send message functionality
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageTextContainer = document.querySelector('.message-text');

    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user-message');
            userMessage.innerHTML = `<p><strong>You:</strong> ${message}</p>`;
            messageTextContainer.appendChild(userMessage);

            messageInput.value = '';

            setTimeout(() => {
                const otherMessage = document.createElement('div');
                otherMessage.classList.add('message', 'other-message');
                otherMessage.innerHTML = `<p><strong>John Doe:</strong> Got it!</p>`;
                messageTextContainer.appendChild(otherMessage);

                messageTextContainer.scrollTop = messageTextContainer.scrollHeight;
            }, 1000);
        }
    });
});