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


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "objectid-compare/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


