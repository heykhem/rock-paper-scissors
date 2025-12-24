import * as UI from "./ui.js";
import * as Auth from "./auth.js";

// INIT AUTH ON LOAD
document.addEventListener("DOMContentLoaded", async () => {
  const user = await Auth.initAuth();

  if (user) {
    UI.showUserUI(user);
  } else {
    UI.showGuestUI();
  }
});
