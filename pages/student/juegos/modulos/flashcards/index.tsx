import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import FlashcardGame from "../../../../../components/student/FlashcardGame";

const FlashcardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
      <FlashcardGame />
    </div>
  );
};

FlashcardPage.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default FlashcardPage;
