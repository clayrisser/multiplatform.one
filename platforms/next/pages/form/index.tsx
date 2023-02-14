import {
  FormSwitch,
  FormProvider,
  FormInput,
  FormSubmitButton,
  FormSlider,
  FormTextArea,
  FormSelectSimple,
} from '../../../../ui/src/forms';
export { getStaticProps } from 'multiplatform.one/next';
import { YStack, Select } from 'tamagui';

interface FormProps {
  firstName: string;
  isMarried: boolean;
  age: number[];
  email: string;
  fruits: string;
}
const FormFields: FormProps = {
  firstName: '',
  isMarried: true,
  age: [0],
  email: '',
  fruits: '',
};

export default function Form() {
  const validateSlider = (value: number[]) => {
    if (value[0] < 18) {
      return 'You must be 18 years or older';
    }
    return true;
  };
  return (
    <YStack jc="center" ai="center" space>
      <FormProvider defaultValues={FormFields} space>
        <FormInput
          name="firstName"
          label="First Name"
          rules={{
            required: true,
            minLength: {
              value: 3,
              message: 'min length should be 3',
            },
            maxLength: {
              value: 10,
              message: 'max length should be 10',
            },
          }}
          required
        />
        <FormInput
          label="Email"
          name="email"
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'invalid email address',
            },
          }}
        />
        <FormSelectSimple name="fruits" label="Favorite Fruit" rules={{ required: true }}>
          {fruits.map((item, index) => (
            <Select.Item key={index} value={item.toLowerCase()} index={index}>
              <Select.ItemText>{item.toUpperCase()}</Select.ItemText>
            </Select.Item>
          ))}
        </FormSelectSimple>
        <FormTextArea
          name="description"
          label="Description"
          required
          rules={{ required: { value: true, message: 'this field is required' } }}
        />
        <FormSlider
          name="age"
          label="age"
          min={0}
          max={200}
          required
          bw="$-0"
          rules={{ required: true, validate: validateSlider }}
          marginTop="$2"
          marginBottom="$3"
        />
        <FormSwitch name="isMarried" label="Are You Married" />
        <FormSubmitButton onSubmit={(data) => console.log(data)}>Submit</FormSubmitButton>
      </FormProvider>
    </YStack>
  );
}
const fruits = [
  'apple',
  'banana',
  'orange',
  'kiwi',
  'mango',
  'pineapple',
  'strawberry',
  'grape',
  'blueberry',
  'watermelon',
];
