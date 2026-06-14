import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";

interface PageHeaderProps {
  title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <Box className="absolute w-full items-center justify-center" style={{ top: 20 }}>
      <Heading size="4xl" className="pb-2 font-normal">
        {title}
      </Heading>
    </Box>
  );
};
