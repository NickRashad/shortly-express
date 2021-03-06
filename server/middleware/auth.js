const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.cookies || Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
      .then((result) => {
        models.Sessions.get({ id: result.insertId }).then((result) => {
          req.session = result;
          res.cookie('shortlyid', result.hash);
          next();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    models.Sessions.get({ hash: req.cookies.shortlyid })
      .then((result) => {
        if (result) {
          /**
           * Will need to refactor req.session assigment as
           * session.user needs to exist on this as well for
           * isLoggedIn  (Include req.session.userId & req.session.hash)
           */
          req.session = result;
          next();
        } else {
          models.Sessions.create().then((result) => {
            models.Sessions.get({ id: result.insertId }).then((result) => {
              /**
               * Will need to refactor req.session assigment as
               * session.user needs to exist on this as well for
               * isLoggedIn  (Include req.session.userId & req.session.hash)
               */
              req.session = result;
              res.cookie('shortlyid', result.hash);
              next();
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
