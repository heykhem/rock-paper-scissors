import * as UI from "./ui.js";
import * as Auth from "./auth.js";

const user = await Auth.initAuth();
// console.log("USER FROM INIT:", user);

if (user) {
  UI.showUserUI(user);
} else {
  UI.showGuestUI();
}
