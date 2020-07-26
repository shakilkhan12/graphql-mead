const { ApolloServer, gql } = require('apollo-server');
let courses = [
    { id: '0', title: 'React course', price: 299, author: '0' },
    { id: '1', title: 'Vue JS course', price: 99, author: '0' },
    { id: '2', title: 'Svelte JS course', price: 49, author: '1' }
]
const authors = [
    { id: '0', name: 'Umer', age: 25 },
    { id: '1', name: 'Usman', age: 24 },
    { id: '2', name: 'Ali', age: 22 }
]
const typeDefs = gql`
type Course {
    id: ID!,
    title: String!,
    price: Int,
    author: Author!
}
type Author {
    id: ID!,
    name: String!,
    age:Int!,
    courses: [Course!]!
}
type Query {
    authors: [Author],
    courses: [Course]
}

type Mutation {
    createCourse(id: ID!, title: String!, price: Int!, author: ID): Course,
    deleteCourse(id: ID!): [Course]
}

`;
const resolvers = {
    Query: {
        authors: () => authors,
        courses: () => courses
    },
    Mutation: {
        createCourse(_, course) {
            courses = [...courses, course];
            return course;
        },
        deleteCourse(_, args) {
            courses = courses.filter(course => course.id !== args.id);
            console.log(args.id)
            return courses;
        }
    },
    Author: {
        courses: (parent, _) => {
            console.log("Hello", parent.id)
            return courses.filter(course => course.author === parent.id)
        }
    },
    Course: {
        author: (parent, _) => {
            return authors.find(author => author.id === parent.author)
        }
    }
}
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});