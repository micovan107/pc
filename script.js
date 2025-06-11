document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const lockScreen = document.getElementById('lockScreen');
    const loginScreen = document.getElementById('loginScreen');
    const desktop = document.getElementById('desktop');
    const startMenu = document.getElementById('startMenu');
    const startMenuButton = document.getElementById('startMenuButton');
    const powerButton = document.getElementById('powerButton');
    const logoutButton = document.getElementById('logoutButton');
    const powerDialog = document.getElementById('powerDialog');
    const shutdownOption = document.getElementById('shutdownOption');
    const restartOption = document.getElementById('restartOption');
    const sleepOption = document.getElementById('sleepOption');
    const cancelPowerOption = document.getElementById('cancelPowerOption');
    const loginButton = document.getElementById('loginButton');
    const passwordInput = document.getElementById('passwordInput');
    const contextMenu = document.getElementById('contextMenu');
    const appWindows = document.querySelectorAll('.app-window');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const appItems = document.querySelectorAll('.app-item');
    const taskbarApps = document.getElementById('taskbarApps');
    const themeToggle = document.getElementById('themeToggle');
    const wallpaperSelect = document.getElementById('wallpaperSelect');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Time and Date
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // Update lock screen time
        if (document.getElementById('lockScreenTime')) {
            document.getElementById('lockScreenTime').textContent = time;
        }
        
        // Update taskbar time
        if (document.getElementById('taskbarTime')) {
            document.getElementById('taskbarTime').textContent = time;
        }
        
        // Update lock screen date
        if (document.getElementById('lockScreenDate')) {
            const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
            const day = days[now.getDay()];
            const date = now.getDate();
            const month = months[now.getMonth()];
            document.getElementById('lockScreenDate').textContent = `${day}, ${date} ${month}`;
        }
    }
    
    // Update clock every second
    updateClock();
    setInterval(updateClock, 60000);
    
    // Lock Screen to Login Screen
    document.addEventListener('keydown', function() {
        if (lockScreen.style.display !== 'none') {
            lockScreen.style.display = 'none';
            loginScreen.style.display = 'flex';
        }
    });
    
    // Login Screen to Desktop
    loginButton.addEventListener('click', function() {
        loginScreen.style.display = 'none';
        desktop.style.display = 'block';
    });
    
    // Also login when pressing Enter in password field
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            loginScreen.style.display = 'none';
            desktop.style.display = 'block';
        }
    });
    
    // Start Menu Toggle
    startMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close Start Menu when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (startMenu.style.display === 'block' && !startMenu.contains(e.target) && e.target !== startMenuButton) {
            startMenu.style.display = 'none';
        }
    });
    
    // Power and Logout Buttons
    powerButton.addEventListener('click', function() {
        powerDialog.style.display = 'flex';
        startMenu.style.display = 'none';
    });
    
    logoutButton.addEventListener('click', function() {
        desktop.style.display = 'none';
        loginScreen.style.display = 'flex';
        startMenu.style.display = 'none';
        // Close all open windows
        document.querySelectorAll('.app-window').forEach(window => {
            window.style.display = 'none';
        });
        // Clear taskbar
        taskbarApps.innerHTML = '';
    });
    
    // Power Dialog Options
    shutdownOption.addEventListener('click', function() {
        desktop.style.display = 'none';
        loginScreen.style.display = 'none';
        lockScreen.style.display = 'flex';
        powerDialog.style.display = 'none';
    });
    
    restartOption.addEventListener('click', function() {
        desktop.style.display = 'none';
        loginScreen.style.display = 'none';
        lockScreen.style.display = 'flex';
        powerDialog.style.display = 'none';
        
        // Simulate restart after 2 seconds
        setTimeout(function() {
            lockScreen.style.display = 'none';
            loginScreen.style.display = 'flex';
        }, 2000);
    });
    
    sleepOption.addEventListener('click', function() {
        desktop.style.display = 'none';
        loginScreen.style.display = 'none';
        lockScreen.style.display = 'flex';
        powerDialog.style.display = 'none';
    });
    
    cancelPowerOption.addEventListener('click', function() {
        powerDialog.style.display = 'none';
    });
    
    // Context Menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        // Position the context menu at the cursor
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        
        // Check if the context menu would go off the screen
        const rect = contextMenu.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        if (rect.right > windowWidth) {
            contextMenu.style.left = `${windowWidth - rect.width}px`;
        }
        
        if (rect.bottom > windowHeight) {
            contextMenu.style.top = `${windowHeight - rect.height}px`;
        }
        
        contextMenu.style.display = 'block';
    });
    
    // Close context menu when clicking elsewhere
    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    });
    
    // Window Management
    let activeWindow = null;
    let zIndex = 10;
    
    // Function to make a window active
    function makeWindowActive(window) {
        if (activeWindow) {
            activeWindow.classList.remove('active-window');
        }
        window.classList.add('active-window');
        window.style.zIndex = zIndex++;
        activeWindow = window;
        
        // Update taskbar
        document.querySelectorAll('.taskbar-app').forEach(app => {
            app.classList.remove('active');
            if (app.dataset.app === window.id) {
                app.classList.add('active');
            }
        });
    }
    
    // Function to open an app
    function openApp(appId) {
        const appWindow = document.getElementById(appId);
        if (appWindow) {
            // Check if app is already open
            if (appWindow.style.display === 'flex') {
                makeWindowActive(appWindow);
                return;
            }
            
            // Position the window in the center if opening for the first time
            if (!appWindow.dataset.positioned) {
                const width = appWindow.offsetWidth || 600;
                const height = appWindow.offsetHeight || 400;
                appWindow.style.width = `${width}px`;
                appWindow.style.height = `${height}px`;
                appWindow.style.left = `${(window.innerWidth - width) / 2}px`;
                appWindow.style.top = `${(window.innerHeight - height) / 2}px`;
                appWindow.dataset.positioned = 'true';
            }
            
            appWindow.style.display = 'flex';
            makeWindowActive(appWindow);
            
            // Add to taskbar if not already there
            if (!document.querySelector(`.taskbar-app[data-app="${appId}"]`)) {
                const taskbarApp = document.createElement('div');
                taskbarApp.className = 'taskbar-app active';
                taskbarApp.dataset.app = appId;
                
                // Get the icon from the app window
                const icon = appWindow.querySelector('.window-title i').cloneNode(true);
                const title = document.createElement('span');
                title.textContent = appWindow.querySelector('.window-title span').textContent;
                
                taskbarApp.appendChild(icon);
                taskbarApp.appendChild(title);
                
                taskbarApp.addEventListener('click', function() {
                    if (appWindow.style.display === 'flex') {
                        if (appWindow === activeWindow) {
                            appWindow.style.display = 'none';
                            taskbarApp.classList.remove('active');
                        } else {
                            makeWindowActive(appWindow);
                        }
                    } else {
                        appWindow.style.display = 'flex';
                        makeWindowActive(appWindow);
                    }
                });
                
                taskbarApps.appendChild(taskbarApp);
            }
        }
    }
    
    // Open apps from desktop icons
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const appId = this.dataset.app;
            openApp(appId);
        });
        
        // Double click for desktop icons
        icon.addEventListener('dblclick', function() {
            const appId = this.dataset.app;
            openApp(appId);
        });
    });
    
    // Open apps from start menu
    appItems.forEach(item => {
        item.addEventListener('click', function() {
            const appId = this.dataset.app;
            openApp(appId);
            startMenu.style.display = 'none';
        });
    });
    
    // Window controls (minimize, maximize, close)
    document.querySelectorAll('.window-minimize').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const window = this.closest('.app-window');
            window.style.display = 'none';
            
            // Update taskbar
            const taskbarApp = document.querySelector(`.taskbar-app[data-app="${window.id}"]`);
            if (taskbarApp) {
                taskbarApp.classList.remove('active');
            }
        });
    });
    
    document.querySelectorAll('.window-maximize').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const window = this.closest('.app-window');
            
            if (window.dataset.maximized === 'true') {
                // Restore window
                window.style.width = window.dataset.prevWidth;
                window.style.height = window.dataset.prevHeight;
                window.style.left = window.dataset.prevLeft;
                window.style.top = window.dataset.prevTop;
                window.dataset.maximized = 'false';
            } else {
                // Maximize window
                window.dataset.prevWidth = window.style.width;
                window.dataset.prevHeight = window.style.height;
                window.dataset.prevLeft = window.style.left;
                window.dataset.prevTop = window.style.top;
                
                window.style.width = '100%';
                window.style.height = 'calc(100% - 40px)';
                window.style.left = '0';
                window.style.top = '0';
                window.dataset.maximized = 'true';
            }
        });
    });
    
    document.querySelectorAll('.window-close').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const window = this.closest('.app-window');
            window.style.display = 'none';
            
            // Remove from taskbar
            const taskbarApp = document.querySelector(`.taskbar-app[data-app="${window.id}"]`);
            if (taskbarApp) {
                taskbarApp.remove();
            }
        });
    });
    
    // Make windows active when clicked
    appWindows.forEach(window => {
        window.addEventListener('mousedown', function() {
            makeWindowActive(this);
        });
        
        // Make window header draggable
        const header = window.querySelector('.window-header');
        if (header) {
            let isDragging = false;
            let offsetX, offsetY;
            
            header.addEventListener('mousedown', function(e) {
                if (e.target.closest('.window-controls')) {
                    return;
                }
                
                isDragging = true;
                offsetX = e.clientX - window.getBoundingClientRect().left;
                offsetY = e.clientY - window.getBoundingClientRect().top;
                window.classList.add('window-drag');
                
                // Prevent text selection during drag
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    const x = e.clientX - offsetX;
                    const y = e.clientY - offsetY;
                    
                    // Keep window within viewport
                    const maxX = window.innerWidth - window.offsetWidth;
                    const maxY = window.innerHeight - window.offsetHeight;
                    
                    window.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
                    window.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
                }
            });
            
            document.addEventListener('mouseup', function() {
                isDragging = false;
                window.classList.remove('window-drag');
            });
        }
    });
    
    // Settings functionality
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', this.checked);
        });
    }
    
    if (wallpaperSelect) {
        wallpaperSelect.addEventListener('change', function() {
            let wallpaperUrl = '';
            
            switch(this.value) {
                case 'default':
                    wallpaperUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80';
                    break;
                case 'mountains':
                    wallpaperUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';
                    break;
                case 'ocean':
                    wallpaperUrl = 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b2NlYW58ZW58MHx8MHx8&w=1000&q=80';
                    break;
                case 'forest':
                    wallpaperUrl = 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZXN0fGVufDB8fDB8fA%3D%3D&w=1000&q=80';
                    break;
            }
            
            document.querySelector('.os-container').style.backgroundImage = `url('${wallpaperUrl}')`;
        });
    }
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            document.documentElement.style.setProperty('--accent-color', this.style.backgroundColor);
            
            // Mark as active
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Calculator functionality
    const calcButtons = document.querySelectorAll('.calc-btn');
    const calcResult = document.querySelector('.calc-result');
    const calcHistory = document.querySelector('.calc-history');
    
    if (calcButtons.length > 0 && calcResult && calcHistory) {
        let currentInput = '0';
        let currentOperation = null;
        let previousInput = null;
        
        function updateCalculatorDisplay() {
            calcResult.textContent = currentInput;
        }
        
        calcButtons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.textContent;
                
                // Handle numbers
                if (!isNaN(value) || value === '.') {
                    if (currentInput === '0' && value !== '.') {
                        currentInput = value;
                    } else if (currentInput === '-0' && value !== '.') {
                        currentInput = '-' + value;
                    } else {
                        // Prevent multiple decimal points
                        if (value === '.' && currentInput.includes('.')) {
                            return;
                        }
                        currentInput += value;
                    }
                    updateCalculatorDisplay();
                }
                // Handle operators
                else if (['+', '-', '×', '÷'].includes(value)) {
                    if (previousInput !== null) {
                        // Perform the previous operation
                        calculate();
                    }
                    previousInput = currentInput;
                    currentOperation = value;
                    calcHistory.textContent = previousInput + ' ' + currentOperation;
                    currentInput = '0';
                }
                // Handle equals
                else if (value === '=') {
                    calculate();
                    calcHistory.textContent = '0';
                }
                // Handle clear
                else if (value === 'C') {
                    currentInput = '0';
                    previousInput = null;
                    currentOperation = null;
                    calcHistory.textContent = '0';
                    updateCalculatorDisplay();
                }
                // Handle clear entry
                else if (value === 'CE') {
                    currentInput = '0';
                    updateCalculatorDisplay();
                }
                // Handle backspace
                else if (this.innerHTML.includes('fa-delete-left')) {
                    if (currentInput.length > 1) {
                        currentInput = currentInput.slice(0, -1);
                    } else {
                        currentInput = '0';
                    }
                    updateCalculatorDisplay();
                }
                // Handle percentage
                else if (value === '%') {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                    updateCalculatorDisplay();
                }
                // Handle square
                else if (value === 'x²') {
                    currentInput = (parseFloat(currentInput) * parseFloat(currentInput)).toString();
                    updateCalculatorDisplay();
                }
                // Handle square root
                else if (value === '√x') {
                    currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                    updateCalculatorDisplay();
                }
                // Handle 1/x
                else if (value === '1/x') {
                    if (parseFloat(currentInput) !== 0) {
                        currentInput = (1 / parseFloat(currentInput)).toString();
                    } else {
                        currentInput = 'Error';
                    }
                    updateCalculatorDisplay();
                }
                // Handle sign change
                else if (value === '±') {
                    if (currentInput.startsWith('-')) {
                        currentInput = currentInput.substring(1);
                    } else {
                        currentInput = '-' + currentInput;
                    }
                    updateCalculatorDisplay();
                }
            });
        });
        
        function calculate() {
            if (previousInput === null || currentOperation === null) {
                return;
            }
            
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            let result;
            
            switch (currentOperation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        result = 'Error';
                    } else {
                        result = prev / current;
                    }
                    break;
            }
            
            calcHistory.textContent = previousInput + ' ' + currentOperation + ' ' + currentInput + ' = ';
            currentInput = result.toString();
            previousInput = null;
            currentOperation = null;
            updateCalculatorDisplay();
        }
    }
    
    // Notepad functionality
    const notepadTextarea = document.querySelector('#notepad textarea');
    if (notepadTextarea) {
        notepadTextarea.addEventListener('input', function() {
            // Update status bar with line and column count
            const text = this.value;
            const lines = text.split('\n');
            const currentPosition = this.selectionStart;
            
            let lineNumber = 1;
            let columnNumber = 1;
            let charCount = 0;
            
            for (let i = 0; i < lines.length; i++) {
                if (charCount + lines[i].length + 1 > currentPosition) {
                    lineNumber = i + 1;
                    columnNumber = currentPosition - charCount + 1;
                    break;
                }
                charCount += lines[i].length + 1;
            }
            
            const statusBar = document.querySelector('#notepad .window-statusbar span:last-child');
            if (statusBar) {
                statusBar.textContent = `Dòng ${lineNumber}, Cột ${columnNumber}`;
            }
        });
    }
    
    // Initialize the OS
    updateClock();
});