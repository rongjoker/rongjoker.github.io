import event from '../../unit/event';
import states from '../states';
import actions from '../../actions';

const down = (store) => {
  store.dispatch(actions.keyboard.reset(true));
  if (store.getState().get('lock')) {
    return;
  }
  if (store.getState().get('cur') !== null) {
    event.down({
      key: 'r',
      once: true,
      callback: () => {
        store.dispatch(actions.speedStart(1));
        store.dispatch(actions.speedRun(1));
        store.dispatch(actions.startLines(0));
        states.overStart();
      },
    });
  } else {
    event.down({
      key: 'r',
      once: true,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        store.dispatch(actions.speedStart(1));
        store.dispatch(actions.speedRun(1));
        store.dispatch(actions.startLines(0));
        states.start();
      },
    });
  }
};

const up = (store) => {
  store.dispatch(actions.keyboard.reset(false));
  event.up({
    key: 'r',
  });
};

export default {
  down,
  up,
};
