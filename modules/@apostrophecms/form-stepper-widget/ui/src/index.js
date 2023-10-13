const WIDGET_NAME = '@apostrophecms/form-stepper';
const WIDGET_SELECTOR = '[data-apos-form-stepper]';

export default () => {
  apos.util.widgetPlayers[WIDGET_NAME] = {
    selector: WIDGET_SELECTOR,
    player (element) {
      // debugger;
      const formWidget = apos.util.closest(element, '[data-apos-form-form]');
      // const stepper = form.querySelector('[data-apos-form-stepper]');

      // // data-apos-form-submit {% if recaptchaReady %}disabled{% endif %}
      // apos.util.emit(formWidget, '@apostrophecms/form:stepper', {
      //   stepper
      // });

      // // apos.util.addClass(thankYou, 'apos-form-visible');
      // apos.util.addClass(form, 'apos-form-hidden');
    }
  };
};
