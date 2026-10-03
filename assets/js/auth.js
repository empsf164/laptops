/**
 * NOVA LAPTOPS - Authentication System (Demo State with Local Storage)
 * Manages user accounts, session state, login, signup, and navbar rendering
 */

(function () {
  const AUTH_STORAGE_KEY = "nova_auth_session";
  const USERS_STORAGE_KEY = "nova_registered_users";

  // Default seed user for testing
  const defaultUsers = [
    {
      name: "Alex Thorne",
      email: "alex.thorne@example.com",
      password: "password123",
      preference: "Developer",
      createdAt: new Date().toISOString()
    }
  ];

  function getUsers() {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : defaultUsers;
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    renderNavAuthState();
  }

  function login(email, password) {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      const sessionUser = {
        name: user.name,
        email: user.email,
        preference: user.preference || "General",
        loggedInAt: new Date().toISOString()
      };
      setCurrentUser(sessionUser);
      return { success: true, user: sessionUser };
    }
    return { success: false, message: "Invalid email or password" };
  }

  function signup(name, email, password, preference = "General") {
    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: "An account with this email already exists" };
    }
    const newUser = { name, email, password, preference, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);

    const sessionUser = { name, email, preference, loggedInAt: new Date().toISOString() };
    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  }

  function logout() {
    setCurrentUser(null);
    if (window.showToast) {
      window.showToast("Signed out successfully", "info");
    }
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }

  function renderNavAuthState() {
    const authContainers = document.querySelectorAll(".nav-auth-container");
    const user = getCurrentUser();

    authContainers.forEach((container) => {
      if (user) {
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        container.innerHTML = `
          <div class="user-nav-dropdown">
            <button class="user-avatar-btn" id="userMenuBtn" aria-label="User profile">
              <div class="user-avatar-img">${initials}</div>
              <span class="user-name-text">${user.name.split(" ")[0]}</span>
              <i data-lucide="chevron-down" style="width: 14px; height: 14px;"></i>
            </button>
            <div class="dropdown-menu" id="userMenuDropdown" style="right: 0; left: auto; width: 220px;">
              <div style="padding: 0.5rem 0.85rem; border-bottom: 1px solid var(--border-subtle); margin-bottom: 0.5rem;">
                <div style="font-weight: 700; font-size: 0.875rem; color: var(--text-primary);">${user.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${user.email}</div>
                <div class="badge badge-blue" style="margin-top: 0.35rem;">${user.preference}</div>
              </div>
              <a href="saved.html" class="dropdown-item">
                <i data-lucide="bookmark" style="width: 16px; height: 16px;"></i> My Saved Items
              </a>
              <a href="compare.html" class="dropdown-item">
                <i data-lucide="scale" style="width: 16px; height: 16px;"></i> Active Comparison
              </a>
              <div style="border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;"></div>
              <button class="dropdown-item" id="logoutBtn" style="width: 100%; color: var(--rose-accent);">
                <i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Sign Out
              </button>
            </div>
          </div>
        `;

        const userMenuBtn = container.querySelector("#userMenuBtn");
        const userMenuDropdown = container.querySelector("#userMenuDropdown");
        const logoutBtn = container.querySelector("#logoutBtn");

        if (userMenuBtn && userMenuDropdown) {
          userMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = userMenuDropdown.style.opacity === "1";
            userMenuDropdown.style.opacity = isOpen ? "0" : "1";
            userMenuDropdown.style.visibility = isOpen ? "hidden" : "visible";
            userMenuDropdown.style.transform = isOpen ? "translateY(10px)" : "translateY(4px)";
          });

          document.addEventListener("click", () => {
            userMenuDropdown.style.opacity = "0";
            userMenuDropdown.style.visibility = "hidden";
          });
        }

        if (logoutBtn) {
          logoutBtn.addEventListener("click", logout);
        }
      } else {
        container.innerHTML = `
          <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
        `;
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderNavAuthState();
  });

  window.novaAuth = {
    getCurrentUser,
    login,
    signup,
    logout,
    renderNavAuthState
  };
})();
