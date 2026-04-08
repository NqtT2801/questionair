-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "phase" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctOptionIndex" INTEGER NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "isTrapped" BOOLEAN NOT NULL DEFAULT false,
    "isBet" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "participantId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "phase" INTEGER NOT NULL,
    "selectedOption" INTEGER NOT NULL,
    "isSuggestedAnswer" BOOLEAN NOT NULL,
    "openedReason" BOOLEAN NOT NULL,
    "timeToAnswerSeconds" DOUBLE PRECISION NOT NULL,
    "isTrapped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_key_key" ON "Question"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Response_participantId_questionKey_key" ON "Response"("participantId", "questionKey");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
