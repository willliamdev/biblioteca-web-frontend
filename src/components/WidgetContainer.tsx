import { SimpleGrid } from '@mantine/core';
import { Widget } from './Widget';
import type { WidgetProps } from './Widget';

interface WidgetContainerProps {
data: WidgetProps[];

}

export function WidgetContainer({ data }: WidgetContainerProps) {
  return (
    <SimpleGrid cols={{ base: 3 }} spacing="lg" flex="1" w="100%">
      {data.map((item) => (
        <Widget
          title={item.title}
          value={item.value}
          description={item.description}
          color={item.color}
        />
      ))}
    </SimpleGrid>
  );
}