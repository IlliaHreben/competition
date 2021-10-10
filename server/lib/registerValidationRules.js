import LIVR        from 'livr';
import extraRules  from 'livr-extra-rules';

const defaultRules = {
  ...extraRules
};

export default defaultRules;

LIVR.Validator.registerDefaultRules(defaultRules);
