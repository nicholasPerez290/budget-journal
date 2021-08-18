# budget-journal

## Purpose

* To keep track of withdrawals, deposits, and overall spending habits

* Be able to keep track of them while offline and have the save when you are online again

## How it works

* When you open the app you are shown a graph of all your past spending

* When you enter a name and amount of money you are prompted to either add or subtract it from your balance

* When you add or subtract your balance a new data point is plotted on the graph and the curve is shown in blue

* When you add data points offline and return online your new data is saved.

## Technology used

* This application uses Mongo_DB to save user entered data

* Indexed_DB is used to save the data when offline and then sends it to the Mongo database when online

* This application uses Javascript's native fetch calls to make calls to the database

## Images

[screenshot](img\Capture.PNG)