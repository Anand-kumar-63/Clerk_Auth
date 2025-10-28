# prisma Setup

- Initialize a TypeScript project and add the Prisma CLI as a development dependency to it:
  npm init -y

- first you should install the prisma as --save-dev 
  npx install prisma --save-dev 

- Along side you have to install the client as well 
  npm install @prisma/client

Next, initialize TypeScript:
npx tsc --init

You can now invoke the Prisma CLI by prefixing it with npx:
npx prisma

- Now you have to write the models and set the output in the Prisma Schema to @node_modules/prisma
- and next you have to configure the prisma config file by installing the dotenv and import the dotenv/config

- next its time to migrate the model 
  npx prisma migrate dev --name init 

- Next Then, run prisma generate which reads your Prisma schema and generates the Prisma Client.
  npx prisma generate  

- Now query the database using the typescript and prisma postgres
// 1
import { PrismaClient } from './generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

// 2
const prisma = new PrismaClient()
  .$extends(withAccelerate())

// 3
async function main() {
  // ... you will write your Prisma Client queries here
}

// 4
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    // 5
    await prisma.$disconnect()
    process.exit(1)
  });
Import the PrismaClient constructor and the withAccelerate extension.
Instantiate PrismaClient and add the Accelerate extension.
Define an async function named main to send queries to the database.
Call the main function.
Close the database connections when the script terminates.


For more info -- Read more https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-prismaPostgres


# Comprehensive Guide to Using Prisma ORM with Next.js
read more - https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

# Clerk auth 
- setup of sign-up page.tsx using the clerk api and make it custom

# Middleware 
