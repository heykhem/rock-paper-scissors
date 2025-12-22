import { supabase } from "./supabase.js";

let currentUser = null;

// INIT (check session on reload)
export async function initAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  currentUser = session?.user || null;
  return currentUser;
}

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
  });

  if (error) throw error;

  currentUser = data.user;
  return currentUser;
}

// LOGOUT
export async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
}

// GET USER
export function getUser() {
  return currentUser;
}
