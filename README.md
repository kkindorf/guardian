# Guardian Saver

## API Overview

The API created for this application displays and stores data into a mongoDB database with data taken from the Guardian news resource's own API.
The Guardian Saver's API stores objects with the following types of data: 
```
{
  _id: "57ade810c76c6a11007be087",
  searchTerm: "food",
  subject: "Guardian Sustainable Business",
  articleURL: "https://www.theguardian.com/sustainable-business/2016/jun/26/food-waste-walmart-date-labels",
  title: "Can Walmart's food labels make a dent in America's $29bn  food waste problem?",
  format: "article",
  notes: "",
  __v: 0,
  date: "2016-08-12T15:15:28.684Z"
}
```
The above snippet is a typical object inside Guardian Saver's API. When a user clicks on the save button, the data given to us from an initial GET request
to the Guardian's API will be extracted into another object which is passed to Guardian Saver's `/savedArticles` endpoint. This new object will store the search term used to query the Guardian's API, 
the subject of the article that the user wants to save, the article url so the user can link back to the article, the title, 
the format, the date which stores the date and time of when the user submitted the search query and there is also a empty string value attached to the notes key. 
This notes key will store new notes that the user adds themselves via a POST request after a GET request is made to Guadian Saver's `/savedArticles` endpoint.

The following image displays a result of the user filling out the form with a search query to the Guardian's API:

![alt tag](http://i1167.photobucket.com/albums/q625/Kevin_Kindorf/Screen%20Shot%202016-08-12%20at%208.29.04%20PM_zpsnxwysfuc.png)

Each request made to the Guardian API returns 10 results, or a single page of articles based on relevance to the search query. 

If a user clicks on the Next or Previous buttons at the bottom of the list, they will set off another GET request to the guadian API but the
result will be the next or previous page of the full request to the Guardian using the same search query. 

When a user clicks on the Save For Later button:

![alt tag](http://i1167.photobucket.com/albums/q625/Kevin_Kindorf/Screen%20Shot%202016-08-12%20at%208.35.47%20PM_zpsai62f6aw.png)

The data from the article is saved in the database. With the Save For Later button turning green upon a successful save or red if an error occurs.

If a user decides they want to conduct another search query they can do so since the form is always present on the screen. The application was
designed to be a single page application that makes it easy for the user to quickly search for articles, save them and add notes 
in the easiest way possible without having to deal with browser refreshes. 

An example of the data being laid out after a get request to the `/savedArticles` endpoint looks like the following:

![alt tag](http://i1167.photobucket.com/albums/q625/Kevin_Kindorf/Screen%20Shot%202016-08-12%20at%208.47.12%20PM_zpst5d956yt.png)

Once the user clicks on the Saved Articles button a list of all of the saved articles will be displayed in place of any other content that may
have been showing previously. All six keys from the object we created on our POST request to the `/savedArticles` endpoint is being displayed.
As you can see if the user clicks inside the blue box at the bottom of the panel, they wll be able to add text to that box which will be 
saved once the user hits the return key. 

## Technologies Used

The technologies used for this application include jQuery which helped significantly with making this application a single page app, Express.js and Node.js
for developing the server and routes as well as our requests to the Guardian api. The data is currently being stored in a MongoDB database. 
Unit tests are being conducted with Mocha and Chai. Travis CI is being used to automate our tests and Heroku is being used to host our production application.




