const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  dob: Date,
  age_group: String,
  gender: String,
  picture_of_child: String,
  relationship_with_child: String,
  specify_relationship: String,
  special_needs: String,
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  },
  caregiver_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver'
  }]
});

module.exports = mongoose.model('Child', childSchema);
