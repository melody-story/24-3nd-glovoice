-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NONE', 'CONFIRM', 'REJECT');

-- CreateTable
CREATE TABLE "voice" (
    "id" SERIAL NOT NULL,
    "fileSize" DECIMAL(11,3) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "userId" INTEGER,
    "sentenceId" INTEGER,
    "dateOfCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMPTZ(3),

    CONSTRAINT "voice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_download_status" (
    "id" SERIAL NOT NULL,
    "voiceId" INTEGER NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "clientId" INTEGER NOT NULL,
    "dateOfCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMPTZ(3),

    CONSTRAINT "voice_download_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_verifty_status" (
    "id" SERIAL NOT NULL,
    "voiceId" INTEGER NOT NULL,
    "verifyStatus" "Status" NOT NULL DEFAULT E'NONE',
    "userId" INTEGER NOT NULL,
    "playCount" INTEGER NOT NULL DEFAULT 1,
    "dateOfCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMPTZ(3),

    CONSTRAINT "voice_verifty_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "script" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "fileSize" DECIMAL(11,3) NOT NULL,
    "remarks" VARCHAR(1000) NOT NULL,
    "clientId" INTEGER,
    "dateOfCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMPTZ(3),

    CONSTRAINT "script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "script_status" (
    "id" SERIAL NOT NULL,
    "scriptId" INTEGER,
    "post" BOOLEAN NOT NULL DEFAULT false,
    "deadline" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "clientId" INTEGER,
    "downloadMax" INTEGER DEFAULT 1,
    "downloadPreiodFrom" DATE,
    "downloadPreiodTo" DATE,
    "uploadStatus" VARCHAR(50),
    "dateOfCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMPTZ(3),

    CONSTRAINT "script_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentence_status" (
    "id" SERIAL NOT NULL,
    "sentenceId" INTEGER NOT NULL,
    "deadlineStatus" BOOLEAN NOT NULL DEFAULT false,
    "dateOfCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMPTZ(3),

    CONSTRAINT "sentence_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentence" (
    "id" SERIAL NOT NULL,
    "scriptId" INTEGER NOT NULL,
    "context" VARCHAR(5000) NOT NULL,
    "language" VARCHAR(50) NOT NULL,
    "age" INTEGER,
    "gender" VARCHAR(50),
    "dateOfCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMPTZ(3),

    CONSTRAINT "sentence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "loginId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "remarks" TEXT,
    "dateOfCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOfUpdated" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'CLIENT',

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "loginId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateOdUpdated" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "birthday" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "languages" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voice_verifty_status_voiceId_key" ON "voice_verifty_status"("voiceId");

-- CreateIndex
CREATE UNIQUE INDEX "script_title_key" ON "script"("title");

-- CreateIndex
CREATE UNIQUE INDEX "client_loginId_key" ON "client"("loginId");

-- CreateIndex
CREATE UNIQUE INDEX "user_loginId_key" ON "user"("loginId");

-- AddForeignKey
ALTER TABLE "voice" ADD CONSTRAINT "voice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice" ADD CONSTRAINT "voice_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "sentence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_download_status" ADD CONSTRAINT "voice_download_status_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "voice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_download_status" ADD CONSTRAINT "voice_download_status_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_verifty_status" ADD CONSTRAINT "voice_verifty_status_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "voice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_verifty_status" ADD CONSTRAINT "voice_verifty_status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script" ADD CONSTRAINT "script_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_status" ADD CONSTRAINT "script_status_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_status" ADD CONSTRAINT "script_status_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentence_status" ADD CONSTRAINT "sentence_status_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "sentence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentence" ADD CONSTRAINT "sentence_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
