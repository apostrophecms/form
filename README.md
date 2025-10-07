<div align="center">
  <img src="https://raw.githubusercontent.com/apostrophecms/apostrophe/main/logo.svg" alt="ApostropheCMS logo" width="80" height="80">

  <h1>Form Builder for ApostropheCMS</h1>
  <p>
    <a aria-label="Apostrophe logo" href="https://docs.apostrophecms.org">
      <img src="https://img.shields.io/badge/MADE%20FOR%20ApostropheCMS-000000.svg?style=for-the-badge&logo=Apostrophe&labelColor=6516dd">
    </a>
    <a aria-label="Join the community on Discord" href="http://chat.apostrophecms.org">
      <img alt="" src="https://img.shields.io/discord/517772094482677790?color=5865f2&label=Join%20the%20Discord&logo=discord&logoColor=fff&labelColor=000&style=for-the-badge&logoWidth=20">
    </a>
    <a aria-label="License" href="https://github.com/apostrophecms/form/blob/main/LICENSE.md">
      <img alt="" src="https://img.shields.io/static/v1?style=for-the-badge&labelColor=000000&label=License&message=MIT&color=3DA639">
    </a>
  </p>
</div>

**Let content teams build and manage forms without developer intervention.** Editors can create contact forms, surveys, applications, and registrations directly in the CMS, then place them anywhere on your site. Forms automatically handle submissions, email notifications, validation, and spam protection.

## Why Form Builder?

- **🎯 No-Code Form Creation**: Editors build forms with drag-and-drop fields—no tickets to developers
- **📊 Automatic Data Collection**: Submissions saved to MongoDB with optional email notifications
- **🛡️ Built-in Security**: reCAPTCHA v3 integration and validation prevent spam
- **🎨 Design Freedom**: Custom CSS classes and styling hooks for brand consistency
- **⚡ Developer-Friendly**: Event hooks, custom validators, and extensible field types
- **📧 Email Ready**: Route submissions to multiple recipients automatically

## Installation

```bash
npm install @apostrophecms/form
```

## Usage

### Module Configuration

Configure the form modules in your `app.js` file:

```javascript
import apostrophe from 'apostrophe';

apostrophe({
  root: import.meta,
  shortName: 'my-project',
  modules: {
    // Main form module (must come first)
    '@apostrophecms/form': {},
    // Form widget for adding forms to areas
    '@apostrophecms/form-widget': {},
    // Field widgets (include only the types you need)
    '@apostrophecms/form-text-field-widget': {},
    '@apostrophecms/form-textarea-field-widget': {},
    '@apostrophecms/form-select-field-widget': {},
    '@apostrophecms/form-radio-field-widget': {},
    '@apostrophecms/form-file-field-widget': {},
    '@apostrophecms/form-checkboxes-field-widget': {},
    '@apostrophecms/form-boolean-field-widget': {},
    '@apostrophecms/form-conditional-widget': {},
    '@apostrophecms/form-divider-widget': {},
    '@apostrophecms/form-group-widget': {}
  }
});
```

**Module order matters:** `@apostrophecms/form` must appear before the widget modules. Include only the field types you want editors to use.

### How It Works

The `@apostrophecms/form` module creates a new **piece-type** called "Forms" in your CMS. This means forms are content that editors create once and can reuse across multiple pages—just like blog posts or products. Create a "Contact Form" once, then place it on your contact page, footer, and sidebar using the form widget.

### Adding Form Widget to Areas

To let editors add forms to a page or piece-type, include the form widget in an area:

```javascript
// modules/contact-page/index.js
export default {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Contact Page'
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
    },
    group: {
      basics: {
        fields: ['contactForm']
      }
    }
  }
};
```

### Editor Workflow

Once configured, editors can create and manage forms:

1. **Create a form**: Click "Forms" in the admin bar and create a new form (e.g., "Contact Form")
2. **Build the form**: Add field widgets (text fields, email, checkboxes, etc.) and configure options
3. **Configure submission handling**: Set up email notifications and confirmation messages in the "After-Submission" tab
4. **Place the form**: Edit any page with a form area, add the form widget, and select your created form

That's it. Editors can now create and manage forms independently without developer intervention.

