const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} = require('graphql');
const Project = require('../models/Project');
const Client = require('../models/Client');

//project type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
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
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
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

module.exports = new GraphQLSchema({
  query: RootQuery,
});
