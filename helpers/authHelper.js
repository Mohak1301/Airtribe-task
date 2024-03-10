import bcrypt from "bcrypt"

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error occurred while hashing password:", error);
  }
};

/**
 * Compares a plain-text password with a hashed password.
 * @param {string} password - The plain-text password.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the passwords match.
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
