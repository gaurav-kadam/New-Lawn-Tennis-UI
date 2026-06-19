import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AuthService from '../services/auth/auth.service';

// Define the type structure matching your backend response
export interface LoggedInUser {
  name: string;
  email: string;
  role?: {
    role_name: string;
    is_active: boolean;
  };
}

export function useHeader() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);

  // Load the user details from storage on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AuthService.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.log('Error reading user data in hook:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await AuthService.logout();
      router.replace('/login');
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };

  const handleUserDetails = () => {
    setDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  // UI Fallback text calculations
  const displayName = user?.name || 'Loading...';
  const displayRole = user?.role?.role_name || 'User';
  const displayEmail = user?.email || '—';

  return {
    dropdownOpen,
    isProfileModalOpen,
    displayName,
    displayRole,
    displayEmail,
    toggleDropdown,
    closeProfileModal,
    handleLogout,
    handleUserDetails,
  };
}