import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import {
  checkLoggedIn,
  checkCanWriteProject
} from "/imports/api/permissions/permissions";

export const ProcessDiagrams = new Mongo.Collection("processDiagrams");
if (Meteor.isServer) {
  Meteor.startup(() => {
    ProcessDiagrams.rawCollection().createIndex({ projectId: 1 });
  });
}

ProcessDiagrams.methods = {};

ProcessDiagrams.methods.create = new ValidatedMethod({
  name: "processDiagrams.create",
  validate: new SimpleSchema({
    projectId: { type: String },
    name: { type: String },
    description: { type: String, optional: true }
  }).validator(),
  run({ projectId, name, description }) {
    checkLoggedIn();
    checkCanWriteProject(projectId);

    const id = ProcessDiagrams.insert({
      projectId: projectId,
      name: name,
      description: description,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });
    return id;
  }
});

ProcessDiagrams.methods.update = new ValidatedMethod({
  name: "processDiagrams.update",
  validate: new SimpleSchema({
    processDiagramId: { type: String },
    name: { type: String },
    description: { type: String, optional: true }
  }).validator(),
  run({ processDiagramId, name, description }) {
    checkLoggedIn();
    const processDiagram = ProcessDiagrams.findOne({ _id: processDiagramId });
    if (!processDiagram) {
      throw new Meteor.Error("not-found");
    }
    checkCanWriteProject(processDiagram.projectId);

    ProcessDiagrams.update(
      {
        _id: processDiagramId
      },
      {
        $set: {
          name: name,
          description: description
        }
      }
    );
  }
});

ProcessDiagrams.methods.saveXML = new ValidatedMethod({
  name: "processDiagrams.saveXML",
  validate: new SimpleSchema({
    processDiagramId: { type: String },
    xml: { type: String }
  }).validator(),
  run({ processDiagramId, xml }) {
    checkLoggedIn();
    const processDiagram = ProcessDiagrams.findOne({ _id: processDiagramId });
    if (!processDiagram) {
      throw new Meteor.Error("not-found");
    }
    checkCanWriteProject(processDiagram.projectId);

    ProcessDiagrams.update(
      {
        _id: processDiagramId
      },
      {
        $set: {
          xml: xml
        }
      }
    );
  }
});

ProcessDiagrams.methods.remove = new ValidatedMethod({
  name: "processDiagrams.remove",
  validate: new SimpleSchema({
    processDiagramId: { type: String }
  }).validator(),
  run({ processDiagramId }) {
    checkLoggedIn();
    const processDiagram = ProcessDiagrams.findOne({ _id: processDiagramId });
    if (!processDiagram) {
      throw new Meteor.Error("not-found");
    }
    checkCanWriteProject(processDiagram.projectId);

    ProcessDiagrams.remove({ _id: processDiagramId });
  }
});
