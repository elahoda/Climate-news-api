const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "nytimes",
    address: "https://www.nytimes.com/section/climate",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "washingtonpost",
    address: "https://www.washingtonpost.com/climate-environment/",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
  {
    name: "foxnews",
    address: "https://www.foxnews.com/category/us/environment/climate-change",
    base: "https://www.foxnews.com",
  },
  {
    name: "nbcnews",
    address: "https://www.nbcnews.com/climate-in-crisis",
    base: "",
  },
  {
    name: "cnn",
    address: "https://www.cnn.com/world/cnn-climate",
    base: "https://www.cnn.com",
  },
  {
    name: "bbc",
    //address: "https://www.bbc.com/news/science_and_environment",
    address: "https://www.bbc.com/news/topics/cmj34zmwm1zt",
    base: "https://www.bbc.com",
  },

  {
    name: "reuters",
    address: "https://www.reuters.com/sustainability/climate-energy/",
    base: "",
  },
  {
    name: "abcnews",
    address: "https://abcnews.go.com/alerts/climate-change",
    base: "",
  },
  {
    name: "apnews",
    address: "https://apnews.com/hub/climate-change",
    base: "",
  },

  {
    name: "cbsnews",
    address: "https://www.cbsnews.com/climate-change/",
    base: "",
  },

  {
    name: "newsweek",
    address: "https://www.newsweek.com/topic/climate-change",
    base: "",
  },
  {
    name: "scientificamerican",
    address: "https://www.scientificamerican.com/climate-change/",
    base: "",
  },
  {
    name: "nasa",
    address: "https://climate.nasa.gov/",
    base: "https://climate.nasa.gov",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("a:contains('climate')", html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title: title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my web scraper!");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        specificArticles.push({
          title: title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
