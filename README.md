# Doki Watch

Welcome to Domains-of-Weeb, an anime platform designed to enhance your anime watching experience. Just like AniList, our platform leverages the AniList API for comprehensive anime metadata and the Consumet API for streaming capabilities.

# Deployed URL

[Domain-of-Weebs](https://doki-watch.netlify.app)

## Features

- **Comprehensive Anime Database**: Explore detailed information about your favorite anime, including synopsis, ratings, and episode lists, powered by the AniList API.
- **Stream Anime**: Enjoy seamless streaming of your favorite anime episodes using the Consumet API.
- **User-Friendly Interface**: Navigate easily through our intuitive and user-friendly interface.
- **Search Functionality**: Quickly find the anime you're looking for with our powerful search feature.
- **Track Your Progress**: Keep track of the episodes you've watched and manage your watchlist effortlessly.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- Node.js installed on your machine
- An AniList account for accessing the AniList API
- Access to the Consumet API for streaming anime

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/domains-of-weeb.git
   cd domains-of-weeb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   ANILIST_API_KEY=your_anilist_api_key
   CONSUMET_API_ENDPOINT=https://consumnetapieshan.vercel.app/
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

### Backend Documentation

For detailed information on the Consumet API, refer to the [Consumet API Documentation](https://docs.consumet.org/) and for information on the Anilist Docs, refer to the [Anilist Documentation](https://anilist.gitbook.io/anilist-apiv2-docs).

## Usage

### Search for Anime

Use the search bar to find any anime by title. Our platform fetches data from the AniList API to provide you with detailed information.

### Stream Anime

Once you find the anime you want to watch, click on the episode you want to stream. The streaming is powered by the Consumet API, ensuring a smooth viewing experience.

### Track Your Watchlist

Log in to your account to keep track of the episodes you've watched. Add anime to your watchlist and manage your progress effortlessly.

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a pull request.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [AniList](https://anilist.co/) for providing a comprehensive anime database API.
- [Consumet](https://consumnetapieshan.vercel.app/) for powering our anime streaming service.

## Contact

If you have any questions, feel free to open an issue or reach out to us at octagramnexus@gmail.com.

Happy watching!

