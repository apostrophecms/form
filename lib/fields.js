module.exports = {
  initial(options) {
    return {
      title: {
        label: 'Form name',
        type: 'string',
        sortify: true,
        required: true
      },
      contents: {
        label: 'Form contents',
        type: 'area',
        options: {
          // TODO: Add other widgets back in.
          widgets: options.formWidgets || {
            // '@apostrophecms/form-text-field': {},
            // '@apostrophecms/form-textarea-field': {},
            // '@apostrophecms/form-file-field': {},
            '@apostrophecms/form-boolean-field': {},
            // '@apostrophecms/form-select-field': {},
            // '@apostrophecms/form-radio-field': {},
            '@apostrophecms/form-checkboxes-field': {},
            // '@apostrophecms/form-conditional': {},
            '@apostrophecms/rich-text': {
              toolbar: [
                'styles', 'bold', 'italic', 'link',
                'orderedList', 'bulletList'
              ]
            }
          }
        }
      },
      submitLabel: {
        label: 'Submit button label',
        type: 'string'
      },
      thankYouHeading: {
        label: 'Thank you message title',
        type: 'string'
      },
      thankYouBody: {
        label: 'Thank you message content',
        type: 'area',
        options: {
          widgets: options.thankYouWidgets || {
            '@apostrophecms/rich-text': {
              toolbar: [
                'Styles', 'Bold', 'Italic', 'Link', 'Anchor', 'Unlink',
                'NumberedList', 'BulletedList'
              ]
            }
          }
        }
      },
      sendConfirmationEmail: {
        label: 'Send a confirmation email',
        // NOTE: The confirmation email is in `views/emailConfirmation.html`.
        // Edit the message there, adding any dynamic content as needed.
        help: 'Enable this to send a message to the person who submits this form.',
        type: 'boolean'
      },
      emailConfirmationField: {
        label: 'Which is your confirmation email field?',
        help: 'Enter the "name" value of the field where people with enter their email address.',
        type: 'string',
        required: true,
        if: {
          sendConfirmationEmail: true
        }
      },
      enableQueryParams: {
        label: 'Enable query parameter capture',
        type: 'boolean',
        htmlHelp: 'If enabled, <em>all</em> query parameters (the key/value pairs in a <a href="https://en.wikipedia.org/wiki/Query_string" target="_blank">query string</a>) will be collected when the form is submitted. You may also set list of specific parameter keys that you wish to collect.'
      },
      queryParamList: {
        label: 'Query parameter keys',
        type: 'array',
        titleField: 'key',
        required: true,
        help: 'Create an array item for each query parameter value you wish to capture.',
        fields: {
          add: {
            key: {
              type: 'string',
              label: 'Key',
              required: true
            },
            lengthLimit: {
              type: 'integer',
              label: 'Limit Saved Parameter Value Length (characters)',
              help: 'Enter a whole number to limit the length of the value saved.',
              min: 1
            }
          }
        },
        if: {
          enableQueryParams: true
        }
      }
    };
  },
  email: {
    emails: {
      label: 'Email Address(es) for Results',
      type: 'array',
      titleField: 'email',
      fields: {
        add: {
          email: {
            type: 'email',
            required: true,
            label: 'Email Address for Results'
          },
          conditions: {
            label: 'Set Conditions for this Notification',
            help: 'For example, if you only notify this email address if the "country" field is set to "Austria". All conditions must be met. Add the email again with another conditional set if needed."',
            type: 'array',
            titleField: 'value',
            fields: {
              add: {
                field: {
                  label: 'Enter a field to use as your condition.',
                  type: 'string',
                  help: 'Only select (drop-down) and checkbox fields can be used for this condition.'
                },
                value: {
                  type: 'string',
                  label: 'Enter the value an end-user will enter to meet this conditional.',
                  htmlHelp: 'Use comma-separated values to check multiple values on this field (an OR relationship). Values that actually contain commas should be entered in double-quotation marks (e.g., <code>Proud Mary, The Best, "River Deep, Mountain High"</code>).',
                  // TODO: work out dynamic choices
                  choices: 'getConditionChoices'
                }
              }
            }
          }
        }
      }
    },
    email: {
      label: 'Primary internal email address',
      type: 'string',
      required: true,
      help: 'You may enter one from the previous list. This is the address that will be used as the "from" address on any generated email messages.'
    }
  }
}
;
