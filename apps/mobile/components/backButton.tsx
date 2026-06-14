import { useRouter } from "expo-router";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { ArrowLeft } from "lucide-react-native";

export const BackButton = () => {
  const router = useRouter();

  return (
    <Box style={{ position: "absolute", left: 20, top: 20, zIndex: 10 }}>
      <Button size="xl" variant="link" onPress={() => void router.back()}>
        <Icon as={ArrowLeft} style={{ width: 24, height: 24 }} />
      </Button>
    </Box>
  );
};
