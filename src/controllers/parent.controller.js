const Parent = require('../models/parent.model')
const Child = require('../models/child.model')
const Caregiver = require('../models/caregiver.model')
const { deleteUploadedFiles } = require('../middlewares/validate-form')
const fs = require('fs')
const path = require('path')

exports.registerParent = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      gender,
      role_in_church,
      primary_phone_number,
      secondary_phone_number,
      department_in_church,
      ministry_in_church,
      means_of_id,
      identification_number,
      address,
      number_of_children,
      people_to_pick_child,
    } = req.body;

    
    const does_parent_exist = await Parent.findOne({ email })
    if (does_parent_exist) {
      // If the email exists, delete uploaded files before sending the response
      if (req.files) {
        deleteUploadedFiles(req.files)
      }

      return res.status(400).json({
        message:
          'The email used is already registered, reach out to the children department',
        status: false,
      })
    }

    // Create Parent Document
    const parent = new Parent({
      first_name,
      last_name,
      email,
      gender,
      role_in_church,
      primary_phone_number,
      secondary_phone_number,
      department_in_church,
      ministry_in_church,
      means_of_id,
      identification_number,
      picture_of_parent: req.files['picture_of_parent']
        ? req.files['picture_of_parent'][0].path
        : null,
      address,
    })

    const savedParent = await parent.save()

    // Parse children and caregivers from request body
    const children = JSON.parse(number_of_children)
    const caregivers = JSON.parse(people_to_pick_child)

    // Save children dynamically
    const savedChildren = await Promise.all(
      children.map(async (child, index) => {
        const newChild = new Child({
          ...child,
          picture_of_child: req.files['children_images'][index]
            ? req.files['children_images'][index].path
            : null,
          parent_id: savedParent._id,
        })
        return await newChild.save()
      }),
    )

    // Save caregivers dynamically and associate them with the correct children
    const savedCaregivers = await Promise.all(
      caregivers.map(async (caregiver, index) => {
        const newCaregiver = new Caregiver({
          ...caregiver,
          picture_of_caregiver: req.files['caregiver_images'][index]
            ? req.files['caregiver_images'][index].path
            : null,
          children: savedChildren.map((child) => child._id), // Assign all child IDs or specify according to your need
          parent_id: savedParent._id,
        })
        return await newCaregiver.save()
      }),
    )

    // Update parent references
    savedParent.number_of_children = savedChildren.map((child) => child._id)
    savedParent.people_to_pick_child = savedCaregivers.map(
      (caregiver) => caregiver._id,
    )
    await savedParent.save()

    // Update children with their caregiver IDs
    await Promise.all(
      savedChildren.map(async (child) => {
        child.caregiver_ids = savedCaregivers.map((caregiver) => caregiver._id)
        await child.save()
      }),
    )

    res.status(201).json({
      message: 'Submission Done successfully',
      status: true,
      parent: savedParent,
      children: savedChildren,
      caregivers: savedCaregivers,
    })
  } catch (err) {
    console.error(err)
    if (req.files) {
      deleteUploadedFiles(req.files)
    }
    res.status(500).json({ message: 'Error processing request', error: err })
  }
}
