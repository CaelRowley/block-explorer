-- CreateTable
CREATE TABLE "blocks" (
    "hash" VARCHAR(66) NOT NULL,
    "size" DECIMAL(78,0) NOT NULL,
    "number" DECIMAL(78,0) NOT NULL,
    "timestamp" DECIMAL(78,0) NOT NULL,
    "nonce" DECIMAL(78,0) NOT NULL,
    "gas_limit" DECIMAL(78,0) NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("hash")
);
