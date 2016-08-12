exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === "production" ?
                        "mongodb://kkindorf:Zooniebin9765@ds153785.mlab.com:53785/guardian-saver" :
                        "mongodb://localhost/guardian-dev");

exports.PORT = process.env.PORT || 8080;

