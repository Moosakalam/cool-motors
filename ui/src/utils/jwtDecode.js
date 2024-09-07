import { jwtDecode } from "jwt-decode";

// Function to extract user ID from JWT
export function getUserIdFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    // Assuming the ID is stored in the 'id' field of the token payload
    return decoded.id || decoded.sub; // Adjust according to your JWT structure
  } catch (error) {
    console.log("hioo");

    console.error("Invalid token", error);
    return null;
  }
}
