import * as UI from "./modules/ui.js";
import * as Auth from "./modules/auth.js";

// INIT AUTH ON LOAD
document.addEventListener("DOMContentLoaded", async () => {
  const user = await Auth.initAuth();

  if (user) {
    UI.showUserUI(user);
  } else {
    UI.showGuestUI();
  }
});
