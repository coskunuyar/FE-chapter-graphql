const graphql = require("graphql");

let authorList = [
  { id: "d493bdf06b7a", name: "Coskun Uyar" },
  { id: "d493xdf06b71", name: "Sait Faik" },
];

let bookList = [
  {
    id: "563d1d17f866",
    name: "Sample Book 1",
    genre: "Sci - Fi",
    authorId: "d493bdf06b7a",
  },
  {
    id: "81e595f1fb88",
    name: "Sample Book 2",
    genre: "History",
    authorId: "d493xdf06b71",
  },
  {
    id: "03ef944cd41f",
    name: "Sample Book 3",
    genre: "Sci - Fi",
    authorId: "d493bdf06b7a",
  },
  {
    id: "03306c4c3d41",
    name: "Sample Book 4",
    genre: "Adventure",
    authorId: "d493xdf06b71",
  },
  {
    id: "07f92aac097c",
    name: "Sample Book 5",
    genre: "History",
    authorId: "d493bdf06b7a",
  },
];

const deleteBookHelper = (id) => {
  const deletedBook = bookList.filter((book) => book.id === id)[0];
  bookList = bookList.filter((book) => book.id !== id);
  return deletedBook;
};

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return bookList.filter((book) => book.authorId === parent.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return authorList.filter((author) => author.id === parent.authorId)[0];
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return bookList.filter((book) => book.id === args.id)[0];
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authorList.filter((author) => author.id === args.id)[0];
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return bookList;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authorList;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        authorList.push({
          id: Math.random().toString().replace(".", ""),
          name: args.name,
        });
        return authorList[authorList.length - 1];
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        bookList.push({
          id: Math.random().toString().replace(".", ""),
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return bookList[bookList.length - 1];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
