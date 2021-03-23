# Act-Master-CLI

CLI for act-master

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
# create .act-master.config.js file, to set up your project
npx act-master-cli init
```

```sh
# Generate actions interfaces and action list files

npx act-master-cli generate
# OR
npx act-master-cli g
```

`act-master-cli generate` - creates two files.

With the interfaces of your actions.

And with an array to be embedded in the library.
