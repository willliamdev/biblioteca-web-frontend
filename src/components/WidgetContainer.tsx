import { SimpleGrid } from '@mantine/core';
import { Widget } from './Widget';
import type { WidgetProps } from './Widget';

interface WidgetContainerProps {
  data: WidgetProps[];
}

export function WidgetContainer({ data }: WidgetContainerProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 'sm', md: 'lg' }} w="100%">
      {data.map((item) => (
        <Widget
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
