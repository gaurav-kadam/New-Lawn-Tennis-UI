import { Controller } from 'react-hook-form';
import Input from '../ui/Input';

export default function FormInput({
  control,
  name,
  rules,
  ...props
}: any) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          {...props}
          value={value}
          onChangeText={onChange}
          error={error?.message}
        />
      )}
    />
  );
}