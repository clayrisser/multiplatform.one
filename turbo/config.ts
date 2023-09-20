import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('component', {
    description: 'Generates a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component to create?',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'Name cannot include extension';
          }
          if (input.includes(' ')) {
            return 'Name cannot include spaces';
          }
          if (!input) {
            return 'Name required';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'createStory',
        message: 'Do you want storyFile for this component',
      },
      {
        type: 'confirm',
        name: 'createNativeFile',
        message: 'Do you want a .native.tsx file to be created?',
      },
    ],
    actions: (prompts) => {
      const actions: PlopTypes.ActionType[] = [
        {
          type: 'add',
          path: '{{turbo.paths.root}}/app/components/{{ pascalCase name }}/index.tsx',
          templateFile: 'templates/component.hbs',
        },
      ];
      if (prompts?.createStory) {
        actions.push({
          type: 'add',
          path: '{{ turbo.paths.root }}/app/components/{{ pascalCase name }}/{{ pascalCase name }}.stories.tsx',
          templateFile: 'templates/story.hbs',
        });
      }
      if (prompts?.createNativeFile) {
        actions.push({
          type: 'add',
          path: '{{ turbo.paths.root }}/app/components/{{ pascalCase name }}/{{ pascalCase name }}.native.tsx',
          templateFile: 'templates/component.hbs',
        });
      }
      return actions;
    },
  });

  plop.setGenerator('screen', {
    description: 'Generate a Screen directory, a screen and Next.js and Expo routes',
    prompts: async (inquirer) => {
      let { path } = await inquirer.prompt({
        type: 'input',
        name: 'path',
        message:
          'In Next.js and Expo, the path for screens should start with a forward slash (/).\n For example, /contact for the contact screen, /contact/mapLocation for the mapLocation sub-screen:',
        validate: (input: string) => {
          if (!input.startsWith('/')) {
            return 'path should start with /';
          }
          if (input.includes(' ')) {
            return 'path cannot include spaces';
          }

          if (!input) {
            return 'path is required';
          }
          return true;
        },
      });

      const screenName = path.split('/').pop();
      path = path.split('/');
      path.pop();
      path = path.join('/');

      const convertToKebabCase = (str) => {
        return str
          .replace(/\s+/g, '-')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
      };

      const kebabPath = convertToKebabCase(path);

      return {
        path,
        screenName,
        kebabPath,
      };
    },
    actions: (prompts) => {
      const actions: PlopTypes.ActionType[] = [
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/app/screens/{{ path }}/{{camelCase screenName}}/index.tsx`,
          templateFile: 'templates/screen.hbs',
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/app/screens/{{ path}}/{{ camelCase screenName }}/{{ camelCase screenName }}.stories.tsx`,
          templateFile: 'templates/screen-story.hbs',
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/platforms/next/pages/{{kebabPath }}/{{kebabCase screenName}}/index.tsx`,
          templateFile: 'templates/nextjs-page.hbs',
        },
        {
          type: 'append',
          path: '{{ turbo.paths.root }}/app/navigation/native/index.tsx',
          pattern: "import React from 'react';",
          template: "import {{ pascalCase screenName }} from 'app/screens{{ path }}/{{camelCase screenName}}' ",
        },
        {
          type: 'append',
          path: '{{ turbo.paths.root }}/app/navigation/native/index.tsx',
          pattern: 'const Stack = createNativeStackNavigator<{',
          template: `{{ camelCase screenName }}: undefined; `,
        },
        {
          type: 'modify',
          path: '{{ turbo.paths.root }}/app/navigation/native/index.tsx',
          pattern: '</Stack.Navigator>',
          template: `\t<Stack.Screen name="{{ camelCase screenName }}" component={ {{ pascalCase screenName }} } />\n\t\t</Stack.Navigator>`,
        },
        {
          type: 'append',
          path: `{{ turbo.paths.root }}/app/navigation/native/index.tsx`,
          pattern: 'export const routeMaps = {',
          template: `{{ camelCase screenName }}: '{{ kebabPath }}/{{kebabCase screenName}}', `,
        },
      ];
      return actions;
    },
  });
}
