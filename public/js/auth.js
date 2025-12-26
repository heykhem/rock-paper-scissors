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
        avatar_url: "assets/avatar/sensi.png", // ✅ default avatar
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
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear local user state
    currentUser = null;

    // Update UI dynamically
    UI.showGuestUI();

    console.log("User logged out successfully");
  } catch (err) {
    console.error("Logout error:", err.message);
  }
}

// GET USER
export function getUser() {
  return currentUser;
}

// AUTO LOGIN (on refresh)
export async function initAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  currentUser = session?.user ?? null;
  return currentUser;
}

// GET USER PROFILE
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", userId)
    .single(); // we expect only one profile

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data; // { full_name, username, avatar_url }
}
