import { Button, Container, Title, Group } from '@mantine/core';

export default function App() {
  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        Biblioteca dos Guri
      </Title>
      <Group>
        <Button onClick={() => console.log('Botão clicado!')} color="blue">
          Stupid Button
        </Button>
      </Group>
    </Container>
  );
}
