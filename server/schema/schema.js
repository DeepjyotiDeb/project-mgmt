const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const Project = require("../models/Project");
const Client = require("../models/Client");
const { findByIdAndRemove } = require("../models/Client");

//project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    //to add relationships between different resources
    client: {
      type: ClientType,
      resolve(parent, args) {
        // return clients.find((client) => client.id === parent.id);
        return Client.findById(parent.clientId); //from Project model, we have clientId field
      },
    },
  }),
});

//client type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType), //it is of type list
      resolve(parent, args) {
        // return projects;
        return Project.find();
      },
    },
    //query to get projects based on id
    project: {
      type: ProjectType, // accepts Clientype made above
      args: { id: { type: GraphQLID } }, //id is the argument from the query
      resolve(parent, args) {
        // return projects.find((project) => project.id === args.id);
        return Project.findById(args.id);
      },
    },
    //query to get all clients
    clients: {
      type: new GraphQLList(ClientType), //it is of type list
      resolve(parent, args) {
        // return clients;
        return Client.find();
      },
    },
    //query to get based on id
    client: {
      type: ClientType, // accepts Clientype made above
      args: { id: { type: GraphQLID } }, //id is the argument from the query
      resolve(parent, args) {
        // return clients.find((client) => client.id === args.id);
        return Client.findById(args.id);
      },
    },
  },
});

//mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });

        return client.save();

        //alternate way Client.create(....)
      },
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        clientId: { type: GraphQLNonNull(GraphQLID) },
        status: {
          type: new GraphQLEnumType({
            //enumType allows specific set of values for an object
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              inProgress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          clientId: args.clientId,
          description: args.description,
          status: args.status,
        });
        return project.save();
      },
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              inProgress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
