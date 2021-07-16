module.exports = function (fastify, opts, next) {
  const givePointsSchema = {
    schema: {
      description: `Give points to a user`,
      tags: [`Points`],
      summary: `Give to points`,
      body: {
        type: `object`,
        required: [`username`, `amount`],
        properties: {
          username: { type: `string` },
          amount: { type: `number` }
        }
      },
      response: {
        200: {
          type: `string`
        },
        404: {
          type: `object`,
          properties: {
            errorCode: { type: `string` },
            errorMessage: { type: `string` }
          }
        }
      }
    },
    preHandler: fastify.auth([fastify.jwtAuth])
  }

  fastify.post(`/give`, givePointsSchema, async (req, reply) => {
    const User = fastify.mongo.db.model(`User`)
    User.findOne({ username: req.body.username }, async (error, user) => {
      if (error) throw error
      if (!user) {
        return reply
          .code(404)
          .send({ errorCode: 404, errorMessage: `User not found` })
      }

      const amountToAdd = req.body.amount + (user.points || 0)
      const username = req.body.username
      User.updateOne(
        { username: username },
        { points: amountToAdd },
        (error, _) => {
          if (error) throw error
          return reply.send(`ok`)
        }
      )
    })
  })

  const getPointsSchema = {
    schema: {
      description: `Get points of a user`,
      tags: [`Points`],
      summary: `Check how many points user has`,
      body: {
        type: `object`,
        required: [`username`],
        properties: {
          username: { type: `string` }
        }
      },
      response: {
        200: {
          type: `object`,
          properties: {
            points: { type: `number` }
          }
        },
        404: {
          type: `object`,
          properties: {
            errorCode: { type: `string` },
            errorMessage: { type: `string` }
          }
        }
      }
    },
    preHandler: fastify.auth([fastify.jwtAuth])
  }

  fastify.post(`/get`, getPointsSchema, async (req, reply) => {
    const User = fastify.mongo.db.model(`User`)
    User.findOne({ username: req.body.username }, async (error, user) => {
      if (error) throw error
      if (!user) {
        return reply
          .code(404)
          .send({ errorCode: 404, errorMessage: `User not found` })
      }

      return reply.send({ points: user.points })
    })
  })

  next()
}
