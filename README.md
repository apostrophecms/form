[![CircleCI](https://circleci.com/gh/apostrophecms/form/tree/main.svg?style=svg)](https://circleci.com/gh/apostrophecms/form/tree/main)
[![Chat on Discord](https://img.shields.io/discord/517772094482677790.svg)](https://chat.apostrophecms.org)

# Form Builder for Apostrophe 3

Allow ApostropheCMS editors to build their own forms. They can then place any form in one or more content areas across the website.

<!-- ## Roadmap
|Feature |Status  |
--- | ---
|SEO Meta fields for pages and pieces| ✅ Implemented
|SEO Page Scanner| 🚧 Under development -->

## Installation

```bash
npm install @apostrophecms/form
```

## Use

### Initialization
Configure `@apostrophecms/form` and the form widgets in `app.js`. `@apostrophecms/form` must appear before the other modules. All the field widget modules below are included in this forms module bundle.

```javascript
require('apostrophe')({
  shortName: 'my-project',
  modules: {
    // The main form module
    '@apostrophecms/form': {},
    // The form widget module, allowing editors to add forms to content areas
    '@apostrophecms/form-widget': {},
    // Form field widgets, used by the main form module to build forms.
    '@apostrophecms/form-text-field-widget': {},
    '@apostrophecms/form-textarea-field-widget': {},
    '@apostrophecms/form-file-field-widget': {},
    '@apostrophecms/form-select-field-widget': {},
    '@apostrophecms/form-radio-field-widget': {},
    '@apostrophecms/form-checkboxes-field-widget': {},
    '@apostrophecms/form-boolean-field-widget': {},
    '@apostrophecms/form-conditional-widget': {}
  }
});
```

<!--
TODO: Is there a new way to do this? To explore.
'apostrophe-permissions': {
  construct: function(self, options) {
    // Required if you want file fields to work on public pages.
    self.addPublic([ 'edit-attachment' ]);
  } -->

**Why do we include all these modules?**
- The first module added, `@apostrophecms/form`, is the piece type module for forms and includes most other related functionality.
- The second, `@apostrophecms/form-widget` is the widget used to add forms to content areas.
- The other widget modules are different types of form fields. We only have to include the field types we want to make available to editors.

**Note:** If you will be using the option to send email notifications you will need to configure the `@apostrophecms/email` module as well. See the [email notifications section](#email).

### Module configuration

There are a few options available for the Apostrophe form module.

|  Property | Type | Description |
|---|---|---|
| `formWidgets` | Object | A widget configuration object for form widgets to use. |
| `saveSubmissions` | Boolean | Set to `false` to prevent Apostrophe from saving submissions in the `aposFormSubmissions` database collection. See [submission information below](#handling-submissions). |
| `emailSubmissions` | Boolean | Set to `false` to disable the email notification fields on forms. See [email information below](#email). |
| `recaptchaSecret` | String | The "secret key" from a configured reCAPTCHA site. See [reCAPTCHA information below](#using-recaptcha-for-user-validation). |
| `recaptchaSite` | String | The "site key" for a configured reCAPTCHA site. See [reCAPTCHA information below](#using-recaptcha-for-user-validation). |
| `classPrefix` | String | A namespacing string used to build CSS classes on form elements for [custom styling](#styling). |

#### `formWidgets` option

The `formWidgets` option allows us to change the widgets allowed in a form. It is configured exactly the same as any area's widget configuration. Most of these will likely be the form field widgets. The default configuration is:

```javascript
{
  '@apostrophecms/form-text-field': {},
  '@apostrophecms/form-textarea-field': {},
  '@apostrophecms/form-file-field': {},
  '@apostrophecms/form-boolean-field': {},
  '@apostrophecms/form-select-field': {},
  '@apostrophecms/form-radio-field': {},
  '@apostrophecms/form-checkboxes-field': {},
  '@apostrophecms/form-conditional': {},
  '@apostrophecms/rich-text': {
    toolbar: [
      'styles', 'bold', 'italic', 'link',
      'orderedList', 'bulletList'
    ]
  }
}
```

This includes the rich text widget so editors can add directions or notes in the form. Any widget type can be included. A very simple form widget configuration might look like this:

```javascript
// modules/@apostrophecms/form/index.js
module.exports = {
  options: {
    formWidgets: {
      '@apostrophecms/form-text-field': {},
      '@apostrophecms/form-textarea-field': {},
      '@apostrophecms/form-boolean-field': {},
      '@apostrophecms/form-radio-field': {},
      '@apostrophecms/form-checkboxes-field': {}
    }
  }
};
```

### Adding forms to pages and pieces

Forms are added to pages and pieces using a widget, `@apostrophecms/form-widget`. Add this to [an area](https://v3.docs.apostrophecms.org/guide/areas-and-widgets.html) in a page or piece type field schema to let editors add a form there. It will often be best to have an area field dedicated to the form widget.

```javascript
// modules/contact-page/index.js
module.exports = {
  options: {
    label: 'Contact page'
  },
  fields: {
    add: {
      contactForm: {
        type: 'area',
        options: {
          max: 1,
          widgets: {
            '@apostrophecms/form': {}
          }
        }
      }
    }
  }
}
```

## Handling submissions

By default, **submissions are saved to a new MongoDB collection**, `aposFormSubmissions`. If you do not want submissions saved to this collection, add the `saveSubmissions: false` option to the `@apostrophecms/form` module.

```javascript
// modules/@apostrophecms/form/index.js
module.exports = {
  options: {
    saveSubmissions: false
  }
}
```

**Form submission triggers a `'submission'` [server-side event](https://v3.docs.apostrophecms.org/guide/server-events.html)** that you can listen for and handle in the `@apostrophecms/form` module or another module. Event handler functions are passed the following arguments:

| Argument | Description |
| ------- | ------- |
| `req` | The request object from the submission |
| `form` | The form object |
| `output` | The user submission |

The module also emits browser events on the `body` element on submission (`@apostrophecms/form:submission-form`) and submission failure (`@apostrophecms/form:submission-failed`). The browser events will include the following properties:

| Argument | Description |
| ------- | ------- |
| `form` | The form object |
| `formError` | The error object in case of a thrown error (`null` when successful) |


If reCAPTCHA is enabled (see [Using reCAPTCHA for user validation](#Using-reCAPTCHA-for-user-validation)), it emits an **event on submission with an unchecked reCAPTCHA** (`@apostrophecms/form:submissions-missing-recaptcha`). This event is also attached to the document `body` element. Its arguments are:

| Argument | Description |
| ------- | ------- |
| `form` | The form object |
| `recaptchaSlot` | The reCAPTCHA slot element, with identifying data attributes |

### Email

If `@apostrophecms/email` is configured, submissions can be sent to multiple email addresses as well. In the "After-Submission" tab, enter a comma-separated list of email addresses to the "Email Address(es) for Results" field. If not using this feature, set the `emailSubmissions: false` on the `@apostrophecms/form` module to hide the related field on forms.
<!--
  TODO: We don't have an email guide yet.
  // See the email tutorial for required configuration.
  // https://docs.apostrophecms.org/apostrophe/tutorials/howtos/email -->

## Styling

<!-- ### Disabling the starter styles

Starter styles for user-facing forms are included in a forms.less file. These offer some spacing as well as styling for error states. If you do not want to use these, pass the `disableBaseStyles: true` option to `@apostrophecms/form-widget`. This file can also be used to identify the error state classes that you should style in your project.

```javascript
'@apostrophecms/form-widget': {
  disableBaseStyles: true
},
``` -->

### Custom class prefix

Need more control over your styling? You can include your own class prefix that will be in included on most of the labels, inputs, and message/error elements within the forms. The class that is created uses the [BEM](http://getbem.com/naming/) convention. You add the prefix you want in the `@apostrophecms/form` configuration.

```javascript
'@apostrophecms/form': {
  options: {
    classPrefix: 'my-form'
  }
}
```
This results in a class like `my-form__input` being added to input elements in the form, for example.

## Using reCAPTCHA for user validation

Google's reCAPTCHA is built in as an option. You will first need to [set up a reCAPTCHA site up on their website](https://www.google.com/recaptcha/) using the *version two option*. Make sure your domains are configured (using "localhost" for local development) and make note of the **site key** and **secret key**. Those should be added as options to `@apostrophecms/form`:

```javascript
// modules/@apostrophecms/form/index.js
module.exports = {
  options: {
    recaptchaSecret: 'YOUR SECRET KEY',
    recaptchaSite: 'YOUR SITE KEY'
  }
}
```

<!-- To make these options configurable by end-users, you can use `apostrophe-override-options` to make global fields set these for you. This would look something like:

```javascript
// in app.js
modules: {
  'apostrophe-override-options': {},
```

```javascript
// in lib/modules/@apostrophecms/global/index.js
module.exports = {
  addFields: [
    {
      name: 'recaptchaSecret',
      label: 'reCAPTCHA Secret',
      type: 'string'
    },
    {
      name: 'recaptchaSite',
      label: 'reCAPTCHA Site',
      type: 'string'
    }
  ],
  overrideOptions: {
    editable: {
      'apos.@apostrophecms/form.recaptchaSite': 'recaptchaSite',
      'apos.@apostrophecms/form.recaptchaSecret': 'recaptchaSecret'
    }
  }
};
```
-->

The reCAPTCHA field will then be present on all forms.

## Custom field validation

Before field values are collected and submitted to the server, field validators can run to check user input. There are none by default, but you can add them by pushing validator functions to `apos.aposForms.validators`, an *array*. Validator functions may be asynchronous functions.

The validator function can review fields however you need, but the error structure needs to include:

- *Either* a `field` property, set to a field's `name` attribute, *or* `global: true`, indicating it is an error that applies to the form as a whole.
- An `errorMessage` property, explaining the error to end users.

For example, if adding a custom field type, you could add the validator from within the widget player.

```javascript
export default () => {
  apos.util.widgetPlayers['long-textarea-field'] = {
    selector: '[data-long-textarea]',
    player: function (el) {
      const formsWidget = apos.util.closest(el, '[data-apos-forms-form]');
      if (!formsWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }

      // 👇 Adding our validator.
      addValidator(el.querySelector('textarea'));

      // Mechanism to collect input value for submission.
      formsWidget.addEventListener('apos-forms-collect', function(event) {
        const input = el.querySelector('textarea');
        event.input[input.getAttribute('name')] = input.value;
      });
    }
  };
};

function addValidator (input) {
  // 👇 The validator function.
  function lengthValidator (form, errors) {
    if (input.value && input.value.split(' ').length < 10) {
      errors.push({
        field: input.getAttribute('name'),
        error: 'invalid',
        errorMessage: 'Write at least 10 words.'
      });
    }
  }

  apos.aposForms.validators.push(lengthValidator);
}
```

The validator could also be added in other client-side JavaScript. In most cases it would be important to apply the validator based on the field type.
