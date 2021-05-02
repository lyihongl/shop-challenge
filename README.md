# Shop Challenge
This project consists of the backend and frontend for an image repository web app for Shopify Fall 2021

Technologies: Typescript, Node.js, GraphQL, Postgresql, React.js, Docker

## Setup

IMPORTANT: IF ON WINDOWS PLEASE CLONE WITH `--config core.autocrlf=input`. There is a bash script that gets messed up on windows otherwise.

1. Clone the repo and create `backend.env` in the root directory
2. This project makes use of S3 buckets, below when providing a name for S3, if you provide the name of a bucket that does not yet exist, it will be programatically created.
3. In `backend.env` supply the following variables:
    | env variable name | description
    | :---------------- | :---------
    | S3_REGION | region of the S3 instance
