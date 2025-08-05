-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_initialFabricId_fkey" FOREIGN KEY ("initialFabricId") REFERENCES "Fabric"("id") ON DELETE SET NULL ON UPDATE CASCADE;
