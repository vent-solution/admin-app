import markRequiredFormField from "./markRequiredFormField";

const checkRequiredFormFields = (inputArray: HTMLInputElement[]) => {
  inputArray.forEach((input) => {
    if (input.value.trim().length < 1) {
      markRequiredFormField(input);
    }
  });
};

export default checkRequiredFormFields;
