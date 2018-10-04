# Changelog

## [2.0.0]
- Added a `DuckFactory` named export, which allows for creating ducks that share the same base configuration.
- [BREAKING]: The default export has been replaced with a named export `Duck`.
- [BREAKING]: `dispatch` is now passed to the `onSuccess` and `onError` callbacks as the first argument. The new signature is `(dispatch, getState, [response, error])`.
- Improvements to the fetch plugin
- Improved flow type support

## [1.2.0]
- Added `onSuccess` and `onError` request options.

## [1.1.0]
- Added the `actionModifiers` request option, which allows modifying the object passed to the `dispatch` function.
- Fixed a bug where errors were not returning a rejected promise.
- Upgraded some dev dependencies.

## [1.0.0]
- Initial release
