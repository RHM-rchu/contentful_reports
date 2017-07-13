# Contentful content queries/export #

### Installation ###

Use the following list to run this locally.

1. Checkout this branch, either via git or by downloading.
1. Navigate into the downloaded directory.
1. Run `npm install`.
2. `npm install -g nodemon eslint`
1. edit nodemon.json to define the directories to monitor for updates without restarting node
1. Run `nodemon` to start the application and auto refresh on change of code.
1. Open your browser to http://localhost:3000.


### Environment Variables ###
1. `.env` for port number and log level use `dotenv_template` as your template


```
node_template/
├── .env
├── app
│   └── exportArticles.js
├── index.js
├── helpers
│   ├── ...helpers...
│   └── ...
├── node_modules
│   ├── ...
│   └── ...
└── routes
    └── exportArticles.js.js
```



### Routes ###
**List contentTypes**
- http://192.168.30.244:3000/getContentTypes/
- http://192.168.30.244:3000/getContentType/slideshow

**Export articles**
- http://192.168.30.244:3000/getEntries/articles
- http://192.168.30.244:3000/getEntries/slideshow?export=1
- http://192.168.30.244:3000/getEntries/author?export=1




