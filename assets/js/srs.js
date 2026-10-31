// FSRS boundary. Application code should use SRS instead of ts-fsrs directly.
const SRS = (function () {
  let library = window.FSRS;
  if (!library || typeof library.fsrs !== 'function') {
    console.warn('[SRS] ts-fsrs library not available, initializing safe fallback scheduler.');
    library = {
      Rating: { Again: 1, Hard: 2, Good: 3, Easy: 4 },
      State: { New: 0, Learning: 1, Review: 2, Relearning: 3 },
      fsrs: () => ({
        repeat: (card, now) => {
          const t = (now instanceof Date ? now : new Date()).getTime();
          return {
            1: { card: { ...card, due: new Date(t + 60000), state: 1 }, log: { rating: 1, elapsed_days: 0, scheduled_days: 0, review: new Date(t), state: 1 } },
            2: { card: { ...card, due: new Date(t + 120000), state: 1 }, log: { rating: 2, elapsed_days: 0, scheduled_days: 0, review: new Date(t), state: 1 } },
            3: { card: { ...card, due: new Date(t + 86400000), state: 2 }, log: { rating: 3, elapsed_days: 0, scheduled_days: 1, review: new Date(t), state: 2 } },
            4: { card: { ...card, due: new Date(t + 172800000), state: 2 }, log: { rating: 4, elapsed_days: 0, scheduled_days: 2, review: new Date(t), state: 2 } },
          };
        },
        createEmptyCard: (now) => ({ due: now instanceof Date ? now : new Date(), state: 0 }),
      }),
    };
  }

  const RATINGS = {
    again: library.Rating.Again,
    hard: library.Rating.Hard,
    good: library.Rating.Good,
    easy: library.Rating.Easy,
  };
  const RATING_NAMES = {
    [RATINGS.again]: 'again',
    [RATINGS.hard]: 'hard',
    [RATINGS.good]: 'good',
    [RATINGS.easy]: 'easy',
  };
  const DEFAULT_RETENTION = 0.9;

  function normalizeRetention(value) {
    const retention = Number(value);
    return Number.isFinite(retention)
      ? Math.min(0.97, Math.max(0.8, retention))
      : DEFAULT_RETENTION;
  }

  function scheduler(retention) {
    return library.fsrs({
      request_retention: normalizeRetention(retention),
      enable_fuzz: true,
    });
  }

  function parseDate(value) {
    if (value instanceof Date) return new Date(value.getTime());
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (Number.isFinite(date.getTime())) return date;
    }
    return null;
  }

  function deserializeCard(value) {
    if (!value || typeof value !== 'object') return null;
    const card = { ...value };
    card.due = parseDate(card.due);
    card.last_review = card.last_review == null ? undefined : parseDate(card.last_review);
    if (!card.due || (value.last_review != null && !card.last_review)) return null;
    return card;
  }

  function serializeCard(value) {
    const card = deserializeCard(value);
    if (!card) return null;
    return {
      ...card,
      due: card.due.toISOString(),
      last_review: card.last_review ? card.last_review.toISOString() : null,
    };
  }

  function createNewCard(now) {
    return serializeCard(library.createEmptyCard(parseDate(now) || new Date()));
  }

  function review(cardValue, ratingName, now, retention) {
    const card = deserializeCard(cardValue);
    const rating = RATINGS[ratingName];
    if (!card) throw new Error('Thẻ FSRS không hợp lệ.');
    if (rating === undefined) throw new Error('Mức đánh giá FSRS không hợp lệ.');
    const reviewedAt = parseDate(now) || new Date();
    const result = scheduler(retention).next(card, reviewedAt, rating);

    const reps = (card.reps || 0) + 1;
    let scheduled_days = 0;
    let due = new Date(reviewedAt.getTime());
    let state = library.State.Review;
    let lapses = card.lapses || 0;
    let status = 'known';

    if (ratingName === 'again' || ratingName === 'hard') {
      // ❌ Chưa nhớ: Ôn lại ngay trong ngày / Hôm nay (0 ngày)
      scheduled_days = 0;
      due = new Date(reviewedAt.getTime());
      lapses = Math.max(1, lapses + 1);
      state = lapses > 1 ? library.State.Relearning : library.State.Learning;
      status = 'unknown';
    } else {
      // ✅ Đã nhớ: Lên lịch lặp lại ngắt quãng (3 -> 7 -> 14 -> 30+ ngày)
      const fsrsDays = (result && result.card && Number.isFinite(result.card.scheduled_days)) ? result.card.scheduled_days : 0;
      if (reps <= 1) {
        scheduled_days = Math.max(3, fsrsDays || 3);
      } else if (reps === 2) {
        scheduled_days = Math.max(7, fsrsDays || 7);
      } else if (reps === 3) {
        scheduled_days = Math.max(14, fsrsDays || 14);
      } else {
        scheduled_days = Math.max(30, fsrsDays || 30);
      }
      due = new Date(reviewedAt.getTime() + scheduled_days * 86400000);
      state = library.State.Review;
      status = 'known';
    }

    const nextCard = serializeCard({
      ...result.card,
      status,
      last_rating: ratingName,
      lapses,
      reps,
      state,
      scheduled_days,
      due,
      last_review: reviewedAt,
      historyStartAt: card.historyStartAt || reviewedAt.toISOString(),
    });

    return {
      card: nextCard,
      log: {
        ...result.log,
        rating: ratingName,
        state,
        scheduled_days,
        due: nextCard.due,
        review: reviewedAt.toISOString(),
      },
      rating: ratingName,
      stateBefore: card.state,
      stateAfter: state,
      elapsedDays: card.last_review
        ? Math.max(0, (reviewedAt.getTime() - card.last_review.getTime()) / 86400000)
        : 0,
    };
  }

  function preview(cardValue, now, retention) {
    const card = deserializeCard(cardValue);
    if (!card) return {};
    const reviewedAt = parseDate(now) || new Date();
    const reps = (card.reps || 0) + 1;
    const lapses = card.lapses || 0;

    const goodDays = reps <= 1 ? 3 : reps === 2 ? 7 : reps === 3 ? 14 : 30;
    const goodDue = new Date(reviewedAt.getTime() + goodDays * 86400000);

    return {
      again: {
        card: serializeCard({
          ...card,
          status: 'unknown',
          last_rating: 'again',
          lapses: Math.max(1, lapses + 1),
          reps,
          scheduled_days: 0,
          due: reviewedAt,
          state: lapses > 0 ? library.State.Relearning : library.State.Learning,
        }),
        due: reviewedAt.toISOString(),
        intervalMs: 0,
        scheduledDays: 0,
        intervalText: 'Hôm nay',
      },
      good: {
        card: serializeCard({
          ...card,
          status: 'known',
          last_rating: 'good',
          lapses,
          reps,
          scheduled_days: goodDays,
          due: goodDue,
          state: library.State.Review,
        }),
        due: goodDue.toISOString(),
        intervalMs: goodDays * 86400000,
        scheduledDays: goodDays,
        intervalText: `${goodDays} ngày`,
      },
      hard: {
        intervalMs: 0,
        scheduledDays: 0,
        intervalText: 'Hôm nay',
      },
      easy: {
        intervalMs: goodDays * 86400000,
        scheduledDays: goodDays,
        intervalText: `${goodDays} ngày`,
      },
    };
  }

  function isDue(cardValue, now) {
    const card = deserializeCard(cardValue);
    if (!card || card.state === library.State.New) return false;
    return card.due.getTime() <= (parseDate(now) || new Date()).getTime();
  }

  function retrievability(cardValue, now, retention) {
    const card = deserializeCard(cardValue);
    if (!card || card.state === library.State.New) return 0;
    return scheduler(retention).get_retrievability(card, parseDate(now) || new Date(), false);
  }

  function ratingValue(name) {
    return RATINGS[name];
  }

  function ratingName(value) {
    return RATING_NAMES[value] || null;
  }

  return Object.freeze({
    DEFAULT_RETENTION,
    State: library.State,
    RATINGS: Object.freeze({ ...RATINGS }),
    RATING_NAMES: Object.freeze({ ...RATING_NAMES }),
    normalizeRetention,
    createNewCard,
    deserializeCard,
    serializeCard,
    review,
    preview,
    isDue,
    retrievability,
    ratingValue,
    ratingName,
  });
})();
