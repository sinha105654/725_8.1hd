const express = require('express');

const Subject = require('../models/Subject');
const Task = require('../models/Task');

const { ensureAuthenticated } = require('./auth');

const router = express.Router();


// -----------------------------------------------------
// SHOW SUBJECTS AND THEIR TASKS
// -----------------------------------------------------

router.get('/', ensureAuthenticated, async (req, res) => {
  try {

    const subjects = await Subject.find({
      owner: req.user._id
    })
      .sort({ createdAt: -1 })
      .lean();

    const subjectIds = subjects.map(subject => subject._id);

    const tasks = await Task.find({
      subject: {
        $in: subjectIds
      }
    })
      .sort({ deadline: 1 })
      .lean();


    // Group tasks by Subject ID
    const tasksBySubject = {};

    tasks.forEach(task => {

      const subjectId = task.subject.toString();

      if (!tasksBySubject[subjectId]) {
        tasksBySubject[subjectId] = [];
      }

      tasksBySubject[subjectId].push(task);
    });


    res.render('subjects', {
      subjects,
      tasksBySubject,
      user: req.user
    });

  } catch (err) {

    console.error(err);

    res.status(500).send(
      'Error loading subjects and tasks.'
    );
  }
});


// -----------------------------------------------------
// CREATE SUBJECT
// -----------------------------------------------------

router.post('/', ensureAuthenticated, async (req, res) => {
  try {

    const name = String(req.body.name || '').trim();

    if (!name) {
      return res.status(400).send(
        'Subject name is required.'
      );
    }

    await Subject.create({
      name,
      owner: req.user._id
    });

    res.redirect('/subjects');

  } catch (err) {

    console.error(err);

    res.status(500).send(
      'Error creating subject.'
    );
  }
});


// -----------------------------------------------------
// CREATE TASK
// -----------------------------------------------------

router.post(
  '/:subjectId/tasks',
  ensureAuthenticated,
  async (req, res) => {

    try {

      const {
        description,
        deadline,
        effortEstimate
      } = req.body;


      // Make sure this subject belongs to this user
      const subject = await Subject.findOne({
        _id: req.params.subjectId,
        owner: req.user._id
      });


      if (!subject) {
        return res.status(404).send(
          'Subject not found.'
        );
      }


      await Task.create({

        description,

        deadline,

        effortEstimate:
          effortEstimate
            ? Number(effortEstimate)
            : undefined,

        subject: subject._id
      });


      res.redirect('/subjects');

    } catch (err) {

      console.error(err);

      res.status(500).send(
        'Error creating task.'
      );
    }
  }
);


module.exports = router;