import React from 'react';
import { Text, TouchableOpacity, View, Pressable, Image } from 'react-native';

import { useTheme } from '../../../theme/themeContext';
import { useHeader } from '../../../hooks/useHeader';
import ProfileModal from '../../../components/elements/ProfileModal'; 

export default function Header({ onToggle }: any) {
  const theme = useTheme();

  const {
    dropdownOpen,
    isProfileModalOpen,
    displayName,
    displayRole,
    displayEmail,
    toggleDropdown,
    closeProfileModal,
    handleLogout,
    handleUserDetails,
  } = useHeader();

  return (
    <View
      style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: theme.layout.dividerHeight,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        zIndex: 1000,
      }}
    >
      {/* LEFT GROUP: HAMBURGER + LOGO */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={onToggle} style={{ marginRight: theme.spacing.md }}>
          <Text style={{ fontSize: theme.typography.sizes.h3, color: theme.colors.textPrimary }}>☰</Text>
        </TouchableOpacity>

        <Image 
          source={require('../../../assets/images/FW_logo.jpeg')} 
          style={{ 
            width: 100,    // Adjusted size to fit well next to hamburger
            height: 35, 
            resizeMode: 'contain' 
          }} 
        />
      </View>

      {/* RIGHT - PROFILE DROPDOWN MANAGER */}
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={toggleDropdown}
          activeOpacity={0.7}
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
          }}
        >
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.sizes.small,
              fontWeight: theme.typography.weights.medium as any,
              textTransform: 'capitalize',
            }}
          >
            {displayName}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.cooldownTimer,
              fontWeight: theme.typography.weights.regular as any,
              marginTop: theme.spacing.xs / 2,
            }}
          >
            {displayRole}
          </Text>
        </TouchableOpacity>

        {/* INTERACTIVE DROPDOWN OPTIONS */}
        {dropdownOpen && (
          <View
            style={{
              position: 'absolute',
              top: 45,
              right: 0,
              width: theme.layout.popupCard.width - 80,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: theme.layout.popupCard.borderWidth,
              borderColor: theme.colors.border,
              paddingVertical: theme.spacing.xs,
              ...theme.shadow.medium,
              zIndex: 1010,
            }}
          >
            <Pressable
              onPress={handleUserDetails}
              style={({ pressed }) => ({
                paddingVertical: theme.spacing.sm + 4,
                paddingHorizontal: theme.spacing.md,
                backgroundColor: pressed ? 'rgba(0,0,0,0.03)' : 'transparent',
                borderBottomWidth: theme.layout.dividerHeight,
                borderBottomColor: theme.colors.border,
              })}
            >
              <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.regular as any }}>
                User Details
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({
                paddingVertical: theme.spacing.sm + 4,
                paddingHorizontal: theme.spacing.md,
                backgroundColor: pressed ? theme.colors.actions.deleteBg : 'transparent',
              })}
            >
              <Text style={{ color: theme.colors.error, fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium as any }}>
                Logout
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        displayName={displayName}
        displayEmail={displayEmail}
        displayRole={displayRole}
      />
    </View>
  );
}