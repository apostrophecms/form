const WIDGET_NAME = '@apostrophecms/form-stepper';
const WIDGET_SELECTOR = '[data-apos-form-stepper]';
const STEP_SELECTOR = '.apos-form-step';
const NEXT_BUTTON = '.apos-form-step-next';
const PREVIOUS_BUTTON = '.apos-form-step-previous';

export default () => {
  apos.util.widgetPlayers[WIDGET_NAME] = {
    selector: WIDGET_SELECTOR,
    player (el) {
      const formWidget = apos.util.closest(el, '[data-apos-form-form]');
      if (!formWidget) {
        // Editing the form in the piece modal, it is not active for submissions
        return;
      }

      const register = () => {
        const activeStep = el.querySelector(`${STEP_SELECTOR}.active`);
        const nextButton = activeStep.querySelector(NEXT_BUTTON);
        const previousButton = activeStep.querySelector(PREVIOUS_BUTTON);
        nextButton.addEventListener('click', nextStep);
        previousButton.addEventListener('click', previousStep);

        return activeStep;
      };
      const unregister = () => {
        const activeStep = el.querySelector(`${STEP_SELECTOR}.active`);
        const nextButton = activeStep.querySelector(NEXT_BUTTON);
        const previousButton = activeStep.querySelector(PREVIOUS_BUTTON);
        nextButton.removeEventListener('click', nextStep);
        previousButton.removeEventListener('click', previousStep);

        return activeStep;
      };

      const nextStep = () => {
        const activeStep = unregister();
        const { index } = activeStep.dataset;
        activeStep.classList.remove('active');
        activeStep.nextElementSibling?.querySelector(`[data-index=${index + 1}]`).classList.add('active');
        register();
      };
      const previousStep = () => {
        const activeStep = unregister();
        const { index } = activeStep.dataset;
        activeStep.classList.remove('active');
        activeStep.previousElementSibling?.querySelector(`[data-index=${index - 1}]`).classList.add('active');
        register();
      };

      register();
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
