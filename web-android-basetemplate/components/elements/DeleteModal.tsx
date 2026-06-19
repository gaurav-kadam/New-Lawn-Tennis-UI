import {
    Modal,
    Text,
    View,
} from 'react-native';

import Button from '../ui/Button';
import Card from '../ui/Card';

import UserService from '../../services/users/user.Service';
import { useTheme } from '../../theme/themeContext';

export default function DeleteModal({
  visible,
  onClose,
  selectedUser,
  reload,
}: any) {
  const theme = useTheme();

  const onDelete = async () => {
    try {
      await UserService.deleteUser(selectedUser.id);

      reload();

      onClose();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: 20,
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: theme.colors.textPrimary,
              marginBottom: 20,
            }}
          >
            Delete User
          </Text>

          <Text
            style={{
              color: theme.colors.textSecondary,
              marginBottom: 20,
            }}
          >
            Are you sure you want to delete this user?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
            />

            <Button
              title="Delete"
              variant="danger"
              onPress={onDelete}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}