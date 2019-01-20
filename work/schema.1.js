const fetch = require('node-fetch')
const util = require('util')

const parseXML = util.promisify(require('xml2js').parseString)

const {
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLInt, 
    GraphQLString,
    GraphQLList
} = require('graphql')



const BookType = new GraphQLObjectType({
    name:'Book', 
    description: '...',

    fields: () => ({
        title: {
            GraphQLString,
            resolve: xml => console.log('xml', xml)
        },
        isbn: {
            type: GraphQLString
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',

    fields: () => ({
        name: {
          type: GraphQLString,
          resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        },
        books: {
          type: new GraphQLList(BookType),
          resolve: xml => {
              log('books', xml.GoodreadsResponse.author[0].books[0] )
          }
        }
    })
})

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      description: '...',

      fields: () => ({
          author: {
              type: AuthorType,
              args: {
                  id: {type: GraphQLInt}
              },
              resolve: (root, args) => fetch(`https://www.goodreads.com/author/show.xml?id=${args.id}&key=N5ePPjTeJ7B3h2sOviOJIQ`)
              .then(response => (response.text())
              .then(parseXML))
            }
        })
    })
})


