This is a Netflix-style movie browsing UI built with the [Next.js App Router](https://nextjs.org/docs/app), Tailwind CSS, and the [TMDB API](https://www.themoviedb.org/documentation/api).

### Getting Started

#### 1. Install dependencies

From the project root:

```bash
npm install
```

#### 2. Set up environment variables

Next.js reads environment variables from files like `.env.local` in the project root.

1. Copy the example file:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and replace `your_api_key_here` with your real TMDB API key:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_real_tmdb_api_key
```

- `.env.local` is listed in `.gitignore`, so it will **not** be committed to git.
- `NEXT_PUBLIC_` variables are available in the browser, which is fine for this demo.

#### 3. Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

You should see a dark Netflix-style homepage with:

- A sticky navbar at the top
- A large hero banner showing a random trending movie/TV show
- Multiple horizontally scrollable rows like Trending, Top Rated, Action, etc.

