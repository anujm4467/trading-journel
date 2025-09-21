-- AlterTable
ALTER TABLE "trades" ADD COLUMN "followedIntradayHunter" BOOLEAN;
ALTER TABLE "trades" ADD COLUMN "followedRiskReward" BOOLEAN;
ALTER TABLE "trades" ADD COLUMN "hadPatienceWhileExiting" BOOLEAN;
ALTER TABLE "trades" ADD COLUMN "overtrading" BOOLEAN;
ALTER TABLE "trades" ADD COLUMN "psychologyNotes" TEXT;
ALTER TABLE "trades" ADD COLUMN "showedFear" BOOLEAN;
ALTER TABLE "trades" ADD COLUMN "showedGreed" BOOLEAN;
ALTER TABLE "trades" ADD COLUMN "tradedAgainstTrend" BOOLEAN;
ALTER TABLE "trades" ADD COLUMN "waitedForRetracement" BOOLEAN;
