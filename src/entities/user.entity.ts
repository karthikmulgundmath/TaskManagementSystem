export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // For hashing
  role: 'owner' | 'contributor'; // Define roles here
}
