const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  role_in_church: String,
  primary_phone_number: String,
  secondary_phone_number: String,
  department_in_church: String,
  ministry_in_church: String,
  means_of_id: String,
  identification_number: String,
  picture_of_parent: String,
  address: String,
  number_of_children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  }],
  people_to_pick_child: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver'
  }]
});

module.exports = mongoose.model('Parent', parentSchema);
