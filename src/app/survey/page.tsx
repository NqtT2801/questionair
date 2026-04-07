import SurveyContainer from "@/components/survey/SurveyContainer";

export default function SurveyPage() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-6 py-8 flex-1">
        <SurveyContainer />
      </div>
    </div>
  );
}
