/**
 * Tests for the "Final code" of each Low-Level Design page, keyed by page slug.
 * Used by scripts/check-lld.mjs. Each entry:
 *   names  identifiers the final code must define (passed to `run`)
 *   run    async (defs) => void — throws (assert) on failure
 */
import assert from 'node:assert/strict';

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

/** A controllable clock: clock() reads it, clock.advance(ms) moves it. */
function fakeClock(start = 0) {
  let now = start;
  const clock = () => now;
  clock.advance = (ms) => { now += ms; };
  return clock;
}

export const tests = {
  'parking-lot': {
    names: ['VehicleType', 'SpotSize', 'Vehicle', 'ParkingSpot', 'Floor', 'BestFitStrategy', 'HourlyPricing', 'ParkingLot'],
    async run({ VehicleType, SpotSize, Vehicle, ParkingSpot, Floor, BestFitStrategy, HourlyPricing, ParkingLot }) {
      const clock = fakeClock();
      const floors = [
        new Floor(0, [new ParkingSpot('0-S1', SpotSize.Small), new ParkingSpot('0-M1', SpotSize.Medium)]),
        new Floor(1, [new ParkingSpot('1-M1', SpotSize.Medium), new ParkingSpot('1-L1', SpotSize.Large)]),
      ];
      const rates = { [VehicleType.Bike]: 10, [VehicleType.Car]: 20, [VehicleType.Truck]: 50 };
      const lot = new ParkingLot(floors, new BestFitStrategy(), new HourlyPricing(rates), clock);

      const bike = lot.park(new Vehicle('B1', VehicleType.Bike));
      assert.equal(bike.spot.id, '0-S1', 'bike takes the small spot');
      const car = lot.park(new Vehicle('C1', VehicleType.Car));
      assert.equal(car.spot.id, '0-M1', 'car takes the lowest-floor medium spot');
      const bike2 = lot.park(new Vehicle('B2', VehicleType.Bike));
      assert.equal(bike2.spot.id, '1-M1', 'bike falls back to a medium spot when smalls are full');
      assert.deepEqual(lot.availability(), { [SpotSize.Small]: 0, [SpotSize.Medium]: 0, [SpotSize.Large]: 1 });

      assert.throws(() => lot.park(new Vehicle('C1', VehicleType.Car)), /already parked/);
      const car2 = lot.park(new Vehicle('C2', VehicleType.Car));
      assert.equal(car2.spot.id, '1-L1', 'car may use a large spot when mediums are full');
      assert.throws(() => lot.park(new Vehicle('T1', VehicleType.Truck)), /No spot available/);

      clock.advance(2 * HOUR + 30 * MIN);
      const receipt = lot.unpark(car.id);
      assert.equal(receipt.fee, 60, '2.5 h rounds up to 3 h at 20/h');
      assert.equal(receipt.plate, 'C1');
      assert.throws(() => lot.unpark(car.id), /Unknown or used ticket/);

      assert.equal(lot.unpark(bike.id).fee, 30, 'bike: 3 h at 10/h');
      const car3 = lot.park(new Vehicle('C3', VehicleType.Car));
      assert.equal(car3.spot.id, '0-M1', 'freed spot is reused');
      clock.advance(10 * MIN);
      assert.equal(lot.unpark(car3.id).fee, 20, 'minimum one hour');
      clock.advance(60 * MIN);
      const car4 = lot.park(new Vehicle('C4', VehicleType.Car));
      clock.advance(60 * MIN);
      assert.equal(lot.unpark(car4.id).fee, 20, 'exactly one hour is one hour');

      const spot = new ParkingSpot('x', SpotSize.Small);
      assert.throws(() => spot.park(new Vehicle('C9', VehicleType.Car)), /too small/);
      assert.throws(() => spot.release(), /already free/);
    },
  },

  elevator: {
    names: ['Direction', 'Elevator', 'ElevatorSystem', 'NearestCarStrategy'],
    async run({ Direction, Elevator, ElevatorSystem }) {
      const drain = (sys, max = 100) => {
        const seen = [];
        for (let i = 0; i < max; i++) seen.push(...sys.step());
        return seen;
      };

      // LOOK ordering for one elevator
      const e = new Elevator('A', 0, 10);
      const one = new ElevatorSystem([e]);
      for (const f of [5, 2, 8]) one.cabRequest('A', f);
      assert.deepEqual(drain(one).map((a) => a.floor), [2, 5, 8]);
      assert.equal(e.direction, Direction.Idle);
      assert.equal(e.floor, 8);

      // a request behind the moving car is served after the reversal
      const b = new Elevator('B', 0, 10);
      const sysB = new ElevatorSystem([b]);
      sysB.cabRequest('B', 8);
      const order = [];
      for (let i = 0; i < 4; i++) order.push(...sysB.step()); // now at floor 4, heading up
      assert.equal(b.floor, 4);
      sysB.cabRequest('B', 3);
      order.push(...drain(sysB));
      assert.deepEqual(order.map((a) => a.floor), [8, 3]);

      // same-floor request schedules nothing
      sysB.cabRequest('B', 3);
      assert.deepEqual(b.pendingStops, []);

      // dispatch: nearest car
      const low = new Elevator('L', 0, 10, 0);
      const high = new Elevator('H', 0, 10, 10);
      const sys = new ElevatorSystem([low, high]);
      assert.equal(sys.hallCall(9).id, 'H');
      assert.equal(sys.hallCall(1).id, 'L');

      // a car heading away pays for its detour
      const away = new Elevator('W', 0, 20, 5);
      const idle = new Elevator('I', 0, 20, 12);
      const sys2 = new ElevatorSystem([away, idle]);
      sys2.cabRequest('W', 15);
      sys2.step(); // W moves up to 6
      assert.equal(sys2.hallCall(4).id, 'I', 'W must go to 15 and back, I is idle 8 floors away');

      assert.throws(() => sys.cabRequest('A', 3), /Unknown elevator/);
      assert.throws(() => sys.hallCall(11), /out of range/);
      assert.throws(() => new ElevatorSystem([]), /at least one/);
    },
  },

  'vending-machine': {
    names: ['VendingMachine'],
    async run({ VendingMachine }) {
      const m = new VendingMachine();
      m.addProduct('A1', 'Cola', 15, 2);
      m.addProduct('B1', 'Chips', 14, 1);
      m.addProduct('C1', 'Gum', 5, 0);

      assert.throws(() => m.select('A1'), /Insert money first/);
      assert.throws(() => m.insert(3), /Unsupported denomination/);

      // insufficient funds keeps the balance; user can top up
      m.insert(10);
      assert.throws(() => m.select('A1'), /Insufficient funds: 5 more needed/);
      m.insert(5);
      assert.equal(m.balance, 15);
      const r1 = m.select('A1');
      assert.equal(r1.product.name, 'Cola');
      assert.deepEqual(r1.change, []);
      assert.equal(m.balance, 0);
      assert.throws(() => m.select('A1'), /Insert money first/, 'back to idle after dispensing');

      // change that greedy would fail: 6 from {5x1, 2x3}
      m.loadCash(2, 3);
      m.insert(20);
      const r2 = m.select('B1');
      assert.deepEqual(r2.change, [2, 2, 2]);

      // out of stock, unknown product
      m.insert(10);
      assert.throws(() => m.select('C1'), /out of stock/);
      assert.throws(() => m.select('Z9'), /Unknown product/);
      assert.throws(() => m.select('B1'), /out of stock/);
      assert.deepEqual(m.cancel(), [10], 'cancel refunds exactly what was inserted');
      assert.deepEqual(m.cancel(), [], 'cancel when idle refunds nothing');

      // cannot make change
      const m2 = new VendingMachine();
      m2.addProduct('A1', 'Cola', 15, 5);
      m2.insert(20);
      assert.throws(() => m2.select('A1'), /Cannot make change/);
      assert.deepEqual(m2.cancel(), [20]);

      // restock works
      m.restock('C1', 1);
      m.insert(5);
      assert.equal(m.select('C1').product.name, 'Gum');
    },
  },

  'tic-tac-toe': {
    names: ['Mark', 'GameStatus', 'Player', 'Game'],
    async run({ Mark, GameStatus, Player, Game }) {
      const players = () => [new Player('Asha', Mark.X), new Player('Ravi', Mark.O)];

      const row = new Game(players());
      for (const [r, c] of [[0, 0], [1, 0], [0, 1], [1, 1]]) assert.equal(row.play(r, c), GameStatus.InProgress);
      assert.equal(row.play(0, 2), GameStatus.Won);
      assert.equal(row.winner().name, 'Asha');
      assert.throws(() => row.play(2, 2), /Game is over/);

      const anti = new Game(players());
      for (const [r, c] of [[0, 0], [0, 2], [0, 1], [1, 1], [2, 2]]) anti.play(r, c);
      assert.equal(anti.play(2, 0), GameStatus.Won, 'O wins on the anti-diagonal');
      assert.equal(anti.winner().mark, Mark.O);

      const turns = new Game(players());
      assert.equal(turns.currentPlayer().mark, Mark.X);
      turns.play(1, 1);
      assert.throws(() => turns.play(1, 1), /occupied/);
      assert.throws(() => turns.play(3, 0), /off the board/);
      assert.throws(() => turns.play(0.5, 0), /off the board/);
      assert.equal(turns.currentPlayer().mark, Mark.O, 'failed move does not pass the turn');

      // X O X / X O O / O X X -> draw
      const draw = new Game(players());
      const moves = [[0, 0], [0, 1], [0, 2], [1, 1], [1, 0], [1, 2], [2, 1], [2, 0], [2, 2]];
      let status;
      for (const [r, c] of moves) status = draw.play(r, c);
      assert.equal(status, GameStatus.Draw);
      assert.equal(draw.winner(), null);

      // win on the last cell is a win, not a draw: X O X / O X O / O X X
      const last = new Game(players());
      for (const [r, c] of [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1], [2, 0]]) last.play(r, c);
      assert.equal(last.play(2, 2), GameStatus.Won);

      const big = new Game(players(), 4);
      for (const [r, c] of [[0, 0], [1, 0], [1, 1], [2, 0], [2, 2], [3, 1]]) big.play(r, c);
      assert.equal(big.play(3, 3), GameStatus.Won, '4x4 main diagonal');

      assert.throws(() => new Game([new Player('a', Mark.X), new Player('b', Mark.X)]), /different marks/);
    },
  },
  'snake-and-ladder': {
    names: ['Board', 'Player', 'Game', 'RandomDice'],
    async run({ Board, Player, Game, RandomDice }) {
      const scripted = (...rolls) => ({ roll: () => { if (!rolls.length) throw new Error('out of rolls'); return rolls.shift(); } });
      const board = new Board(20, [{ from: 3, to: 12 }, { from: 17, to: 4 }, { from: 14, to: 20 }]);
      const game = new Game(board, [new Player('A'), new Player('B')], scripted(3, 2, 5, 6, 2, 6));

      let t = game.playTurn();
      assert.deepEqual([t.player, t.from, t.to, t.jump], ['A', 0, 12, 'ladder']);
      t = game.playTurn();
      assert.deepEqual([t.player, t.to, t.jump], ['B', 2, null]);
      t = game.playTurn();
      assert.deepEqual([t.player, t.from, t.to, t.jump], ['A', 12, 4, 'snake'], '12+5 = 17 is a snake head');
      t = game.playTurn();
      assert.deepEqual([t.player, t.to], ['B', 8]);
      t = game.playTurn();
      assert.deepEqual([t.player, t.to], ['A', 6]);
      t = game.playTurn();
      assert.deepEqual([t.player, t.to, t.jump, t.won], ['B', 20, 'ladder', true], 'ladder onto the last cell wins');
      assert.equal(game.winner().name, 'B');
      assert.throws(() => game.playTurn(), /Game over/);

      // overshoot: stay put
      const b2 = new Board(10, []);
      const g2 = new Game(b2, [new Player('A'), new Player('B')], scripted(6, 1, 6, 1, 4));
      g2.playTurn(); g2.playTurn();
      t = g2.playTurn();
      assert.deepEqual([t.from, t.to], [6, 6], '6+6 overshoots 10');
      g2.playTurn();
      t = g2.playTurn();
      assert.deepEqual([t.to, t.won], [10, true]);

      // validation
      assert.throws(() => new Board(10, [{ from: 10, to: 2 }]), /last cell/);
      assert.throws(() => new Board(10, [{ from: 2, to: 11 }]), /off the board/);
      assert.throws(() => new Board(10, [{ from: 2, to: 5 }, { from: 2, to: 8 }]), /Two jumps start at 2/);
      assert.throws(() => new Board(10, [{ from: 2, to: 5 }, { from: 5, to: 1 }]), /starts where another jump ends/);
      assert.throws(() => new Board(10, [{ from: 4, to: 4 }]), /goes nowhere/);
      assert.throws(() => new Game(b2, [new Player('A')], scripted()), /at least two/);
      assert.throws(() => new Game(b2, [new Player('A'), new Player('A')], scripted()), /unique/);

      // random dice stays in range and a full game finishes
      let seed = 7;
      const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const dice = new RandomDice(6, rng);
      for (let i = 0; i < 200; i++) { const r = dice.roll(); assert.ok(r >= 1 && r <= 6); }
      const full = new Game(new Board(100, [{ from: 4, to: 56 }, { from: 99, to: 2 }]), [new Player('A'), new Player('B')], dice);
      assert.ok(['A', 'B'].includes(full.playToEnd().name));
    },
  },

  splitwise: {
    names: ['ExpenseManager', 'SplitType'],
    async run({ ExpenseManager, SplitType }) {
      const m = new ExpenseManager();
      for (const id of ['a', 'b', 'c', 'd']) m.addUser(id, id.toUpperCase());
      assert.throws(() => m.addUser('a', 'dup'), /already exists/);

      const e = m.addExpense({ description: 'Dinner', paidBy: 'a', amount: 10000, participants: ['a', 'b', 'c'], split: SplitType.Equal });
      assert.deepEqual([...e.shares.values()], [3334, 3333, 3333], 'leftover paisa goes to the first participant');
      assert.equal(m.balanceOf('a'), 6666);
      assert.equal(m.balanceOf('b'), -3333);
      assert.deepEqual(m.debts(), [{ from: 'b', to: 'a', amount: 3333 }, { from: 'c', to: 'a', amount: 3333 }]);

      // netting: b pays for a, a's debt to b cancels against b's debt to a
      m.addExpense({ description: 'Cab', paidBy: 'b', amount: 2000, participants: ['a'], split: SplitType.Exact, values: [2000] });
      assert.deepEqual(m.debts().filter((d) => d.to === 'a' && d.from === 'b'), [{ from: 'b', to: 'a', amount: 1333 }]);

      m.addExpense({ description: 'Tickets', paidBy: 'd', amount: 1000, participants: ['c', 'd'], split: SplitType.Percent, values: [25, 75] });
      assert.equal(m.balanceOf('d'), 250);

      // balances always sum to zero
      const total = ['a', 'b', 'c', 'd'].reduce((s, u) => s + m.balanceOf(u), 0);
      assert.equal(total, 0);

      // simplify settles everyone with at most n - 1 payments
      const plan = m.simplify();
      assert.ok(plan.length <= 3);
      const after = new Map(['a', 'b', 'c', 'd'].map((u) => [u, m.balanceOf(u)]));
      for (const p of plan) { after.set(p.from, after.get(p.from) + p.amount); after.set(p.to, after.get(p.to) - p.amount); }
      for (const v of after.values()) assert.equal(v, 0);

      // settle
      m.settle('b', 'a', 1333);
      assert.equal(m.debts().some((d) => d.from === 'b' && d.to === 'a'), false);
      assert.throws(() => m.settle('b', 'a', 1), /only owes a 0/);

      // validation
      const bad = (input) => () => m.addExpense({ description: 'x', paidBy: 'a', amount: 1000, participants: ['a', 'b'], split: SplitType.Equal, ...input });
      assert.throws(bad({ split: SplitType.Exact, values: [500, 400] }), /add up to the total/);
      assert.throws(bad({ split: SplitType.Percent, values: [50, 40] }), /add up to 100/);
      assert.throws(bad({ amount: 10.5 }), /positive number of paise/);
      assert.throws(bad({ participants: ['a', 'z'] }), /Unknown user z/);
      assert.throws(bad({ participants: ['a', 'a'] }), /Duplicate participants/);
      assert.throws(bad({ participants: [] }), /needs participants/);
    },
  },

  'movie-ticket-booking': {
    names: ['BookingService', 'Movie', 'Screen', 'Seat', 'Show', 'SeatCategory', 'BookingStatus'],
    async run({ BookingService, Movie, Screen, Seat, Show, SeatCategory, BookingStatus }) {
      const clock = fakeClock(1_000);
      let paymentOk = true;
      const charges = [];
      const gateway = { charge: (u, amt) => { charges.push([u, amt]); return paymentOk; } };
      const svc = new BookingService(gateway, clock, 8 * MIN);
      const screen = new Screen('S1', [
        new Seat('A1', SeatCategory.Regular), new Seat('A2', SeatCategory.Regular), new Seat('P1', SeatCategory.Premium),
      ]);
      svc.addShow(new Show('show1', new Movie('m1', 'Dune'), screen, 10 * HOUR, { REGULAR: 200, PREMIUM: 350 }));
      assert.deepEqual(svc.availableSeats('show1'), ['A1', 'A2', 'P1']);

      const h1 = svc.holdSeats('show1', 'u1', ['A1', 'P1']);
      assert.equal(h1.amount, 550);
      assert.deepEqual(svc.availableSeats('show1'), ['A2']);

      // all-or-nothing: A2 must stay free when P1 is taken
      assert.throws(() => svc.holdSeats('show1', 'u2', ['A2', 'P1']), /P1 is not available/);
      assert.deepEqual(svc.availableSeats('show1'), ['A2']);

      // payment failure keeps the hold
      paymentOk = false;
      assert.throws(() => svc.confirm(h1.id), /Payment failed/);
      paymentOk = true;
      const b1 = svc.confirm(h1.id);
      assert.equal(b1.status, BookingStatus.Confirmed);
      assert.deepEqual(charges.at(-1), ['u1', 550]);
      assert.throws(() => svc.confirm(h1.id), /Unknown hold/);

      // expiry frees seats and blocks confirmation
      const h2 = svc.holdSeats('show1', 'u2', ['A2']);
      clock.advance(8 * MIN);
      assert.deepEqual(svc.availableSeats('show1'), ['A2']);
      const h3 = svc.holdSeats('show1', 'u3', ['A2']);
      assert.throws(() => svc.confirm(h2.id), /Hold expired/);
      svc.releaseHold(h2.id); // no-op, must not free u3's seat
      assert.deepEqual(svc.availableSeats('show1'), []);
      svc.releaseHold(h3.id);
      assert.deepEqual(svc.availableSeats('show1'), ['A2']);

      // cancel frees booked seats
      svc.cancel(b1.id);
      assert.deepEqual(svc.availableSeats('show1').sort(), ['A1', 'A2', 'P1']);
      assert.throws(() => svc.cancel(b1.id), /already cancelled/);

      assert.throws(() => svc.holdSeats('show1', 'u', []), /at least one/);
      assert.throws(() => svc.holdSeats('show1', 'u', ['A1', 'A1']), /Duplicate/);
      assert.throws(() => svc.holdSeats('show1', 'u', ['Z9']), /does not exist/);
      assert.throws(() => svc.holdSeats('nope', 'u', ['A1']), /Unknown show/);
      clock.advance(10 * HOUR);
      assert.throws(() => svc.holdSeats('show1', 'u', ['A1']), /already started/);
    },
  },

  'cache-eviction': {
    names: ['Cache', 'LRUPolicy', 'LFUPolicy'],
    async run({ Cache, LRUPolicy, LFUPolicy }) {
      const lru = new Cache(2, new LRUPolicy());
      lru.put('a', 1); lru.put('b', 2);
      assert.equal(lru.get('a'), 1);            // a is now most recent
      lru.put('c', 3);                          // evicts b
      assert.equal(lru.get('b'), undefined);
      assert.equal(lru.get('a'), 1);
      lru.put('a', 10);                         // update, no eviction
      assert.equal(lru.size, 2);
      lru.put('d', 4);                          // evicts c
      assert.equal(lru.get('c'), undefined);
      assert.equal(lru.get('a'), 10);
      assert.equal(lru.delete('a'), true);
      assert.equal(lru.delete('a'), false);
      lru.put('e', 5); lru.put('f', 6);         // d evicted
      assert.equal(lru.get('d'), undefined);

      const lfu = new Cache(2, new LFUPolicy());
      lfu.put('a', 1); lfu.put('b', 2);
      lfu.get('a'); lfu.get('a');               // a freq 3, b freq 1
      lfu.put('c', 3);                          // evicts b
      assert.equal(lfu.get('b'), undefined);
      lfu.put('d', 4);                          // c (freq 1) evicted, not a
      assert.equal(lfu.get('c'), undefined);
      assert.equal(lfu.get('a'), 1);

      const tie = new Cache(2, new LFUPolicy());
      tie.put('x', 1); tie.put('y', 2);
      tie.get('x'); tie.get('y');               // both freq 2; x is older
      tie.put('z', 3);
      assert.equal(tie.get('x'), undefined, 'LFU tie breaks by least recent');
      assert.equal(tie.get('y'), 2);

      const del = new Cache(3, new LFUPolicy());
      del.put('p', 1); del.put('q', 2); del.put('r', 3);
      del.get('q'); del.get('r');               // p:1, q:2, r:2
      del.delete('p');                          // minFreq must move to 2
      del.put('s', 4);                          // s:1, minFreq 1
      del.get('s'); del.get('s');               // s:3
      del.put('t', 5);                          // evict q (freq 2, older than r)
      assert.equal(del.get('q'), undefined);
      assert.equal(del.get('r'), 3);

      const one = new Cache(1);
      one.put(1, 'x'); one.put(2, 'y');
      assert.equal(one.get(1), undefined);
      assert.equal(one.get(2), 'y');
      assert.throws(() => new Cache(0), /positive integer/);
    },
  },
  'lld-rate-limiter': {
    names: ['TokenBucketLimiter', 'FixedWindowLimiter', 'SlidingWindowLogLimiter', 'TieredRateLimiter'],
    async run({ TokenBucketLimiter, FixedWindowLimiter, SlidingWindowLogLimiter, TieredRateLimiter }) {
      const clock = fakeClock(10_000);
      const tb = new TokenBucketLimiter(3, 1, clock); // burst 3, 1 token/s
      assert.deepEqual([1, 2, 3, 4].map(() => tb.allow('u')), [true, true, true, false]);
      assert.equal(tb.allow('other'), true, 'keys are independent');
      clock.advance(1000);
      assert.equal(tb.allow('u'), true);
      assert.equal(tb.allow('u'), false);
      clock.advance(60_000);
      assert.deepEqual([1, 2, 3, 4].map(() => tb.allow('u')), [true, true, true, false], 'refill caps at capacity');

      const fw = new FixedWindowLimiter(2, 1000, clock); // clock at 71_000: window boundary
      assert.deepEqual([fw.allow('k'), fw.allow('k'), fw.allow('k')], [true, true, false]);
      clock.advance(999);
      assert.equal(fw.allow('k'), false);
      clock.advance(1);
      assert.equal(fw.allow('k'), true, 'new window');

      const sw = new SlidingWindowLogLimiter(2, 1000, clock);
      assert.equal(sw.allow('k'), true);
      clock.advance(500);
      assert.equal(sw.allow('k'), true);
      assert.equal(sw.allow('k'), false);
      clock.advance(500);
      assert.equal(sw.allow('k'), true, 'first request has left the window');
      assert.equal(sw.allow('k'), false);

      const tiers = new TieredRateLimiter(new Map([['free', new FixedWindowLimiter(1, 1000, clock)], ['pro', new FixedWindowLimiter(3, 1000, clock)]]));
      assert.deepEqual([tiers.allow('a', 'free'), tiers.allow('a', 'free')], [true, false]);
      assert.deepEqual([tiers.allow('b', 'pro'), tiers.allow('b', 'pro'), tiers.allow('b', 'pro')], [true, true, true]);
      assert.throws(() => tiers.allow('c', 'gold'), /No rate limit configured/);
      assert.throws(() => new TokenBucketLimiter(0, 1), /Invalid/);
    },
  },

  logger: {
    names: ['LogManager', 'LogLevel', 'MemoryAppender', 'JsonFormatter', 'TextFormatter'],
    async run({ LogManager, LogLevel, MemoryAppender, JsonFormatter }) {
      LogManager.reset();
      const mem = new MemoryAppender(LogLevel.Debug);
      const errorsOnly = new MemoryAppender(LogLevel.Error, new JsonFormatter());
      const broken = { level: LogLevel.Debug, append() { throw new Error('disk full'); } };
      const manager = LogManager.getInstance();
      manager.configure({ level: LogLevel.Info, clock: () => Date.UTC(2026, 0, 2, 3, 4, 5), appenders: () => [broken, mem, errorsOnly] });
      assert.equal(LogManager.getInstance(), manager, 'singleton');

      const log = manager.getLogger('payments');
      assert.equal(manager.getLogger('payments'), log, 'same logger per name');
      log.debug('hidden');
      log.info('charged', { orderId: 42 });
      log.error('refund failed');
      assert.deepEqual(mem.lines, [
        '2026-01-02T03:04:05.000Z INFO [payments] charged {"orderId":42}',
        '2026-01-02T03:04:05.000Z ERROR [payments] refund failed',
      ]);
      assert.deepEqual(errorsOnly.lines.map((l) => JSON.parse(l)), [
        { ts: '2026-01-02T03:04:05.000Z', level: 'error', logger: 'payments', msg: 'refund failed' },
      ]);
      assert.equal(log.failures, 2, 'broken appender is isolated and counted');

      log.level = LogLevel.Debug;
      log.debug('now visible');
      assert.match(mem.lines.at(-1), /DEBUG \[payments\] now visible/);

      LogManager.reset();
      assert.notEqual(LogManager.getInstance(), manager);
    },
  },

  'pub-sub': {
    names: ['Broker'],
    async run({ Broker }) {
      const b = new Broker(() => 0, 2);
      b.createTopic('orders');
      assert.throws(() => b.createTopic('orders'), /already exists/);
      assert.throws(() => b.publish('nope', 1), /Unknown topic/);

      b.publish('orders', 'early');
      const billing = [];
      const shipA = [];
      const shipB = [];
      b.subscribe('orders', 'billing', (m) => billing.push(m.payload), { fromBeginning: true });
      assert.deepEqual(billing, ['early'], 'replay from beginning');
      b.subscribe('orders', 'shipping', (m) => shipA.push(m.payload));
      const unsubB = b.subscribe('orders', 'shipping', (m) => shipB.push(m.payload));
      for (const p of ['o1', 'o2', 'o3', 'o4']) b.publish('orders', p);
      assert.deepEqual(billing, ['early', 'o1', 'o2', 'o3', 'o4'], 'every group gets every message');
      assert.deepEqual([...shipA, ...shipB].sort(), ['o1', 'o2', 'o3', 'o4'], 'group members share the work');
      assert.equal(shipA.length, 2);
      assert.equal(shipB.length, 2);
      assert.ok(!shipA.includes('early'), 'new group starts at latest by default');

      // group with no members keeps its offset and catches up on rejoin
      unsubB();
      const unsubA = b.subscribe('orders', 'audit', () => {}); // unrelated group
      unsubA();
      const shipping = b.offset('orders', 'shipping');
      b.publish('orders', 'o5');
      assert.equal(shipA.at(-1), 'o5');
      assert.equal(b.offset('orders', 'shipping'), shipping + 1);
      b.publish('orders', 'o6');
      const late = [];
      b.subscribe('orders', 'audit', (m) => late.push(m.payload));
      assert.deepEqual(late, ['o5', 'o6'], 'rejoining group catches up from its offset');

      // retries then dead letter
      b.createTopic('emails');
      let calls = 0;
      b.subscribe('emails', 'sender', (m) => { calls++; if (m.payload === 'bad') throw new Error('boom'); });
      b.publish('emails', 'bad');
      b.publish('emails', 'good');
      assert.equal(calls, 3, '2 attempts for bad, 1 for good');
      assert.deepEqual(b.deadLetters('emails', 'sender').map((m) => m.payload), ['bad']);

      // a handler that publishes does not cause duplicate delivery
      b.createTopic('chain');
      const seen = [];
      b.subscribe('chain', 'g', (m) => { seen.push(m.payload); if (m.payload < 3) b.publish('chain', m.payload + 1); });
      b.publish('chain', 1);
      assert.deepEqual(seen, [1, 2, 3]);
    },
  },

  'library-management': {
    names: ['Library', 'Book', 'Member', 'PerDayFine', 'CopyStatus'],
    async run({ Library, Book, Member, PerDayFine, CopyStatus }) {
      const DAY = 24 * HOUR;
      const clock = fakeClock(0);
      const lib = new Library(new PerDayFine(10, 50), clock);
      const [c1] = lib.addBook(new Book('111', 'Clean Code', 'Robert Martin'), 1);
      lib.addBook(new Book('222', 'Refactoring', 'Martin Fowler'), 2);
      lib.addMember(new Member('asha', 'Asha', 2));
      lib.addMember(new Member('ravi', 'Ravi'));
      lib.addMember(new Member('meera', 'Meera'));

      assert.deepEqual(lib.search('martin').map((b) => b.isbn).sort(), ['111', '222']);
      assert.deepEqual(lib.search('REFACT').map((b) => b.isbn), ['222']);

      const loan = lib.borrow('asha', '111');
      assert.equal(loan.dueAt, 14 * DAY);
      assert.throws(() => lib.borrow('ravi', '111'), /reserve/);
      assert.throws(() => lib.reserve('ravi', '222'), /borrow it instead/);
      assert.equal(lib.reserve('ravi', '111'), 1);
      assert.equal(lib.reserve('meera', '111'), 2);
      assert.throws(() => lib.reserve('ravi', '111'), /Already reserved/);

      lib.borrow('asha', '222');
      assert.throws(() => lib.borrow('asha', '222'), /Loan limit of 2/);

      // late return: 3 days late -> 30
      clock.advance(17 * DAY);
      assert.equal(lib.returnCopy(c1), 30);
      assert.deepEqual(lib.copyStatus(c1), { status: CopyStatus.OnHold, heldFor: 'ravi' });
      assert.throws(() => lib.borrow('asha', '111'), /outstanding fine/);
      lib.payFine('asha', 30);
      assert.throws(() => lib.borrow('meera', '111'), /No copy available/, 'held for ravi');

      // ravi never collects; hold passes to meera after 3 days
      clock.advance(3 * DAY);
      const mLoan = lib.borrow('meera', '111');
      assert.equal(mLoan.copyId, c1);

      // on-time return, fine cap, unknown copy
      clock.advance(14 * DAY);
      assert.equal(lib.returnCopy(c1), 0, 'returned on the due date');
      assert.deepEqual(lib.copyStatus(c1), { status: CopyStatus.Available, heldFor: null });
      lib.borrow('ravi', '111');
      clock.advance(40 * DAY);
      assert.equal(lib.returnCopy(c1), 50, 'fine is capped');
      assert.throws(() => lib.returnCopy(c1), /not on loan/);
      assert.throws(() => lib.payFine('ravi', 60), /Invalid payment/);
      assert.throws(() => lib.borrow('ghost', '111'), /Unknown member/);
      assert.throws(() => lib.addMember(new Member('asha', 'dup')), /already exists/);
    },
  },
  atm: {
    names: ['ATM', 'Card', 'NoteDispenser'],
    async run({ ATM, Card, NoteDispenser }) {
      const accounts = new Map([['1111', { pin: '1234', balance: 50_000 }], ['2222', { pin: '0000', balance: 300 }]]);
      const bank = {
        verifyPin: (n, pin) => accounts.get(n)?.pin === pin,
        balance: (n) => accounts.get(n).balance,
        debit: (n, amt) => { const a = accounts.get(n); if (a.balance < amt) return false; a.balance -= amt; return true; },
      };
      const chain = () => new NoteDispenser(2000, 2, new NoteDispenser(500, 1, new NoteDispenser(200, 3, new NoteDispenser(100, 0))));
      const atm = new ATM(bank, chain());

      assert.throws(() => atm.enterPin('1234'), /Insert a card first/);
      assert.throws(() => atm.withdraw(100), /Insert a card first/);
      atm.insertCard(new Card('1111'));
      assert.throws(() => atm.insertCard(new Card('2222')), /already inserted/);
      assert.throws(() => atm.balance(), /Enter your PIN first/);
      assert.throws(() => atm.enterPin('9999'), /2 attempts left/);
      atm.enterPin('1234');
      assert.equal(atm.balance(), 50_000);

      // 600 = 200 x 3 (greedy would take the 500 and get stuck)
      const plan = atm.withdraw(600);
      assert.deepEqual(Object.fromEntries(plan), { 200: 3 });
      assert.equal(accounts.get('1111').balance, 49_400);
      assert.deepEqual(atm.cashStock(), { 2000: 2, 500: 1, 200: 0, 100: 0 });

      // cannot dispense -> not debited
      assert.throws(() => atm.withdraw(300), /cannot dispense/);
      assert.equal(accounts.get('1111').balance, 49_400);
      assert.throws(() => atm.withdraw(150), /multiple of 100/);
      assert.throws(() => atm.withdraw(25_000), /Maximum/);
      assert.deepEqual(Object.fromEntries(atm.withdraw(4500)), { 2000: 2, 500: 1 });
      atm.ejectCard();
      assert.throws(() => atm.ejectCard(), /No card/);

      // bank declines -> notes untouched
      const atm2 = new ATM(bank, chain());
      atm2.insertCard(new Card('2222'));
      atm2.enterPin('0000');
      assert.throws(() => atm2.withdraw(2000), /Insufficient funds/);
      assert.deepEqual(atm2.cashStock(), { 2000: 2, 500: 1, 200: 3, 100: 0 });
      atm2.ejectCard();

      // three wrong PINs retain the card
      atm2.insertCard(new Card('2222'));
      assert.throws(() => atm2.enterPin('1'), /2 attempts left/);
      assert.throws(() => atm2.enterPin('2'), /1 attempts left/);
      assert.throws(() => atm2.enterPin('3'), /card retained/);
      assert.equal(atm2.retainedCards.length, 1);
      assert.throws(() => atm2.balance(), /Insert a card first/);
    },
  },

  chess: {
    names: ['Game', 'Board', 'GameStatus', 'Color', 'King', 'Queen', 'Pawn'],
    async run({ Game, Board, GameStatus, Color, King, Queen, Pawn }) {
      // Fool's mate
      const fool = new Game();
      assert.equal(fool.move('f2', 'f3'), GameStatus.InProgress);
      fool.move('e7', 'e5');
      fool.move('g2', 'g4');
      assert.equal(fool.move('d8', 'h4'), GameStatus.Checkmate);
      assert.throws(() => fool.move('a2', 'a3'), /Game is over/);

      const g = new Game();
      assert.throws(() => g.move('e7', 'e5'), /WHITE's turn/);
      assert.throws(() => g.move('e3', 'e4'), /No piece on e3/);
      assert.throws(() => g.move('e2', 'e5'), /Illegal/);
      assert.throws(() => g.move('a1', 'a3'), /Illegal/, 'rook blocked by pawn');
      assert.throws(() => g.move('b1', 'd2'), /Illegal/, 'knight onto own piece');
      g.move('e2', 'e4');
      g.move('e7', 'e5');
      assert.equal(g.move('d1', 'h5'), GameStatus.InProgress);
      assert.throws(() => g.move('f7', 'f6'), /Illegal/, 'f7 is pinned against the king');
      g.move('b8', 'c6');
      g.move('f1', 'c4');
      g.move('g8', 'f6');
      assert.equal(g.move('h5', 'f7'), GameStatus.Checkmate, "scholar's mate");
      assert.equal(g.pieceAt('f7'), 'wQ');

      // check, not mate
      const c = new Game();
      c.move('e2', 'e4'); c.move('f7', 'f6');
      assert.equal(c.move('d1', 'h5'), GameStatus.Check);
      assert.throws(() => c.move('a7', 'a6'), /Illegal/, 'must answer check');
      c.move('g7', 'g6');

      // pawn rules
      const p = new Game();
      p.move('a2', 'a4');
      p.move('a7', 'a5');
      assert.throws(() => p.move('a4', 'a5'), /Illegal/, 'pawn cannot capture straight');
      assert.throws(() => p.move('a4', 'a6'), /Illegal/, 'double step only from start');

      // stalemate and promotion on custom boards
      const sq = (s) => ({ row: Number(s[1]) - 1, col: s.charCodeAt(0) - 97 });
      const sb = new Board();
      sb.set(sq('a8'), new King(Color.Black));
      sb.set(sq('h1'), new King(Color.White));
      sb.set(sq('c1'), new Queen(Color.White));
      assert.equal(new Game(sb).move('c1', 'c7'), GameStatus.Stalemate);

      const pb = new Board();
      pb.set(sq('a7'), new Pawn(Color.White));
      pb.set(sq('e1'), new King(Color.White));
      pb.set(sq('h8'), new King(Color.Black));
      const pg = new Game(pb);
      assert.equal(pg.move('a7', 'a8'), GameStatus.Check);
      assert.equal(pg.pieceAt('a8'), 'wQ');
    },
  },

  'ride-sharing': {
    names: ['RideService', 'Rider', 'Driver', 'NearestDriverStrategy', 'DistanceFareStrategy', 'VehicleType', 'RideStatus'],
    async run({ RideService, Rider, Driver, NearestDriverStrategy, DistanceFareStrategy, VehicleType, RideStatus }) {
      let surge = 1;
      const rates = { BIKE: { base: 20, perKm: 5 }, AUTO: { base: 30, perKm: 10 }, SEDAN: { base: 50, perKm: 15 } };
      const svc = new RideService(new NearestDriverStrategy(5), new DistanceFareStrategy(rates, () => surge));
      svc.registerRider(new Rider('r1', 'Asha'));
      svc.registerRider(new Rider('r2', 'Ravi'));
      const near = new Driver('d1', 'Near', VehicleType.Sedan, { x: 1, y: 0 });
      const far = new Driver('d2', 'Far', VehicleType.Sedan, { x: 3, y: 0 });
      const bike = new Driver('d3', 'Bike', VehicleType.Bike, { x: 0, y: 1 });
      const tooFar = new Driver('d4', 'Remote', VehicleType.Auto, { x: 50, y: 50 });
      for (const d of [near, far, bike, tooFar]) svc.registerDriver(d);

      const ride = svc.requestRide('r1', { x: 0, y: 0 }, { x: 0, y: 4 }, VehicleType.Sedan);
      assert.equal(ride.driver.id, 'd1');
      assert.equal(near.available, false);
      assert.throws(() => svc.requestRide('r1', { x: 0, y: 0 }, { x: 1, y: 1 }, VehicleType.Bike), /active ride/);
      const ride2 = svc.requestRide('r2', { x: 0, y: 0 }, { x: 3, y: 4 }, VehicleType.Sedan);
      assert.equal(ride2.driver.id, 'd2', 'nearest driver is busy, next nearest assigned');
      assert.throws(() => svc.requestRide('r3', { x: 0, y: 0 }, { x: 1, y: 1 }, VehicleType.Auto), /Unknown rider/);
      svc.registerRider(new Rider('r3', 'Meera'));
      assert.throws(() => svc.requestRide('r3', { x: 0, y: 0 }, { x: 1, y: 1 }, VehicleType.Auto), /No AUTO available/);

      assert.throws(() => svc.completeRide(ride.id), /Cannot complete a ride that is ASSIGNED/);
      svc.startRide(ride.id);
      assert.throws(() => svc.cancelRide(ride.id), /from STARTED to CANCELLED/);
      surge = 1.5;
      assert.equal(svc.completeRide(ride.id), 165, '(50 + 15 * 4) * 1.5');
      assert.equal(near.available, true);
      assert.deepEqual(near.location, { x: 0, y: 4 });
      assert.throws(() => svc.startRide(ride.id), /from COMPLETED/);

      svc.rateDriver(ride.id, 5);
      assert.throws(() => svc.rateDriver(ride.id, 4), /already rated/);
      assert.equal(near.rating(), 5);

      svc.cancelRide(ride2.id);
      assert.equal(ride2.status, RideStatus.Cancelled);
      assert.equal(far.available, true);
      assert.throws(() => svc.rateDriver(ride2.id, 3), /Only completed/);
      const again = svc.requestRide('r2', { x: 0, y: 0 }, { x: 0, y: 3 }, VehicleType.Bike);
      assert.equal(again.driver.id, 'd3', 'rider can book again after cancelling');
      svc.startRide(again.id);
      surge = 1;
      assert.equal(svc.completeRide(again.id), 35);
      assert.throws(() => svc.rateDriver(again.id, 6), /1 to 5/);
    },
  },

  'file-system': {
    names: ['FileSystem'],
    async run({ FileSystem }) {
      const fs = new FileSystem();
      fs.mkdir('/docs');
      assert.throws(() => fs.mkdir('/docs'), /already exists/);
      assert.throws(() => fs.mkdir('/a/b/c'), /Parent of \/a\/b\/c does not exist/);
      fs.mkdir('/a/b/c', true);
      fs.mkdir('/a/b', true); // no-op
      fs.writeFile('/docs/notes.txt', 'hello');
      fs.writeFile('/docs/notes.txt', ' world', true);
      assert.equal(fs.readFile('/docs/notes.txt'), 'hello world');
      fs.writeFile('/a/b/c/x.txt', '12345');
      fs.writeFile('/a/./b/../y.txt', 'abc');
      assert.deepEqual(fs.ls('/a'), ['b', 'y.txt']);
      assert.deepEqual(fs.ls('/docs/notes.txt'), ['notes.txt']);
      assert.deepEqual(fs.ls('/'), ['a', 'docs']);
      assert.deepEqual(fs.ls('/..'), ['a', 'docs'], '.. at root stays at root');
      assert.equal(fs.size('/a'), 8);
      assert.equal(fs.size('/'), 19);

      assert.throws(() => fs.readFile('/a'), /is a directory/);
      assert.throws(() => fs.writeFile('/a/b', 'x'), /is a directory/);
      assert.throws(() => fs.writeFile('/docs/notes.txt/z', 'x'), /is not a directory/);
      assert.throws(() => fs.mkdir('/docs/notes.txt/sub', true), /is a file/);
      assert.throws(() => fs.readFile('/nope'), /No such file/);
      assert.throws(() => fs.ls('relative'), /must be absolute/);

      assert.throws(() => fs.mv('/a', '/a/b/inside'), /into itself/);
      assert.throws(() => fs.mv('/a/y.txt', '/docs/notes.txt'), /already exists/);
      fs.mv('/a/b', '/docs/b2');
      assert.deepEqual(fs.ls('/docs'), ['b2', 'notes.txt']);
      assert.equal(fs.readFile('/docs/b2/c/x.txt'), '12345');
      assert.equal(fs.size('/a'), 3);

      assert.throws(() => fs.rm('/docs'), /not empty/);
      fs.rm('/docs/b2', true);
      assert.deepEqual(fs.ls('/docs'), ['notes.txt']);
      fs.rm('/a/y.txt');
      fs.rm('/a');
      assert.deepEqual(fs.ls('/'), ['docs']);
      assert.throws(() => fs.rm('/'), /root/);
    },
  },

  'shopping-cart': {
    names: ['Product', 'Inventory', 'Cart', 'PricingEngine', 'CheckoutService', 'CategoryPercentOff', 'BuyXGetYFree', 'FlatOffAboveMinimum'],
    async run({ Product, Inventory, Cart, PricingEngine, CheckoutService, CategoryPercentOff, BuyXGetYFree, FlatOffAboveMinimum }) {
      const phone = new Product('p1', 'Phone', 150_000, 'electronics');
      const socks = new Product('p2', 'Socks', 20_000, 'apparel');
      const inv = new Inventory();
      inv.setStock('p1', 2);
      inv.setStock('p2', 10);
      const pricing = new PricingEngine(
        [new CategoryPercentOff('electronics', 10), new BuyXGetYFree('p2', 2, 1)],
        new Map([['SAVE200', new FlatOffAboveMinimum(20_000, 200_000)], ['BIG', new FlatOffAboveMinimum(500_000, 1_000_000)]]),
      );
      const checkout = new CheckoutService(inv, pricing);

      const cart = new Cart(inv);
      cart.add(phone);
      cart.add(socks, 5);
      assert.throws(() => cart.add(phone, 2), /Only 2 of Phone available/);
      assert.throws(() => cart.setQuantity(socks, 1.5), /whole number/);

      let price = pricing.price(cart);
      assert.equal(price.subtotal, 250_000);
      assert.deepEqual(price.discounts, [
        { label: '10% off electronics', amount: 15_000 },
        { label: 'Buy 2 get 1 free', amount: 20_000 },
      ]);
      assert.equal(price.total, 215_000);

      assert.throws(() => checkout.applyCoupon(cart, 'NOPE'), /not valid/);
      assert.throws(() => checkout.applyCoupon(cart, 'BIG'), /not eligible/);
      checkout.applyCoupon(cart, 'SAVE200');
      price = pricing.price(cart);
      assert.deepEqual(price.discounts.at(-1), { label: 'Coupon SAVE200', amount: 20_000 });
      assert.equal(price.total, 195_000);

      // coupon becomes ineligible when items are removed: contributes 0
      cart.setQuantity(socks, 0);
      price = pricing.price(cart);
      assert.equal(price.total, 135_000);
      assert.equal(price.discounts.length, 1);

      // stock drops before checkout -> nothing reserved
      cart.add(socks, 3);
      inv.setStock('p2', 2);
      assert.throws(() => checkout.checkout(cart), /Only 2 of Socks left/);
      assert.equal(inv.available('p1'), 2, 'phone stock untouched');
      cart.setQuantity(socks, 2);
      const order = checkout.checkout(cart);
      assert.equal(order.price.total, 135_000 + 40_000);
      assert.equal(inv.available('p1'), 1);
      assert.equal(inv.available('p2'), 0);
      assert.deepEqual(cart.items(), []);
      assert.throws(() => checkout.checkout(cart), /empty/);

      // discount never exceeds the remaining total
      const cheap = new Product('p3', 'Sticker', 100, 'misc');
      inv.setStock('p3', 5);
      const tiny = new Cart(inv);
      tiny.add(cheap);
      const greedy = new PricingEngine([new FlatOffAboveMinimum(10_000, 0)], new Map());
      assert.equal(greedy.price(tiny).total, 0);
    },
  },
};
