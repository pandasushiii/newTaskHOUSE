document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");
    const contentDivs = document.querySelectorAll('.card');
    const menuItems = document.querySelectorAll("[data-content]");
    const dropdowns = document.querySelectorAll(".dropdown");

    // Handle sidebar toggle
    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("expanded");
    });

    // Handle content switching and highlighting
    menuItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent the dropdown from closing
            const contentId = this.getAttribute("data-content");
            
            // Hide all content divs
            contentDivs.forEach(div => {
                div.style.display = "none";
            });
            
            // Show selected content
            document.getElementById(contentId).style.display = "block";
            
            // Remove highlight from all items
            menuItems.forEach(menuItem => {
                menuItem.classList.remove("highlighted");
            });
            
            // Only add highlight if it's not a dropdown or submenu item
            if (!this.closest('.dropdown') && !this.closest('.submenu')) {
                this.classList.add("highlighted");
            }
        });
    });

    // Handle dropdowns
    dropdowns.forEach(dropdown => {
        const span = dropdown.querySelector('span');
        
        span.addEventListener('click', (event) => {
            event.stopPropagation();
            
            // Toggle current dropdown
            const submenu = dropdown.querySelector('.submenu');
            const isOpen = submenu.style.display === 'block';
            
            if (!isOpen) {
                submenu.style.display = 'block';
                dropdown.classList.add('active');
            } else {
                submenu.style.display = 'none';
                dropdown.classList.remove('active');
            }
        });
    });

    // Close dropdowns only when clicking outside the sidebar
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target)) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                dropdown.querySelector('.submenu').style.display = 'none';
            });
        }
    });

    // Update dropdown handling
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const submenu = toggle.nextElementSibling;
            const isHidden = submenu.classList.contains('hidden');
            
            // Close all other submenus
            document.querySelectorAll('.submenu').forEach(menu => {
                if (menu !== submenu) {
                    menu.classList.add('hidden');
                }
            });
            
            // Toggle current submenu
            submenu.classList.toggle('hidden');
            
            // Update arrow and text
            const text = toggle.textContent.trim();
            const baseText = text.replace(' ▼', '').replace(' ▲', '');
            toggle.innerHTML = `
                ${toggle.querySelector('.menu-icon').outerHTML}
                ${baseText} ${isHidden ? '▲' : '▼'}
            `;
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.submenu').forEach(submenu => {
                submenu.classList.add('hidden');
            });
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                const text = toggle.textContent.trim();
                const baseText = text.replace(' ▼', '').replace(' ▲', '');
                toggle.innerHTML = `
                    ${toggle.querySelector('.menu-icon').outerHTML}
                    ${baseText} ▼
                `;
            });
        }
    });

    // Add this to your existing script.js
    const userProfileBtn = document.querySelector('.user-profile-btn');
    const userDropdown = document.querySelector('.user-dropdown');

    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userProfileBtn.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    // Handle dropdown items
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
                case 'Logout':
                    console.log('Logging out...');
                    break;
            }
            userDropdown.classList.remove('show');
        });
    });

    // Add active state handling
    document.querySelectorAll('.menu > li:not(.dropdown), .submenu li').forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.menu > li, .submenu li').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // If item is in submenu, also highlight parent dropdown
            if (item.closest('.submenu')) {
                item.closest('.dropdown').classList.add('active');
            }
        });
    });

    // Add Task Modal functionality
    const addTaskBtn = document.querySelector('.add-task-card-btn');
    const modal = document.getElementById('addTaskModal');
    const closeBtn = document.querySelector('.close-modal');
    const taskForm = document.querySelector('.task-form');

    // Open modal
    addTaskBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close modal functions
    function closeModal() {
        modal.classList.remove('show');
        taskForm.reset();
    }

    closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        closeModal();
    });

    // Get the month dropdown and current month display elements
    const monthDropdown = document.querySelector('.month-dropdown');
    const currentMonthDisplay = document.getElementById('current-month');

    // Array of month names
    const months = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    // Set current month in dropdown
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    monthDropdown.value = currentMonth + 1; // 1-12

    // Update month display when dropdown changes
    monthDropdown.addEventListener('change', function() {
        const selectedMonth = months[this.value - 1];
        currentMonthDisplay.textContent = selectedMonth;
    });

    // Set initial month display
    currentMonthDisplay.textContent = months[currentMonth];

    // Function to get the number of days in a month
    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    // Function to update table dates based on selected month
    function updateTableDates(month, year = new Date().getFullYear()) {
        const daysInMonth = getDaysInMonth(month, year);
        const thead = document.querySelector('.va-table thead tr');
        
        // Keep the first (MONTH) and last (TOTAL) columns
        const firstTh = thead.firstElementChild;
        const lastTh = thead.lastElementChild;
        
        // Clear existing date columns
        while (thead.children.length > 2) {
            thead.removeChild(thead.children[1]);
        }
        
        // Add new date columns
        for (let i = 1; i <= daysInMonth; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            thead.insertBefore(th, lastTh);
        }

        // Update table body cells to match the new number of days
        const tbody = document.querySelector('.va-table tbody');
        tbody.querySelectorAll('tr').forEach(row => {
            const firstTd = row.firstElementChild;
            const lastTd = row.lastElementChild;
            
            // Clear existing date cells
            while (row.children.length > 2) {
                row.removeChild(row.children[1]);
            }
            
            // Add new date cells
            for (let i = 1; i <= daysInMonth; i++) {
                const td = document.createElement('td');
                // Get day of week (0 = Sunday, 6 = Saturday)
                const dayOfWeek = new Date(year, month - 1, i).getDay();
                
                // Weekend logic
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    td.className = 'weekend';
                    td.textContent = '-';
                } else {
                    // Random bill hours between 7 and 8 for example
                    td.textContent = Math.random() < 0.5 ? '7' : '8';
                }
                row.insertBefore(td, lastTd);
            }

            // Update total
            const total = Array.from(row.children)
                .slice(1, -1) // Exclude name and total columns
                .reduce((sum, cell) => {
                    const value = cell.textContent;
                    return sum + (value === '-' ? 0 : parseInt(value) || 0);
                }, 0);
            lastTd.textContent = total;
            lastTd.className = 'total';
        });
    }

    // Update table when month changes
    monthDropdown.addEventListener('change', function() {
        const selectedMonth = parseInt(this.value);
        const selectedYear = parseInt(yearDropdown.value);
        const selectedMonthName = months[selectedMonth - 1];
        currentMonthDisplay.textContent = selectedMonthName;
        updateTableDates(selectedMonth, selectedYear);
    });

    // Initial table update with current year
    updateTableDates(currentMonth + 1, currentDate.getFullYear());

    // Get the new dropdown elements
    const yearDropdown = document.querySelector('.year-dropdown');
    const billTypeDropdown = document.querySelector('.bill-type-dropdown');

    // Set current year in dropdown
    const currentYear = currentDate.getFullYear();
    yearDropdown.value = currentYear;

    // Generate year options dynamically
    const startYear = 2022;
    const endYear = currentYear + 1;
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    }

    // Update table when year changes
    yearDropdown.addEventListener('change', function() {
        const selectedMonth = parseInt(monthDropdown.value);
        const selectedYear = parseInt(this.value);
        updateTableDates(selectedMonth, selectedYear);
    });

    // Update table when bill type changes
    billTypeDropdown.addEventListener('change', function() {
        const selectedMonth = parseInt(monthDropdown.value);
        const selectedYear = parseInt(yearDropdown.value);
        updateTableDates(selectedMonth, selectedYear);
    });

    // Update the updateTableDates function to accept year parameter
    function updateTableDates(month, year = new Date().getFullYear()) {
        const daysInMonth = getDaysInMonth(month, year);
        const thead = document.querySelector('.va-table thead tr');
        
        // Keep the first (MONTH) and last (TOTAL) columns
        const firstTh = thead.firstElementChild;
        const lastTh = thead.lastElementChild;
        
        // Clear existing date columns
        while (thead.children.length > 2) {
            thead.removeChild(thead.children[1]);
        }
        
        // Add new date columns
        for (let i = 1; i <= daysInMonth; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            thead.insertBefore(th, lastTh);
        }

        // Update table body cells to match the new number of days
        const tbody = document.querySelector('.va-table tbody');
        tbody.querySelectorAll('tr').forEach(row => {
            const firstTd = row.firstElementChild;
            const lastTd = row.lastElementChild;
            
            // Clear existing date cells
            while (row.children.length > 2) {
                row.removeChild(row.children[1]);
            }
            
            // Add new date cells
            for (let i = 1; i <= daysInMonth; i++) {
                const td = document.createElement('td');
                // Get day of week (0 = Sunday, 6 = Saturday)
                const dayOfWeek = new Date(year, month - 1, i).getDay();
                
                // Weekend logic
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    td.className = 'weekend';
                    td.textContent = '-';
                } else {
                    // Random bill hours between 7 and 8 for example
                    td.textContent = Math.random() < 0.5 ? '7' : '8';
                }
                row.insertBefore(td, lastTd);
            }

            // Update total
            const total = Array.from(row.children)
                .slice(1, -1) // Exclude name and total columns
                .reduce((sum, cell) => {
                    const value = cell.textContent;
                    return sum + (value === '-' ? 0 : parseInt(value) || 0);
                }, 0);
            lastTd.textContent = total;
            lastTd.className = 'total';
        });
    }

    // Update the month change event listener
    monthDropdown.addEventListener('change', function() {
        const selectedMonth = parseInt(this.value);
        const selectedYear = parseInt(yearDropdown.value);
        const selectedMonthName = months[selectedMonth - 1];
        currentMonthDisplay.textContent = selectedMonthName;
        updateTableDates(selectedMonth, selectedYear);
    });

    // Initial table update with current year
    updateTableDates(currentMonth + 1, currentYear);

    // Add Attendance Modal functionality
    const attendanceBtn = document.querySelector('.clock-btn');
    const attendanceModal = document.getElementById('attendance');
    const attendanceCloseBtn = attendanceModal.querySelector('.close-modal');
    const clockInBtn = attendanceModal.querySelector('.clock-in-btn');
    const breakTimeBtn = attendanceModal.querySelector('.break-time-btn');
    const clockOutBtn = attendanceModal.querySelector('.clock-out-btn');
    const userStatus = document.getElementById('userStatus');
    const statusIndicator = document.getElementById('statusIndicator');
    const logsTableBody = document.getElementById('logsTableBody');
    const scheduleTableBody = document.getElementById('scheduleTableBody');

    // Open modal
    attendanceBtn.addEventListener('click', () => {
        attendanceModal.classList.add('show');
    });

    // Close modal functions
    function closeAttendanceModal() {
        attendanceModal.classList.remove('show');
    }

    attendanceCloseBtn.addEventListener('click', closeAttendanceModal);

    // Close on outside click
    attendanceModal.addEventListener('click', (e) => {
        if (e.target === attendanceModal) {
            closeAttendanceModal();
        }
    });

    // Function to add log entry
    function addLogEntry(status) {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        const logRow = document.createElement('tr');
        logRow.innerHTML = `<td>${date}</td><td>${time}</td><td>${status}</td>`;
        logsTableBody.appendChild(logRow);
    }

    // Handle button actions
    clockInBtn.addEventListener('click', () => {
        console.log('Clocking in...');
        userStatus.textContent = 'Active';
        statusIndicator.style.backgroundColor = 'green';
        addLogEntry('Clock In');
        closeAttendanceModal();
    });

    breakTimeBtn.addEventListener('click', () => {
        if (breakTimeBtn.textContent === 'Break Time') {
            console.log('Taking a break...');
            userStatus.textContent = 'Break Time';
            statusIndicator.style.backgroundColor = 'red';
            addLogEntry('Break Time');
            breakTimeBtn.textContent = 'End Break';
        } else {
            console.log('Ending break...');
            userStatus.textContent = 'Active';
            statusIndicator.style.backgroundColor = 'green';
            addLogEntry('End Break');
            breakTimeBtn.textContent = 'Break Time';
        }
        closeAttendanceModal();
    });

    clockOutBtn.addEventListener('click', () => {
        console.log('Clocking out...');
        userStatus.textContent = 'Inactive';
        statusIndicator.style.backgroundColor = 'red';
        addLogEntry('Clock Out');
        closeAttendanceModal();
    });

    // Function to add schedule entry
    function addScheduleEntry(day, startTime, endTime) {
        // Check if the entry already exists
        const existingRow = Array.from(scheduleTableBody.children).find(row => row.children[0].textContent === day);
        if (existingRow) {
            existingRow.children[1].textContent = startTime;
            existingRow.children[2].textContent = endTime;
        } else {
            const scheduleRow = document.createElement('tr');
            scheduleRow.innerHTML = `
                <td>${day}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td><button class="edit-schedule-btn">Edit</button></td>
            `;
            scheduleTableBody.appendChild(scheduleRow);
        }
    }

    // Example schedule entries
    const scheduleEntries = [
        { day: 'Monday', startTime: '07:00 AM', endTime: '01:00 PM' },
        { day: 'Tuesday', startTime: '07:00 AM', endTime: '01:00 PM' },
        { day: 'Wednesday', startTime: '07:00 AM', endTime: '01:00 PM' },
        { day: 'Thursday', startTime: '07:00 AM', endTime: '01:00 PM' },
        { day: 'Friday', startTime: '07:00 AM', endTime: '06:00 PM' },
        { day: 'Saturday', startTime: '07:00 AM', endTime: '06:00 PM' },
        { day: 'Sunday', startTime: 'Rest Day', endTime: '' }
    ];

    scheduleEntries.forEach(entry => addScheduleEntry(entry.day, entry.startTime, entry.endTime));

    // Handle schedule editing
    scheduleTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-schedule-btn')) {
            const row = e.target.closest('tr');
            const day = row.children[0].textContent;
            const startTime = row.children[1].textContent;
            const endTime = row.children[2].textContent;

            const newStartTime = prompt(`Edit start time for ${day}:`, startTime);
            const newEndTime = prompt(`Edit end time for ${day}:`, endTime);

            if (newStartTime !== null && newEndTime !== null) {
                row.children[1].textContent = newStartTime;
                row.children[2].textContent = newEndTime;
            }
        }
    });

    // Fix Average Productivity progress bar
    const productivityCard = document.querySelector('.performance-card:nth-child(1)');
    const productivityPercentage = productivityCard.querySelector('.percentage').textContent.trim();
    const productivityProgress = productivityCard.querySelector('.progress');
    productivityProgress.style.width = productivityPercentage;

    // Add real-time date display
    function updateDateTime() {
        const now = new Date();
        const dateTimeDisplay = document.getElementById('dateTimeDisplay');
        dateTimeDisplay.textContent = now.toLocaleString();
    }

    // Update date and time every second
    setInterval(updateDateTime, 1000);
    updateDateTime(); // Initial call to set the date and time immediately

    // Handle memo title click
    const memoTitleButtons = document.querySelectorAll('.memo-title-btn');
    const memoContents = document.querySelectorAll('.memo-content');

    memoTitleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const memoId = button.getAttribute('data-memo');
            memoContents.forEach(content => {
                content.style.display = content.id === memoId ? 'block' : 'none';
            });
        });
    });

    // Handle 13th month pay modal
    const thirteenthMonthBtn = document.querySelector('.thirteenth-month-btn');
    const thirteenthMonthModal = document.getElementById('thirteenthMonthModal');
    const thirteenthMonthCloseBtn = thirteenthMonthModal.querySelector('.close-modal');

    thirteenthMonthBtn.addEventListener('click', () => {
        thirteenthMonthModal.classList.add('show');
    });

    thirteenthMonthCloseBtn.addEventListener('click', () => {
        thirteenthMonthModal.classList.remove('show');
    });

    thirteenthMonthModal.addEventListener('click', (e) => {
        if (e.target === thirteenthMonthModal) {
            thirteenthMonthModal.classList.remove('show');
        }
    });

    // Handle group chat modal
    const groupChatBtn = document.querySelector('.group-chat-btn');
    const groupChatModal = document.getElementById('groupChatModal');
    const groupChatCloseBtn = groupChatModal.querySelector('.close-modal');

    groupChatBtn.addEventListener('click', () => {
        groupChatModal.classList.add('show');
    });

    groupChatCloseBtn.addEventListener('click', () => {
        groupChatModal.classList.remove('show');
    });

    groupChatModal.addEventListener('click', (e) => {
        if (e.target === groupChatModal) {
            groupChatModal.classList.remove('show');
        }
    });

    // Handle message sending
    const sendMessageBtn = document.querySelector('.send-message-btn');
    const messageInput = document.querySelector('.message-input');
    const messageText = document.querySelector('.message-text');

    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `<p><strong>You:</strong> ${message}</p>`;
            messageText.appendChild(messageElement);
            messageInput.value = '';
            messageText.scrollTop = messageText.scrollHeight; // Scroll to bottom
        }
    });

    // Handle file insertion (dummy functionality)
    const insertFileBtn = document.querySelector('.insert-file-btn');

    insertFileBtn.addEventListener('click', () => {
        alert('File insertion functionality is not implemented yet.');
    });

    // Add this to your existing script.js
    const messageBtn = document.querySelector('.message-btn');
    const messagesCard = document.getElementById('messages');

    messageBtn.addEventListener('click', () => {
        // Hide all content divs
        contentDivs.forEach(div => {
            div.style.display = "none";
        });

        // Show the Messages section
        messagesCard.style.display = "block";
    });
});

// Add this to your existing script.js
function updateClock() {
    const now = new Date();
    const timeDisplay = document.getElementById('timeDisplay');
    timeDisplay.textContent = now.toLocaleTimeString();
}

// Update clock every second
setInterval(updateClock, 1000);
// Initial call to avoid delay
updateClock();