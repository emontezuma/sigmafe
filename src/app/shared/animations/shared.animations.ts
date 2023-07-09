import {
  style,
  animate,
  trigger,
  transition,
  state,
} from '@angular/animations';

export const fromTop2 = trigger('fromTop', [
  transition('void => *', [
    style({ opacity: 0.3, transform: 'translateY(10px)' }),
    animate(
      '0.3s ease-in',
      style({ opacity: 1, transform: 'translateY(0px)' })
    ),
  ]),
  transition('* => void', [
    animate(
      '0.3s ease-out',
      style({ opacity: 0.3, transform: 'translateY(10px)' })
    ),
  ]),
]);


export const fromTop = trigger('fromTop', [
  state(
    'in',
    style({
      opacity: 1,
      transform: 'translateY(0px)',
    })
  ),
  transition('void => *', [ style({ opacity: 0.3, transform: 'translateY(20px)' }), animate('0.3s ease-in') ]),
  transition('* => void', [ animate('0.3s ease-out'), style({ opacity: 0, transform: 'translateY(20px)', }) ]),
]);

export const appearing = trigger('appearing', [
  transition('void => *', [
    style({ opacity: 0.3, transform: 'scale(0.3)' }),
    animate('0.1s ease-in', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition('* => void', [
    animate('0.1s ease-out', style({ opacity: 0.3, transform: 'scale(0.3)' })),
  ]),
]);

export const numbers = trigger('numbers', [
  state(
    'in',
    style({
      opacity: 1,
    })
  ),
  transition('void => *', [ style({ opacity: 0, transform: 'scale(2)' }), animate('0.1s ease-in') ]),
  transition('* => void', [ animate('0.1s ease-out'), style({ opacity: 0, transform: 'scale(2)' }) ]),
]);

export const dissolve = trigger('dissolve', [
  transition('void => *', [
    style({ opacity: 0.3 }),
    animate('0.3s ease-in', style({ opacity: 1 })),
  ]),
  transition('* => void', [
    animate('0.3s ease-out', style({ opacity: 0.3 })),
  ]),
]);
