# publish-variants

Enable automated publication of same package as different variants like `es5` and `es6`.

```bash
npm install -D publish-variants
```

```bash
# npx publish-variants --help
publish-variants version

Options:
  --version      Show version number                                   [boolean]
  --config, -c   path to config file            [default: "./publish.config.js"]
  --variant, -v  Process only selected variant                           [array]
  --dry-run, -d  Run all step except for final publish                 [boolean]
  --help         Show help                                             [boolean]
```
Sample `publish.config.js`
```js
module.exports = {
  variants: {
    es5: {
      steps: [
        'npm run test',
        'npm run build',
      ],

    },
    es2015: {
      suffix: '-es2015',
      tag: 'es2015',
      steps: [
        'npm run test',
        'npm run build:es2015',
      ],
    },
  }
}
```

To run just use `npx`:
```
npx publish-variants 1.0.0
```
