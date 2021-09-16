const assert = require('assert');
const testUtil = require('apostrophe/test-lib/test');
// const axios = require('axios');
// const fileUtils = require('./lib/file-utils');

describe('Forms module', function () {
  let apos;

  this.timeout(25000);

  after(async function () {
    testUtil.destroy(apos);
  });

  // Existence
  const formWidgets = {
    '@apostrophecms/form-widget': {},
    '@apostrophecms/form-text-field-widget': {},
    '@apostrophecms/form-textarea-field-widget': {},
    '@apostrophecms/form-select-field-widget': {},
    '@apostrophecms/form-radio-field-widget': {},
    '@apostrophecms/form-checkboxes-field-widget': {},
    '@apostrophecms/form-file-field-widget': {},
    '@apostrophecms/form-boolean-field-widget': {},
    '@apostrophecms/form-conditional-widget': {}
  };

  let forms;
  let textWidgets;
  let textareaWidgets;
  let selectWidgets;
  let radioWidgets;
  let checkboxesWidgets;
  let fileWidgets;
  let booleanWidgets;
  let conditionalWidgets;

  it('should be a property of the apos object', async function () {
    apos = await testUtil.create({
      testModule: 'apostrophe',
      baseUrl: 'http://localhost:4242',
      modules: {
        '@apostrophecms/express': {
          options: {
            port: 4242,
            csrf: {
              exceptions: [ '/api/v1/@apostrophecms/form/submit' ]
            },
            session: {
              secret: 'test-the-forms'
            },
            apiKeys: {
              skeleton_key: { role: 'admin' }
            }
          }
        },
        '@apostrophecms/form': {},
        ...formWidgets
      }
    });

    const aposForm = '@apostrophecms/form';
    forms = apos.modules[`${aposForm}`];
    const widgets = apos.modules[`${aposForm}-widget`];
    textWidgets = apos.modules[`${aposForm}-text-field-widget`];
    textareaWidgets = apos.modules[`${aposForm}-textarea-field-widget`];
    selectWidgets = apos.modules[`${aposForm}-select-field-widget`];
    radioWidgets = apos.modules[`${aposForm}-radio-field-widget`];
    checkboxesWidgets = apos.modules[`${aposForm}-checkboxes-field-widget`];
    fileWidgets = apos.modules[`${aposForm}-file-field-widget`];
    booleanWidgets = apos.modules[`${aposForm}-boolean-field-widget`];
    conditionalWidgets = apos.modules[`${aposForm}-conditional-widget`];

    assert(forms.__meta.name === `${aposForm}`);
    assert(widgets.__meta.name === `${aposForm}-widget`);
    assert(textWidgets.__meta.name === `${aposForm}-text-field-widget`);
    assert(textareaWidgets.__meta.name === `${aposForm}-textarea-field-widget`);
    assert(selectWidgets.__meta.name === `${aposForm}-select-field-widget`);
    assert(radioWidgets.__meta.name === `${aposForm}-radio-field-widget`);
    assert(checkboxesWidgets.__meta.name === `${aposForm}-checkboxes-field-widget`);
    assert(fileWidgets.__meta.name === `${aposForm}-file-field-widget`);
    assert(booleanWidgets.__meta.name === `${aposForm}-boolean-field-widget`);
    assert(conditionalWidgets.__meta.name === `${aposForm}-conditional-widget`);
  });

  // Submissions collection exists.
  it('should have a default collection for submissions', async function () {
    apos.db.collection('aposFormSubmissions', function (err, collection) {
      assert(!err);
      assert(collection);
    });
  });

  // Create a form
  const form1 = {
    _id: 'form1:en:published',
    archived: false,
    type: '@apostrophecms/form',
    title: 'First test form',
    slug: 'test-form-one',
    contents: {
      _id: 'form1ContentsArea890',
      metaType: 'area',
      items: [
        {
          _id: 'dogNameId',
          fieldLabel: 'Dog name',
          fieldName: 'DogName',
          required: true,
          type: '@apostrophecms/form-text-field'
        },
        {
          _id: 'dogTraitsId',
          fieldLabel: 'Check all that apply',
          fieldName: 'DogTraits',
          required: true,
          type: '@apostrophecms/form-checkboxes-field',
          choices: [
            {
              label: 'Runs fast',
              value: 'Runs fast'
            },
            {
              label: 'It\'s a dog',
              value: 'It\'s a dog'
            },
            {
              label: 'Likes treats',
              value: 'Likes treats'
            }
          ]
        },
        {
          _id: 'dogBreedId',
          fieldLabel: 'Dog breed',
          fieldName: 'DogBreed',
          required: false,
          type: '@apostrophecms/form-radio-field',
          choices: [
            {
              label: 'Irish Wolfhound',
              value: 'Irish Wolfhound'
            },
            {
              label: 'Cesky Terrier',
              value: 'Cesky Terrier'
            },
            {
              label: 'Dachshund',
              value: 'Dachshund'
            },
            {
              label: 'Pumi',
              value: 'Pumi'
            }
          ]
        },
        {
          _id: 'dogPhotoId',
          fieldLabel: 'Photo of your dog',
          fieldName: 'DogPhoto',
          required: false,
          type: '@apostrophecms/form-file-field'
        },
        {
          _id: 'agreeId',
          fieldLabel: 'Opt-in to participate',
          fieldName: 'agree',
          required: true,
          checked: false,
          type: '@apostrophecms/form-boolean-field'
        }
      ]
    },
    enableQueryParams: true,
    queryParamList: [
      {
        id: 'source',
        key: 'source'
      },
      {
        id: 'memberId',
        key: 'member-id',
        lengthLimit: 6
      }
    ]
  };

  let savedForm1;

  it('should create a form', async function () {
    const req = apos.task.getReq();

    await apos.doc.db.insertOne(form1);

    const form = await apos.doc.getManager('@apostrophecms/form').find(req, {}).toObject();

    savedForm1 = form;
    assert(form);
    assert(form.title === 'First test form');
  });

  // TEMP to quiet eslint
  console.log('🤫', !!savedForm1);

  it('should have the same widgets in conditional widget areas', function () {
    const formWidgets = forms.schema.find(field => {
      return field.name === 'contents';
    }).options.widgets;

    // Main form widgets has the conditional widget as an option.
    assert(formWidgets['@apostrophecms/form-conditional']);

    delete formWidgets['@apostrophecms/form-conditional'];

    const condWidgets = conditionalWidgets.schema.find(field => {
      return field.name === 'contents';
    }).options.widgets;

    assert(Object.keys(formWidgets).length === Object.keys(condWidgets).length);

    for (const widget in condWidgets) {
      assert(formWidgets[widget]);
    }
  });

  // Submitting gets 200 response
  const submission1 = {
    DogName: 'Jasper',
    DogTraits: [
      'Runs fast',
      'Likes treats'
    ],
    DogBreed: 'Irish Wolfhound',
    DogToy: 'Frisbee',
    LifeStory: 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.',
    agree: true,
    queryParams: {
      'member-id': '123456789',
      source: 'newspaper',
      malicious: 'evil'
    }
  };

  it('should accept a valid submission', async function () {
    submission1._id = savedForm1._id;

    let response;
    try {
      response = await apos.http.post(
        '/api/v1/@apostrophecms/form/submit?apikey=skeleton_key',
        {
          body: submission1
        }
      );
    } catch (error) {
      assert(!error);
    }

    assert(response.status === 'ok');
  });

  // Submission is stored in the db
  it('can find the form submission in the database', async function () {
    try {
      const doc = await apos.db.collection('aposFormSubmissions').findOne({

      });

      assert(doc.data.DogBreed === 'Irish Wolfhound');
    } catch (err) {
      assert(!err);
    }
  });

  // // Submission captures and limits query parameters
  // it('can find query parameter data saved and limited', function (done) {
  //   apos.db.collection('aposFormSubmissions').findOne({
  //     'data.DogName': 'Jasper'
  //   }, function (err, doc) {
  //     assert(!err);
  //     assert(doc.data['member-id'] === '123456');
  //     assert(doc.data.source === 'newspaper');
  //     assert(doc.data.malicious === undefined);

  //     return done();
  //   });
  // });

  // // Submission is not stored in the db if disabled.
  // let apos2;
  // const form2 = { ...form1 };
  // form2.slug = 'test-form-two';
  // form2._id = 'form2';
  // let savedForm2;
  // const submission2 = { ...submission1 };

  // it('should be a property of the apos2 object', function (done) {
  //   apos2 = require('apostrophe')({
  //     shortName: 'test2',
  //     baseUrl: 'http://localhost:5000',
  //     modules: {
  //       'apostrophe-express': {
  //         port: 5000,
  //         csrf: {
  //           exceptions: [ '/modules/apostrophe-forms/submit' ]
  //         },
  //         session: {
  //           secret: 'test-the-forms-more'
  //         }
  //       },
  //       '@apostrophecms/form': {
  //         saveSubmissions: false
  //       },
  //       ...formWidgets
  //     },
  //     afterInit: function (callback) {
  //       const forms = apos.modules['@apostrophecms/form'];

  //       assert(forms.__meta.name === '@apostrophecms/form');

  //       return callback(null);
  //     },
  //     afterListen: function (err) {
  //       assert(!err);
  //       done();
  //     }
  //   });
  // });

  // it('should not save in the database if disabled', async function () {
  //   const req = apos2.tasks.getReq();

  //   await apos2.docs.db.insert(form2)
  //     .then(function () {
  //       return apos2.docs.getManager('@apostrophecms/form').find(req, {}).toObject();
  //     })
  //     .then(function (form) {
  //       savedForm2 = form;
  //     })
  //     .catch(function (err) {
  //       assert(!err);
  //     });

  //   submission2._id = savedForm2._id;

  //   const response = await axios({
  //     method: 'post',
  //     url: 'http://localhost:5000/modules/apostrophe-forms/submit',
  //     data: submission2
  //   });

  //   assert(response.status === 200);

  //   const doc = await apos2.db.collection('aposFormSubmissions').findOne({
  //     'data.DogName': 'Jasper'
  //   });

  //   assert(!doc);
  // });

  // it('destroys the second instance', function (done) {
  //   testUtil.destroy(apos2, done);
  // });

  // // Get form errors returned from missing required data.
  // const submission3 = {
  //   agree: true
  // };

  // it('should return errors for missing data', async function () {
  //   submission3._id = savedForm1._id;

  //   const response = await axios({
  //     method: 'post',
  //     url: 'http://localhost:4242/modules/apostrophe-forms/submit',
  //     data: submission3
  //   });

  //   assert(response.status === 200);
  //   assert(response.data.status === 'error');
  //   assert(response.data.formErrors.length === 2);
  //   assert(response.data.formErrors[0].error === 'required');
  //   assert(response.data.formErrors[1].error === 'required');
  // });

  // // Test basic reCAPTCHA requirements.
  // let apos3;
  // let savedForm3;
  // const submission4 = { ...submission1 };
  // const form3 = {
  //   ...form1,
  //   emails: [
  //     {
  //       id: 'emailCondOne',
  //       email: 'emailOne@example.net',
  //       conditions: []
  //     },
  //     {
  //       id: 'emailCondTwo',
  //       email: 'emailTwo@example.net',
  //       conditions: [
  //         {
  //           field: 'DogTraits',
  //           value: 'Likes treats, It\'s a dog'
  //         },
  //         {
  //           field: 'DogBreed',
  //           value: 'Cesky Terrier, Pumi'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'emailCondThree',
  //       email: 'emailThree@example.net',
  //       conditions: [
  //         {
  //           field: 'DogTraits',
  //           value: 'Likes treats, "Comma, test"'
  //         }
  //       ]
  //     }
  //   ]
  // };
  // form3.slug = 'test-form-three';
  // form3._id = 'form3';

  // it('should be a property of the apos3 object', function (done) {
  //   apos3 = require('apostrophe')({
  //     shortName: 'test3',
  //     baseUrl: 'http://localhost:6000',
  //     modules: {
  //       'apostrophe-express': {
  //         port: 6000,
  //         csrf: {
  //           exceptions: [ '/modules/apostrophe-forms/submit' ]
  //         },
  //         session: {
  //           secret: 'test-the-forms-again'
  //         }
  //       },
  //       '@apostrophecms/form': {
  //         emailSubmissions: true,
  //         testing: true,
  //         // reCAPTCHA test keys https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha-what-should-i-do
  //         recaptchaSite: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  //         recaptchaSecret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
  //       },
  //       ...formWidgets
  //     },
  //     afterInit: function (callback) {
  //       const forms = apos.modules['@apostrophecms/form'];

  //       assert(forms.__meta.name === '@apostrophecms/form');

  //       return callback(null);
  //     },
  //     afterListen: function (err) {
  //       assert(!err);
  //       done();
  //     }
  //   });
  // });

  // it('should return a form error if missing required reCAPTHCA token', async function () {
  //   const req = apos3.tasks.getReq();

  //   await apos3.docs.db.insert(form3)
  //     .then(function () {
  //       return apos3.docs.getManager('@apostrophecms/form').find(req, {})
  //         .toObject();
  //     })
  //     .then(function (form) {
  //       savedForm3 = form;
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //       assert(!err);
  //     });

  //   submission4._id = savedForm3._id;

  //   const response = await axios({
  //     method: 'post',
  //     url: 'http://localhost:6000/modules/apostrophe-forms/submit',
  //     data: submission4
  //   });

  //   assert(response.status === 200);
  //   assert(response.data.status === 'error');
  //   assert(response.data.formErrors[0].error === 'recaptcha');
  //   assert(response.data.formErrors[0].global === true);
  // });

  // it('should submit successfully with a reCAPTCHA token', async function () {
  //   submission4.recaptcha = 'validRecaptchaToken';

  //   const response = await axios({
  //     method: 'post',
  //     url: 'http://localhost:6000/modules/apostrophe-forms/submit',
  //     data: submission4
  //   });

  //   assert(response.status === 200);
  //   assert(response.data.status === 'ok');
  //   assert(!response.data.formErrors);
  // });

  // const submission5 = {
  //   DogName: 'Jenkins',
  //   DogTraits: [
  //     'Runs fast',
  //     'Comma, test'
  //   ],
  //   DogBreed: 'Irish Wolfhound'
  // };

  // const submission6 = {
  //   DogName: 'Jenkins',
  //   DogTraits: [
  //     'Runs fast',
  //     'Likes treats'
  //   ],
  //   DogBreed: 'Cesky Terrier'
  // };

  // it('should populate email notification lists based on conditions', async function () {
  //   const req = apos3.tasks.getReq();

  //   const emailSetOne = await apos3.modules['@apostrophecms/form'].sendEmailSubmissions(req, savedForm3, submission5);

  //   assert(emailSetOne.length === 2);
  //   assert(emailSetOne.indexOf('emailOne@example.net') > -1);
  //   assert(emailSetOne.indexOf('emailTwo@example.net') === -1);
  //   assert(emailSetOne.indexOf('emailThree@example.net') > -1);

  //   const emailSetTwo = await apos3.modules['@apostrophecms/form'].sendEmailSubmissions(req, savedForm3, submission6);

  //   assert(emailSetTwo.length === 3);
  //   assert(emailSetTwo.indexOf('emailOne@example.net') > -1);
  //   assert(emailSetTwo.indexOf('emailTwo@example.net') > -1);
  //   assert(emailSetTwo.indexOf('emailThree@example.net') > -1);
  // });

  // it('destroys the third instance', function (done) {
  //   testUtil.destroy(apos3, done);
  // });

  // // Individual tests for sanitizeFormField methods on field widgets.
  // it('sanitizes text widget input', function (done) {
  //   const widget = { fieldName: 'textField' };
  //   const output1 = {};
  //   const input1 = { textField: 'A valid string.' };

  //   textWidgets.sanitizeFormField(widget, input1, output1);

  //   assert(output1.textField === 'A valid string.');

  //   const input2 = { textField: 127 };
  //   const output2 = {};

  //   textWidgets.sanitizeFormField(widget, input2, output2);

  //   assert(output2.textField === '127');

  //   const input3 = { textField: null };
  //   const output3 = {};

  //   textWidgets.sanitizeFormField(widget, input3, output3);

  //   assert(output3.textField === '');

  //   done();
  // });

  // it('sanitizes textArea widget input', function (done) {
  //   const widget = { fieldName: 'textAreaField' };
  //   const longText = 'Nullam id dolor id nibh ultricies vehicula ut id elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean lacinia bibendum nulla sed consectetur.';
  //   const input1 = { textAreaField: longText };
  //   const output1 = {};

  //   textareaWidgets.sanitizeFormField(widget, input1, output1);
  //   assert(output1.textAreaField === longText);

  //   const input2 = { textAreaField: [ 127, 0 ] };
  //   const output2 = {};

  //   textareaWidgets.sanitizeFormField(widget, input2, output2);

  //   assert(!output2.textAreaField);

  //   done();
  // });

  // it('sanitizes select widget input', function (done) {
  //   const widget = {
  //     fieldName: 'selectField',
  //     choices: [
  //       { value: 'first' },
  //       { value: 'second' },
  //       { value: 'third' },
  //       { value: 'fourth' }
  //     ]
  //   };
  //   const input1 = { selectField: 'second' };
  //   const output1 = {};

  //   selectWidgets.sanitizeFormField(widget, input1, output1);

  //   assert(output1.selectField === 'second');

  //   const input2 = { selectField: 'ninetieth' };
  //   const output2 = {};

  //   selectWidgets.sanitizeFormField(widget, input2, output2);

  //   assert(!output2.selectField);
  //   done();
  // });

  // it('sanitizes radio widget input', function (done) {
  //   const widget = {
  //     fieldName: 'radioField',
  //     choices: [
  //       { value: 'first' },
  //       { value: 'second' },
  //       { value: 'third' },
  //       { value: 'fourth' }
  //     ]
  //   };
  //   const input1 = { radioField: 'second' };
  //   const output1 = {};

  //   radioWidgets.sanitizeFormField(widget, input1, output1);

  //   assert(output1.radioField === 'second');

  //   const input2 = { radioField: 'ninetieth' };
  //   const output2 = {};

  //   radioWidgets.sanitizeFormField(widget, input2, output2);

  //   assert(!output2.radioField);
  //   done();
  // });

  // it('sanitizes checkbox widget input', function (done) {
  //   const widget = {
  //     fieldName: 'checkboxField',
  //     choices: [
  //       { value: 'first' },
  //       { value: 'second' },
  //       { value: 'third' },
  //       { value: 'fourth' }
  //     ]
  //   };
  //   const input1 = { checkboxField: [ 'second', 'fourth', 'seventeenth' ] };
  //   const output1 = {};

  //   checkboxesWidgets.sanitizeFormField(widget, input1, output1);

  //   assert(output1.checkboxField.length === 2);
  //   assert(output1.checkboxField[0] === 'second');
  //   assert(output1.checkboxField[1] === 'fourth');

  //   done();
  // });

  // let fileId;

  // it('should upload a test file using the attachments api', function (done) {
  //   return fileUtils.insert('upload-test.txt', apos, function (result) {
  //     fileId = result._id;
  //     done();
  //   });
  // });

  // it('sanitizes file widget input', async function () {
  //   const widget = { fieldName: 'fileField' };
  //   const output1 = {};
  //   const input1 = { fileField: [ fileId ] };

  //   await fileWidgets.sanitizeFormField(widget, input1, output1);

  //   assert(output1.fileField[0] === `/uploads/attachments/${fileId}-upload-test.txt`);

  //   const input2 = { fileField: '8675309' };
  //   const output2 = {};

  //   await fileWidgets.sanitizeFormField(widget, input2, output2);

  //   assert(Array.isArray(output2.fileField));
  //   assert(output2.fileField.length === 0);
  // });

  // const uploadTarget = `${__dirname}/public/uploads/`;

  // it('should clear uploads material if any', function (done) {
  //   fileUtils.wipeIt(uploadTarget, apos, done);
  // });

  // it('sanitizes boolean widget input', function (done) {
  //   const widget = { fieldName: 'booleanField' };
  //   const output1 = {};
  //   const input1 = { booleanField: true };

  //   booleanWidgets.sanitizeFormField(widget, input1, output1);

  //   assert(output1.booleanField === true);

  //   const input2 = { booleanField: false };
  //   const output2 = {};

  //   booleanWidgets.sanitizeFormField(widget, input2, output2);

  //   assert(output2.booleanField === false);

  //   done();
  // });
});
