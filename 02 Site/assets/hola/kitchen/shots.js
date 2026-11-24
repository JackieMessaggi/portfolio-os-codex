// Hola! Churros section 02: shots, copy, and timing (from cinematic study 04, approved). One source for the player and the scene.
// Kitchen cm: x 0 = left end (window 3) to 300 = door end; z 0 = back wall to 200 = service side; y 0 = floor.
// p = camera, l = look-at, f = vertical field of view at a 1.3:1 stage. pk = how much of the desktop width a phone keeps (1 = all).
export const PARTS = [
  { n: 1, t: 'A Big Idea in a Small Space', s: 'Small space', a: 0, b: 14 },
  { n: 2, t: 'Designed for the Workflow', s: 'Workflow', a: 14, b: 30 },
  { n: 3, t: 'Every Centimeter Had a Purpose', s: 'One order', a: 30, b: 66 },
  { n: 4, t: 'Built to Scale', s: 'Built to scale', a: 66, b: 96 },
];
export const TOTAL = 96;   // content time (all times in this file)
// study 04: the two ticket shots (content 30 to 36) play 1.5× faster, so they take 4 s instead of 6 s. Nothing else moves.
export const RATE = (u) => (u >= 30 && u < 36 ? 1.5 : 1);
export const toReal = (u) => (u < 30 ? u : u < 36 ? 30 + (u - 30) / 1.5 : u - 2);
export const REAL_TOTAL = toReal(TOTAL);   // 94 s
export const SENT = [
  [0.6, 1, 'We had just six square meters to build a fully functioning churros kitchen.'],
  [5.4, 1, 'The real challenge wasn’t fitting everything inside. It was making the operation work efficiently.'],
  [14.4, 2, 'I planned the kitchen around the production process, from preparing the dough to adding the final toppings.'],
  [20.0, 2, 'Each workstation had a purpose, and its position supported the next step.'],
  [30.4, 3, 'Space was limited, so the workflow had to be deliberate.'],
  [60.2, 3, 'Orders and finished churros moved through different hands, while customers ordered and collected at the same window.'],
  [66.4, 4, 'Scalability was part of the plan from day one.'],
  [69.6, 4, 'We designed the kitchen to work with a lean team and expand to eight people during major events, balancing efficiency, staffing costs, and demand in the same space.'],
];
// PROPOSED step lines for part 3 (new copy, needs approval)
export const STEPS = [
  [30.4, 'The order is taken at the register.'],
  [33.6, 'One ticket per order.'],
  [36.1, 'The ticket waits on the rail above the line.'],
  [39.6, 'Dough pressed out onto the board.'],
  [46.1, 'Fried until golden.'],
  [49.6, 'Drained.'],
  [51.6, 'Rolled in sugar and cinnamon.'],
  [53.6, 'Filled at the dispenser.'],
  [57.1, 'Finished with toppings.'],
  [60.1, 'Packed and handed over at the same window.'],
  [63.1, 'The path it just took.'],
];
export const BEATS = [
  [66.6, 3, ['Register and service', 'Shaping and frying', 'Filling, toppings, and handover']],
  [74.6, 5, ['Register and orders', 'Dough and frying', 'Fillings', 'Toppings', 'Order control and handover']],
  [83.0, 8, ['Register and orders', 'Dough and shaping', 'Fillings', 'Toppings, right half', 'Order control and handover', 'Frying, draining, sugar', 'Toppings, left half', 'Replenishment']],
];
const W = { p: [560, 330, 600], l: [150, 85, 100], f: 32, pk: 1.04 };   // part 4 wide: the whole kitchen and everyone in it
const polar = (o, i) => { const a = o.a[i] * Math.PI / 180; return [o.c[0] + Math.cos(a) * o.r[i], o.y[i], o.c[2] + Math.sin(a) * o.r[i]]; };
export const SHOTS = [
  // ---------------------------------------------------------------- 01 · establishing first, then the reveal
  { id: '1.1', part: 1, t: [0, 4.5], type: 'Orbit with push-in', orbit: { c: [165, 70, 100], a: [12, 46], r: [930, 800], y: [360, 290], l: [165, 60, 100] }, f: 30, pk: 1.12, ease: 'out',
    focus: 'The whole trailer, turning to show its door end and service side.', action: 'Closed trailer. The camera travels about 34° around it while moving in.', transition: 'Moving from the first frame: the orbit is the hook.' },
  { id: '1.2', part: 1, t: [4.5, 9], type: 'Orbit continues, slight pull-back', orbit: { c: [165, 70, 100], a: [46, 74], r: [800, 840], y: [290, 270], l: [160, 55, 100] }, f: 30, pk: 1.12, ease: 'io',
    focus: 'Length and width, read while the camera moves.', action: 'Dimension lines draw on the ground during the orbit: 3 m (4.0 to 5.2), 2 m (4.8 to 6.0), then “6 m²” (6.0). They stay until 8.6.', transition: 'Continuous orbit; the lines fade before the crane.' },
  { id: '1.3', part: 1, t: [9, 14], type: 'Crane up and push in', to: { p: [400, 560, 470], l: [140, 70, 95], f: 34, pk: .98 }, ease: 'io',
    focus: 'The roof as it opens, then the kitchen.', action: 'Approved reveal: windows and counter open, roof lifts and fades, near walls sectioned (9.6 to 13.0).', transition: 'The reveal carries the camera into part 2.' },
  // ---------------------------------------------------------------- 02 · empty kitchen, one station at a time, one label each
  { id: '2.1', part: 2, t: [14, 16], type: 'Descend into the aisle', to: { p: [255, 215, 205], l: [110, 105, 30], f: 38 }, ease: 'io',
    focus: 'The back counter, end to end.', action: 'Nothing moves. Rails are not in this part.', transition: 'Orientation before the close shots.' },
  { id: '2.2', part: 2, t: [16, 19], type: 'Medium, whole machine', to: { p: [206, 160, 200], l: [130, 122, 26], f: 36 }, ease: 'out', light: [130, 120, 24], label: ['Dough dispenser', [130, 158, 22]],
    focus: 'Dough dispenser, lever, cutting board.', action: 'Warm key light on the station.', transition: 'Arrives fast, then drifts, so the label lands on a still frame.' },
  { id: '2.3', part: 2, t: [19, 22], type: 'Medium, high angle', to: { p: [100, 186, 112], l: [83, 94, 26], f: 34 }, ease: 'out', light: [83, 92, 26], label: ['Fryer', [83, 106, 4]],
    focus: 'Fryer and its two baskets.', action: 'Key light. No tint (the old fryer glitch came from the tint and a wall seam; both fixed).', transition: 'Tracks left along the counter.' },
  { id: '2.4', part: 2, t: [22, 25], type: 'Medium, high angle', to: { p: [50, 186, 116], l: [31, 95, 24], f: 34 }, ease: 'out', light: [31, 95, 24], label: ['Drain trays · sugar and cinnamon', [31, 98, 24]],
    focus: 'Both drain trays.', action: 'Key light.', transition: 'Continues left, then turns.' },
  { id: '2.5', part: 2, t: [25, 27.5], type: 'Medium, from the aisle', to: { p: [150, 150, 128], l: [10, 113, 117], f: 34 }, ease: 'out', light: [10, 113, 117], label: ['Filling dispensers', [8.5, 137, 117]],
    focus: 'The four filling dispensers, levers toward the aisle.', action: 'Key light.', transition: 'A turn to the left wall; the back counter stays at the frame edge.' },
  { id: '2.6', part: 2, t: [27.5, 30], type: 'High, toward the front', to: { p: [86, 222, 88], l: [80, 96, 180], f: 36 }, ease: 'out', light: [80, 96, 180], label: ['Toppings', [80, 101, 180]],
    focus: 'The six toppings under window 2.', action: 'Key light.', transition: 'Ends facing the service windows, where part 3 begins.' },
  // ---------------------------------------------------------------- 03 · no people; the order as states, joined by cuts
  { id: '3.1', part: 3, t: [30, 32.4], type: 'Medium, from outside window 1', cut: true, from: { p: [300, 190, 330], l: [252, 90, 172], f: 28 }, to: { p: [292, 182, 316], l: [252, 90, 172], f: 28 }, ease: 'io',
    focus: 'Register, stool, order pad.', action: 'The ticket lies on the pad.', transition: 'Cut outside. Short (1.6 s on screen): it only places the ticket.' },
  { id: '3.2', part: 3, t: [32.4, 36], type: 'Fast push through the window into the close-up', to: { p: [258, 124, 189], l: [251, 91, 172], f: 26 }, ease: 'out',
    focus: 'The ticket.', action: 'The real ticket, marked Chocolate and M&M’s.', transition: 'No cut: the camera moves in fast (most of the move in under a second) and settles on the ticket.' },
  { id: '3.3', part: 3, t: [36, 39.5], type: 'High, from outside', cut: true, from: { p: [252, 196, 318], l: [232, 150, 190], f: 30 }, to: { p: [244, 192, 306], l: [232, 158, 192], f: 30 }, ease: 'io',
    focus: 'The ticket hanging on the rail over window 1.', action: 'Ticket already on the rail (the move happens between shots).', transition: 'Cut; the tilt follows where tickets go.' },
  { id: '3.4', part: 3, t: [39.5, 42], type: 'Move through the window to the back counter', to: { p: [176, 150, 92], l: [130, 100, 28], f: 32 }, ease: 'io',
    focus: 'From the rail to the dough station.', action: 'The camera passes under the rail and over the counter, through the open window.', transition: 'Continuous: the ticket hands over to production.' },
  { id: '3.5', part: 3, t: [42, 46], type: 'Close-up', to: { p: [160, 126, 72], l: [129, 94, 30], f: 30 }, ease: 'out', light: [130, 94, 28],
    focus: 'Nozzle and cutting board.', action: 'Lever and plunger move (42.4 to 44.6) and the dough comes out of the nozzle onto the board (42.6 to 44.6); the strand separates at the nozzle (44.9).', transition: 'Settles into the close-up as the dough appears.' },
  { id: '3.6', part: 3, t: [46, 49.5], type: 'Close-up', cut: true, from: { p: [100, 150, 86], l: [72.7, 92, 25], f: 30 }, to: { p: [96, 146, 80], l: [72.7, 92, 25], f: 30 }, ease: 'io', light: [72.7, 92, 25],
    focus: 'The churro floating in the first basket.', action: 'Color goes from raw to golden (46.4 to 49.2).', transition: 'Cut.' },
  { id: '3.7', part: 3, t: [49.5, 51.5], type: 'Close-up', cut: true, from: { p: [72, 142, 80], l: [46.6, 96, 24], f: 30 }, to: { p: [69, 138, 76], l: [46.6, 96, 24], f: 30 }, ease: 'io', light: [46.6, 96, 24],
    focus: 'Drain tray next to the fryer.', action: 'Golden churro on the tray.', transition: 'Cut.' },
  { id: '3.8', part: 3, t: [51.5, 53.5], type: 'Close-up', cut: true, from: { p: [42, 142, 80], l: [16.4, 96, 24], f: 30 }, to: { p: [39, 138, 76], l: [16.4, 96, 24], f: 30 }, ease: 'io', light: [16.4, 96, 24],
    focus: 'Second tray: sugar and cinnamon.', action: 'Sugared churro.', transition: 'Cut, same angle shifted left: reads as the next step on the same counter.' },
  { id: '3.9', part: 3, t: [53.5, 57], type: 'Medium close, from the aisle', cut: true, from: { p: [86, 128, 150], l: [24, 98, 110], f: 30 }, to: { p: [80, 124, 146], l: [24, 98, 110], f: 30 }, ease: 'io', light: [20, 100, 110],
    focus: 'Churro on the Nutella spout.', action: 'Churro on the spout with the filling line on top.', transition: 'Cut.' },
  { id: '3.10', part: 3, t: [57, 60], type: 'Medium close', cut: true, from: { p: [150, 150, 140], l: [134.8, 98, 180], f: 30 }, to: { p: [146, 145, 146], l: [134.8, 98, 180], f: 30 }, ease: 'io', light: [134.8, 98, 180],
    focus: 'Churro on the colorful candies.', action: 'Churro resting on the candies, candies on top.', transition: 'Cut.' },
  { id: '3.11', part: 3, t: [60, 63], type: 'Medium, from outside window 1', cut: true, from: { p: [226, 160, 250], l: [206, 92, 187], f: 24 }, to: { p: [222, 154, 242], l: [206, 92, 187], f: 24 }, ease: 'io',
    focus: 'The finished churro inside its Hola! tray, ticket beside it, at window 1.', action: 'The approved Hola! tray model (artwork from the production die line) with the order inside.', transition: 'Cut back outside: the same window as 3.1.' },
  { id: '3.12', part: 3, t: [63, 66], type: 'Crane up to elevated isometric', to: { p: [430, 520, 460], l: [135, 80, 100], f: 34, pk: 1.02 }, ease: 'io',
    focus: 'The whole kitchen and the path.', action: 'Overhead items hidden (63.2 to 67.4). Dashed line draws from the dough station to window 1 (63.4 to 65.6).', transition: 'Experience first, then the plan.' },
  // ---------------------------------------------------------------- 04 · wide, push, wide at every size; changes only in the wide
  { id: '4.1', part: 4, t: [66, 68], type: 'Descend to the wide', to: W, ease: 'io', focus: 'Kitchen and team of three.', action: 'Rails hidden. Three people fade in (66.6 to 67.2). The dashed line fades (66.0 to 66.8).', transition: 'Continuous from the crane.' },
  { id: '4.2', part: 4, t: [68, 71.5], type: 'Push in', to: { p: [380, 225, 410], l: [150, 100, 110], f: 32 }, ease: 'io', focus: 'Three people covering every station.', action: 'Actions running.', transition: 'Smooth push.' },
  { id: '4.3', part: 4, t: [71.5, 74], type: 'Pull back', to: W, ease: 'io', focus: 'Whole kitchen again.', action: '', transition: 'Back to the wide before the change.' },
  { id: '4.4', part: 4, t: [74, 76], type: 'Wide hold', to: { ...W, p: [552, 326, 606] }, ease: 'io', focus: 'Five people.', action: 'Persons 4 and 5 fade in (74.6 to 75.2), while the camera is wide.', transition: 'Barely moving: the change is the event.' },
  { id: '4.5', part: 4, t: [76, 80], type: 'Push in to the front counter', to: { p: [250, 195, 365], l: [150, 100, 150], f: 32 }, ease: 'io', focus: 'Toppings and handover now separate.', action: 'Actions running.', transition: 'Goes to the split.' },
  { id: '4.6', part: 4, t: [80, 82.5], type: 'Pull back', to: W, ease: 'io', focus: 'Whole kitchen again.', action: '', transition: 'Back to the wide.' },
  { id: '4.7', part: 4, t: [82.5, 84.5], type: 'Wide hold', to: { ...W, p: [552, 326, 606] }, ease: 'io', focus: 'Eight people.', action: 'Persons 6, 7, and 8 fade in and persons 3 and 4 move to their busy spots (83.0 to 83.8).', transition: 'The change happens wide.' },
  { id: '4.8', part: 4, t: [84.5, 92], type: 'Final push-in', to: { p: [395, 238, 425], l: [140, 96, 96], f: 32, pk: 1 }, ease: 'io', focus: 'Eight people in the same 6 m².', action: 'All eight working.', transition: 'Slow and deliberate.' },
  { id: '4.9', part: 4, t: [92, 96], type: 'Final frame', to: { p: [390, 236, 422], l: [140, 96, 96], f: 32, pk: 1 }, ease: 'io', focus: 'Final composition.', action: 'Holds; no loop. Actions run 6 s more, then settle.', transition: 'End.' },
];
// orbit shots: their end point also feeds the next shot's start
for (const s of SHOTS) if (s.orbit) { s.from = { p: polar(s.orbit, 0), l: s.orbit.l, f: s.f, pk: s.pk }; s.to = { p: polar(s.orbit, 1), l: s.orbit.l, f: s.f, pk: s.pk }; }