> **📧 Email Configuration**: To send form submissions via email, you must first configure the `@apostrophecms/email` module. See the [email configuration guide](https://docs.apostrophecms.org/guide/sending-email.html) for setup instructions. Forms can still save submissions to the database without email configuration.

## Configuration

### Main Module Options

Configure `@apostrophecms/form` with these options:

| Property | Type | Description |
|---|---|---|
| `disableOptionalLabel` | Boolean | Removes "(Optional)" text from optional fields. Default: `false` |
| `formWidgets` | Object | Widget configuration for allowed field types in forms |
| `saveSubmissions` | Boolean | Set to `false` to prevent saving submissions to MongoDB. Default: `true` |
| `emailSubmissions` | Boolean | Set to `false` to hide email notification fields. Default: `true` |
| `recaptchaSecret` | String | Secret key from reCAPTCHA site configuration |
| `recaptchaSite` | String | Site key for reCAPTCHA integration |
| `classPrefix` | String | Namespace for CSS classes on form elements |

### Available Field Types

The `formWidgets` option controls which widgets editors can use when building forms. Configure this in your project-level `/modules/@apostrophecms/form/index.js` file to override the built-in defaults. This is a **global setting** that applies to all forms in your project.

Default configuration:

```javascript
// modules/@apostrophecms/form/index.js
export default {
  options: {
    formWidgets: {
      '@apostrophecms/form-text-field': {},
      '@apostrophecms/form-textarea-field': {},
      '@apostrophecms/form-boolean-field': {},
      '@apostrophecms/form-select-field': {},
      '@apostrophecms/form-radio-field': {},
      '@apostrophecms/form-checkboxes-field': {},
      '@apostrophecms/form-conditional': {},
      '@apostrophecms/form-divider': {},
      '@apostrophecms/rich-text': {
        toolbar: [
          'styles', 'bold', 'italic', 'link',
          'orderedList', 'bulletList'
        ]
      }
    }
  }
};
```

The rich text widget allows editors to add instructions within forms. Any widget type can be included in this configuration.

> **Need different field types for different forms?** The `formWidgets` option is global and cannot be set per-area or per-page. If you need separate sets of allowed fields (for example, a simple contact form vs. a detailed application form), extend the `@apostrophecms/form` module to create a second form piece-type with its own `formWidgets` configuration. **However**, without additional controls, all editors can use both form types. Use `@apostrophecms-pro/advanced-permission` to restrict which user groups can create and manage each form type—ensuring junior editors only access basic forms while senior staff can use advanced forms. [Learn more about Pro features](#-ready-for-more).

### Field-Specific Options

#### Select Field

The select field widget supports multiple selection:

```javascript
// modules/@apostrophecms/form-select-field-widget/index.js
export default {
  options: {
    allowMultiple: true  // Default: false
  }
};
```

When enabled, two additional fields appear in the widget schema:

| Property | Type | Description |
|---|---|---|
| `allowMultiple` | Boolean | Enable multiple selections. Default: `false` |
| `size` | Integer | Number of visible options. Default: `0` |

#### File Upload Field

⚠️ **Critical Security Warning**: The file field widget allows **any anonymous user or bot** to upload files directly to your server. Files are stored in your media uploads directory and get documents in the `aposAttachments` collection. This creates potential risks for storage abuse, malicious file uploads, and spam.

**Not included by default**: The `@apostrophecms/form-file-field-widget` module is intentionally excluded from the default `formWidgets` configuration. You must explicitly add it to enable file uploads.

**Required safeguards:**
- **Always use reCAPTCHA** when enabling file uploads on public forms
- Implement additional rate limiting or spam prevention
- Monitor storage usage and file types regularly
- Consider the legal and compliance implications of accepting user files

**Multiple file uploads**: Like the select field, the file field widget also supports an `allowMultiple` option:

```javascript
// modules/@apostrophecms/form-file-field-widget/index.js
export default {
  options: {
    allowMultiple: true  // Default: false
  }
};
```

When enabled, users can select and upload multiple files in a single form submission.

## Handling Submissions

### Database Storage

Submissions are automatically saved to the `aposFormSubmissions` MongoDB collection. To disable database storage:

```javascript
// modules/@apostrophecms/form/index.js
export default {
  options: {
    saveSubmissions: false
  }
};
```

### Server-Side Events

Form submissions trigger events you can handle in your code:

**`submission` event** - Fires on every form submission:

```javascript
// modules/@apostrophecms/form/index.js
export default {
  handlers(self) {
    return {
      'submission': {
        async handleSubmission(req, form, submission) {
          // Your custom logic here
          console.log('Form submitted:', form.title);
          console.log('Data:', submission);
        }
      }
    };
  }
};
```

**`beforeSaveSubmission` event** - Fires before saving to database (if enabled):

```javascript
// modules/@apostrophecms/form/index.js
export default {
  handlers(self) {
    return {
      'beforeSaveSubmission': {
        async modifySubmission(req, info) {
          // Modify info.submission before it's saved
          info.submission.processedAt = new Date();
        }
      }
    };
  }
};
```

Event handler arguments:

| Event | Arguments | Description |
|---|---|---|
| `submission` | `req`, `form`, `submission` | Request object, form document, submission data |
| `beforeSaveSubmission` | `req`, `info` | Request object, object with `form`, `data`, and `submission` properties |

### Browser Events

The module emits browser events on the `body` element:

- `@apostrophecms/form:submission-form` - Successful submission
- `@apostrophecms/form:submission-failed` - Submission error

Both events include `form` and `formError` properties.

### Email Notifications

If `@apostrophecms/email` is configured, forms can automatically email submissions to multiple recipients. In the form editor, navigate to the "After-Submission" tab and enter comma-separated email addresses in the "Email Address(es) for Results" field.

To hide email notification fields:

```javascript
// modules/@apostrophecms/form/index.js
export default {
  options: {
    emailSubmissions: false
  }
};
```

## reCAPTCHA Integration

Protect forms from spam with Google reCAPTCHA v3. Set up reCAPTCHA at [google.com/recaptcha](https://www.google.com/recaptcha/) using version 3, then configure your site and secret keys.

### Configuration Options

**Option 1: Hard-code in module configuration**

```javascript
// modules/@apostrophecms/form/index.js
export default {
  options: {
    recaptchaSecret: 'YOUR_SECRET_KEY',
    recaptchaSite: 'YOUR_SITE_KEY'
  }
};
```

**Option 2: Allow editors to configure in UI**

If you don't hard-code both keys, a global settings UI appears where admins can enter them. Once configured, each form has a checkbox to enable reCAPTCHA independently.

## Styling

### Custom CSS Classes

Add your own class prefix to form elements for complete styling control:

```javascript
// modules/@apostrophecms/form/index.js
export default {
  options: {
    classPrefix: 'my-form'
  }
};
```

This generates BEM-style classes like `my-form__input`, `my-form__label`, and `my-form__error` on form elements.

### Visual Form Styling with Palette

For teams who prefer visual design tools over writing CSS, **ApostropheCMS Pro** includes the Palette extension. Palette allows editors and designers to customize form styling directly in the browser using an intuitive visual interface—no code required. Adjust colors, spacing, typography, and more while seeing changes in real-time on actual forms.

Perfect for agencies managing multiple client sites with different brand requirements, or teams without dedicated frontend developers. [Learn more about Pro features](#-ready-for-more).

## Custom Field Validation

Each field returns its value from a collector function located on the `apos.aposForm.collectors` array in the browser. You can extend these collector functions to adjust the value or do additional validation before the form posts to the server. Collector functions can be written as asynchronous functions if needed.

Collector functions take the widget element as an argument and return a response object on a successful submission. The response object properties are:

| Property | Description |
|---|---|
| `field` | The field element's `name` attribute (identical to the field widget's `name` property) |
| `value` | The field value |

### Extending Collectors with the Super Pattern

These functions can be extended for project-level validation using the super pattern. This involves:

1. Assigning the original function to a variable
2. Creating a new function that uses the original one, adds functionality, and returns an identically structured response
3. Assigning the new function to the original function property

### Example: Minimum Word Count Validation

```javascript
// modules/@apostrophecms/form-textarea-field-widget/ui/src/index.js

export default () => {
  const TEXTAREA_WIDGET = '@apostrophecms/form-textarea-field';

  // 1️⃣ Store the original collector function on `superCollector`.
  const superCollector = apos.aposForm.collectors[TEXTAREA_WIDGET].collector;

  // 2️⃣ Create a new collector function that accepts the same widget element
  // parameter.
  function newCollector(el) {
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

### Error Handling

If you want to indicate an error on the field, `throw` an object with the following values (as shown above):

| Property | Description |
|---|---|
| `field` | The field element's `name` attribute (identical to the field widget's `name` property) |
| `message` | A string to display on the field as an error message |

## Use Cases

**Contact Forms**: Let teams create department-specific contact forms without developer involvement.

**Lead Generation**: Build conversion-optimized forms with conditional fields and reCAPTCHA protection.

**Event Registration**: Collect attendee information with file uploads for documents or photos.

**User Feedback**: Create surveys and feedback forms that route to appropriate team members.

**Job Applications**: Accept resumes and application materials with validation and email routing.

## 💎 Ready for More?

The open-source form builder provides powerful form creation capabilities, but enterprise teams often need advanced control and workflow features. **ApostropheCMS Pro** extends form functionality with professional-grade features:

### 🚀 **Pro Features for Forms**

- **🔐 Advanced Permissions** - Control which teams can create, edit, and manage specific form types. Restrict access to sensitive forms like HR applications or customer data collection. Perfect for multi-team organizations that need different form capabilities for different departments.

- **🌍 Automated Translation** - Automatically translate forms and confirmation messages into multiple languages with AI-powered translation services (DeepL, Google Translate, Azure). Deploy multilingual forms without manual translation work.

- **📝 Document Management** - Version control for forms with complete audit trails. Track changes to form fields, restore previous versions, and maintain compliance with form modification history.

- **🎨 Visual Design Tools** - Use the Palette extension for in-context CSS customization of form styling without writing code.

**[Contact our team](https://apostrophecms.com/contact-us)** to learn about Pro licensing and access enterprise features that enhance form management, compliance, and team collaboration.

---

<div>
  <p>Made with ❤️ by the <a href="https://apostrophecms.com">ApostropheCMS</a> team. <strong>Found this useful? <a href="https://github.com/apostrophecms/form">Give us a star on GitHub!</a> ⭐</strong></p>
</div>