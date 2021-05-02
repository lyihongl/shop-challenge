# Shop Challenge
This project consists of the backend and frontend for an image repository web app for Shopify Fall 2021

Technologies: Typescript, Node.js, GraphQL, Postgresql, React.js, Docker

## Setup

IMPORTANT: IF ON WINDOWS PLEASE CLONE WITH `--config core.autocrlf=input`. There is a bash script that gets messed up on windows otherwise.

1. Clone the repo and create `backend.env` in the root directory
2. Create an S3 bucket on aws
3. In `backend.env` supply the following variables:
    | env variable name | description
    | S3_REGION | 
