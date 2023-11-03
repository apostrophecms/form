# Changelog

## 1.3.0 (2023-11-03)

### Adds

* Add group widget which is a fieldset container for other form widgets.
* Add multiple and size fields to select widget.

### Fixes

* Fix missing select widget icon.

## 1.2.0 (2023-10-12)

### Adds

* File upload can now be limited in size (frontend only) by setting the max file size per file upload field.
On the server, there are many factors that can influence this rule (for example proxies and servers used 
between Apostrophe and the end-user). That is why this rule is not enforced on the server side.
We use the default express connect-multiparty size limits. The rule is checked before submit.
* Allow to configure file field `multiple` attribute. By default, file field allow the user to select multiple files.
This can now be disabled.
* Add divider widget (`<hr>` tag) to form widgets.

### Fixes

* To avoid confusion, we can now select only one form when editing the form widget relationship to form field ('Form to display'). Note that selecting more than one form never had any useful effect.

## 1.1.1 (2023-02-17)

### Fixes

* Remove `apostrophe` as a peer dependency.

## 1.1.0 (2023-01-18)

### Adds

* Emit new event `beforeSaveSubmission`. The event receives `req, { form, data, submission }` allowing an opportunity to modify `submission` just before it is saved to the MongoDB collection. For most purposes the `submission` event is more useful.

### Fixes

* Fixes missing root widget class when `classPrefix` option is set.

## 1.0.1 (2022-08-03)

### Fixes

* Fixes typos in the `emailsConditionsField`, 'emailsConditionsFieldHelp', `emailsConsitionsValue`, and `emailsConditionsValueHtmlHelp` l10n keys.
* Changes the `htmlHelp` key value for the `value` object to maintain consistency in l10n key format.

## 1.0.0 (2022-02-04)

### Fixes

* Sets the dev dependency of Apostrophe to a published version.
* Fixes a typo in the recaptchaValidationError l10n key.
* Fixes an incorrect error localization key usage.

### Adds

* Adds full support for file field widgets, including a new dedicated upload route.

## 1.0.0-beta.1 (2021-11-15)

### Changes

* Changes to reCAPTCHA v3 for form user verification. The browser events are removed since the reCAPTCHA retrieves its token automatically.
* Removes the dropdown style for checkbox fields.

## 1.0.0-beta (2021-10-14)

* Initial release for Apostrophe 3.
