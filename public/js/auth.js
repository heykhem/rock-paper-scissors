import { supabase } from "./supabase.js";
import * as UI from "./ui.js";

let currentUser = null;

/**
 * Sign up a new user with full name, email, and password
 * @param {string} fullName - Full name of the user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} - { user, error }
 */

// LOGIN
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  currentUser = data.user;
  return currentUser;
}

// SIGNUP
export async function signup(fullName, email, password) {
  try {
    // 1️⃣ Sign up in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    // 2️⃣ Generate default username from full name
    const username = fullName.trim().split(" ")[0].toLowerCase();

    // 3️⃣ Insert user profile into `profiles` table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id, // Link to auth.users.id
        full_name: fullName,
        username: username,
        avatar_url: null, // You can assign a default avatar here
      },
    ]);

    if (profileError) {
      return { user: null, error: profileError };
    }

    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
}
// LOGOUT
export async function logout() {
  await supabase.auth.signOut();
  currentUser = null;

  // Refresh UI after logout
  UI.showGuestUI(); // function that switches UI to guest mode
}

// GET USER
export function getUser() {
  return currentUser;
}

// AUTO LOGIN (on refresh)
// AUTO LOGIN (on refresh)
export async function initAuth() {
  // 1️⃣ Get current session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error.message);
    currentUser = null;
    return currentUser;
  }

  // 2️⃣ Set currentUser if session exists
  currentUser = session?.user || null;

  // 3️⃣ Optional: listen for session changes (login/logout)
  supabase.auth.onAuthStateChange((event, newSession) => {
    currentUser = newSession?.user || null;

    if (currentUser) {
      // Update UI when user logs in
      UI.showUserUI(currentUser);
    } else {
      // Update UI when user logs out
      UI.showGuestUI();
    }
  });

  return currentUser;
}

export function getUsername() {
  if (!currentUser) return null;
  return currentUser.user_metadata?.username || currentUser.email.split("@")[0];
}
