import {
  style,
  animate,
  trigger,
  transition,
  state,
  query,
  stagger,
} from '@angular/animations';

export const routingAnimation = trigger('routingAnimation', [
  transition('void => *', [
    style({ opacity: 0.3, transform: 'translateY(30px)' }),
    animate(
      '0.3s ease-in',
      style({ opacity: 1, transform: 'translateY(0px)' })
    ),
  ]),
  transition('* => void', [
    animate(
      '0.3s ease-out',
      style({ opacity: 0.3, transform: 'translateY(30px)' })
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
  transition('void => *', [ style({ opacity: 0.3, transform: 'translateY(10px)' }), animate('0.6s ease-in') ]),
  transition('* => void', [ animate('0.6s ease-out'), style({ opacity: 0, transform: 'translateY(10px)', }) ]),
]);

export const fromLeft = trigger('fromLeft', [
  state(
    'in',
    style({
      opacity: 1,
      transform: 'translateX(0px)',
    })
  ),
  transition('void => *', [ style({ opacity: 0.5, transform: 'translateX(30px)' }), animate('0.25s ease-in') ]),
  transition('* => void', [ animate('0.25s ease-out'), style({ opacity: 0.5, transform: 'translateX(30px)', }) ]),
]);

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [  
    query(':leave', [
     stagger(150, [
       animate(125, style({ opacity: 0, transform: 'translateY(-10%)' }))
     ])
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-10%)' }),
      stagger(150, [
       animate(125, style({ opacity: 1, transform: 'translateY(0px)' }))
     ])
    ], { optional: true })
  ])
]);

export const dissolve = trigger('dissolve', [
  state(
    'in',
    style({
      opacity: 1,
    })
  ),
  transition('void => *', [ style({ opacity: 0, }), animate('0.5s ease-in') ]),
  transition('* => void', [ animate('0.5s ease-out'), style({ opacity: 0, }) ]),
]);

export const fastDissolve = trigger('fastDissolve', [
  state(
    'in',
    style({
      opacity: 1,
    })
  ),
  transition('void => *', [ style({ opacity: 0, }), animate('0.1s ease-in') ]),
  transition('* => void', [ animate('0.1s ease-out'), style({ opacity: 0, }) ]),
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

export const fader2 = trigger('routeAnimations', [
  transition('* => *', [
    // The query function has three params.
    // First is the event, so this will apply on entering or when the element is added to the DOM.
    // Second is a list of styles or animations to apply.
    // Third we add a config object with optional set to true, this is to signal
    // angular that the animation may not apply as it may or may not be in the DOM.
    query(
      ':enter, :leave', [style({ opacity: 1}), animate('2s', style({ transform: 'translateY(-15px)', }))],
      { optional: true }
    ),
    query(
      ':enter',
      [style({ transform: 'translateY(-15px)' }), animate('2s', style({ opacity: 1, }))],
      { optional: true }
    )
  ])
]);
