export const moods = [
  { id: 'tense', label: 'Tense', genre: '53' },
  { id: 'funny', label: 'Funny', genre: '35' },
  { id: 'thoughtful', label: 'Thoughtful', genre: '18' },
  { id: 'feelgood', label: 'Feel-good', genre: '10749' },
  { id: 'scary', label: 'Scary', genre: '27' },
  { id: 'spectacular', label: 'Spectacular', genre: '28' },
];

export const times = [
  { id: 'short', label: 'Under 100 min', lte: 100 },
  { id: 'standard', label: 'About 2 hours', gte: 95, lte: 135 },
  { id: 'long', label: 'A long sit', gte: 130 },
];

export const eras = [
  { id: 'any', label: 'Any year' },
  { id: 'classic', label: 'Before 2000', lte: '1999-12-31' },
  { id: 'mid', label: '2000–2019', gte: '2000-01-01', lte: '2019-12-31' },
  { id: 'recent', label: '2020s', gte: '2020-01-01' },
];

const moodWhy = {
  tense:
    'You asked for tension, not jump-scare noise. This title is built to keep the next scene expensive — conversations, waiting, and the feeling that a plan might fail.',
  funny:
    'You wanted something that actually plays as comedy, not a drama with three jokes. This one earns laughs from character and timing, which holds up if you are only half-paying attention at first and then you are in.',
  thoughtful:
    'You wanted a film that leaves a residue. This pick is paced for people who will sit with a scene after it ends, not for a plot checklist.',
  feelgood:
    'You wanted warmth without a lecture. This leans on people trying to be decent, or at least trying to get back to each other, which is a better night than most “uplifting” posters.',
  scary:
    'You wanted to be scared on purpose. This one uses dread and rules, not only loud stingers — better if the lights are already low.',
  spectacular:
    'You wanted scale. This is a movie that spends its money on movement and images, the kind you put on a bigger screen if you have one.',
};

const timeWhy = {
  short: 'Runtime is kept short, so it fits a weeknight without bargaining with tomorrow.',
  standard: 'Length is in the two-hour band: enough room to land, not a three-hour project.',
  long: 'This is a long sit on purpose. Give it the evening, not the last forty minutes before sleep.',
};

const eraWhy = {
  any: '',
  classic: 'It is an older title, which usually means the style is the point — not a remake’s polish.',
  mid: 'It sits in the 2000s–2010s, when digital sheen and practical craft still mix.',
  recent: 'It is from the 2020s, so the humor, politics, or effects should feel current.',
};

export const buildPickerWhy = (movie, mood, time, era) => {
  const bits = [moodWhy[mood.id], timeWhy[time.id], eraWhy[era.id]].filter(Boolean);
  return bits[0] || '';
};

export const buildPickerQuery = (mood, time, era) => {
  const params = new URLSearchParams({
    with_genres: mood.genre,
    sort_by: 'vote_average.desc',
    vote_count_gte: '400',
    page: '1',
  });
  if (time.gte) params.set('with_runtime_gte', String(time.gte));
  if (time.lte) params.set('with_runtime_lte', String(time.lte));
  if (era.gte) params.set('release_date_gte', era.gte);
  if (era.lte) params.set('release_date_lte', era.lte);
  return params.toString();
};
