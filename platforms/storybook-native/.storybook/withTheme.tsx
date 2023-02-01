import React, { useEffect, useState } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { useThemeState } from 'app/state/theme';
import { ThemeName } from 'tamagui';

const UPDATE_BACKGROUND = 'storybook-addon-background:update';

export const withTheme = makeDecorator({
  name: 'withTheme',
  parameterName: 'backgrounds',
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    const channel = addons.getChannel();
    const data = (parameters || { values: [] }) as {
      default?: string;
      values: Background[];
    };
    const backgrounds: Background[] = data.values;
    const defaultValue = data.default ? backgrounds.find((b) => b.name === data.default) : undefined;
    const defaultOrFirst = defaultValue ? defaultValue : backgrounds[0];
    const [background, setBackground] = useState(defaultOrFirst?.value || '');
    const themeState = useThemeState();

    useEffect(() => {
      channel.on(UPDATE_BACKGROUND, setBackground);
      return () => {
        channel.removeListener(UPDATE_BACKGROUND, setBackground);
      };
    }, [channel]);

    const themeName = backgrounds.find((b) => b.value === background)?.name;

    useEffect(() => {
      if (!themeName) return;
      themeState.setRoot(themeName);
    }, [themeName, themeState.setRoot]);

    return <>{getStory(context)}</>;
  },
});

interface Background {
  name: ThemeName;
  value: string;
}
