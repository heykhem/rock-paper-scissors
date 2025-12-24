import { supabase } from "./supabase.js";
import * as UI from "./ui.js";

let currentUser = null;

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
export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // store it here
    },
  });

  if (error) throw error;

  currentUser = data.user;
  console.log(currentUser);
  return currentUser;
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
export async function initAuth() {
  const { data } = await supabase.auth.getSession();
  currentUser = data.session?.user || null;
  return currentUser;
}

export function getUsername() {
  if (!currentUser) return null;
  return currentUser.user_metadata?.username || currentUser.email.split("@")[0];
}
