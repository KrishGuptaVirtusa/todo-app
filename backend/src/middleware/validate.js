/**
 * Higher-order middleware function to run one or more validators
 * @param  {...Function} validators
 */
function validate(...validators) {
  return (req, res, next) => {
    const allErrors = [];

    for (const validator of validators) {
      const errors = validator(req);
      if (Array.isArray(errors) && errors.length > 0) {
        allErrors.push(...errors);
      }
    }

    if (allErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: allErrors,
      });
    }

    next();
  };
}

module.exports = validate;
