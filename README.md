# prisma-scripts

[![GitHub stars](https://img.shields.io/github/stars/silicon-hills/prisma-scripts.svg?style=social&label=Stars)](https://github.com/silicon-hills/prisma-scripts)

> scripts for managing prisma orm

Please ★ this repo if you found it useful ★ ★ ★

## Installation

```sh
npm install --save prisma-scripts
```

## Usage

```ts
await seedDb(
  {
    user: {
      email,
      firstname,
      lastname,
      password:
        // eslint-disable-next-line spellcheck/spell-checker
        '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'ADMIN'
    }
  },
  ['user.password']
);
```

## Support

Submit an [issue](https://github.com/codejamninja/prisma-scripts/issues/new)

## License

[Apache-2.0](LICENSE)

[Silicon Hills LLC](https://siliconhills.dev) © 2020-2021

## Credits

- [Clay Risser](https://clayrisser.com) - Author
