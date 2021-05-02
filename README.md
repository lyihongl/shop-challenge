# Shop Challenge
This project consists of the backend and frontend for an image repository web app for Shopify Fall 2021

Technologies: Typescript, Node.js, GraphQL, Postgresql, React.js, Docker

## Setup

IMPORTANT: IF ON WINDOWS PLEASE CLONE WITH `--config core.autocrlf=input`. There is a bash script that gets messed up on windows otherwise.

1. Clone the repo and create `backend.env` in the root directory
2. This project makes use of S3 buckets, below when providing a name for S3, if you provide the name of a bucket that does not yet exist, it will be programatically created.
    a. If you are supplying an already existing bucket, please disable block public access
    [](https://github.com/lyihongl/shop-challenge/blob/master/assets/aws-settings.png)
3. In `backend.env` supply the following variables:
    | env variable name | description
    | :---------------- | :---------
    | S3_REGION | region of the S3 instance
    | S3_BUCKET | name of the S3 bucket (the bucket does not need to exist yet)
