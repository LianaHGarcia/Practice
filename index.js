const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

let books = [
  { id: 1, title: '1984', author: 'George Orwell' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

const schema = buildSchema(`
  type Book {
    id: Int
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    updateBook(id: Int!, title: String, author: String): Book
    deleteBook(id: Int!): Book
  }
`);

const root = {
  books: () => books,
  addBook: ({ title, author }) => {
    const book = { id: books.length + 1, title, author };
    books.push(book);
    return book;
  },
  updateBook: ({ id, title, author }) => {
    const book = books.find(book => book.id === id);
    if (!book) throw new Error('Book not found');
    if (title) book.title = title;
    if (author) book.author = author;
    return book;
  },
  deleteBook: ({ id }) => {
    const index = books.findIndex(book => book.id === id);
    if (index === -1) throw new Error('Book not found');
    const deletedBook = books.splice(index, 1)[0];
    return deletedBook;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));