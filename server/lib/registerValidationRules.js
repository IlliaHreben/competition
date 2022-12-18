import LIVR from 'livr';
import extraRules from 'livr-extra-rules';

const JSONPointer = (object, pointer) => {
  const parts = pointer.split('/');
  let value = object;

  for (const part of parts) {
    if (!value) break;
    value = value[part];
  }

  return value;
};

const isNoValue = (value) => {
  return value === undefined || value === null || value === '';
};

const defaultRules = {
  list_or_one(rule) {
    return (value) => {
      if (isNoValue(value)) return;
      const validator = new LIVR.Validator({
        value: {
          or: [rule, { list_of: rule }],
        },
      });

      if (!validator.validate({ value })) {
        return validator.getErrors().value;
      }
    };
  },
  to_array() {
    return (value, params, outputArr) => {
      if (isNoValue(value)) return;

      if (!Array.isArray(value)) {
        outputArr.push([value]);
      }
    };
  },
  date_before(query) {
    if (arguments.length > 1) {
      if (!query) {
        throw new Error('LIVR: the target key of the "date_before" rule is missed');
      }
    }

    return (value, params) => {
      if (isNoValue(value)) return;

      const valueToCheck = JSONPointer(params, query);
      if (!valueToCheck) {
        throw new Error('LIVR: the target value of the "date_before" rule is missed');
      }

      const dateAfter = new Date(valueToCheck);
      const currentDate = new Date(value);

      if (currentDate > dateAfter) return 'TOO_HIGH';
    };
  },
  date_after(query) {
    if (arguments.length > 1) {
      if (!query) {
        throw new Error('LIVR: the target key of the "date_before" rule is missed');
      }
    }

    return (value, params) => {
      if (isNoValue(value)) return;

      const valueToCheck = JSONPointer(params, query);
      if (!valueToCheck) {
        throw new Error('LIVR: the target value of the "date_before" rule is missed');
      }
      const [dateBefore] = new Date(valueToCheck).toISOString().split('T');
      const currentDate = new Date(value);

      if (dateBefore > currentDate) return 'TOO_LOW';
    };
  },
  bigger_than(query) {
    if (arguments.length > 1) {
      if (!query) {
        throw new Error('LIVR: the target key of the "bigger_than" rule is missed');
      }
    }

    return (value, params) => {
      if (isNoValue(value)) return;

      const valueToCheck = JSONPointer(params, query);

      if (valueToCheck >= value) return 'TOO_LOW';
    };
  },
  required_if_not_present(query) {
    if (arguments.length > 1) {
      if (!query) {
        throw new Error('LIVR: the target key of the "required_if_not_present" rule is missed');
      }
    }

    return (value, params) => {
      // if (isNoValue(value)) return;

      const valueToCheck = JSONPointer(params, query);

      if (isNoValue(valueToCheck) && isNoValue(value)) return 'REQUIRED';
    };
  },
  ...extraRules,
};

LIVR.Validator.registerDefaultRules(defaultRules);

const aliases = {
  limit: ['positive_integer', { number_between: [0, 1000] }],
  offset: ['integer', { min_number: 0 }, { default: 0 }],
};

Object.entries(aliases).forEach(([name, rules]) => {
  LIVR.Validator.registerAliasedDefaultRule({ name, rules });
});

export default defaultRules;
