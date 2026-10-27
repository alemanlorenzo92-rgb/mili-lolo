-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PARTNER',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "chapter" TEXT,
    "coverUrl" TEXT,
    "coverCaption" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "format" TEXT,
    "resourceType" TEXT NOT NULL DEFAULT 'image',
    "bytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "memoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryTag" (
    "memoryId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "MemoryTag_pkey" PRIMARY KEY ("memoryId","tagId")
);

-- CreateTable
CREATE TABLE "DiaryEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" TEXT,
    "location" TEXT,
    "readingTime" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "sealColor" TEXT DEFAULT 'terracotta',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Memory_date_idx" ON "Memory"("date");

-- CreateIndex
CREATE INDEX "Memory_authorId_idx" ON "Memory"("authorId");

-- CreateIndex
CREATE INDEX "MediaAsset_memoryId_idx" ON "MediaAsset"("memoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "MemoryTag_tagId_idx" ON "MemoryTag"("tagId");

-- CreateIndex
CREATE INDEX "DiaryEntry_date_idx" ON "DiaryEntry"("date");

-- CreateIndex
CREATE INDEX "DiaryEntry_authorId_idx" ON "DiaryEntry"("authorId");

-- CreateIndex
CREATE INDEX "Letter_date_idx" ON "Letter"("date");

-- CreateIndex
CREATE INDEX "Letter_senderId_idx" ON "Letter"("senderId");

-- CreateIndex
CREATE INDEX "Letter_recipientId_idx" ON "Letter"("recipientId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryTag" ADD CONSTRAINT "MemoryTag_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryTag" ADD CONSTRAINT "MemoryTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEntry" ADD CONSTRAINT "DiaryEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
