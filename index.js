import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 4000;
const api_url = "https://api.nytimes.com/svc/books/v3";
const api_key = "n2x7qHDp3SZDyd6WVjMH5flV2RPW8c3V";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/bestSellerBooks", async (req, res) => {
  const inputDate = req.body.date;
  const dateObject = new Date(inputDate);
  const formattedDate = dateObject.toISOString().split("T")[0];
  const name = req.body.type;
  try {
    const response = await axios.get(
      api_url +
        "/lists/" +
        formattedDate +
        "/" +
        name +
        ".json?api-key=" +
        api_key
    );
    const books = response.data.results.books;
    res.render("index.ejs", { books: books, date: formattedDate });
  } catch (error) {
    console.log(error);
  }
});

app.post("/authorReviews", async (req, res) => {
  const authorName = req.body.author.replace(/\s+/g, "+");
  const auth = req.body.author;
  try {
    const response = await axios.get(
      api_url + "/reviews.json?author=" + authorName + "&api-key=" + api_key
    );
    const reviews = response.data.results;
    res.render("index.ejs", { reviews: reviews, auth: auth });
  } catch (error) {
    console.log(error);
  }
});

app.post("/bookReviews", async (req, res) => {
  const auth = req.body.author;
  const title = req.body.book.replace(/\s+/g, "+");
  const book = req.body.book;
  try {
    const response = await axios.get(
      api_url + "/reviews.json?title=" + title + "&api-key=" + api_key
    );
    const reviews = response.data.results;
    console.log(reviews);
    res.render("index.ejs", { Book: book, Breviews: reviews, auth: auth });
  } catch (error) {
    console.log(error);
  }
});

app.post("/top5", async (req, res) => {
  //here the req.body.date, the date is name attr in ejs
  const inputDate = req.body.date;
  const dateObject = new Date(inputDate);
  const formattedDate = dateObject.toISOString().split("T")[0];

  try {
    const response = await axios.get(
      `${api_url}/lists/overview.json?api-key=${api_key}&date=${formattedDate}`
    );
    const lists = response.data.results.lists;

    // Use flatMap to flatten the array of books from each list
    const books = lists.flatMap((list) => list.books);
    // console.log(books);
    res.render("index.ejs", { List: lists, Books: books });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
