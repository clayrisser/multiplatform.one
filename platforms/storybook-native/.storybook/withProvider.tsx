import { ReactNode } from 'react';
import { makeDecorator, LegacyStoryFn, StoryWrapper } from '@storybook/addons';

const withProvider = makeDecorator({
  name: 'withProvider',
  parameterName: 'provider',
  skipIfNoParametersOrOptions: false,
  wrapper: ((getStory: LegacyStoryFn<ReactNode>, context: any) => {
    return getStory(context);
  }) as StoryWrapper,
});

export default withProvider;
