# Data Sentinel ETL Test

## Getting Started

 This is an application that will take incoming JSON containing a UNIX timestamp, a URL string, and array of objects, and transform the data into a new format that is easier to understand and parse different parts of the URL to make it easier to query downstream.

 This uses simple typescript and jest for unit testing.

 This program nothing stores in memory instead uses stream to read data, transform on the fly and write stream to the file.

### Clone repository

To clone the repository, use the following commands:

```sh
git clone git@github.com:badaldesai/data-sentinel-etl-test.git
cd data-sentinel-etl-test
npm install
```

## Run the program

To run the program, use the following command with path to input zip file. It assumes that file is zip with multiple gz JSON files.

```sh
npm run start <Path to zip file>
```

In order to run the program we build using
```sh
npm run build
```

Now if the `input.zip` in the same folder. We can run as:
```sh
npm run start input.zip
```

## Run the Unit Test

To run the unit test.

```sh
npm run test
```