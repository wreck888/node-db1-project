const express = require('express');
const { checkAccountPayload, checkAccountId, checkAccountNameUnique } = require('./accounts-middleware');
const Account = require('./accounts-model')
const router = require('express').Router()



router.get('/', async (req, res, next) => {
  try {
    const data = await Account.getAll()
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', checkAccountId, async (req, res, next) => {
  try {
    res.status(200).json(req.account)
  } catch (err) {
    next(err)
  }
})

router.post('/', checkAccountPayload, checkAccountNameUnique,  async (req, res, next) => {
  try {
    const data = await Account.create({
      name: req.body.name.trim(),
      budget: req.body.budget,
    })
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try {
    const data = await Account.updateById(req.params.id, req.body)
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const data = await Account.deleteById(req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router;
