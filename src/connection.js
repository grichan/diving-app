import PouchDB from 'pouchdb'

class Connection {
  constructor (database, setup) {
    this.database = database
    this.setup = setup
    this.db = new PouchDB(database, {skip_setup: setup})
  }
  getDocument (doc) {
    if ((typeof doc) !== 'string') {
      throw new Error('Wrong type ')
    }
    // returns promise returns new words
    return this.db.get(doc).then((doc) => {
      console.log(doc)
      return doc
    }).catch(function (err) {
      throw new Error('Error:', err)
    })
  }

  createDocument (doc) {
    return this.db.put(doc).then((res, err) => {
      return true
    }).catch((err) => {
      if (err) {
        return err
      }
    })
  }
}
export {Connection}
