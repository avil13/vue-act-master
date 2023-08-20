# Act-Master-Cli

Act's can be spread out in different folders. And it is not always convenient to keep track of them.

To simplify this task, the package `act-master-cli` was created.

With it, you can:

- Collect all the act's in one file.
- Add strict typing and type substitution when you call them.
- Check act's for type correctness.

## Installation

```bash
npm install act-master-cli
```

## Configuration

Now you need to create a configuration file to search for acts.

```bash
npx act-master-cli init
```

This command will create a file `.act-master.yaml

It contains the recommended default parameters

```yaml
config:
  # the path to the folder with the source files relative to this file
  src: './src'
  alias: '@'
actionsPatterns: # a patterns for finding action files
  - 'act/**/*.act.ts'
generate:
  actionsIndexFile: 'act/generated/actions.ts'
  prefixText: '/* This is generated file */'
```


## Launch

To make it easier to run the command, we recommend adding a call command to `package.json` in the `scripts` section:
```json
  "act:gen": "act-master-cli g"
```

Now you can run the command that will generate the file

::: code-group
```bash [npm]
npm run act:gen
```
```bash [yarn]
yarn act:gen
```
```bash [npx]
npx act-master-cli g
```
:::

![act-master-cli demo](/img/act-master-cli-run.avif)

Usually projects use their own code style, and for the created file `act/generated/actions.ts` to match it, you can add formatting.

If you are using `eslint`, you can add the following command to `package.json` in the `scripts` section

```json
"postact:gen": "eslint ./src/act/generated/actions.ts --fix"
```

Now, after each run of the `act:gen` command, the created file will be formatted.
