import Text from "../Text/Text";

type StepCardProps = {
  title: string;
  description: string;
};

export default function StepCard({ title, description }: StepCardProps) {
  return (
    <div className="flex w-full flex-col items-center border border-[#5b7a8c] px-3 py-2.5 text-center text-[#5b7a8c]">
      <h3 className="whitespace-nowrap font-beth-ellen text-[16px] leading-none text-[#5b7a8c]">
        {title}
      </h3>
      <div className="mt-1 flex w-full flex-1 items-center justify-center">
        <div data-step-text className="w-full text-wrap">
          <Text className="text-[16px] leading-18px">{description}</Text>
        </div>
      </div>
    </div>
  );
}