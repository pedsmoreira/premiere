# Contributing

We'd love to have your contribution added to Premiere. If you decide to do so, please follow the
[code of conduct](./CODE_OF_CONDUCT.md)

## Code Style

Please follow the [TSLint](https://github.com/palantir/tslint) rules on the [tslint.json](tslint.json) file.
You can analyse your code style with `npm run lint`.

The linter is also ran before the tests, so if your build is not passing, may be because of formatting.

## Commit Messages

Commit messages should be verb based, such as:

- Fixing ...
- Adding ...
- Updating ...
- Removing ...

## Testing

Please update the tests to accordingly to your code changes. Pull requests will only be accepted if they are successful on
[Travis CI](https://travis-ci.org/pedsmoreira/premiere).

## Documentation
   
If needed, please update the README and tutorials to reflect your changes.
Upon publishing a new version, the `documentation` will be updated automatically.

## Releasing

To release a new version, define the number following the [semantic versioning](http://semver.org/).


``` bash
$ npm version <newversion> -m "Releasing %s"
$ npm publish
```
