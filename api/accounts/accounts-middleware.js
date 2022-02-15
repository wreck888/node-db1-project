const db = require("../../data/db-config")
const Account = require('./accounts-model')

exports.checkAccountPayload = (req, res, next) => {
    const { name, budget } = req.body
    const errorMessage = {status: 400}
    if (name === undefined || budget === undefined) {
      res.status(400).json({ 
        message: "name and budget are required" 
      })
    } else if (name.trim().length < 3 || name.trim().length > 100) {
      res.status(400).json({ 
        message: "name of account must be between 3 and 100" 
      })
    } else if ( typeof budget !== 'number' || isNaN(budget)) {
      res.status(400).json({ 
        message: "budget of account must be a number" 
      })
    } else if ( budget < 0 || budget > 1000000) {
      res.status(400).json({ 
        message: "budget of account is too large or too small" 
      })
    } else if ( errorMessage.message ) {
      next(errorMessage);
    }else {
      next();
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const existingAccounts = await db('accounts')
      .where( "name", req.body.name.trim() )
      .first()

    if (existingAccounts) {
      next( { status: 400, message: "that name is taken" } )

    } else {
      next();
    }

  } catch (error) {
    next(error);
  }
}
exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById( req.params.id )
    if( !account ) {
      next( { status: 404, message: "account not found" } )

    } else {
      req.account = account;
      next();
    }
    }catch(error){
      next(error);
    }
}
