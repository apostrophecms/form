export default () => {
  apos.aposForm.collectors['@apostrophecms/form-text-field'] = {
    selector: '[data-apos-forms-text]',
    collector (el) {
      const input = el.querySelector('input');

      return {
        field: input.getAttribute('name'),
        value: input.value
      };
    }
  };
};
