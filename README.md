# tipcalculatorV2
This is version 2 of the Tip Calculator Web App. The purpose of this app is to provide Starbucks partners (employees) with a tool for weekly tip distribution based on hours worked. Use of this app results in fewer errors and less time spent processing tips. The app is cuurently hosted on Heroku at: www.sbuxtip.com

# Upgrades from V1
Implemented persistence layer via mongodb in order to support multiple stores and their corresponding lists of partners.
Optimized layout and appearance via Bootstrap to make the app responsive for multiple devices.

# Specs
Front end: HTML, CSS/Bootstrap, Javascript

Back end: Node server, EJS templates, mongodb

# TODO

Create feedback link for user to communicate feedback regarding their experience via email

Create sticky header on payout page to keep total hours and $/hr values always visible

Data logging in mongodb for future debugging and algorithm improvements

Possibly migrate project to AWS
