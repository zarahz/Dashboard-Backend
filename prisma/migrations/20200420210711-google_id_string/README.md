# Migration `20200420210711-google_id_string`

This migration has been generated by zarahz at 4/20/2020, 9:07:11 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" DROP COLUMN "googleId",
ADD COLUMN "googleId" text  NOT NULL ;

CREATE UNIQUE INDEX "User.googleId" ON "public"."User"("googleId")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200420210355-google_id_float..20200420210711-google_id_string
--- datamodel.dml
+++ datamodel.dml
@@ -1,8 +1,8 @@
 // scheme://user:password@ip:port/database
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = "postgres://postgres:postgres@localhost:5432/dashboard"
 }
 generator client {
   provider = "prisma-client-js"
@@ -21,9 +21,9 @@
   picture             String
   role                Role               @default(USER)
   googleCredentials   GoogleCredentials? @relation(fields: [googleCredentialsId], references: [id])
   googleCredentialsId Int?
-  googleId            Float              @unique
+  googleId            String             @unique
 }
 model GoogleCredentials {
   id           Int    @default(autoincrement()) @id
```

