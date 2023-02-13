import { FormSwitch, FormProvider, FormInput, FormSubmitButton, FormSlider } from '../../../../ui/src/forms';
export { getStaticProps } from 'multiplatform.one/next';
import { YStack } from 'tamagui';

interface FormProps {
  firstName: string;
  isMarried: boolean;
  age: number[];
}
const FormFields: FormProps = {
  firstName: '',
  isMarried: true,
  age: [0],
};

export default function Form() {
  return (
    <YStack jc="center" ai="center">
      <FormProvider defaultValues={FormFields} space>
        2
        <FormInput name="firstName" label="First Name" />
        <FormSwitch name="isMarried" label="Are You Married" />
        <FormSlider name="age" label="age" min={0} max={200} required bw="$-0" rules={{ required: true }} />
        <FormSubmitButton onSubmit={(data) => console.log(data)}>Submit</FormSubmitButton>
      </FormProvider>
    </YStack>
  );
}
