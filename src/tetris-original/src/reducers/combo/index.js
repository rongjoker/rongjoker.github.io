import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

const saved = lastRecord && lastRecord.combo;
const initState = Number.isInteger(saved) && saved >= 0 ? saved : 0;

const combo = (state = initState, action) => {
  switch (action.type) {
    case reducerType.COMBO:
      return action.data;
    default:
      return state;
  }
};

export default combo;
