# Changelog

## [1.3.0]
- Added the ability to define global configuration options using the `config` static method.
- The `getState` method is now passed to action modifiers and request callback functions (`onSuccess` and `onError`).

## [1.2.0]
- Added `onSuccess` and `onError` request options.

## [1.1.0]
- Added the `actionModifiers` request option, which allows modifying the object passed to the `dispatch` function.
- Fixed a bug where errors were not returning a rejected promise.
- Upgraded some dev dependencies.

## [1.0.0]
- Initial release
