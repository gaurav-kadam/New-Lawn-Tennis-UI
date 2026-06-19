import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import Select from '@/components/ui/Select';
import { useAuth } from '@/hooks/fake_auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useTheme } from '../../theme/themeContext';
import DatePicker from '@/components/ui/DatePicker';

export default function Dashboard() {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [dob, setDob] = useState<Date>();

  const { logout } = useAuth();
  const router = useRouter();

  return (
    <ScrollView
  contentContainerStyle={{
    padding: theme.spacing.md,
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  }}
  showsVerticalScrollIndicator={false}
>

  <Button
    title="Logout"
     style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        gap: theme.spacing.lg,
      }}
    onPress={() => {
      logout(); // ❌ remove access
          router.replace('/login'); // 🔁 redirect
        
    }}
  />
  {/* All your sections here */}

    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        gap: theme.spacing.lg,
      }}
    >

      {/* ================= CARD SECTION ================= */}
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ color: theme.colors.textPrimary }}>
          Cards
        </Text>

        <Card>
          <Text style={{ color: theme.colors.textPrimary }}>
            Default Card
          </Text>
        </Card>

        <Card variant="outlined">
          <Text style={{ color: theme.colors.textPrimary }}>
            Outlined Card
          </Text>
        </Card>

        <Card onPress={() => console.log('Card Clicked')}>
          <Text style={{ color: theme.colors.textPrimary }}>
            Clickable Card
          </Text>
        </Card>
      </View>

      {/* ================= INPUT SECTION ================= */}

       <View>
 <Text style={{ color: theme.colors.textPrimary }}>
          Datepicker
        </Text>
      <DatePicker
        label="Date of Birth"
        value={dob}
        onChange={setDob}
      />

    </View>

      {/* ================= INPUT SECTION ================= */}
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ color: theme.colors.textPrimary }}>
          Inputs
        </Text>

        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={(text: string) => {
            setName(text);
            if (text) setError('');
          }}
        />

        <Input
          label="With Error"
          placeholder="Try submit empty"
          value={name}
          onChangeText={setName}
          error={error}
        />

        <Button
          title="Validate Input"
          onPress={() => {
            if (!name) {
              setError('Name is required');
            } else {
              console.log('Valid:', name);
            }
          }}
        />
      </View>

        {/* ================= Radio Group SECTION ================= */}
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ color: theme.colors.textPrimary }}>
          Radio Group
        </Text>

        <RadioGroup
  label="Gender"
  value={gender}
  onChange={setGender}
  options={[
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]}
/>

        <Input
          label="With Error"
          placeholder="Try submit empty"
          value={name}
          onChangeText={setName}
          error={error}
        />

        <Button
          title="Validate Input"
          onPress={() => {
            if (!name) {
              setError('Name is required');
            } else {
              console.log('Valid:', name);
            }
          }}
        />
      </View>

      {/* ================= SELECT SECTION ================= */}
<View style={{ gap: theme.spacing.sm }}>
  <Text style={{ color: theme.colors.textPrimary }}>
    Select Dropdown
  </Text>

  <Select
    label="Country"
    value={country}
    onChange={setCountry}
    options={[
      { label: 'India', value: 'india' },
      { label: 'USA', value: 'usa' },
      { label: 'UK', value: 'uk' },
    ]}
  />

  <Button
    title="Show Selected"
    onPress={() => {
      console.log('Selected Country:', country);
    }}
  />
</View>


{/* ================= CHECKBOX SECTION ================= */}
<View style={{ gap: theme.spacing.sm }}>
  <Text style={{ color: theme.colors.textPrimary }}>
    Checkbox
  </Text>

  <Checkbox
    label="Accept Terms & Conditions"
    value={isChecked}
    onChange={setIsChecked}
  />

  <Button
    title="Check Status"
    onPress={() => {
      console.log('Checked:', isChecked);
    }}
  />
</View>

      {/* ================= BUTTON SECTION ================= */}
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ color: theme.colors.textPrimary }}>
          Buttons
        </Text>

        {/* Primary */}
        <Button title="Primary Button" />

        {/* Variants */}
        <Button title="Outline Button" variant="outline" />
        <Button title="Ghost Button" variant="ghost" />
        <Button title="Danger Button" variant="danger" />

        {/* Sizes */}
        <Button title="Small Button" size="sm" />
        <Button title="Large Button" size="lg" />

        {/* With Icons */}
        <Button title="Add Item" icon="add" />
        <Button title="Next Step" icon="arrow-forward" iconPosition="right" />

        {/* States */}
        <Button title="Loading Button" loading />
        <Button title="Disabled Button" disabled />
      </View>

    </View>
    </ScrollView>
  );
}