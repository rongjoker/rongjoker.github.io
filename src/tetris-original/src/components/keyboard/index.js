import React from 'react';
import Immutable from 'immutable';
import propTypes from 'prop-types';

import style from './index.less';
import Button from './button';
import store from '../../store';
import todo from '../../control/todo';
import { i18n, lan } from '../../unit/const';
import { unlockAudio } from '../../unit/music';

export default class Keyboard extends React.Component {
  componentDidMount() {
    // iOS can show text selection on long press even with user-select: none.
    const preventSelection = e => e.preventDefault();
    this.keyboard.addEventListener('touchstart', preventSelection, { passive: false });
    this.keyboard.addEventListener('contextmenu', preventSelection);
    this.keyboard.addEventListener('selectstart', preventSelection);
    Object.keys(todo).forEach((key) => {
      const button = this[`dom_${key}`].dom;
      let pressed = false;
      button.addEventListener('pointerdown', (e) => {
        if (pressed || (e.pointerType === 'mouse' && e.button !== 0)) return;
        e.preventDefault();
        unlockAudio();
        button.setPointerCapture(e.pointerId);
        pressed = true;
        todo[key].down(store);
      });
      const stop = () => {
        if (!pressed) return;
        pressed = false;
        todo[key].up(store);
      };
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type =>
        button.addEventListener(type, stop));
      button.addEventListener('contextmenu', e => e.preventDefault());
    });
  }
  shouldComponentUpdate({ keyboard, filling }) {
    return !Immutable.is(keyboard, this.props.keyboard) || filling !== this.props.filling;
  }
  render() {
    const keyboard = this.props.keyboard;
    return (
      <div
        className={style.keyboard}
        ref={(c) => { this.keyboard = c; }}
        style={{
          marginTop: 20 + this.props.filling,
        }}
      >
        <Button
          color="blue"
          size="s1"
          top={0}
          left={374}
          label={i18n.rotation[lan]}
          arrow="translate(0, 63px)"
          position
          active={keyboard.get('rotate')}
          ref={(c) => { this.dom_rotate = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={180}
          left={374}
          label={i18n.down[lan]}
          arrow="translate(0,-71px) rotate(180deg)"
          active={keyboard.get('down')}
          ref={(c) => { this.dom_down = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={284}
          label={i18n.left[lan]}
          arrow="translate(60px, -12px) rotate(270deg)"
          active={keyboard.get('left')}
          ref={(c) => { this.dom_left = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={464}
          label={i18n.right[lan]}
          arrow="translate(-60px, -12px) rotate(90deg)"
          active={keyboard.get('right')}
          ref={(c) => { this.dom_right = c; }}
        />
        <Button
          color="blue"
          size="s0"
          top={100}
          left={52}
          label={`${i18n.drop[lan]} (SPACE)`}
          active={keyboard.get('drop')}
          ref={(c) => { this.dom_space = c; }}
        />
        <Button
          color="red"
          size="s2"
          top={0}
          left={196}
          label={`${i18n.reset[lan]}(R)`}
          active={keyboard.get('reset')}
          ref={(c) => { this.dom_r = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={0}
          left={106}
          label={`${i18n.sound[lan]}(S)`}
          active={keyboard.get('music')}
          ref={(c) => { this.dom_s = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={0}
          left={16}
          label={`${i18n.pause[lan]}(P)`}
          active={keyboard.get('pause')}
          ref={(c) => { this.dom_p = c; }}
        />
      </div>
    );
  }
}

Keyboard.propTypes = {
  filling: propTypes.number.isRequired,
  keyboard: propTypes.object.isRequired,
};
