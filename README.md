[![CircleCI](https://circleci.com/gh/apostrophecms/form/tree/main.svg?style=svg)](https://circleci.com/gh/apostrophecms/form/tree/main)
[![Chat on Discord](https://img.shields.io/discord/517772094482677790.svg)](https://chat.apostrophecms.org)

# Form Builder for Apostrophe 3

Allow ApostropheCMS editors to build their own forms. They can then place any form in one or more content areas across the website.

## Installation

```bash
npm install @apostrophecms/form
```

## Use

### Initialization

Configure `@apostrophecms/form` and the form widgets in `app.js`. `@apostrophecms/form` must appear before the form widget and form field widget modules. All the field widget modules below are included in this forms module bundle.

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
    '@apostrophecms/form-select-field-widget': {},
    '@apostrophecms/form-radio-field-widget': {},
    '@apostrophecms/form-file-field-widget': {},
    '@apostrophecms/form-checkboxes-field-widget': {},
    '@apostrophecms/form-boolean-field-widget': {},
    '@apostrophecms/form-conditional-widget': {}
  }
});
```

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
| `recaptchaSecret` | String | The "secret key" from a configured reCAPTCHA site. See [reCAPTCHA details below](#using-recaptcha-for-user-validation). |
| `recaptchaSite` | String | The "site key" for a configured reCAPTCHA site. See [reCAPTCHA details below](#using-recaptcha-for-user-validation). |
| `classPrefix` | String | A namespacing string used to build CSS classes on form elements for [custom styling](#styling). |

#### `formWidgets` option

The `formWidgets` option allows us to change the widgets allowed in a form. It is configured exactly the same as any area's widget configuration. Most of these will likely be the form field widgets. The default configuration is:

```javascript
{
  '@apostrophecms/form-text-field': {},
  '@apostrophecms/form-textarea-field': {},
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

This includes the rich text widget so editors can add directions or notes in the form. The file field widget is *not included* by default since site owners should carefully consider the implications of potentially public upload access. See [the following section on file field support](#supporting-file-field-uploads-safely).

Any widget type can be included. A very simple form widget configuration might look like this:

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


### Supporting file field uploads safely

The file field widget, `@apostrophecms/form-file-field-widget`, uses a route on the form widget that allows anonymous site visitor to include files (e.g., PDFs, images) in form submissions. Those uploads are stored in the same uploads directory as all other Apostrophe uploads, such as media library images, and they each get a document in the `aposAttachments` database collection. The file access URL is included in the form submission data along with other submission data.

**⚠️ Public access allows *anyone* to upload files to your media storage.** It is then recommended that any public form using a file field should also use the reCAPTCHA validation option or other means to prevent spam submissions.

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

Google's reCAPTCHA is built in as an optional feature. You will first need to [set up a reCAPTCHA site up on their website](https://www.google.com/recaptcha/) using the *version three option*. Make sure your domains are configured (using `localhost` for local development).

Copy the **site key** and **secret key**. You will need to enter them in the site's global settings when logged in. Each form will have a checkbox to enable reCAPTCHA for that form.

You have two options for configuring reCAPTCHA:
1. Configure the secret key *and* site key as [hard-coded options](#module-configuration).
2. Allow site admins and editors to configure those values as global settings in the UI.

If you do not configure *both* the secret key *and* the site key in code, the global settings for the site will have fields for admins and editors to configure this themselves. This will be the case if you only configure one of the two in code. If you configure *both* in code, that global setting UI will not be available and the module will use the hard-coded values even if the global settings document has values for them already.

Once these values are configured, each form will have the option to enable reCAPTCHA independently.

### In-code configuration example:
```javascript
// modules/@apostrophecms/form/index.js
module.exports = {
  options: {
    recaptchaSecret: 'YOUR SECRET KEY',
    recaptchaSite: 'YOUR SITE KEY'
  }
}
```

## Custom field validation

Each field returns its value from a collector function located on the `apos.aposForm.collectors` array in the browser. You can extend these collector functions to adjust the value or do additional validation before the form posts to the server. You can write them as asynchronous functions if needed.

Collector functions take the widget element as an argument and return a response object on a successful submission. The response object properties are:

| Property | Description |
| ------- | ------- |
| `field` | The field element's `name` attribute (identical to the field widget's `name` property) |
| `value` | The field value |

These functions can be extended for project-level validation using the super pattern. This involves:

1. Assigning the original function to a variable.
2. Creating a new function that uses the original one, adds functionality, and returns an identically structured response.
3. Assigning the new function to the original function property.

An example for the text area field in project code might look like this:

```javascript
// modules/@apostrophecms/form-textarea-field-widget/ui/src/index.js

export default () => {
  const TEXTAREA_WIDGET = '@apostrophecms/form-textarea-field';

  // 1️⃣ Store the original collector function on `superCollector`.
  const superCollector = apos.aposForm.collectors[TEXTAREA_WIDGET].collector;

  // 2️⃣ Create a new collector function that accepts the same widget element
  // parameter.
  function newCollector (el) {
    // Get the response from the original collector.
    const response = superCollector(el);

    if (response.value && response.value.split(' ').length < 10) {
      // Throwing an object if there are fewer than ten words.
      throw {
        field: response.field,
        message: 'Write at least 10 words'
      };
    } else {
      // Returning the original response if everything is okay.
      return response;
    }
  }

  // 3️⃣ Assign our new collector to the original property.
  apos.aposForm.collectors[TEXTAREA_WIDGET].collector = newCollector;
};
```

If you want to indicate an error on the field, `throw` and object with the following values (as shown above):

| Property | Description |
| ------- | ------- |
| `field` | The field element's `name` attribute (identical to the field widget's `name` property) |
| `message` | A string to display on the field as an error message |
