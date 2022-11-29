# eslint-plugin-objectid-compare

Comparing ObjectId from mongodb module

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-objectid-compare`:

```sh
npm install eslint-plugin-objectid-compare --save-dev
```

## Usage

Add `objectid-compare` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "objectid-compare"
    ]
}
```

Also this plugin required parser options, so please add in your `.eslintrc` configuration file:

```json
{
    "parserOptions": {
        "project": ["path/to/your/tsconfig/file"]
    },
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "objectid-compare/rule-name": "warn"
    }
}
```

For currently supported rule:

```json
{
    "rules": {
        "objectid-compare/objectid-compare": "warn"
    }
}
```

## Supported Rules

* objectid-compare

## Usage - Examples

When comparation sign '===' is used, and both sides are type of ObjectId, or can be
ObjectId, warning will be shown.

Example 1:
![example-1](https://github.com/almedinhodzic/objectid-compare/blob/main/assets-docu/example1.gif)
Example 2:
![example-2](https://github.com/almedinhodzic/objectid-compare/blob/main/assets-docu/example2.png)


---

## Author Info

- LinkedIn - [@almedin](https://www.linkedin.com/in/almedin-hodzic-171a3b203/)


