# Shop Challenge

This project consists of the backend and frontend for an image repository web app for Shopify Fall 2021

Technologies: Typescript, Node.js, GraphQL, Postgresql, React.js, Docker

## Setup

IMPORTANT: IF ON WINDOWS PLEASE CLONE WITH `git clone https://github.com/lyihongl/shop-challenge.git --config core.autocrlf=input`. There is a bash script that gets messed up on windows otherwise because of the way windows handles file endings.

### With docker

1. Clone the repo and create a file `backend.env` in the root directory.
2. This project makes use of S3 buckets, below when providing a name for S3, if you provide the name of a bucket that does not yet exist, it will be programatically created.

   a. If you are supplying an already existing bucket, please disable block public access
   ![](https://github.com/lyihongl/shop-challenge/blob/master/assets/aws-settings.png)

3. In `backend.env` supply the following variables:

| env variable name | description                                                   |
| :---------------- | :------------------------------------------------------------ |
| S3_REGION         | region of the S3 instance                                     |
| S3_BUCKET         | name of the S3 bucket (the bucket does not need to exist yet) |
| AWS_ACCESS_KEY    | your aws access key                                           |
| AWS_SECRET        | your aws secret key                                           |

a. The format expected is `S3_REGION=us-east-1`.

4. Once `backend.env` has been set, run `docker-compose up -d` to start the application.
5. If everything goes smoothly the frontend will be accessable from `localhost:3000`

### Development setup

Note: for some reason the way yarn resolves packages causes the frontend to break, but it is fine for backend...

1. In the backend folder, run `yarn install`.
2. In the frontend folder, run `npm install`.
3. Install `nodemon` locally or globally (I had it as a global install which is why it is not in package.json).
4. Export the environment variables as specified in the [With docker](#with-docker) section.
5. Run `docker-compose up -d db` to start only the database.
6. In the backend folder, run `yarn watch`, then in another terminal instance run `yarn dev`.
7. In the frontend folder, run `npm run start`.

## Features

| Feature                         | Description                                                       |
| :------------------------------ | :---------------------------------------------------------------- |
| User Authentication             | User registration and login                                       |
| Password Hashing                | Passwords are hashed using argon2 before stored for user security |
| Authenticated endpoints         | Certain resources require an access token to use                  |
| Search function                 | Search for images based on tags in an AND or an OR fashion        |
| Upload Images                   | Repository supports jpeg/jpg/png                                  |
| Authenticated Deletion          | Only the owner of an image can delete it                          |
| Private images                  | Only the owner of the image is able to view the image             |
| User added tags                 | The user can supply custom tags to the image                      |
| Machine Learning Generated Tags | When an image is uploaded                                         |
