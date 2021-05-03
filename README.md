# Shop Challenge

This project consists of the backend and frontend for an image repository web app for Shopify Fall 2021

Technologies: Typescript, Node.js, GraphQL, Postgresql, React.js, Docker

## Setup

IMPORTANT: IF ON WINDOWS PLEASE CLONE WITH `git clone https://github.com/lyihongl/shop-challenge.git --config core.autocrlf=input`. There is a bash script that gets messed up on windows otherwise because of the way windows handles line endings.

This project makes use of ports `3000, 4000, 5432`. Please make sure those ports are not taken up by other services.

### With docker

1. Clone the repo and create a file `backend.env` in the root directory.
2. This project makes use of S3 buckets, below when providing a name for S3, if you provide the name of a bucket that does not yet exist, it will be programatically created.

   a. If you are supplying an already existing bucket, please disable block public access
   ![](https://github.com/lyihongl/shop-challenge/blob/master/assets/aws-settings.png)

3. In `backend.env` supply the following variables:

```
S3_REGION=
S3_BUCKET=
AWS_ACCESS_KEY=
AWS_SECRET=
```

4. Once `backend.env` has been set, run `docker-compose up -d` to start the application.
5. If everything goes smoothly the frontend will be accessable from `localhost:3000`, or the graphql playground from `localhost:4000/graphql`

### Development setup

Note: for some reason the way yarn resolves packages causes the frontend to break, but yarn works fine for backend... so backend will be handled by yarn and frontend by npm :).

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

The [mobile net](https://www.npmjs.com/package/@tensorflow-models/mobilenet) package was used on the backend to generate tags, only tags that had above 0.75 confidence we actually stored.

## Testing

Tbh for the life of me I couldn't get a mock isAuth working. I struggled with it for about 4 hours but I am busy with other things in life at the moment so testing just does not work on the project as of right now :(.
