export const GUIDES_UPDATED = 'September 20, 2026';

export const guides = [
  {
    slug: 'how-flickx-works',
    title: 'How Flickx works',
    description: 'What Flickx is for, what we show on a title page, and why we never host full movies.',
    sections: [
      {
        id: 'purpose',
        title: 'What Flickx is for',
        body: [
          'Flickx is a movie discovery tool, not a streaming service. The job of the site is to help you find a title, read a clear details page, watch the official trailer when one is available, and optionally save the film to a personal list.',
          'We built Flickx this way because most people do not need another copy of a giant catalog. They need a fast search, honest filters, and a page that is easy to scan on a phone. That is the product. If you want to watch the full film, you leave Flickx and use a service that actually licenses it.',
        ],
      },
      {
        id: 'title-page',
        title: 'What you get on a title page',
        body: 'Every movie page is assembled from public catalog data plus Flickx features we maintain ourselves:',
        bullets: [
          'Plot, runtime, rating, and release date from the source catalog.',
          'Top billed cast with character names.',
          'An official trailer when the catalog includes a video.',
          'Favorites and share actions that belong to your Flickx account or browser.',
        ],
        footer: 'Flickx does not rewrite studio synopses or invent ratings.',
      },
      {
        id: 'hosting',
        title: 'Why we do not host films',
        body: [
          'Hosting or ripping full movies would break copyright law and would also make the site a piracy destination. Flickx will not do that. Trailers exist as embeds from the official video when the catalog provides one.',
          'If a listing looks incomplete, that is usually because the public catalog has not published a trailer, poster, or overview yet. We would rather show a gap than pad the page with fake text.',
        ],
      },
    ],
  },
  {
    slug: 'search-and-filters',
    title: 'Search and filters',
    description: 'How to search by title, browse by genre or year, and get useful results on Flickx.',
    sections: [
      {
        id: 'search',
        title: 'Search by title',
        body: [
          'Use the search bar on Home when you already know the name, or even part of it. Flickx sends that query to our movie API and returns matching titles. Open a poster to read the full page.',
          'If nothing comes back, try a shorter fragment, drop the year from the query, or switch to filters instead of search. Catalog search is literal: a typo or an alternate international title can miss.',
        ],
      },
      {
        id: 'filters',
        title: 'Browse with filters',
        body: 'Leave search empty and use filters when you are in the mood for a type of film rather than a specific name.',
        bullets: [
          'Genre narrows the set to a single category such as comedy or thriller.',
          'Year limits results to that calendar year.',
          'Sort changes the order: popularity, rating, newest, or oldest.',
        ],
      },
      {
        id: 'tips',
        title: 'Tips that actually help',
        body: [
          'Newest sort is for films that already have a release date on or before today. Future titles are hidden so the list is not a wall of unreleased marketing dates.',
          'Your last search and filter choices stay in the browser so you can leave a title page and land back on the same browse state. Reset filters when you want the default trending view again.',
        ],
      },
    ],
  },
  {
    slug: 'trending-and-newest',
    title: 'Trending and newest',
    description: 'How Flickx decides what appears on Home, and how newest sort treats release dates.',
    sections: [
      {
        id: 'trending',
        title: 'What “trending” means here',
        body: [
          'The Home grid is not a random poster wall. It is a snapshot of titles the catalog currently treats as trending. That list changes as public attention moves. Flickx refreshes it when you load Home; we do not hand-pick a marketing slate.',
          'The hero banner uses the same trending set, filtered to titles that have a backdrop image so the top of the page is not empty. If a title has no backdrop, it can still appear in the grid.',
        ],
      },
      {
        id: 'newest',
        title: 'How newest sort works',
        body: [
          'Newest sort orders by release date, newest first, and excludes dates after today. That is a Flickx rule, not a default catalog dump. We added it because “new” lists that mix unreleased films are frustrating when you are trying to pick something you can actually watch this week.',
          'Past years still appear if you set the year filter. Newest is a sort, not a lock to the current calendar year.',
        ],
      },
      {
        id: 'ratings',
        title: 'Ratings on Flickx',
        body: 'The score on a title page is the community rating from the source catalog, rounded for display. Flickx does not weight it, hide low scores, or replace it with an editorial grade. If you want our own writing, read these guides — not the rating number.',
      },
    ],
  },
  {
    slug: 'favorites-and-accounts',
    title: 'Favorites and accounts',
    description: 'How sign-in, Google Sign-In, and the Flickx favorites list work.',
    sections: [
      {
        id: 'without-account',
        title: 'You can browse without an account',
        body: 'Search, filters, title pages, and trailers work while signed out. That is intentional. An account is only required when you want a list that follows you across devices.',
      },
      {
        id: 'sign-in',
        title: 'Email or Google',
        body: 'Create an account with a username, email, and password, or use Google Sign-In. We store a hashed password for email accounts, not the plain text. Google Sign-In shares the identity Google already verified so we can attach favorites to that user.',
        bullets: [
          'Favorites sync to your account after you sign in.',
          'Theme and filter preferences can still live in the browser.',
          'You can sign out at any time from the navigation bar.',
        ],
      },
      {
        id: 'list',
        title: 'Using the favorites list',
        body: [
          'Open a title and use the favorite action to add or remove it. The Favorites page shows everything you have saved. Clearing the list is permanent for that account.',
          'The list is private to your account. It is a personal tool, not a public profile and not a social feed.',
        ],
      },
    ],
  },
];

export const getGuide = (slug) => guides.find((guide) => guide.slug === slug);
