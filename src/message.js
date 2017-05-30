/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')
const req = require('request')

// This function is the core of the bot behaviour
const replyMessage = (message) => {
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    /*
    * YOUR OWN CODE
    * Here, you can add your own process.
    * Ex: You can call any external API
    * Or: Update your mongo DB
    * etc...
    */

    //-------------------------------------------------------------------------------------

    var o = {} // empty Object
        var key = 'messages';
        o[key] = []; // empty Array, which you can push() values into

        var headers = {
          'Authorization':'Token 8eacd9988bf88405c98adff0f6304ab2',
          'Content-Type':'application/json'
        }

        var data
        var options

    //-------------------------------------------------------------------------------------

    if (result.action) {
      console.log('The conversation action is: ', result.action.slug)

      //-------------------------------------------------------------------------------------

      if (result.action.slug === 'yes') {
        console.log('Test si égal à yes')
        //envoi requete réponse TRUE


        data = {
            presence: 'TRUE',
            conversationId: message.conversationId
        };

        o[key].push(data);

        // Configure the request
        options = {
            url: 'http://al2c.dtdns.net/Al2cServer-war/webresources/evenements/validerInvitation',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(o)
        }

        console.log(JSON.stringify(o))

        // Start the request
        req(options, function (error, response, body) {
          console.log(response)
          console.log(JSON.stringify(o))
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body)
          }
      })
       }
    
      //-------------------------------------------------------------------------------------

      if (result.action.slug === 'no') {
        console.log('Test si égal à no')
        //envoi requete réponse false

        data = {
            presence: 'FALSE',
            conversationId: message.conversationId
        };

        o[key].push(data);

        // Configure the request
        options = {
            url: 'http://al2c.dtdns.net/Al2cServer-war/webresources/evenements/validerInvitation',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(o)
        }

        console.log(JSON.stringify(o))

        // Start the request
      req(options, function (error, response, body) {
          console.log(response)
          console.log(JSON.stringify(o))
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body)
          }
      })
    }
    
      //-------------------------------------------------------------------------------------

      if (result.action.slug === 'user-defined-payload') {
        console.log('Test si égal à USER_DEFINED_PAYLOAD')
        //envoi requete d'initialisation

        var str = message.message.data.userName
        var arr = str.split(" ");

        console.log("nom / prenom")
        console.log(arr[1])
        console.log(arr[0])

        data = {
            nom: arr[1],
            prenom: arr[0],
            conversationId: message.conversationId
        };

        o[key].push(data);

        // Configure the request
        options = {
            url: 'http://al2c.dtdns.net/Al2cServer-war/webresources/evenements/creerInvitationPremierContact',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(o)
        }

          // Start the request
          req(options, function (error, response, body) {
          console.log(response)
          console.log(JSON.stringify(o))
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body)
          }
      })
    }
    
      //-------------------------------------------------------------------------------------

      if (result.action.slug === 'savethedate') {
        console.log('Test si égal à SaveTheDate')
        //envoi requete d'initialisation

        data = {
            numero: message.senderId,
            conversationId: message.conversationId
        };

        o[key].push(data);

        // Configure the request
        options = {
            url: 'http://al2c.dtdns.net/Al2cServer-war/webresources/evenements/creerInvitationPremierContact',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(o)
        }

        console.log(JSON.stringify(o))

          // Start the request
          req(options, function (error, response, body) {
          console.log(response)
          console.log(JSON.stringify(o))
          console.log("Requete envoyé !!!!!!!!!!")
          if (!error && response.statusCode == 200) {
              // Print out the response body
              console.log(body)
          }
      })
    }
    
      //-------------------------------------------------------------------------------------

    }

    // If there is not any message return by Recast.AI for this current conversation
    if (!result.replies.length) {
      message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
    } else {
      // Add each reply received from API to replies stack
      result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
    }

    // Send all replies
    message.reply()
    .then(() => {
      // Do some code after sending messages
      console.log(message.senderId)
      console.log(message)
      console.log("MESSAGE.MESSAGE.USERNAME")
      console.log(message.message.data.userName)
    })
    .catch(err => {
      console.error('Error while sending message to channel', err)
    })
  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage

