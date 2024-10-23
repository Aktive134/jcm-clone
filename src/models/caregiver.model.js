const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  care_giver_name: String,
  gender: String,
  email: String,
  role_in_church: String,
  primary_phone_number: String,
  secondary_phone_number: String,
  department_in_church: String,
  ministry_in_church: String,
  picture_of_caregiver: String,
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  }],
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  }
});

module.exports = mongoose.model('Caregiver', caregiverSchema);
