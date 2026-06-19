import AsyncStorage
from '@react-native-async-storage/async-storage';

class StorageService {

  async set(
    key: string,
    value: any
  ) {

    await AsyncStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }

  async get(key: string) {

    const value =
      await AsyncStorage.getItem(key);

    // IMPORTANT FIX
    if (!value) {
      return null;
    }

    try {

      return JSON.parse(value);

    } catch {

      return value;
    }
  }

  async remove(key: string) {

    await AsyncStorage.removeItem(key);
  }

  async clear() {

    await AsyncStorage.clear();
  }
}

export default new StorageService();