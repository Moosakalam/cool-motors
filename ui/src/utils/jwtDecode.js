// import { jwtDecode } from "jwt-decode";

// // Function to extract user ID from JWT
// export function getUserIdFromToken(token) {
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.id || decoded.sub; // Adjust according to your JWT structure
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null;
//   }
// }

export const isMobile = () => {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent);
};
