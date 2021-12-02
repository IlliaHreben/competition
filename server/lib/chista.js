import ChistaModule from 'chista';
// import pino         from 'pino';

// const logger = pino();

const Chista = ChistaModule.default;

const chista = new Chista({
  // defaultLogger: (type, ...args) => {}
  // logger[type](...args)
});

export default chista;
