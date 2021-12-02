import cors    from 'cors';
import express from 'express';
import bytes   from 'bytes';

export default {
  json: express.json({
    limit  : bytes('1MB'),
    verify : (_, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.send({
          ok    : false,
          error : {
            code    : 'BROKEN_JSON',
            message : 'Please, verify your json'
          }
        });
        throw new Error('BROKEN_JSON');
      }
    }
  }),
  arrays (req, _, next) {
    const keys = Object.keys(req.query);

    keys
      .filter(key => req.query[key].includes(',') || req.query[key] === 'include')
      .forEach(key => req.query[key] = req.query[key].split(','));

    return next();
  },
  urlencoded : express.urlencoded({ extended: true }),
  cors       : cors({ origin: '*' }) // We allow any origin because we DO NOT USE cookies and basic auth
};
