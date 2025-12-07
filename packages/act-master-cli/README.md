# Act-Master-CLI

CLI for [act-master](https://www.npmjs.com/package/act-master)

# About

act-master-cli - adds the ability to automatically build and generate interfaces and lists of **typescript** actions.

With act-master-cli, you will noticeably increase the stability and reliability of your application.

# How to install

```sh
npm install -D act-master-cli
```

# Usage

```sh
# show help message
npx act-master-cli help
```

```sh
# create ".act-master.yaml" file, to set up your project
npx act-master-cli init
```

```sh
# Generate actions interfaces and action list files

npx act-master-cli generate
# OR
npx act-master-cli g
```

`act-master-cli generate` - creates files with the interfaces of your actions and with an array to be embedded in the library.
