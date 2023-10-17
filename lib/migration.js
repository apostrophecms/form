module.exports = self => {
  return {
    apostropheFormAddHasStepperFieldMigration() {
      self.apos.migration.add('apostrophe-form-add-has-stepper-field', self.apostropheFormCreateHasStepperFieldMigration);
    },
    apostropheFormCreateHasStepperFieldMigration() {
      return self.apos.migration.eachDoc(
        {
          type: '@apostrophecms/form',
          hasStepper: { $exists: 0 }
        },
        5,
        async doc => {
          await self.apos.doc.db.updateOne(
            { _id: doc._id },
            { $set: { hasStepper: false } }
          );
        }
      );
    }
  };
};
