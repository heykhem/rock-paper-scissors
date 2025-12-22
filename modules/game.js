export function winCheck(user, computer) {
  if (user === computer) return null;
  return (user - computer + 3) % 3 === 1;
}
