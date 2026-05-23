import TerminalClient from "@/app/terminal/TerminalClient";
import { getNowPage } from "@/lib/data/now";

const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL;

export default async function TerminalPage() {
  const nowPage = await getNowPage();

  const nowData = nowPage
    ? {
      currentFocus: nowPage.current_focus,
      currentProjects: nowPage.current_projects,
      learningRoadmap: nowPage.learning_roadmap,
    }
    : null;

  return <TerminalClient nowData={nowData} resumeUrl={RESUME_URL} />;
}
