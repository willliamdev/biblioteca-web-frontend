import { SimpleGrid } from '@mantine/core';
import { StatsCard } from './StatsCard';
import type { StatsProps } from './StatsCard';

interface StatsContainerProps {
  data: StatsProps[];
}

export function StatsContainer({ data }: StatsContainerProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 'sm', md: 'lg' }} w="100%">
      {data.map((item) => (
        <StatsCard
          key={item.title}
          title={item.title}
          value={item.value}
          description={item.description}
          color={item.color}
        />
      ))}
    </SimpleGrid>
  );
}
