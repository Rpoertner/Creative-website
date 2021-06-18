const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
    title: String,
    location: String
});

const Project = mongoose.model('project', projectSchema);

router.post('/', validUser, async (req, res) => {
    const project = new Project({
      user: req.user,
      title: req.body.title,
      location: req.body.location
    });
    try {
      await project.save();
      res.send(project);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });
router.get('/', validUser, async (req, res) => {
    try {
      let projects = await Project.find();
      res.send(projects);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });


router.delete('/:projectID', validUser, async(req,res) =>{

    try{
        let project = await Project.findOne({_id: req.params.projectID});
        if (!project) {
            res.send(404);
            return;
        }
        await project.delete();
        res.sendStatus(200);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
});

  const locusSchema = new mongoose.Schema({
      project: {
          type: mongoose.Schema.ObjectId,
          ref: 'Project'
      },
      subLocation: String,
      memory: String
  });

  const Locus = mongoose.model('Locus', locusSchema);

  router.post('/:projectID', validUser, async (req, res) => {
    try {
        let subProject = await Project.findOne({_id: req.params.projectID});
        if (!subProject) {
            res.send(404);
            return;
        }
        let locus = new Locus({
            project: subProject,
            subLocation: req.body.subLocation,
            memory: req.body.memory,
        });
        await locus.save();
        res.send(locus);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:projectID', validUser, async (req, res) => {
    try {
        let subProject = await Project.findOne({_id: req.params.projectID});
        if (!Project) {
            res.send(404);
            return;
        }
        let loci = await Locus.find();
        res.send(loci);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:projectID/:lociID', validUser, async (req, res) => {
    try {
        let locus = await Locus.findOne({_id:req.params.lociID});
        if (!locus) {
            res.send(404);
            return;
        }
        locus.subLocation = req.body.subLocation;
        locus.memory = req.body.memory;
        await locus.save();
        res.send(locus);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:projectID/:lociID', validUser, async (req, res) => {
    try {
        let locus = await Locus.findOne({_id: req.params.lociID});
        if (!locus) {
            res.send(404);
            return;
        }
        await locus.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
    model: Project,
    valid: validUser
  };