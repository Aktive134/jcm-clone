const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const deleteUploadedFiles = (files) => {
  Object.values(files).forEach(fileArray => {
    fileArray.forEach(file => {
      fs.unlink(path.join(file.path), (err) => {
        if (err) console.error(`Error deleting file: ${file.path}`, err);
      });
    });
  });
};

const validateFormSubmission = [
  check('first_name').notEmpty().withMessage('First name is required'),
  check('last_name').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be male or female'),
  check('role_in_church').notEmpty().withMessage('Role in church is required'),
  check('primary_phone_number')
    .isMobilePhone()
    .withMessage('Valid primary phone number is required'),
  check('secondary_phone_number')
    .optional()
    .isMobilePhone()
    .withMessage('Valid secondary phone number is required'),
  check('department_in_church')
    .optional(),
  check('ministry_in_church')
    .optional(),
  check('means_of_id').optional(),
  check('identification_number')
  .optional(),
  check('address').notEmpty().withMessage('Address is required'),

  // Validate children and people_to_pick_child fields (which are arrays)
  check('number_of_children').custom((value) => {
    const children = JSON.parse(value)
    if (!Array.isArray(children)) {
      throw new Error('Number of children must be an array')
    }
    children.forEach((child) => {
      if (
        !child.first_name ||
        !child.last_name ||
        !child.dob ||
        !child.gender
      ) {
        throw new Error(
          'Each child must have first name, last name, date of birth, and gender',
        )
      }
    })
    return true
  }),
  check('people_to_pick_child').custom((value) => {
    const people = JSON.parse(value)
    if (!Array.isArray(people)) {
      throw new Error('People to pick child must be an array')
    }
    people.forEach((person) => {
      if (!person.care_giver_name || !person.primary_phone_number) {
        throw new Error('Each caregiver must have a name and a phone number')
      }
    })
    return true
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    deleteUploadedFiles(req.files);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]

module.exports = { validateFormSubmission, deleteUploadedFiles }
