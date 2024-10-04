//https://github.com/kaikaew13/manganato-api/blob/main/manga.go

import express from "express";
import axios from "axios";
import { load } from "cheerio";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/api/manga", async (req, res) => {
  const { name } = req.query;
  try {
    const searchUrl = `https://manganato.com/search/story/${encodeURIComponent(
      name
    )}`;
    const searchResponse = await axios.get(searchUrl);
    const searchHtml = searchResponse.data;
    const $search = load(searchHtml);
    const mangaUrl = $search(".search-story-item a.item-img").attr("href");

    if (!mangaUrl) {
      return res.status(404).json({ error: "Manga not found" });
    }

    const response = await axios.get(mangaUrl);
    const html = response.data;
    const $ = load(html);

    const manga = {
      id: mangaUrl.split("/").pop(),
      name: $(".story-info-right h1").text(),
      alternatives: $(
        ".variations-tableInfo tr:nth-child(1) .table-value"
      ).text(),
      author: $(".variations-tableInfo tr:nth-child(2) .table-value").text(),
      status: $(".variations-tableInfo tr:nth-child(3) .table-value").text(),
      updated: $(".story-info-right-extent p:nth-child(1) .stre-value").text(),
      views: $(".story-info-right-extent p:nth-child(2) .stre-value").text(),
      rating: $("em#rate_row_cmd").text().split(" ")[3],
      description: $(".panel-story-info-description")
        .text()
        .trim()
        .replace("Description :\n", ""),
      genres: [],
      chapters: [],
    };

    $(".variations-tableInfo tr:nth-child(4) .table-value a").each((i, el) => {
      manga.genres.push($(el).text());
    });

    $(".row-content-chapter li").each((i, el) => {
      manga.chapters.push({
        id: $(el).find("a").attr("href").split("/").pop(),
        title: $(el).find("a").text(),
        url: $(el).find("a").attr("href"),
      });
    });

    res.json(manga);
  } catch (error) {
    console.error("Error fetching manga details:", error);
    res.status(500).json({ error: "Failed to fetch manga details" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
