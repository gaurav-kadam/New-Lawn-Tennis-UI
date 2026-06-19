
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import { useTheme } from '../../theme/themeContext';

export default function UserRoleSelect({
  value,
  onChange,
  roles = [],
}: any) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const selected = roles.find(
    (role: any) => String(role.role_id) === value
  );

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={{ marginBottom: 4, color: theme.colors.textPrimary }}>
        User Type
      </Text>

      <Pressable
        onPress={() => setOpen(!open)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text style={{ color: theme.colors.textPrimary }}>
          {selected ? selected.role_name : 'Select User Type'}
        </Text>
      </Pressable>

      {open ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginTop: 4,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.surface,
            maxHeight: 120,
          }}
        >
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {roles.map((role: any) => (
              <Pressable
                key={role.role_id}
                onPress={() => {
                  onChange(String(role.role_id));
                  setOpen(false);
                }}
                style={{
                  padding: theme.spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <Text style={{ color: theme.colors.textPrimary }}>
                  {role.role_name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}